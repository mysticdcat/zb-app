<template>
    <div class="search"  ref="stateTop">
        <header class="search_header">
             <div class="search_input flex1">
                    <img src="~/assets/payimg/search_icon.png" alt="search_icon">
                    <input type="text" :placeholder="placeholder" v-model="searchWord">
                    <i class="iconfont icon-delete_fill" @click="resetting" v-show="isDelete"></i>
                </div>
                <div class="search_word" @click="search">
                    搜索
                </div>
        </header>
        <div class="search_result" v-if="isSearch">
            <ul class="search_list">
                <li v-for="(item,index) in searchList" :key="index" @click="godetail"></li>
            </ul>
        </div>
        <div class="hot_search" v-else>
            <p class="hot_title">热门搜索</p>
           <ul class="hot_search_list">
               <li>土豆丝</li>
               <li>麻辣烫</li>
               <li>香菇青菜</li>
               <li>杨国福麻辣烫</li>
               <li>小炒肉</li>
               <li>胡辣汤</li>
           </ul>
        </div>
    </div>
</template>

<script>
import api from "~/api";
import { Toast } from "vant";
export default {
  data() {
    return {
      placeholder: "搜索关键字",
      // 搜索输入文字
      searchWord: "",
      isSearch: false,
      searchList: [],
      isDelete: false
    };
  },
  methods: {
    resetting() {
      console.log(1111);
    },
    search() {
      let keyword = this.searchWord;
      // let addr = this.$store.state.city;
      let addr = this.$store.state.city;
      let lng = this.$store.state.coordinate.lng;
      let lat = this.$store.state.coordinate.lat;
      let params = {
        keyword,
        addr,
        lng,
        lat
      };
      console.log(params, "params");
      api
        .getKeyWordShops(params)
        .then(res => {
          this.searchList = res.data;
          this.isSearch = true;
        })
        .catch(err => {});
    },
    godetail() {}
  },
  mounted() {
    let statusBarHeight = localStorage.getItem("statusBarHeight");
    this.$refs.stateTop.style.paddingTop = statusBarHeight + "px";
  },
  created() {},
  watch: {
    searchWord: function() {}
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.search {
  width: 100%;
  background-color: #fff;
  padding: tr(30px) tr(20px) tr(0px) tr(20px);
  .search_header {
    width: 100%;
    height: tr(60px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .search_input {
      height: 100%;
      border-radius: tr(30px);
      background-color: rgba(0, 0, 0, 0.05);
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flexbox;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      img {
        width: tr(32px);
        height: tr(32px);
        margin-left: tr(25px);
      }
      input {
        margin-left: tr(10px);
        font-size: tr(26px);
        line-height: 20px;
        color: #999999 !important;
        background-color: transparent;
      }
      ::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #999 !important;
      }
      ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #999;
      }
      :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #999;
      }
      i {
        font-size: tr(36px);
        color: #999;
        position: absolute;
        right: tr(10px);
      }
    }
    .search_word {
      height: 100%;
      color: #8346fd;
      padding: tr(0px) tr(30px);
      border-radius: tr(16px);
      font-size: tr(20px);
      background-color: rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: tr(15px);
    }
  }
  .search_result {
    width: 100%;
    .search_list {
      width: 100%;
      li {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: tr(20px) 0;
        font-size: tr(24px);
        color: #1a1a1a;
        border-bottom: 1px solid #e6e6e6;
      }
    }
  }
  .hot_search {
    width: 100%;
    margin-top: tr(20px);
    .hot_title {
      color: #1a1a1a;
      font-size: tr(26px);
      line-height: tr(60px);
      border-bottom: 1px solid #e6e6e6;
    }
    .hot_search_list {
      width: 100%;
      padding: 0 0 tr(15px) 0;
      li {
        font-size: tr(24px);
        color: #1a1a1a;
        padding: tr(10px) tr(25px);
        border-radius: tr(2px);
        border: 1px solid #e6e6e6;
        display: inline-block;
        margin: tr(20px) tr(20px) 0 0;
      }
    }
  }
}
</style>