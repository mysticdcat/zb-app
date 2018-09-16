<template>
    <div class="card">
        <div class="card_photo"  @click="hrefDetail">
            <img :src="item.itemImage" alt="" >
        </div>
        <div class="card_info">
            <p class="card_name"  @click="hrefDetail">{{item.itemTitle}}</p>
            <p class="card_saleNum">月销{{item.sale}}笔</p>
            <div class="card_goumai">
                <p class="card_price">￥{{item.price.toFixed(2)}}</p>
                <img class="card_car" src="../../assets/images/smallcar.png" alt="" @click="getcar">
            </div>
        </div>
    </div>
</template>

<script>
import api from "~/api";
import { Toast, Lazyload } from "vant";
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
        path: "/goodsDetail/goodsDetail",
        query: {
          shopId: this.item.itemId,
        }
      });
    },
    getcar() {
      let params = {
        itemid: this.item.itemId,
        num: 1
      };
      api.getGoodsCar(params).then(res => {
        if (res.code == 200) {
          Toast({
            mask: false,
            message: "成功添加到购物车",
            duration: 800
          });
        } else {
          Toast.error({
            mask: false,
            message: "添加失败",
            duration: 800
          });
        }
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
  height: 100%;
  width: 100%;
  font-size: 0;
  background-color: #f7f7f7;
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
    padding: tr(10px);
    .card_name {
      color: #1a1a1a;
      font-size: tr(24px);
      line-height: tr(24px);
      margin-top: tr(20px);
      text-align: left;
      overflow: hidden; /*自动隐藏文字*/
      text-overflow: ellipsis; /*文字隐藏后添加省略号*/
      white-space: nowrap; /*强制不换行*/
    }
    .card_saleNum {
      color: #999999;
      background-color: #fff;
      border-radius: tr(16px);
      font-size: tr(20px);
      display: inline-block;
      padding: tr(4px) tr(15px);
      margin-top: tr(16px);
    }
    .card_goumai {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: tr(5px);
      .card_price {
        color: #8346fd;
        font-size: tr(28px);
        line-height: tr(24px);
      }
      .card_car {
        width: tr(44px);
        height: tr(44px);
      }
    }
  }
}
</style>