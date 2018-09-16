<template>
    <div class="top">
         <Headertitle :title='faTitle'></Headertitle>
        <div v-if="show">
            <header>
            </header>
            <div class="main">
                <ul>
                    <li v-for="(item,value) in topDataList" :key="value">
                        <img src="../../assets/top/1.png" alt="" v-if="value == 0">
                        <img src="../../assets/top/2.png" alt="" v-if="value == 1">
                        <img src="../../assets/top/3.png" alt="" v-if="value == 2">
                        <span v-if="value > 2">{{value + 1}}</span>
                        <span>{{item.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="empty" v-if="!show">
            
            <img src="../../assets/top/empty.png" alt="">
            <p>暂无数据</p>
        </div>
    </div>
</template>
<script>
import api from "../../api/index";
import Headertitle from '~/components/header/title.vue'
export default {
     components: {
        Headertitle
    },
    head() {
    return {
      title:'家族榜单'
    };
  },
  data() {
    return {
        faTitle:'家族榜单',
      show: false,
      topDataList: [],
      params: {
        type: 2,
        pageNum: 1,
        pageSize: 50,
        giftid: 325,
        total: 50
      }
    };
  },
  methods: {},
  mounted() {
    api.getTopList(this.params).then(res => {
      this.topDataList = res.data;
      this.firstImg = this.topDataList[0].smallpic;
      this.myname = res.data[0].myname;
      if (res.data.length > 0) {
        this.show = true;
      }
    });
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.top {
  width: 100%;
  height: 100%;

  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      margin-top: tr(-100px);
      display: inline-block;
    }
    p {
      text-align: center;
      margin-top: tr(40px);
      font-size: tr(28px);
      font-weight: bold;
      color: #ccc;
    }
  }
  header {
    width: 100%;
    height: tr(352px);
    background: url(../../assets/top/family.png);
    img {
      width: 100%;
    }
  }
  .main {
    margin-top: -20px;
    z-index: 999;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    height: tr(1000px);
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    padding: 0 tr(20px);
    overflow: hidden;
    ul {
      width: 100%;
      height: 100%;
      padding: 0 tr(20px);
      margin-bottom: tr(20px);
      border-radius: tr(16px);
      background-color: #fff;
      overflow-y: auto;
      //滑动效果
      -webkit-overflow-scrolling: touch;
      li {
        width: 100%;
        height: tr(100px);
        border-bottom: 1px solid #eee;
        padding-top: tr(20px);
        img {
          width: tr(42px);
          height: tr(62px);
          display: inline-block;
          vertical-align: middle;
        }
        span:nth-child(1) {
          width: tr(42px);
          height: tr(62px);
          display: inline-block;
          text-align: center;
          line-height: tr(62px);
          color: #8346fd;
          vertical-align: middle;
          font-size: tr(28px);
        }
        span:nth-child(2) {
          font-size: tr(28px);
          padding-left: tr(40px);
          color: #8346fd;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>


