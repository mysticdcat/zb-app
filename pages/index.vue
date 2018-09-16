<template>
    <div id="first">
        
        <div id="tabbar">
            <div class="topImg">
                <img src="../assets/images/fiveDiscount2x.png" alt="" class="topbg_img">
                <div class="tabbar_box">
                    <ul class="tabbar_list">
                        <li v-for="(item,index) in tabList" :key="index" @click="toggleTab(index)" :class="{active:isShow == index ? true :false}">
                            <img :src="item.image" alt="">
                            <span>{{item.typeName}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <keep-alive>
            <component :is="currentTab"></component>
        </keep-alive>
        <img src="../assets/images/cart.png" alt="" class='shopCar' @click='goShop'>
    </div>
</template>
<script>
import api from "~/api";
import remeng from "./hotactivity/remeng";
import youxuan from "./hotactivity/youxuan";
import bimai from "./hotactivity/bimai";
import icon1 from "@/assets/images/tabbar1@2x.png";
import icon2 from "@/assets/images/tabbar2@2x.png";
import icon3 from "@/assets/images/tabbar3@2x.png";
export default {
    scrollTop: false,
    head() {
        return {
            title: "购物"
        };
    },
    data() {
        return {
            currentTab: "remeng",
            dataList: [],
            remeng: 1,
            show: 1,
            isShow: 0,
            tabList: [],
            tabcompontents: ["remeng", "youxuan", "bimai"],
            index: 0
        };
    },
    components: {
        remeng,
        youxuan,
        bimai
    },
    methods: {
        toggleTab(index) {
            if (index != null) {
                this.isShow = index;
                this.currentTab = this.tabcompontents[index];
                this.$store.commit("changeTabIndex", index);
            }
        },
        //点击跳转购物车
        goShop() {
            this.$router.push({
                path: "/goodsCar/goodsCar"
            });
        }
    },
    /* && */
    mounted() {
        if (this.$route.query.key) {
            if (localStorage.getItem("key") != this.$route.query.key) {
                localStorage.setItem("key", this.$route.query.key);
            }
        }

        api
            .getTabbaTitle()
            .then(res => {
                this.tabList = res.data;
            })
            .catch(err => {});
        //获取app传过来的index
        if (this.$route.query.index) {
            this.index = this.$route.query.index;
            // 获取的url参数 为string类型 转换为num
            let num = this.index;
            this.isShow = num;
            this.currentTab = this.tabcompontents[num];
        }
        // 如果有全局状态的index值
        let n = this.$store.state.tabIndex;
        this.toggleTab(n);
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
#first {
    /* 解决再ios屏幕上滑动卡顿问题 */
    overflow: auto; /* 用于 android4+，或其他设备 */
    -webkit-overflow-scrolling: touch; /* 用于 ios5+ */
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    padding-top: tr(300px);
}
#tabbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: #f7f7f7;
    z-index: 1000;
    font-size: 14px;
    .topImg {
        width: 100%;
        height: auto;
        position: relative;
        img {
            width: 100%;
            height: tr(205px);
        }
        .tabbar_box {
            width: 100%;
            padding: 0 tr(20px);
            position: absolute;
            bottom: tr(-78px);
            .tabbar_list {
                width: 100%;
                height: tr(130px);
                background-color: #ffffff;
                border-radius: tr(10px);
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 tr(30px);
                li {
                    color: #666666;
                    font-size: tr(28px);
                    font-family: "PingFangSC-Regular";
                    img {
                        width: tr(50px);
                        height: tr(54px);
                    }
                    span {
                        margin-left: tr(10px);
                    }
                }
                li.active {
                    color: #8346fd;
                }
            }
        }
    }
}

.shopCar {
    width: tr(120px);
    height: tr(120px);
    position: fixed;
    bottom: tr(100px);
    right: tr(29px);
    z-index: 1000;
}

@media screen and (min-width: 750px) {
    #first {
        padding-top: tr(396px);
    }
    .topImg .topbg_img {
        height: tr(300px) !important;
    }
}
</style>