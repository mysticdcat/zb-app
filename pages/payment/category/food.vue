<template>
  <div class='container'>
    <Headertitle :title="title"></Headertitle>
    <!-- banner部分 -->
    <div class='banner'>
      <!-- 首页banner图 -->
      <img v-if="bannerImg" v-bind:src="bannerImg" alt="">
    </div>
    <div class='blank'></div>
    <!-- 美食部分 -->
    <div class='main'>
      <p>美食</p>
      <ul v-if='isShow'>
        <li v-for='(item,index) in storeInfo' :key='index' class='liBox' @click="goShopDetail(item.id)">
          <img v-bind:src="item.logo" alt="">
          <p class='storeName'>{{item.name}}</p>
          <span class='moods'>人气{{item.popularity}}</span>
          <img src="~assets/images/flame.png" alt="" class='flame' v-if='item.popularity>80&&item.popularity<=84?true:false'>
          <img src="~assets/images/flame.png" alt="" class='flame' v-if='item.popularity>84&&item.popularity<=92?true:false' v-for='num in 2' :key='num'>
          <img src="~assets/images/flame.png" alt="" class='flame' v-if='item.popularity>92?true:false' v-for='num in 3' :key='num'>
          <span class='distance'>{{item.juli | fmtlevel}}</span>
          <div class='order' v-if='item.man != null'>满{{item.man}}减{{item.jian}}</div>
          <div class='order' v-else>优惠{{item.sale}}折</div>
          <div class='ranking'>人均消费：100</div>
        </li>
      </ul>
    </div>
    <van-list v-model="loading" :offset='1000' :finished="finished" @load="onLoad" :loading-text='islanding' :immediate-check="false"></van-list>
    <div class='noStore' v-if='!isShow'>
      <img src="~/assets/images/noStore.png" alt="">
      <p>暂无商家入驻，敬请期待...</p>
    </div>
  </div>
</template>
<script>
import api from "~/api";
import { Toast } from "vant";
import Headertitle from "~/components/header/title.vue";
export default {
  head() {
    return {
      title: "美食"
    };
  },
  components: {
    Headertitle
  },
  data() {
    return {
      title: "美食",
      isShow: false,
      bannerImg: "", //banner图
      storeInfo: [], //店家基本信息
      params: {
        typeid: 2,
        addr: "",
        pageNum: 1,
        pageSize: 12,
        lng: null, //经度
        lat: null //纬度
      },
      loading: false,
      finished: false,
      islanding: "数据加载中",
      count: 0
    };
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        if (this.count == this.storeInfo.length) {
          this.loading = false;
          this.islanding = "没有更多数据了";
          setTimeout(() => {
            this.finished = true;
          }, 1500);
          return;
        } else {
          this.loading = true;
          api.getPlayStore(this.params).then(res => {
            var newarr = this.storeInfo.concat(res.data.list);
            this.storeInfo = newarr;
            this.params.pageNum = this.params.pageNum + 1;
            this.isShow = true;
            this.loading = false;
          });
        }
      }, 500);
    },
    goShopDetail(id) {
      this.$router.push({
        path: "/payment/shopping/goodsDetail",
        query: { shopId: id, typeid: 1 }
      });
    }
  },
  mounted() {
    /* 首页banner图接口 */
    api.getFood().then(res => {
      this.bannerImg = res.data[0].imageurl;
    });

    let addr = this.$store.state.city;
    let lng = this.$store.state.coordinate.lng;
    let lat = this.$store.state.coordinate.lat;
    if (addr && lng && lat) {
      this.params.addr = this.$store.state.city;
      this.params.lng = this.$store.state.coordinate.lng;
      this.params.lat = this.$store.state.coordinate.lat;
    } else {
      // Toast({
      //   mask: false,
      //   message: "位置信息获取失败",
      //   duration: 800
      // });
    }
    /* 美食相关的商家 */
    api
      .getPlayStore(this.params)
      .then(res => {
        if (res.data == null) {
          this.isShow = false;
        } else {
          this.storeInfo = res.data.list;
          this.count = res.data.count;
          this.params.pageNum = this.params.pageNum + 1;
          this.isShow = true;
        }
      })
      .catch(err => {
        console.log(err, "res");
      });
  }
};
</script>

<style lang='scss' scoped>
@import "~@/assets/style/nostore.scss";
@import "~@/assets/style/px-to-rem";
.container {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.blank {
  width: 100%;
  height: tr(15px);
  background-color: RGBA(247, 247, 247, 1);
}
.banner {
  width: 100%;
  > img {
    width: 100%;
  }
  > ul {
    width: 100%;
    height: tr(178px);
    display: flex;
    justify-content: space-around; //富裕空间平均分配在元素两侧
    background-color: #fff;
    // margin-bottom: tr(15px);
    > li {
      position: relative;
      float: left;
      align-self: center; //是元素垂直居中
      img {
        width: tr(56px);
        height: tr(51px);
      }
      p {
        text-align: center;
        font-size: tr(24px);
        color: #333;
      }
    }
  }
}
.main {
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  > p {
    font-size: tr(32px);
    font-family: MicrosoftYaHei;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    // line-height: 42px;
    margin-left: tr(30px);
    margin-top: tr(20px);
  }
  ul {
    width: 100%;
    li {
      width: 100%;
      padding: tr(30px);
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      overflow: hidden;
      > img:nth-child(1) {
        width: tr(210px);
        height: tr(190px);
        border-radius: tr(5px);
        float: left;
        margin-right: tr(20px);
      }
      .storeName {
        margin-top: tr(6px);
        font-size: tr(30px);
        color: #000;
      }
      .moods {
        margin-top: tr(10px);
        display: inline-block;
        color: #ff1400;
        font-size: tr(28px);
        margin-right: tr(12px);
        vertical-align: middle;
      }
      .flame {
        margin-top: tr(10px);
        // width: tr(30px);
        width: 16px;
      }
      .distance {
        float: right;
        margin-top: tr(15px);
        color: #999;
      }
      .order,
      .ranking {
        margin-top: tr(20px);
        padding: tr(6px) tr(13px);
        position: absolute;
        left: tr(260px);
        border-radius: tr(3px);
        border: 1px solid RGBA(0, 0, 0, 0.2);
        font-size: tr(20px);
        color: RGBA(0, 0, 0, 1);
      }
      .ranking {
        margin-left: tr(135px);
      }
    }
  }
}
</style>
