<template>
  <div class='container'>
     <Headertitle :title="title"></Headertitle>
    <!-- banner部分 -->
    <div class='banner'>
      <van-swipe :autoplay="3000" class='swipe'>
        <van-swipe-item><img src="~/assets/images/banner.png" alt=""></van-swipe-item>
        <van-swipe-item><img src="~/assets/images/banner.png" alt=""></van-swipe-item>
        <van-swipe-item><img src="~/assets/images/banner.png" alt=""></van-swipe-item>
        <van-swipe-item><img src="~/assets/images/banner.png" alt=""></van-swipe-item>
      </van-swipe>
    </div>
    <!-- 休闲娱乐 -->
    <div class='main'>
      <ul v-if='isShow'>
        <li>
          <img src="~/assets/images/4.jpg" alt="">
          <p class='storeName'>仙剑奇侠传
            <span>2D</span>
            <span>IMAX</span>
          </p>
          <span class='moods'>观众评分
            <span>9.1</span>
          </span>
          <button class='distance'>购票</button>
          <div class='discounts'>特惠</div>
          <div class='welfale'>导演：
            <span>李易峰</span>&nbsp;
            <span>王力宏</span>
          </div>
          <div class='protagonist'>
            主演：
            <span>杨洋</span>&nbsp;
            <span>吴尊</span>&nbsp;
            <span>张天爱</span>
          </div>
          <span class='todayHot'>200yuan</span>
          <span class='weekHot'>300yuan</span>
        </li>
      </ul>
    </div>
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
      title: "电影"
    };
  },
  components: {
    Headertitle
  },
  data() {
    return {
      title: "电影",
      images: ["https://img.yzcdn.cn/1.jpg", "https://img.yzcdn.cn/2.jpg"],
      isShow: false,
      params: {
        typeid: 4,
        addr: "",
        pageNum: 1,
        pageSize: 12,
        lng: null, //经度
        lat: null //纬度
      }
    };
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
    /* 电影相关的商家 */
    api.getPlayStore(this.params).then(res => {
      if (res.data == null) {
        this.isShow = false;
      } else {
      }
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
.banner {
  width: 100%;
  .swipe {
    img {
      width: 100%;
    }
  }
}
.main {
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  > ul {
    width: 100%;
    li {
      position: relative;
      width: 100%;
      height: tr(281px);
      padding: tr(30px);
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      overflow: hidden;
      > img:nth-child(1) {
        background-color: pink;
        width: tr(130px);
        height: tr(190px);
        border-radius: tr(5px);
        float: left;
        margin-right: tr(20px);
      }
      .storeName {
        margin-top: tr(6px);
        font-size: tr(30px);
        color: #000;
        > span:first-child {
          font-size: tr(24px);
          padding: tr(7px);
          box-sizing: border-box;
          border-top-left-radius: tr(5px);
          border-bottom-left-radius: tr(5px);
          border: 1px solid RGBA(153, 153, 153, 1);
          background-color: RGBA(153, 153, 153, 1);
          color: #fff;
        }
        > span:last-child {
          font-size: tr(24px);
          padding: tr(7px);
          box-sizing: border-box;
          border-top-right-radius: tr(5px);
          border-bottom-right-radius: tr(5px);
          border: 1px solid RGBA(153, 153, 153, 1);
          color: RGBA(153, 153, 153, 1);
        }
      }
      .moods {
        margin-top: tr(10px);
        display: inline-block;
        color: RGBA(158, 158, 158, 1);
        font-size: tr(26px);
        margin-right: tr(12px);
        vertical-align: middle;
        > span {
          color: RGBA(254, 165, 76, 1);
          font-size: tr(24px);
        }
      }
      .averagePrice {
        margin-top: tr(10px);
        display: inline-block;
        margin-left: tr(20px);
        vertical-align: middle;
        color: #999;
      }
      .distance {
        float: right;
        margin-top: tr(13px);
        background: linear-gradient(
          245deg,
          rgba(131, 70, 253, 1),
          rgba(156, 71, 252, 1)
        );
        border-radius: tr(30px);
        padding: tr(16px) tr(35px);
        font-size: tr(24px);
        color: #fff;
      }
      .discounts {
        float: right;
        margin-top: tr(86px);
        margin-right: tr(-83px);
        color: RGBA(153, 153, 153, 1);
        font-size: tr(24px);
      }
      .welfale {
        margin-top: tr(8px);
        position: absolute;
        left: tr(180px);
        font-size: tr(24px);
        color: #999;
      }
      .protagonist {
        margin-top: tr(45px);
        font-size: tr(24px);
        color: #999;
      }
      .todayHot {
        position: absolute;
        bottom: tr(30px);
        left: tr(180px);
        display: inline-block;
        color: RGBA(255, 77, 100, 1);
        font-size: tr(22px);
        padding: tr(5px) tr(11px);
        border-radius: tr(5px);
        border: 1px solid RGBA(255, 77, 100, 1);
      }
      .weekHot {
        position: absolute;
        bottom: tr(30px);
        left: tr(300px);
        font-size: tr(22px);
        padding: tr(5px) tr(11px);
        border-radius: tr(5px);
        border: 1px solid RGBA(255, 160, 49, 1);
        color: RGBA(255, 160, 49, 1);
      }
    }
  }
}
</style>
