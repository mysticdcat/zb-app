<template>
  <div class='container'>
    <header-title :title='title'></header-title>
    <!-- 休闲娱乐 -->
    <div class='main'>
      <ul v-if='isShow'>
        <li v-for='(item,index) in dataList' :key='index' @click="goShopDetail(item.id)">
          <img :src="item.logo" alt="">
          <p class='storeName'>{{item.name}}</p>
          <span class='moods'>人气{{item.popularity}}</span>
          <img src="~assets/images/flame.png" alt="" class='flame' v-if='item.popularity>80&&item.popularity<=84?true:false'>
          <img src="~assets/images/flame.png" alt="" class='flame' v-if='item.popularity>84&&item.popularity<=92?true:false' v-for='num in 2' :key='num'>
          <img src="~assets/images/flame.png" alt="" class='flame' v-if='item.popularity>92?true:false' v-for='num in 3' :key='num'>
          <span class='averagePrice'>人均{{item.avgprice}}元</span>
          <span class='distance'>{{item.juli | fmtlevel}}</span>
          <div class='welfale'>周一至周五/男生半价</div>
          <span class='price'>200yuan</span>
          <span class='lyPrice'>300yuan</span>
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
import ts from "coordtransform";
import Headertitle from '~/components/header/title';
export default {
  components: {
    'header-title': Headertitle
  },
  head() {
    return {
      title: '休闲娱乐'
    }
  },
  data() {
    return {
      title: '休闲娱乐',
      isShow: false,
      dataList: [],
      params: {
        typeid: 3,
        addr: this.$store.state.city,
        // addr: '北京市',
        pageNum: 1,
        pageSize: 1,
        lng: this.$store.state.coordinate.lng,
        lat: this.$store.state.coordinate.lat,
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
        if(this.count==this.dataList.length) {
          this.loading=false;
          this.islanding="没有更多数据了";
          setTimeout(() => {
            this.finished=true;
          },1500);
          return;
        } else {
          this.loading=true;
          api.getPlayStore(this.params).then(res => {
            var newarr=this.dataList.concat(res.data.list);
            this.dataList=newarr;
            // this.dataList=[...new Set(newarr)]
            this.params.pageNum=this.params.pageNum+1;
            this.isShow=true;
            this.loading=false;
          });
        }
      },500);
    },
    goShopDetail(id) {
      this.$router.push({
        path: "/payment/shopping/goodsDetail",
        query: { shopId: id,typeid: 3 }
      });
    }
  },
  mounted() {
    /* 娱乐相关的商家 */
    api.getPlayStore(this.params).then(res => {
      if(res.data==null) {
        this.isShow=false;
      } else {
        this.isShow=false,
          this.dataList=res.data.list
        this.count=res.data.count;
        this.params.pageNum=this.params.pageNum+1;
      }
    });
  }
};
</script>

<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
.container {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.main {
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  ul {
    width: 100%;
    li {
      position: relative;
      width: 100%;
      padding: tr(30px);
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      overflow: hidden;
      > img:nth-child(1) {
        background-color: pink;
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
        width: tr(30px);
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
        margin-top: tr(15px);
        color: #999;
      }
      .welfale {
        margin-top: tr(20px);
        position: absolute;
        left: tr(260px);
        font-size: tr(24px);
        color: #999;
      }
      .price {
        position: absolute;
        bottom: tr(20px);
        left: tr(260px);
        display: inline-block;
        color: #ff1400;
        font-size: tr(26px);
      }
      .lyPrice {
        position: absolute;
        bottom: tr(20px);
        left: tr(380px);
        text-decoration: line-through;
        color: #999;
        font-size: tr(26px);
      }
    }
  }
}
.noStore {
  width: 100%;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translateX(-50%);
  img {
    width: tr(210px);
    height: tr(168px);
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  p {
    color: RGBA(153, 153, 153, 1);
    font-size: tr(24px);
    text-align: center;
    margin-top: tr(20px);
  }
}
</style>
