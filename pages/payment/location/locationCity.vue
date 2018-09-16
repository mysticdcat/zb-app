<template>
    <div class='container' ref="stateTop">
        <!-- 搜索 -->
        <div class='searchInput'>
            <img src="~@/assets/images/close.png" alt="" @click='goHome'>
            <!-- <i class='iconfont icon-icon-test'></i> -->
            <input type="text" placeholder='城市名/拼音' @focus='search'>
        </div>
        <!-- 国家切换 -->
        <ul class='toggleCountry'>
            <li class='china' @click='china' :class='{activeCountry:changeChinaBorder==1}'>中国</li>
            <li class='foreign' @click='foreign' :class='{activeCountry:changeForeignBorder==2}'>马来西亚</li>
        </ul>
        <keep-alive>
            <component :is='tabCurrent'></component>
        </keep-alive>
    </div>
</template>
<script>
import china from "~/components/toggleCountry/china";
import malaysia from "~/components/toggleCountry/malaysia";

export default {
  components: {
    china,
    malaysia
  },
  data() {
    return {
      changeChinaBorder: -1, //选择国家出现border-bottom
      changeForeignBorder: -1,
      threeVisit: ["北京", "上海", "杭州"],
      nineVisit: [
        "北京",
        "上海",
        "杭州",
        "武汉",
        "深圳",
        "长沙",
        "广州",
        "重庆",
        "四川"
      ],
      // endSelectedCity: '',         //最终选择的城市
      tabComponents: ["china", "malaysia"],
      tabCurrent: "china"
    };
  },
  methods: {
    china() {
      this.changeChinaBorder = 1;
      this.changeForeignBorder = -1;
      this.tabCurrent = this.tabComponents[0];
    },
    foreign() {
      this.changeForeignBorder = 2;
      this.changeChinaBorder = -1;
      this.tabCurrent = this.tabComponents[1];
    },
    search() {
      this.$router.push("/payment/location/search");
    },
    /* 点击返回主页 */
    goHome() {
      this.$router.push("/payment/payment");
    }
  },
  /* 页面一加载自动加载中国子组件 */
  mounted() {
    let statusBarHeight = localStorage.getItem("statusBarHeight");
    this.$refs.stateTop.style.paddingTop = statusBarHeight + "px";
    this.tabCurrent = this.tabComponents[0];
    this.changeChinaBorder = 1;
  }
};
</script>
<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
.container {
  width: 100%;
  height: 100%;
}
.searchInput {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #eee;
  position: relative;
  > img {
    position: absolute;
    left: tr(30px);
    top: 50%;
    transform: translateY(-50%);
  }
  > input {
    width: 70%;
    height: 25px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: tr(50px);
    text-align: center;
    background-color: #eee;
  }
}
.toggleCountry {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #ccc;
  .china,
  .foreign {
    width: 50%;
    height: 40px;
    text-align: center;
    float: left;
    line-height: 40px;
  }
}
.activeCountry {
  border-bottom: 2px solid skyblue;
}
</style>
