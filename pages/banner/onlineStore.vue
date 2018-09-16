<template>
    <div class="netHost">
        <Headertitle :title='faTitle'></Headertitle>
        <div class="main">
              <img src="../../assets/carImage/join.png" alt="">
        </div>
    </div>
</template>
<script>
import Headertitle from '~/components/header/title.vue'
export default {
     components: {
        Headertitle
    },
    head() {
    return {
      title:'在线商店'
    };
  },
  data() {
    return {
         faTitle:'在线商店',
    };
  },
  methods: {
    //返回上一级
    backgo() {
      this.$router.go(-1);
    }
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.netHost {
  height: 100%;
  background-color: #fff;
  .main {
    text-align: center;
    position: relative;
    z-index: 1;
    height: 100%;
    background: url(../../assets/carImage/onlineStore.png) no-repeat;
    background-size: 100% 100%;
    img {
      width: 50%;
      position: absolute;
      top: 83%;
      height: tr(100px);
      left: 25%;
    }
  }
}
</style>

