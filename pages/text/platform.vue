<template>
    <div class="platform">
         <Headertitle :title='faTitle'></Headertitle>
        <div>
            <h3>平台介绍：</h3>
            <p>宝兆平台是在共享经济时代下诞生的一款“直播+电商”产品，致力于为广大消费者、主播和商家提供一个在线直播、互动和购物的平台。</p>
            <p>产品特色：</p>
            <p>1.	打破传统</p>
            <p>将商城系统和视频直播技术应用于电商行业，将产品更全面地展现给用户</p>
            <p>2.	在线导购，促进销售</p>
            <p>主播免费商品代言、在线导购，吸引用户，降低销售成本，提高销售效率。</p>
            <p>3.	在线互动，愉快购物</p>
            <p>用户与主播在线互动，更全面地了解到商品</p>
            <p>4.	优惠买单</p>
            <p>线下商户一键直播，用户一键买单，线上与线下结合，促进新零售发展。</p>
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
      title: "平台介绍"
    };
  },
  data () {
      return {
           //头部
            faTitle:'平台介绍',
      }
  }
};
</script>

<style lang="scss" scoped>
.platform {
  padding: 10px;
  height: 100%;
  background-color: #fff;
}
p {
  letter-spacing: 2px;
  font-size: 14px;
  text-indent: 2em;
}
h3 {
  text-align: center;
}
</style>
