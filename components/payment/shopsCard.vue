<template>
    <div class="card"  @click="hrefDetail">
        <div class="card_photo">
            <img :src="item.shopLogo" alt="" >
        </div>
        <div class="card_info">
            <p class="card_name">{{item.shopName}}</p>
            <div class="card_saleNum">
              <i class="iconfont icon-location"></i>
             <span>距离{{item.juli | fmtlevel}}</span>
            </div>
            <div class="card_discont">
                <p v-if="item.sale">{{item.sale}}折优惠</p>
                <p v-else>满{{item.man}}减{{item.jian}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import api from "~/api";
import { Toast } from "vant";
export default {
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    hrefDetail() {
      this.$router.push({
        path: "/payment/shopping/goodsDetail",
        query: { shopId: this.item.shopId, typeid: 1 }
      });
    }
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.card {
  width: 100%;
  font-size: 0;
  .card_photo {
    width: 100%;
    height: tr(344px);
    font-size: 0;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .card_info {
    width: 100%;
    padding: tr(10px) tr(10px) tr(10px) tr(10px);
    background-color: #ffffff;
    text-align: left;
    .card_name {
      color: #1a1a1a;
      font-size: tr(24px);
      line-height: tr(28px);
      text-align: left;
      overflow: hidden; /*自动隐藏文字*/
      text-overflow: ellipsis; /*文字隐藏后添加省略号*/
      white-space: nowrap; /*强制不换行*/
    }
    .card_saleNum {
      margin: tr(10px) tr(0px);
      i {
        font-size: tr(24px);
      }
      span {
        color: #999999;
        font-size: tr(20px);
        display: inline-block;
      }
    }
    .card_discont {
      margin-top: tr(5px);
      p {
        display: inline-block;
        font-size: tr(22px);
        line-height: tr(28px);
        color: #8346fd;
        padding: tr(0px) tr(8px);
        border-radius: tr(3px);
        vertical-align: baseline;
        border: 1px solid rgba(130, 70, 253, 0.5);
      }
    }
  }
}
</style>