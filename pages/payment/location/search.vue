<template>
    <div ref="stateTop">
        <div class='searchInput'>
            <input type="text" placeholder='城市名/拼音名' v-model='search' @focus='focusSearch'>
            <span class='cancel' @click='cancel'>取 消</span>
        </div>
        <ul class='ulBox'>
            <li v-for='(item,index) in searchList' :key='index' @click='searchCity(item)'>{{item.name}}</li>
        </ul>
    </div>
</template>
<script>
import { Toast } from "vant";
import chinaJson from "~/assets/js/chinaJson.js";
import malaysiaJson from "~/assets/js/malaysiaJson.js";
export default {
  data() {
    return {
      dataList: chinaJson,
      malaList: malaysiaJson,
      search: "",
      searchList: [],
      isShow: false
    };
  },
  methods: {
    /* 点击取消返回上一级 */
    cancel() {
      this.$router.push("/payment/location/locationCity");
    },
    /* 点击搜索出来的值将其保存到vuex中 */
    searchCity(data) {
      if (data.cityid == "-1") {
        // alert('对不起，您所选的城市不在服务范围')
        Toast("对不起，您所选的城市不在服务范围");
        return;
      }
      this.$store.commit("changeCity", data.name);
      this.$router.push({ path: "/payment/payment" });
    },
    focusSearch() {
      this.searchList = [];
    }
  },
  mounted() {
    let statusBarHeight = localStorage.getItem("statusBarHeight");
    this.$refs.stateTop.style.paddingTop = statusBarHeight + "px";
  },
  watch: {
    search(value) {
      // debugger;
      this.searchList = [];
      if (value === "") {
        return;
      }

      this.dataList.forEach(item => {
        // if(item.name!="★热门城市") {
        item.cities.forEach(item => {
          if (
            item.tags.toLowerCase().indexOf(value.toLowerCase()) === 0 ||
            item.name.indexOf(value) === 0
          ) {
            this.searchList.push(item);
          }
        });
        // }
      });
      this.malaList.forEach(item => {
        // if(item.name!="★热门城市") {
        item.City.forEach(item => {
          if (
            item.Code.toLowerCase().indexOf(value.toLowerCase()) === 0 ||
            item.Name.indexOf(value) === 0
          ) {
            var obj = {
              cityid: item.Name,
              name: item.Name
            };
            this.searchList.push(obj);
          }
        });
        // }
      });
      if (this.searchList.length < 1) {
        this.searchList = [{ name: "对不起暂无数据", cityid: "-1" }];
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
.searchInput {
  width: 100%;
  height: tr(90px);
  border-bottom: 1px solid #eee;
  position: relative;
  > input {
    width: 80%;
    height: tr(60px);
    position: absolute;
    left: tr(20px);
    top: 50%;
    transform: translateY(-50%);
    border-radius: tr(50px);
    padding-left: tr(40px);
    background-color: #eee;
  }
  .cancel {
    position: absolute;
    right: tr(25px);
    top: 50%;
    transform: translateY(-50%);
    font-size: tr(26px);
  }
}
.ulBox {
  width: 100%;
  padding-left: tr(20px);
  box-sizing: border-box;
  li {
    width: 100%;
    height: tr(80px);
    line-height: tr(80px);
    border-bottom: 1px solid #ccc;
  }
}
p {
  font-weight: bold;
  font-size: tr(30px);
  padding-left: tr(20px);
  line-height: tr(60px);
}
</style>
