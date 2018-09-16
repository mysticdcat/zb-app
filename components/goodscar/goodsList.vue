<template>
    <div class="goods_list_li">
        <nuxt-link :to="{name: 'goodsDetail-goodsDetail', query: { shopId: item.itemId ,language:this.$route.query.language}}">
        <div class="left">
          <img :src="item.itemImage">
        </div>
        <div class="right flex1 fx-column fx-space-between">
          <div class="right_name">
            <p>{{item.itemTitle}}</p>
          </div>
          <div class="right_tags">
              <span v-if="tagarr[0]" class="tag1">{{tagarr[0]}}</span>
              <span v-if="tagarr[1]" class="tag2">{{tagarr[1]}}</span>
          </div>
          <div class="right_price">
           <div class="price">
             <span class="price_now" v-if="item.price">￥{{item.price.toFixed(2)}}</span>
             <span class="price_yuan" v-if="item.lyPrice">￥{{item.lyPrice.toFixed(2)}}</span>
           </div>
           <img class="qianggou" src="../../assets/images/qianggou.png" alt="" @click="qianggou">
          </div>
        </div>
        </nuxt-link>
    </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    },
  },
  data() {
    return {
      tagarr: []
    };
  },
  methods: {
    qianggou() {
      this.$router.push({
        path: "/goodsDetail/goodsDetail",
        query: {
          shopId: this.item.itemId
        }
      });
    }
  },
  mounted() {
    this.tagarr = this.item.depict.split(",");
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.goods_list_li {
  width: 100%;
  border-radius: tr(20px);
  margin-top: tr(20px);
  padding: tr(30px) tr(30px);
  background-color: #fff;
  a {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .left {
      width: tr(180px);
      height: tr(180px);
      img {
        width: 100%;
        height: 100%;
        border-radius: tr(20px);
      }
    }
    .right {
      height: tr(180px);
      margin-left: tr(20px);
      .right_name {
        p {
          color: #1a1a1a;
          font-size: tr(24px);
          line-height: tr(32px);
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .right_tags {
        display: flex;
        justify-content: flex-start;
        span {
          font-size: tr(20px);
          color: #999999;
          padding: tr(6px) tr(14px);
          background-color: #f2f2f2;
          border-radius: tr(16px);
          overflow: hidden; /*自动隐藏文字*/
          text-overflow: ellipsis; /*文字隐藏后添加省略号*/
          white-space: nowrap; /*强制不换行*/
        }
        .tag1 {
          width: tr(100px);
        }
        .tag2 {
          width: tr(130px);
          margin-left: tr(10px);
        }
      }
      .right_price {
        height: auto;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .price {
          .price_now {
            font-size: tr(28px);
            color: #8346fd;
            line-height: tr(28px);
          }
          .price_yuan {
            font-size: tr(24px);
            color: #999999;
            line-height: tr(24px);
            margin-left: tr(8px);
            text-decoration: line-through;
          }
        }
        .qianggou {
          width: tr(120px);
          height: tr(60px);
        }
      }
    }
  }
}

.goods_list_li:nth-of-type(1) {
  margin-top: 0;
}
</style>

