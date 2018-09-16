<template>
  <div id="all">
    <div class="header">
      <div class="top fx-justify-start">
        <div class="p1">
          <van-icon name="arrow-left" class="arrowLeft" @click="jumpBack" />
        </div>
        <div class="p2">
          <van-icon name="search" class="search" />
          <input type="search" placeholder='店内搜素' v-model="name" @keyup.enter='searchCommodity'>
        </div>
        <div class="p3"></div>
      </div>
      <!-- 上半部分的信息 -->
      <div class="down fx-justify-start">
        <div class="left">
          <div class="imgbox">
            <img :src="typeList.logo" alt="">
          </div>
        </div>
        <div class="right">
          <div class="rights">
            <p class="fz-36 ">{{typeList.name}}</p>
            <p class="fz-28 ">主营|{{typeList.desc}}</p>
          </div>
        </div>

      </div>
    </div>
    <div class="content">
      <!-- 页面一刷新就先把所有的商品渲染出来 -->
      <div class="shop" v-for="(data,key) in dataList" :key="key" @click="toShopDetaill(data.id)">
        <div class="imgbox">
          <img :src="data.image[0]" alt="">
        </div>
        <div class="info">
          {{data.title}}
        </div>
        <div class="price">
          <span>￥</span>
          <span>{{data.tbItemProperty.price}}</span>
          <span>.00</span>
        </div>
      </div>
    </div>
    <van-list v-if="searched" v-model="loading" :finished="finished" @load="onLoad" :offset='10' :immediate-check="false" :loading-text='islanding'>
    </van-list>
    <van-list v-else v-model="loading" :finished="finished" @load="searchLoad" :offset='10' :immediate-check="false" :loading-text='islanding'>
    </van-list>
  </div>
</template>
<script>
import api from "~/api";
import { Toast } from "vant";
export default {
  head() {
    return {
      title:"商家详情"
    };
  },
  data() {
    return {
      dataList: [], //页面一加载就渲染所有的商品信息
      typeList: {}, //根据主健id来获取该商家的信息
      loading: false,
      finished: false,
      searched: true,
      islanding: "数据加载中",
      shopid: null,
      pageNum: 1,
      pageSize: 4,
      name: "",
      allNum: 0
    };
  },
  methods: {
    jumpBack() {
      this.$router.go(-1);
    },
    toShopDetaill(shopId) {
      this.$router.push({
        path: "/goodsDetail/goodsDetail",
        query: { shopId: shopId }
      });
    },
    /* 模糊查询，根据输入的字段来查询商品 */
    searchCommodity() {
      let shopid = this.$route.query.shopId;

      let name = this.name;
      let pageNum = this.pageNum;
      let pageSize = this.pageSize;
      if (name.length == 0) {
        Toast("请输入搜索内容");
        this.initList();
      } else {
        api.searchCom(shopid, name, pageNum, pageSize).then(res => {
          if (res.data) {
            this.searched = false;
            res.data.list.forEach(item => {
              item.image = item.image.split(",");
            });
            this.dataList = res.data.list;
            // 关键字搜索到的总条数
            this.allNum = res.data.count;
          } else {
            Toast("没有找到相关商家信息");
            /* 当没有数据时，是没有count和list的，所以在这里是res.data */
            this.dataList = res.data;
          }
        });
      }
    },
    // 下拉加载更多
    onLoad() {
      setTimeout(() => {
        if (this.allNum == this.dataList.length) {
          this.loading = false;
          this.islanding = "没有更多数据了";
          setTimeout(() => {
            this.finished = true;
          }, 500);
          return;
        }
        this.loading = true;
        var shopid = this.$route.query.shopId;
        var pageNum = this.pageNum;
        var pageSize = this.pageSize;
        api.getIdShopGoods(shopid, pageNum, pageSize).then(res => {
          var newarr = this.dataList.concat(res.data.list);
          res.data.list.forEach(item => {
            item.item.image = item.item.image.split(",");
          });
          this.dataList = newarr;
          this.pageNum = pageNum + 1;
          this.loading = false;
        });
      }, 1500);
    },
    //搜索下拉加载更多
    searchLoad() {
      if (this.searched === false) {
        setTimeout(() => {
          if (this.allNum == this.dataList.length) {
            this.loading = false;
            this.islanding = "没有更多数据了";
            setTimeout(() => {
              this.finished = true;
            }, 800);
            return;
          }
          this.loading = true;
          let shopid = this.$route.query.shopId;
          let name = this.name;
          let pageNum = this.pageNum;
          let pageSize = this.pageSize;
          api.getIdShopGoods(shopid, name, pageNum, pageSize).then(res => {
            var newarr = this.shopLists.concat(res.data.list);
            this.shopLists = newarr;
            this.pageNum = pageNum + 1;
            this.loading = false;
          });
        }, 1000);
      }
    },
    //封装成函数让页面一刷新就加载数据
    initList() {
      var shopid = this.$route.query.shopId;
      var pageNum = this.pageNum;
      var pageSize = this.pageSize;
      api.getIdShopGoods(shopid, pageNum, pageSize).then(res => {
        this.dataList = res.data.list;
        this.allNum = res.data.count;
        this.pageNum = pageNum + 1;
        this.dataList.forEach(item => {
          item.image = item.image.split(","); //获取该商家下的商品
        });
      });
    }
  },
  /* 通过计算属性，v-model里面的name一发生变化就执行初始化函数 */
  watch: {
    name: function() {
      if (this.name == "") {
        this.initList();
      }
    }
  },
  mounted() {
    //页面一刷新就加载数据
    this.initList();
    /* 页面一加载完上半部分的数据渲染 */
    api.getIdShop(this.$route.query.shopId).then(res => {
      this.typeList = res.data;
    });
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
#all {
  background-color: #f7f7f7;
  .header {
    width: 100%;
    height: tr(338px);
    padding-top: tr(51px);
    background: url("../../assets/images/shopb.png") no-repeat center;
    background-size: 100%;
    .top {
      width: 100%;
      height: tr(68px);
      /*    display: flex;
         display: -ms-flexbox;
         display:-webkit-flex;
         -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row; */
      .p1 {
        width: tr(75px);
        color: #fff;
        display: flex;
        .arrowLeft {
          margin: auto;
        }
      }
      .p2 {
        width: tr(600px);
        border-radius: tr(34px);
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        padding-left: tr(29px);
        input {
          margin-left: tr(20px);
          border: none;
          width: tr(600px);
          border-radius: tr(34px);
          font-size: tr(28px);
          // // background: #f6f4f4;
          background: rgba(255, 255, 255, 0);
          // opacity: 0.8 !important;
        }
        .search {
          margin: auto 0;
          font-size: tr(34px);
        }
      }

      .p3 {
        width: tr(75px);
      }
    }
    .down {
      width: 100%;
      height: tr(152px);
      padding: tr(28px) 0;

      /*  display:flex;
           flex-direction:row; */
      padding-left: tr(75px);
      .left {
        width: tr(152px);
        .imgbox {
          width: tr(152px);
          height: tr(152px);
          img {
            width: 100%;
            height: 100%;
            float: left;
          }
        }
      }
      .right {
        width: tr(540px);
        height: tr(152px);
        display: flex;
        .rights {
          margin: auto 0;
          padding-left: tr(21px);
          p:nth-child(1) {
            font-size: tr(36px);
            color: #fffefe;
          }
          p:nth-child(2) {
            font-size: tr(28px);
            color: #fffefe;
            margin-top: tr(10px);
          }
        }
      }
    }
  }
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding-left: 12px;
    .shop {
      width: tr(345px);
      height: tr(477px);
      padding: tr(21px) tr(20px) tr(21px) tr(19px);
      border-radius: 5px;
      padding: tr(20px);
      margin-top: 10px;
      margin-right: 5px;
      background: #fff;
      .imgbox {
        width: tr(306px);
        height: tr(306px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
          font-size: tr(24px);
        margin-top: tr(16px);
        font-weight: bold;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .price {
        margin-top: tr(10px);
        font-weight: bolder;
        span {
          background: linear-gradient(
            270deg,
            rgb(233, 68, 180),
            rgb(79, 72, 179)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        span:nth-child(1) {
          font-size: tr(24px);
        }
        span:nth-child(2) {
          font-size: tr(36px);
        }
        span:nth-child(3) {
          font-size: tr(24px);
        }
      }
    }
  }
}
input::-webkit-input-placeholder {
  font-size: tr(28px);
  color: #999;
}
input::-moz-input-placeholder {
  font-size: tr(28px);
  color: #999;
}

input::-ms-input-placeholder {
  font-size: tr(28px);
  color: #999;
}
</style>