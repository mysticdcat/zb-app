<template>
  <div class="youxuan" v-if="display">
    <div class="goods_list">
      <!-- 主播推荐 -->
      <div class="activing">
        <img class="recommend_bgimg" src="../../assets/images/activing_tuijian.png" alt="">
        <div class="activing_content">
          <ul class="activing_list">
            <li v-for='(item,index) in randomList' :key='index'>
              <nuxt-link :to="{name: 'goodsDetail-goodsDetail', query: { shopId: item.itemId}}">
                <img class="activing_list_img" :src="item.itemImage" alt="">
                <p class="activing_list_title">{{item.itemTitle}}</p>
                <p class="activing_list_price" v-if="item.price">￥{{item.price.toFixed(2)}}</p>
              </nuxt-link>
            </li>
          </ul>
        </div>        
      </div>
       <!--今日必买  -->
      <div class="activing">
        <img class="recommend_bgimg" src="../../assets/images/activing_bimai.png" alt="">
        <div class="activing_content">
          <ul class="activing_list">
             <li v-for='(item,index) in randomList' :key='index'>
              <nuxt-link :to="{name: 'goodsDetail-goodsDetail', query: { shopId: item.itemId }}">
                <img class="activing_list_img" :src="item.itemImage" alt="">
                <p class="activing_list_title">{{item.itemTitle}}</p>
                <p class="activing_list_price" v-if="item.price">￥{{item.price.toFixed(2)}}</p>
              </nuxt-link>
            </li>
          </ul>
        </div>        
      </div>
    </div>
    <div class="goods_card">
          <h6>为您推荐</h6>
          <ul class="goods_card_list">
            <li v-for="(item,key) in goodsList" :key='key'>
              <goodscard :item="item" ></goodscard>
            </li>
          </ul>
    </div>
    <van-list v-if="goodsCount > 0" v-model="loading" :finished="finished" :loading-text='islanding' @load="onLoad" :offset='10'>
    </van-list>
  </div>
</template>

<script>
import api from "~/api";
import { Toast, Lazyload } from "vant";
import goodscard from "~/components/indexcomponents/goodsCard.vue";
export default {
  name: "youxuan",
  components: {
    goodscard
  },
  data() {
    return {
      display: false,
      // 推荐数据
      goodsList: [],
      // 今日必买 主播推荐 3条数据
      randomList: [],
      imageList: "",
      //上拉加载数据
      list: [],
      loading: false,
      finished: false,
      page: 1,
      pageSize: 12,
      goodsCount: 0,
      islanding: "数据加载中"
    };
  },
  methods: {
    // 上拉加载更多
    onLoad() {
      setTimeout(() => {
        if (this.goodsCount == this.goodsList.length) {
          this.loading = false;
          this.islanding = "没有更多数据了";
          setTimeout(() => {
            this.finished = true;
          }, 800);
          return;
        }
        this.loading = true;
        var page = this.page;
        var pageSize = this.pageSize;
        api.getPopularpromotion(page, pageSize).then(res => {
          var newarr = this.goodsList.concat(res.data.list);
          this.goodsList = newarr;
          this.page = page + 1;
          this.loading = false;
        });
      }, 500);
    },
    getThreeData() {
      /* 随机三条数据 */
      api.getThreeShop().then(res => {
        if (res.data.list.length > 0) {
          this.display = true;
        }
        this.randomList = res.data.list;
      });
    }
  },
  mounted() {
    // 获取主播推荐 和 今日必买 数据
    this.getThreeData();
    let page = this.page;
    let pageSize = this.pageSize;
    api.getPopularpromotion(page, pageSize).then(res => {
      this.goodsList = res.data.list;
      this.goodsCount = res.data.count;
      this.page = page + 1;
    });
  }
};
</script>


<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.youxuan {
  .goods_list {
    width: 100%;
    padding: tr(0px) tr(20px) tr(0px) tr(20px);
    .activing {
      position: relative;
      height: auto;
      margin-bottom: tr(205px);
      .recommend_bgimg {
        width: 100%;
        height: tr(290px);
        border-radius: tr(10px);
      }
      .activing_content {
        position: absolute;
        top: tr(129px);
        width: 100%;
        padding: 0 tr(20px);
        .activing_list {
          width: 100%;
          border-radius: tr(10px);
          padding: tr(30px) tr(20px);
          background-color: #fff;
          display: flex;
          justify-content: space-between;
          li {
            width: 32%;
            background-color: #f7f7f7;
            border-radius: tr(8px);
            padding-bottom: tr(10px);
            a {
              width: 100%;
              display: inline-block;
              .activing_list_img {
                width: 100%;
                height: tr(191px);
                border-radius: tr(8px) tr(8px) 0 0;
              }
              .activing_list_title {
                margin-top: tr(10px);
                color: #1a1a1a;
                font-size: tr(22px);
                line-height: tr(32px);
                text-align: left;
                padding: 0 tr(10px);
                overflow: hidden; /*自动隐藏文字*/
                text-overflow: ellipsis; /*文字隐藏后添加省略号*/
                white-space: nowrap; /*强制不换行*/
              }
              .activing_list_price {
                text-align: right;
                color: #8346fd;
                font-size: tr(28px);
                line-height: tr(28px);
                margin-top: tr(16px);
                padding: 0 tr(10px);
                overflow: hidden; /*自动隐藏文字*/
                text-overflow: ellipsis; /*文字隐藏后添加省略号*/
                white-space: nowrap; /*强制不换行*/
              }
            }
          }
        }
      }
    }
  }
  .goods_card {
    width: 100%;
    background-color: #fff;
    h6 {
      text-align: center;
      color: #1a1a1a;
      font-size: tr(32px);
      line-height: tr(100px);
    }
    .goods_card_list {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      padding: 0 tr(20px);
      flex-wrap: wrap;
      li {
        width: 50%;
        margin-top: tr(18px);
      }
      li:nth-child(odd) {
        border-right: 1px solid #e6e6e6;
      }
      li:nth-child(even) {
        border-left: 1px solid #e6e6e6;
      }
    }
  }
}

@media screen and (min-width: 750px) {
  .activing {
    margin-bottom: tr(270px) !important;
  }
  .recommend_bgimg {
    height: tr(420px) !important;
  }

  .activing_content {
    top: tr(159px) !important;
  }

  .activing_list li {
    width: 32% !important;
  }

  .activing_list_img {
    height: tr(350px) !important;
  }
}
</style>