<template>
    <div class='container' v-if="display">
        <!-- 背景图 -->
        <div class='popularHeight'>
            <div class="popularityRanking">
                <img src="~@/assets/images/ranking.png" alt="">
                <!-- <span class='more'>更多
          <van-icon name="arrow" class='icon' />
        </span> -->
            </div>
            <!-- 排名图片 -->
            <img src="~@/assets/images/one.png" alt="" class='numberOne'>
            <img src="~@/assets/images/two.png" alt="" class='numberTwo'>
            <img src="~@/assets/images/three.png" alt="" class='numberThree'>
            <!-- 人气商品排行 -->
            <ul class='moodsUl'>
                <li class='popularGoods' v-for="(data,index) in dataList" :key='index' @click="toDetail(data.itemId)">
                    <!-- 左侧小图片 -->
                    <div class='leftImg'>
                        <img v-bind:src="data.itemImage" alt="" v-lazy="data.itemImage">
                    </div>
                    <!-- 右侧文字介绍 -->
                    <div class='rightWord'>
                        <span>{{data.itemTitle}}</span>
                        <span class='price'>￥{{data.price}}.00</span>
                        <!-- 点击加入购物车 -->
                        <img src="~@/assets/images/smallcar.png" alt="" class='shopcar' @click.stop="goGoodsCar(data.itemId)">
                    </div>
                </li>
            </ul>
        </div>
        <!-- 新品上新 -->
        <div class='newProduct'>
            <div>
                <img src="~@/assets/images/newproduct.png" alt="">
                <!-- <span class='more'>更多
                    <van-icon name="arrow" class='icon' />
                </span> -->
            </div>
            <ul class='newUl'>
                <li v-for='(data,index) in randomList' :key='index' @click="toDetail(data.itemId)">
                    <img :src="data.itemImage" alt="">
                    <span>{{data.itemTitle}}</span>
                    <p v-if="data.price">￥{{data.price.toFixed(2)}}</p>
                </li>
            </ul>
        </div>
        <!-- 为您推荐 -->
        <div class="goods_card">
            <h6>为您推荐</h6>
            <ul class="goods_card_list">
                <li v-for="(item,key) in goodsList" :key='key'>
                    <goodscard :item="item"></goodscard>
                </li>
            </ul>
        </div>
        <van-list v-model="loading" :finished="finished" @load="onLoad" :offset='10' :immediate-check="false" :loading-text='islanding'></van-list>
    </div>
</template>
<script>
import api from "~/api";
import { Toast } from "vant";
import { Lazyload } from "vant";
import goodscard from "~/components/indexcomponents/goodsCard.vue";
export default {
  components: {
    goodscard
  },
  data() {
    return {
      display: false,
      dataList: [],
      randomList: [],
      goodsList: [], //推荐数据
      loading: false,
      finished: false,
      pageNum: 1,
      pageSize: 12,
      allNum: 0,
      islanding: "数据加载中"
    };
  },
  methods: {
    /* 初始化4条排行数据 */
    initList() {
      api.getPopularRanking().then(res => {
        this.dataList = res.data.list;
      });
      /* 随机三条数据 */
      api.getThreeShop().then(res => {
        this.randomList = res.data.list;
      });
    },
    /* 点击跳转到详情页，把shopid传过去 */
    toDetail(shopId) {
      this.$router.push({
        path: "/goodsDetail/goodsDetail",
        query: { shopId: shopId }
      });
    },
    // /* 点击加入购物车 */
    goGoodsCar(itemid) {
      var params = {
        itemid: itemid,
        num: 1
      };
      api
        .getGoodsCar(params)
        .then(res => {
          if (res.code == 200) {
            Toast({
              mask: false,
              message: "成功添加到购物车",
              duration: 800
            });
          }
        })
        .catch(res => {
          Toast.error({
            mask: false,
            message: "添加到购物车失败",
            duration: 800
          });
        });
    },
    // 下拉加载更多数据
    onLoad() {
      setTimeout(() => {
        if (this.allNum == this.goodsList.length) {
          this.loading = false;
          this.islanding = "没有更多数据了";
          setTimeout(() => {
            this.finished = true;
          }, 1500);
          return;
        }
        this.loading = true;
        var pageNum = this.pageNum;
        var pageSize = this.pageSize;
        api.getmustlist(pageNum, pageSize).then(res => {
          var newarr = this.goodsList.concat(res.data.list);
          this.goodsList = newarr;
          this.pageNum = pageNum + 1;
          this.loading = false;
        });
      }, 500);
    }
  },
  mounted() {
    this.initList();
    var pageNum = this.pageNum;
    var pageSize = this.pageSize;
    api.getmustlist(pageNum, pageSize).then(res => {
      if (res.data.list.length > 0) {
        this.display = true;
      }
      this.goodsList = res.data.list;
      this.allNum = res.data.count;
      this.pageNum = pageNum + 1;
    });
  }
};
</script>
<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
.container {
  width: 100%;
  overflow: hidden;
}
.popularHeight {
  position: relative;
  .popularityRanking {
    width: 100%;
    margin: 0 auto;
    padding: 0 tr(20px);
    img {
      width: 100%;
    }
    .more {
      position: absolute;
      z-index: 66;
      color: #fff;
      font-size: tr(28px);
      right: tr(40px);
      top: tr(50px);
      .icon {
        vertical-align: tr(-3px);
      }
    }
  }
  > ul {
    width: 92%;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: tr(129px);
    .popularGoods:first-child {
      margin: tr(30px) auto tr(16px);
    }
    .popularGoods {
      // width: tr(608px);
      position: relative;
      width: 94%;
      height: tr(113px);
      margin: 0 auto tr(16px);
      background-color: #f7f7f7;
      border-radius: 0px tr(8px) tr(8px) 0px;
      .leftImg {
        width: tr(115px);
        height: tr(113px);
        float: left;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .rightWord {
        width: tr(493px);
        height: tr(113px);
        float: left;
        > span {
          width: tr(362px);
          display: block;
          padding: tr(15px) 0 0 tr(20px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: tr(24px);
          float: left;
        }
        .price {
          color: #8346fd;
          padding: tr(18px) 0 0 tr(22px);
          font-size: tr(28px);
          display: inline;
        }
        .shopcar {
          width: tr(46px);
          height: tr(46px);
          position: absolute;
          right: tr(23px);
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}

.newProduct {
  position: relative;
  width: 100%;
  height: tr(500px);
  z-index: 2;
  margin-top: tr(370px);
  div:first-child {
    width: 100%;
    padding: 0 tr(20px) 0 tr(20px);
    box-sizing: border-box;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
  .more {
    position: absolute;
    z-index: 999;
    color: #fff;
    color: fff;
    font-size: tr(28px);
    right: tr(40px);
    top: tr(45px);
    .icon {
      vertical-align: tr(-3px);
    }
  }
  > ul {
    width: 92%;
    height: tr(351px);
    background: rgba(255, 255, 255, 1);
    border-radius: tr(10px);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: tr(129px);
    padding-top: tr(30px);
    padding-bottom: tr(30px);
    // padding: tr(30px) tr(20px);
    box-sizing: border-box;
    li {
      float: left;
      margin-left: 2.5%;
      width: 30%;
      height: tr(291px);
      background-color: #f7f7f7;
      box-sizing: border-box;
      border-radius: 5px;
      img {
        width: 100%;
        height: tr(191px);
        border-radius: 3px;
      }
      span {
        width: tr(171px);
        display: block;
        color: rgba(26, 26, 26, 1);
        font-size: tr(22px);
        padding-top: tr(17px);
        margin: 0 auto;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      p {
        text-align: right;
        line-height: tr(45px);
        margin-right: tr(10px);
        font-size: tr(28px);
        color: #8346fd;
      }
    }
  }
}
.numberOne,
.numberTwo,
.numberThree {
  width: tr(40px);
  height: tr(40px);
  position: relative;
  left: tr(51px);
  z-index: 100;
  top: tr(-131px);
}
.numberTwo {
  top: tr(-2px);
  left: tr(12px);
}
.numberThree {
  top: tr(127px);
  left: tr(-24px);
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

@media screen and (min-width: 768px) {
  .newProduct {
    height: tr(630px);
    margin-top: tr(280px);
  }
  .moodsUl {
    top: tr(169px) !important;
  }
  .newUl {
    top: tr(169px) !important;
    height: tr(431px) !important;
    li {
      height: tr(370px) !important;
      img {
        height: tr(270px) !important;
      }
    }
  }
  .numberOne,
  .numberTwo,
  .numberThree {
    width: tr(40px);
    height: tr(40px);
    position: relative;
    left: tr(71px);
    z-index: 100;
    top: tr(-222px);
  }
  .numberTwo {
    top: tr(-93px);
    left: tr(32px);
  }
  .numberThree {
    top: tr(36px);
    left: tr(-7px);
  }
  .more {
    top: tr(70px) !important;
  }
}

@media screen and (min-width: 990px) {
  .newProduct {
    height: tr(790px);
  }
  .moodsUl {
    top: tr(239px) !important;
  }
  .newUl {
    top: tr(249px) !important;
    height: tr(510px) !important;
    li {
      height: tr(450px) !important;
      img {
        height: tr(340px) !important;
      }
    }
  }
  .numberOne,
  .numberTwo,
  .numberThree {
    width: tr(40px);
    height: tr(40px);
    position: relative;
    left: tr(93px);
    z-index: 100;
    top: tr(-297px);
  }
  .numberTwo {
    top: tr(-168px);
    left: tr(52px);
  }
  .numberThree {
    top: tr(-38px);
    left: tr(13px);
  }
  .newProduct {
    margin-top: tr(200px);
  }
  .more {
    top: tr(100px) !important;
  }
}
</style>

