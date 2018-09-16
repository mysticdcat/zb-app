<template>
    <div>
      <Headertitle :title="title"></Headertitle>
      <div class="shopping">
            <div class="banner">
                <div class="bannerBox">
                    <img src="~assets/images/paymentBanner.png" alt="">
                </div>
            </div>
            <div class="bar">
                <van-tabs swipeable @click="getTypeIdData">
                    <van-tab v-for="(item,index) in titles" :title="item" :key="index">
                    </van-tab>
                </van-tabs>
            </div>
            <div class="suggest">
                <ul>
                    <li v-for="(item,index) in listData" :key="index" @click="goShopDetail(item.id,item.typeId)">
                        <div><img :src="item.logo" alt=""></div>
                        <div>
                            <p>{{item.name}}</p>
                            <p>
                                <span>人气 {{item.popularity}}</span>
                                <img src="~assets/images/hot.png" alt="">
                                <img src="~assets/images/hot.png" alt="">
                                <img src="~assets/images/hot.png" alt="">
                                <img src="~assets/images/hot.png" alt="">
                                <img src="~assets/images/hot.png" alt="">
                                <span class="distance">{{item.juli | fmtlevel}}</span>
                            </p>
                            <p>满{{item.man}}减{{item.jian}}</p>
                            <P>
                                <button>{{item.des}}</button>
                            </P>
                        </div>
                    </li>
                </ul>
            </div>
            <van-list v-model="loading" :offset='1000' :finished="finished" @load="onLoad" :loading-text='islanding'></van-list>

        </div>
      </div>
</template>
<script>
import api from "~/api/index.js";
import { Toast } from "vant";
import Headertitle from "~/components/header/title.vue";
export default {
  head() {
    return {
      title: "购物"
    };
  },
  components: {
    Headertitle
  },
  data() {
    return {
      title: "购物",
      titles: ["全部", "服饰", "鞋靴", "香水", "箱包", "日用", "百货"],
      pageNum: 1,
      pageSize: 4,
      listData: [],
      allNum: 0,
      loading: false,
      finished: false,
      islanding: "数据加载中",
      params: {
        typeid: 1,
        addr: "",
        pageNum: 1,
        pageSize: 12,
        lng: null, //经度
        lat: null //纬度
      },
      isall: true
    };
  },
  methods: {
    onClick(index, title) {
      this.$toast(title);
    },

    //点击分类获取数据
    getTypeIdData(index) {
      var params = this.params;
      if (index != 0) {
        this.isall = false;
        this.pageNum = 1;
        params.typeid = index + 5;
        api.getShopInfoTotypeid(params).then(res => {
          this.listData = res.data.list;
          this.allNum = res.data.count;
          this.islanding = "数据正在加载中";
          this.finished = false;
        });
      } else {
        this.isall = true;
        this.pageNum = 1;
        this.params.pageNum = 1;
        api.getShopInfo(params).then(res => {
          this.listData = res.data.list;
          this.allNum = res.data.count;
          this.islanding = "数据正在加载中";
          this.finished = false;
        });
      }
    },
    goShopDetail(id, itemid) {
      this.$router.push({
        path: "/payment/shopping/goodsDetail",
        query: { shopId: id, typeid: itemid }
      });
    },
    onLoad() {
      setTimeout(() => {
        if (this.allNum == this.listData.length) {
          this.loading = false;
          this.islanding = "没有更多数据了";
          setTimeout(() => {
            this.finished = true;
          }, 1500);
          return;
        } else {
          this.loading = true;
          this.params.pageNum++;
          if (this.isall) {
            api.getShopInfo(this.params).then(res => {
              var newarr = this.listData.concat(res.data.list);
              this.listData = newarr;
              // this.storeInfo=[...new Set(newarr)]
              this.isShow = true;
              this.loading = false;
            });
          } else {
            api.getShopInfoTotypeid(this.params).then(res => {
              var newarr = this.listData.concat(res.data.list);
              this.listData = newarr;
              // this.storeInfo=[...new Set(newarr)]
              this.isShow = true;
              this.loading = false;
            });
          }
        }
      }, 500);
    }
  },
  mounted() {
    let addr = this.$store.state.city;
    let lng = this.$store.state.coordinate.lng;
    let lat = this.$store.state.coordinate.lat;
    if (addr && lng && lat) {
      this.params.addr = this.$store.state.city;
      this.params.lng = this.$store.state.coordinate.lng;
      this.params.lat = this.$store.state.coordinate.lat;
    } else {
      Toast({
        mask: false,
        message: "位置信息获取失败",
        duration: 800
      });
    }
    api.getShopInfo(this.params).then(res => {
      this.listData = res.data.list;
      this.allNum = res.data.count;
    });
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";

.shopping {
  width: 100%;
  .banner {
    padding: 0 tr(30px);
    .bannerBox {
      padding: 2px;
      border: 1px dashed #999;
      border-radius: 5px;
      img {
        width: 100%;
      }
    }
  }
  .bar {
    padding: 0 tr(30px);
    color: #999 !important;
  }
  .suggest {
    padding-top: tr(30px);
    width: 100%;
    > p {
      padding-bottom: tr(30px);
    }
    ul {
      width: 100%;
      li {
        height: tr(230px);
        width: 100%;
        padding: tr(20px) 0 tr(20px) tr(30px);
        border-bottom: 1px solid #e6e6e6;
        > div {
          float: left;
        }
        > div:nth-child(1) {
          img {
            width: tr(180px);
            height: tr(180px);
          }
        }
        > div:nth-child(2) {
          padding-left: tr(20px);
          height: tr(180px);
          display: flex;
          width: 70%;
          flex-direction: column;
          justify-content: space-between;
          p:nth-child(1) {
            font-size: tr(30px);
          }
          p:nth-child(2) {
            .distance {
              float: right;
              color: #999;
            }
            span {
              vertical-align: middle;
              color: #ff1400;
              font-size: tr(28px);
            }
            img {
              vertical-align: middle;
              width: tr(24px);
              height: tr(22px);
            }
          }
          p:nth-child(3) {
            color: #999;
          }
          p:nth-child(4) {
            button {
              height: tr(32px);
              padding: 0 tr(20px);
              font-size: tr(20px);
              background-color: #fff;
              margin-right: tr(20px);
              color: #4d94ff;
              border: 1px solid #4d94ff;
              border-radius: tr(4px);
            }
          }
        }
      }
    }
  }
  /deep/ .van-ellipsis {
    bottom: 0;
  }
  /deep/.van-tab--active {
    color: #999;
  }
  .van-tabs__line {
    display: none;
  }
}
</style>


