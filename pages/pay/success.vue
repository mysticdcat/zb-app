<template>
    <div class="success">
        <Headertitle :title='faTitle'></Headertitle>
        <div class="logo">
            <img src="../../assets/carImage/success.png" alt="" v-show="code == 200">
            <img src="../../assets/carImage/fuil.png" alt="" v-show="code != 200">
        </div>
        <h3>{{message}}</h3>

        <button @click="goIndex">确定</button>
    </div>
</template>
<script>
import api from "~/api";
import Headertitle from "~/components/header/title.vue";
export default {
    components: {
        Headertitle
    },
    head() {
        return {
            title: "支付信息"
        };
    },
    data() {
        return {
            //头部
            faTitle: "订单支付",
            message: "",
            code: 0,
            key: ""
        };
    },
    methods: {
        // 跳转主页
        goIndex() {
            this.$router.push({
                path: "/"
            });
        }
    },
    mounted() {
        function getSearchString(key) {
            // 获取URL中?之后的字符
            var str = location.search;
            str = str.substring(1, str.length);
            // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
            var arr = str.split("&");
            var obj = new Object();
            // 将每一个数组元素以=分隔并赋给obj对象
            for (var i = 0; i < arr.length; i++) {
                var tmp_arr = arr[i].split("=");
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(
                    tmp_arr[1]
                );
            }
            return obj[key];
        }
        this.message = getSearchString("message");
        this.code = getSearchString("code");
        // this.key = getSearchString("key");
    }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.success {
    height: 100%;
    padding-top: tr(90px);
    background-color: #fff;
    .logo {
        margin: 0 auto;
        text-align: center;
        margin-top: tr(200px);
        img {
            width: tr(120px);
        }
    }
    h3 {
        margin-top: 20px;
        text-align: center;
        font-size: 16px;
    }
    button {
        margin: tr(200px) auto;
        margin-left: 5%;

        width: 90%;
        height: tr(81px);
        text-align: center;
        line-height: tr(33px);
        background: linear-gradient(
            270deg,
            rgb(233, 68, 180),
            rgb(79, 72, 179)
        );
        color: #fff;
        border-radius: tr(40px);
        font-size: tr(32px) !important;
    }
}
</style>


