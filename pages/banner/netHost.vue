<template>
    <div class="netHost">
          <Headertitle :title='faTitle'></Headertitle>
        <div class="main">
            <img src="../../assets/carImage/application.png" alt="">
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
            title: "主播招募"
        };
    },
    data() {
        return {
            faTitle: "主播招募"
        };
    },
    methods: {}
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
        background: url(../../assets/carImage/netHost.png) no-repeat;
        background-size: 100% 100%;
        img {
            width: 50%;
            position: absolute;
            top: 80%;
            height: tr(200px);
            left: 25%;
        }
    }
}
</style>

