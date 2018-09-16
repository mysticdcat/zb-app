<template>
    <div class="page">
        <headerTitle :title='title'></headerTitle>
        <!-- 推荐商家 -->
        <div class="page_recommendShop" v-if='isShow'>
            <ul class="recommendShop_goodsList">
                <li class="goodsList_li" v-for="(item,key) in shopLists" :key='key'>
                    <shopCard :item="item"></shopCard>
                </li>
            </ul>
            <van-list v-model="loading" :finished="finished" @load="onLoad" :offset='10' :immediate-check="false" :loading-text='islanding'>
            </van-list>
        </div>
        <div class='noStore' v-if='noStore'>
            <img src="~/assets/images/noStore.png" alt="">
            <p>暂无商家入驻，敬请期待...</p>
        </div>
    </div>
</template>

<script>
import api from "~/api";
import { Toast } from "vant";
import { MP } from "~/assets/js/amap.js";
import shopCard from "~/components/payment/shopsCard.vue";
import "~/assets/UIstyle/updateVant.scss";
import headerTitle from '~/components/header/title'
export default {
    head() {
        return {
            title: "实惠好货"
        };
    },
    components: {
        shopCard,
        headerTitle
    },
    data() {
        return {
            title: '实惠好货',
            city: "",
            // 搜索输入文字
            searchWord: "",
            //icon分类导航图标
            fiveIconClassify: [],
            // 推荐商家
            shopLists: [],
            // 推荐商家总条数
            shopCount: null,
            // 下拉
            loading: false,
            finished: false,
            islanding: "数据加载中",
            page: 1,
            pageSize: 12,
            isShow: false,       //这两个show是判断如果没有门店就让暂无入驻显示
            noStore: false,
        };
    },
    methods: {
        // 上拉加载更多
        onLoad() {
            if(this.page>1) {
                setTimeout(() => {
                    if(this.shopCount==this.shopLists.length) {
                        this.loading=false;
                        this.islanding="没有更多数据了";
                        setTimeout(() => {
                            this.finished=true;
                        },800);
                        return;
                    }
                    this.loading=true;
                    let pageNum=this.page;
                    let pageSize=this.pageSize;
                    let lng=this.$store.state.coordinate.lng;
                    let lat=this.$store.state.coordinate.lat;
                    api
                        .getPaymentRecommendShops(lng,lat,pageSize,pageNum)
                        .then(res => {
                            var newarr=this.shopLists.concat(res.data.list);
                            this.shopLists=newarr;
                            this.page=pageNum+1;
                            this.loading=false;
                        });
                },500);
            } else {
                this.loading=false;
            }
        },
        // 高德地图定位
        amaplocation() {
            var that=this;
            MP()
                .then(function() {
                    var mapObj=new AMap.Map("",{
                        resizeEnable: true
                    });
                    // 地图实例化对象赋给全局(点击定位使用)
                    mapObj.plugin(["AMap.Geolocation"],function() {
                        let geolocation=new AMap.Geolocation({
                            enableHighAccuracy: true, // 是否使用高精度定位，默认：true
                            timeout: 10000, // 设置定位超时时间，默认：无穷大
                            maximumAge: 0 //定位结果缓存0毫秒，默认：0
                        });
                        mapObj.addControl(geolocation);
                        // 个人位置定位
                        geolocation.getCurrentPosition();
                        // 监听定位成功/失败的回调
                        // 实例化地图并获取个人位置
                        AMap.event.addListener(geolocation,"complete",result => {
                            let mypos={
                                lng: result.position.lng,
                                lat: result.position.lat
                            };
                            that.$store.commit("changeCity",result.addressComponent.city);
                            that.$store.commit("changeCoordinate",mypos);
                            that.city=result.addressComponent.city;
                        });
                        AMap.event.addListener(geolocation,"error",result => {
                            Toast({
                                mask: false,
                                message: "定位失败",
                                duration: 800
                            });
                        });
                    });
                })
                .catch(err => {
                    // 地图加载失败返回到上级(未加载toast)
                });
        }
    },
    created() {
        //   城市名的改变触发推荐数据的变化
        let cityname=this.$store.state.city;
        if(cityname) {
            this.city=cityname;
        } else {
            this.amaplocation();
        }
    },
    mounted() {
        /* icon分类接口路由的跳转 */
        api
            .fiveIcon(0)
            .then(res => {
                this.fiveIconClassify=res.data;
            })
            .catch(err => {
                console.log(err);
            });
    },
    watch: {
        city: function(newVal,oldVal) {
            //监听全局状态变化的城市;
            let addr=this.$store.state.city
            let lng=this.$store.state.coordinate.lng;
            let lat=this.$store.state.coordinate.lat;
            let pageNum=this.page;
            let pageSize=this.pageSize;
            console.log(pageNum,pageSize,lng,lat);
            // 获取推荐商家数据
            api.getPaymentRecommendShops(addr,lng,lat,pageNum,pageSize).then(res => {
                if(res.data.count==0) {
                    this.noStore=true,
                        this.isShow=false
                } else {
                    this.shopLists=res.data.list;
                    this.shopCount=res.data.count;
                    this.page=pageNum+1;
                    this.isShow=true
                    this.noStore=false
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
// @import "~@/assets/style/nostore.scss";
.page {
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  position: relative;
  // 推荐商家
  .page_recommendShop {
    width: 100%;
    text-align: center;
    padding-top: tr(20px);
    .recommendShop_goodsList {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: tr(0px) tr(20px);
      .goodsList_li {
        width: 49.3%;
        margin-top: tr(10px);
      }
    }
  }
}
.noStore {
  width: 100%;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translateX(-50%);
  img {
    width: tr(210px);
    height: tr(168px);
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  p {
    color: RGBA(153, 153, 153, 1);
    font-size: tr(24px);
    text-align: center;
    margin-top: tr(20px);
  }
}
</style>