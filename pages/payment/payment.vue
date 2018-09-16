<template>
    <div class="page">
        <header id="header" :class="searchBarFixed == true ? 'headerbg': '' " ref="stateTop">
            <div class="nav_top">
                <div class="nav_point" @click="selectCity()" :class="searchBarFixed == true ? 'citybg': '' ">
                    <span class="point_word" :class="searchBarFixed == true ? 'citywordbg': '' ">{{city}}</span>
                    <i class="iconfont icon-jiantou_down"></i>
                </div>
                <div class="nav_search flex1" :class="searchBarFixed == true ? 'searchbg': '' "  @click="goSearchPage()">
                    <img src="../../assets/payimg/search_icon.png" alt="search_icon">
                    <input type="text" :placeholder="placeholder" v-model="searchWord" disabled="disabled">
                </div>
            </div>
            <div>
            </div>
        </header>
        <van-swipe :autoplay="7000" class="banner_box">
            <van-swipe-item v-for="(item, index) in bannerimg" :key="index">
                <img :src='item.imageurl' @click="bannerDetail(item.link)" alt="">
            </van-swipe-item>
        </van-swipe>
        <!-- 分类导航 icon导航 -->
        <ul class="nav_tabbar">
            <li v-for='(item,index) in fiveIconClassify' :key='index' @click='clickSkip(item.id)'>
                <img v-bind:src="item.image" alt="">
                <p>{{item.typeName}}</p>
            </li>
        </ul>
        <!-- 分类导航 detail导航 -->
        <ul class="nav_detail">
            <li class="detail_card" @click="cardDetail(1)">
                <div class="detail_description">
                    <p>实惠好货</p>
                    <p>时尚品味、大牌</p>
                </div>
                <img class="detail_photo" src="../../assets/payimg/card_leftimg1.png" alt="">
            </li>
            <li class="detail_card" @click="cardDetail(3)">
                <div class="detail_description">
                    <p>休闲娱乐</p>
                    <p>欢乐放松、激情</p>
                </div>
                <img class="detail_photo" src="../../assets/payimg/card_leftimg2.png" alt="">
            </li>
            <li class="detail_card" @click="cardDetail(4)">
                <div class="detail_description">
                    <p>精品酒店</p>
                    <p>平淡幽静、幸福</p>
                </div>
                <img class="detail_photo" src="../../assets/payimg/card_leftimg3.png" alt="">
            </li>
            <li class="detail_card" @click="cardDetail(2)">
                <div class="detail_description">
                    <p>清新美食</p>
                    <p>营业健康、美味</p>
                </div>
                <img class="detail_photo" src="../../assets/payimg/card_leftimg4.png" alt="">
            </li>
        </ul>
        <!-- 推荐商家 -->
        <div class="page_recommendShop">
            <img class="recommendShop_titleImg" src="../../assets/payimg/active_recommend.png" alt="">
            <ul class="recommendShop_goodsList">
                <li class="goodsList_li" v-for="(item,key) in shopLists" :key='key'>
                    <shopCard :item="item"></shopCard>
                </li>
            </ul>
            <van-list v-model="loading" :finished="finished" @load="onLoad" :offset='10' :immediate-check="false" :loading-text='islanding'>
            </van-list>
        </div>
    </div>
</template>

<script>
import api from "~/api";
import { Toast } from "vant";
import { Swipe, SwipeItem } from "vant";
import { MP } from "~/assets/js/amap.js";
import shopCard from "~/components/payment/shopsCard.vue";
import "~/assets/UIstyle/updateVant.scss";
export default {
  head() {
    return {
      title: "优惠购物"
    };
  },
  components: {
    shopCard
  },
  data() {
    return {
      city: "",
      placeholder: "搜索关键字",
      // 搜索输入文字
      searchWord: "",
      bannerimg: [],
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
      // 搜索背景色
      searchBarFixed: false
    };
  },
  methods: {
    //   banner导航
    bannerDetail(link) {
      window.location.href = link;
    },
    //   图标导航
    clickSkip(id) {
      switch (id) {
        case 1:
          this.$router.push({
            path: "/payment/category/shop"
          });
          break;
        case 2:
          this.$router.push({
            path: "/payment/category/food"
          });
          break;
        case 3:
          this.$router.push({
            path: "/payment/category/amusement"
          });
          break;
        case 4:
          this.$router.push({
            path: "/payment/category/hotel"
          });
          break;
        case 5:
          this.$router.push({
            path: "/payment/category/movies"
          });
          break;
      }
    },
    //  图标导航下 card分类导航与图标导航一致
    cardDetail(id) {
      switch (id) {
        case 1:
          this.$router.push({
            path: "/payment/category/shop"
          });
          break;
        case 2:
          this.$router.push({
            path: "/payment/category/food"
          });
          break;
        case 3:
          this.$router.push({
            path: "/payment/category/amusement"
          });
          break;
        case 4:
          this.$router.push({
            path: "/payment/category/hotel"
          });
          break;
        case 5:
          this.$router.push({
            path: "/payment/category/movies"
          });
          break;
      }
    },
    // 选择城市
    selectCity() {
      this.$router.push({
        path: "/payment/location/locationCity"
      });
    },
    // 上拉加载更多
    onLoad() {
      if (this.page > 1) {
        setTimeout(() => {
          if (this.shopCount == this.shopLists.length) {
            this.loading = false;
            this.islanding = "没有更多数据了";
            setTimeout(() => {
              this.finished = true;
            }, 800);
            return;
          }
          this.loading = true;
          let pageNum = this.page;
          let pageSize = this.pageSize;
          let addr = this.$store.state.city;
          let lng = this.$store.state.coordinate.lng;
          let lat = this.$store.state.coordinate.lat;
          api
            .getPaymentRecommendShops(addr, lng, lat, pageSize, pageNum)
            .then(res => {
              var newarr = this.shopLists.concat(res.data.list);
              this.shopLists = newarr;
              this.page = pageNum + 1;
              this.loading = false;
            });
        }, 500);
      } else {
        this.loading = false;
      }
    },
    // 监听页面滚动 改变搜索背景色
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > 0) {
        this.searchBarFixed = true;
      } else {
        this.searchBarFixed = false;
      }
    },
    // 高德地图定位
    amaplocation() {
      var that = this;
      MP()
        .then(function() {
          var mapObj = new AMap.Map("", {
            resizeEnable: true
          });
          // 地图实例化对象赋给全局(点击定位使用)
          mapObj.plugin(["AMap.Geolocation"], function() {
            let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, // 是否使用高精度定位，默认：true
              timeout: 10000, // 设置定位超时时间，默认：无穷大
              maximumAge: 0 //定位结果缓存0毫秒，默认：0
            });
            mapObj.addControl(geolocation);
            // 个人位置定位
            geolocation.getCurrentPosition();
            // 监听定位成功/失败的回调
            // 实例化地图并获取个人位置
            AMap.event.addListener(geolocation, "complete", result => {
              let mypos = {
                lng: result.position.lng,
                lat: result.position.lat
              };
              that.$store.commit("changeCity", result.addressComponent.city);
              that.$store.commit("changeCoordinate", mypos);
              that.city = result.addressComponent.city;
            });
            AMap.event.addListener(geolocation, "error", result => {
              // 定位失败 设置默认
              let mypos = {
                lng: 116.404844,
                lat: 39.915378
              };
              that.city = "北京";
              that.$store.commit("changeCity", "北京");
              that.$store.commit("changeCoordinate", mypos);
              Toast({
                mask: false,
                message: "定位失败请手动选择地址",
                duration: 800
              });
            });
          });
        })
        .catch(err => {
          // 地图加载失败返回到上级(未加载toast)
        });
    },
    // 去搜索页面
    goSearchPage() {
      this.$router.push({
        path: "/payment/search"
      });
    },
    // title信息存储
    setTitleStroge() {
      var Bridge = this.$route.query.bridge;
      this.device = this.$route.query.device;
      var Height = parseInt(this.$route.query.statusBarHeight) || 0;
      if (Bridge) {
        localStorage.setItem("isBridge", Bridge);
        localStorage.setItem("device", this.device);
        localStorage.setItem("statusBarHeight", Height);
        let statusBarHeight = localStorage.getItem("statusBarHeight");
        this.$refs.stateTop.style.paddingTop = statusBarHeight + "px";
      }
    }
  },
  created() {
    //   城市名的改变触发推荐数据的变化
    let cityname = this.$store.state.city;
    if (cityname) {
      this.city = cityname;
    } else {
      this.amaplocation();
    }
  },
  mounted() {
    /* icon分类接口路由的跳转 */
    api
      .fiveIcon(0)
      .then(res => {
        this.fiveIconClassify = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    // 首页banner
    api.getPaymentBanner().then(res => {
      this.bannerimg = res.data;
    });
    // 判断 / 存储 title信息
    this.setTitleStroge();
    // 首页滚动 搜索背景改变
    window.addEventListener("scroll", this.handleScroll);
  },
  watch: {
    city: function(newVal, oldVal) {
      //监听全局状态变化的城市;
      let addr = this.$store.state.city;
      let lng = this.$store.state.coordinate.lng;
      let lat = this.$store.state.coordinate.lat;
      let pageNum = this.page;
      let pageSize = this.pageSize;
      // 获取推荐商家数据
      api
        .getPaymentRecommendShops(addr, lng, lat, pageNum, pageSize)
        .then(res => {
          if (res.code == 200) {
            console.log(res);
            this.shopLists = res.data.list;
            this.shopCount = res.data.count;
            this.page = pageNum + 1;
          } else {
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.page {
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  #header {
    width: 100%;
    padding-top: tr(20px);
    background-color: transparent;
    position: fixed;
    z-index: 1000;
    .nav_top {
      width: 100%;
      height: tr(60px);
      padding: tr(0px) tr(30px);
      //搜索底部白色背景
      margin-bottom: tr(20px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: transparent;
      .nav_point {
        height: tr(36px);
        color: #999;
        padding: tr(0px) tr(10px) tr(0px) tr(15px);
        border-radius: tr(20px);
        font-size: tr(20px);
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          max-width: tr(80px);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        i {
          font-size: tr(20px);
          margin-left: tr(2px);
        }
      }
      .nav_search {
        height: 100%;
        border-radius: tr(30px);
        background-color: rgba(255, 255, 255, 0.8);
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flexbox;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: tr(30px);
        img {
          width: tr(32px);
          height: tr(32px);
          margin-left: tr(25px);
        }
        input {
          margin-left: tr(10px);
          font-size: tr(26px);
          line-height: 20px;
          color: #999999 !important;
          background-color: transparent;
        }
        ::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #999 !important;
        }
        ::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #999;
        }
        :-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #999;
        }
      }
    }
  }
  .headerbg {
    background-color: #fff !important;
    .citybg {
      background-color: rgba(0, 0, 0, 0.05) !important;
      .citywordbg {
        color: #999999;
      }
    }
    .searchbg {
      background-color: rgba(0, 0, 0, 0.05) !important;
    }
  }
  .banner_box {
    width: 100%;
    height: tr(370px);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .nav_tabbar {
    width: 100%;
    height: tr(180px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 0 tr(30px);
    li {
      display: inline-block;
      img {
        width: tr(76px);
        height: tr(76px);
      }
      p {
        font-size: tr(24px);
        line-height: tr(24px);
        color: #333;
        text-align: center;
        margin-top: tr(20px);
      }
    }
  }
  .nav_detail {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .detail_card {
      width: 49.4%;
      height: tr(180px);
      margin-top: tr(10px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: tr(25px) tr(20px) tr(15px) tr(30px);
    }
    .detail_card:nth-child(even) {
      margin-left: 1%;
    }
    .detail_card:nth-of-type(1) {
      background-image: url("../../assets/payimg/card_leftbg1.png");
      background-size: cover;
      background-repeat: no-repeat;
    }
    .detail_card:nth-of-type(2) {
      background-image: url("../../assets/payimg/card_leftbg2.png");
      background-size: cover;
      background-repeat: no-repeat;
    }
    .detail_card:nth-of-type(3) {
      background-image: url("../../assets/payimg/card_leftbg3.png");
      background-size: cover;
      background-repeat: no-repeat;
    }
    .detail_card:nth-of-type(4) {
      background-image: url("../../assets/payimg/card_leftbg4.png");
      background-size: cover;
      background-repeat: no-repeat;
    }
    .detail_description {
      p:nth-of-type(1) {
        font-size: tr(30px);
        line-height: tr(30px);
        font-weight: 550;
        color: #1a1a1a;
        letter-spacing: 2px;
      }
      p:nth-of-type(2) {
        font-size: tr(22px);
        line-height: tr(22px);
        color: #999999;
        margin-top: tr(25px);
        letter-spacing: 1px;
      }
    }
    .detail_photo {
      width: tr(140px);
      height: tr(140px);
    }
  }
  // 特推活动
  .page_active {
    width: 100%;
    padding: tr(0px) tr(10px);
    .active_model {
      width: 100%;
      padding-top: tr(20px);
      text-align: center;
      img {
        width: 70%;
        height: tr(80px);
        display: inline-block;
      }
      .model_cardbox {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        li {
          width: 49.4%;
          height: tr(188px);
          img {
            width: 100%;
            height: 100%;
          }
        }
        li:nth-child(even) {
          margin-left: 1%;
        }
      }
    }
    .active_food {
      width: 100%;
      padding-top: tr(20px);
      text-align: center;
      img {
        width: 70%;
        height: tr(80px);
        display: inline-block;
      }
      .food_cardbox {
        width: 100%;
        height: tr(370px);
        display: flex;
        justify-content: space-between;
        .food_cardbox_left {
          width: 49.5%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .food_cardbox_right {
          width: 49.5%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          img {
            width: 100%;
            height: 49%;
          }
        }
      }
    }
    .active_play {
      width: 100%;
      padding-top: tr(20px);
      text-align: center;
      img {
        width: 70%;
        height: tr(80px);
        display: inline-block;
      }
      .play_cardbox {
        width: 100%;
        height: tr(370px);
        display: flex;
        justify-content: space-between;
        .play_cardbox_left {
          width: 49.5%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .play_cardbox_right {
          width: 49.5%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          img {
            width: 100%;
            height: 49%;
          }
        }
      }
    }
    .active_special {
      margin-top: tr(20px);
      width: 100%;
      img {
        width: 100%;
        height: tr(200px);
      }
    }
  }
  // 推荐商家
  .page_recommendShop {
    width: 100%;
    text-align: center;
    padding-top: tr(20px);
    .recommendShop_titleImg {
      width: 70%;
      height: tr(80px);
      display: inline-block;
    }
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
</style>