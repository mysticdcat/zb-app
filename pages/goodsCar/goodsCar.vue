<template>
    <div class="goodsCar" ref="goodsCar">
        <Headertitle :title='faTitle'></Headertitle>
        <div class="contentBox">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <div id="goodsItem" v-for="(item,index) in  $store.getters.filtersCar" :key="index" v-if="$store.state.car.length">
                    <div class="card-content">
                        <div class="seller">
                            <img src="../../assets/carImage/noChecked.png" alt="" class="circl" v-show="!item.shopChecked" @click="$store.commit('changeSeller',item.shopName)">
                            <img src="../../assets/carImage/checked.png" alt="" class="circl" v-show="item.shopChecked" @click="$store.commit('changeSeller',item.shopName)">
                            <img src="../../assets/carImage/shopLogo.png" alt="" class="sellerLogo">
                            <span @click="goShop(item.shopId)">{{item.shopName}}</span>
                        </div>
                        <div class="card-content-inner" v-for="(item,index) in item.tbCarts" :key="index">
                            <van-cell-swipe :right-width="80">
                                <span slot="right" @click="deleteCartItem(item.itemId)"><img src="../../assets/carImage/delete.png" alt="">
                                    <p>删除</p>
                                </span>
                                <img src="../../assets/carImage/noChecked.png" alt="" class="circl checked" v-show="!item.checked" @click="$store.commit('changeChecked',{id:item.id,shopName:item.shopName})">
                                <img src="../../assets/carImage/checked.png" alt="" class="circl checked" v-show="item.checked" @click="$store.commit('changeChecked',{id:item.id,shopName:item.shopName})">
                                <div class="imgBox">
                                    <img :src="item.images[0]" alt="">
                                </div>
                                <div class="info">
                                    <p class="title" @click="goInfo(item.itemId)">{{item.title}}</p>
                                    <p class="gift">
                                        <span>{{item.itemProperty}}</span>
                                       
                                    </p>
                                    <p>
                                        <span class="price">
                                            <span class="sign">￥</span>{{item.price}}</span>
                                        <van-stepper v-model="item.num" @change="updNum({itemid:parseInt(item.itemId),num:item.num,propertyId:item.reserve3})" :max="item.reserve2" />
                                    </p>
                                </div>
                            </van-cell-swipe>
                        </div>
                    </div>
                </div>
                <div v-if="status" class="empty">
                    <img src="../../assets/carImage/empty.png" alt="">
                    <p>购物车空空如也</p>
                    <button @click="goIndex">去逛逛</button>
                </div>
            </van-pull-refresh>
            <div id="goPay" v-show="!status" v-cloak>
                <div class="footerLeft">
                    <img src="../../assets/carImage/noChecked.png" alt="" class="circl" v-show="!$store.state.allChecked" @click="$store.commit('changeAll')">
                    <img src="../../assets/carImage/checked.png" alt="" class="circl" v-show="$store.state.allChecked" @click="$store.commit('changeAll')">
                    <span class="checkAll">全选</span>
                    <span class="and">合计:</span>
                    <span>￥</span>
                    <span class="andPrice">{{$store.getters.payPrice}}</span>
                </div>
                <button @click="submit">{{flag?'结算':'删除'}}({{$store.getters.num}})</button>
            </div>
        </div>  
    </div>
</template>
<script>
import bridge from "~/assets/js/bridge.js";
import api from "~/api/index.js";
import { Toast } from "vant";
import { PullRefresh } from "vant";
import { Stepper } from "vant";
import Headertitle from '~/components/header/title.vue'
export default {
    components: {
        Headertitle
    },
    head() {
        return {
            title: "购物车"
        };
    },
    data() {
        return {
            //头部
            faTitle:'购物车',
            //监控用户操作改变button
            flag: true,
            status: false,
            //默认创建空数组存放数据
            carList: [],
            state: false,
            allPrice: this.$store.state.allPrice,
            //默认全部不选中
            //定义一个空的字符串储存商品ID
            goodsId: [],
            // number:0,
            // float:00,
            key: "",

            //下拉加载数据

            isLoading: false
        };
    },
    methods: {
        //下拉刷新页面
        onRefresh() {
            setTimeout(() => {
                this.$toast("刷新成功");
                this.isLoading = false;
                api.getCar().then(res => {
                    if (!res.data) {
                        this.$store.state.car = [];
                        this.status = true;
                        return;
                    } else {
                        this.status = false;
                    }
                    if (res.data) {
                        this.$store.state.car = res.data;
                        if (this.$store.state.car) {
                            this.$store.state.car.forEach(item => {
                                item.tbCarts.forEach(item => {
                                    if (typeof item.images == "string") {
                                        item.images = item.images.split(",");
                                    }
                                });
                            });
                        }
                    }
                });
                this.$store.state.allChecked = 0;
            }, 500);
        },

        //去商家页面
        goShop(id) {
            this.$router.push({
                path: "/shopDetail/shopDetail",
                query: { shopId: id }
            });
        },
        //当购物车没有商品时返回主页
        goIndex() {
            this.$router.push({
                path: "/"
            });
        },
        //返回上一级
        backgo() {
            this.$router.go(-1);
        },
        //删除单间商品
        deleteCartItem(goodsId) {
            this.$dialog
                .confirm({
                    message: "确定删除吗？"
                })
                .then(() => {
                    var params = {
                        itemid: goodsId
                    };
                    api.delGoods(params).then(res => {
                        if (res.code == 200) {
                            api.getCar().then(res => {
                                this.$store.state.car = res.data;
                                if (this.$store.state.car) {
                                    this.$store.state.car.forEach(item => {
                                        item.tbCarts.forEach(item => {
                                            if (
                                                typeof item.images == "string"
                                            ) {
                                                item.images = item.images.split(
                                                    ","
                                                );
                                            }
                                        });
                                    });
                                }
                                if (!res.data) {
                                    this.status = true;
                                } else {
                                    this.status = false;
                                }
                            });
                        }
                    });
                })
                .catch(() => {
                    return;
                });
        },

        changeStatus() {
            this.flag = !this.flag;
        },

        //结算或者删除商品
        submit() {
            if (this.flag) {
                if (this.$store.getters.payPrice == 0) {
                    Toast.fail("请选择商品");
                    return;
                }
                this.getOrder();
            }
        },
        //点击去商品详情
        goInfo(id) {
            this.$router.push({
                path: "/goodsDetail/goodsDetail",
                query: { shopId: id }
            });
        },
        //获取购物车数据
        getGoodsCar() {
            api.getCar().then(res => {
                this.$refs.goodsCar.style.backgroundColor = '#f7f7f7';
                var carData = [];
                if (res.data) {
                    res.data.forEach(item => {
                        this.$store.state.car.push(item);
                    });
                }
                if (!res.data) {
                    this.$refs.goodsCar.style.backgroundColor = '#fff';
                    this.status = this.$store.state.car;
                }
                if (this.$store.state.car) {
                    this.$store.state.car.forEach(item => {
                        item.tbCarts.forEach(item => {
                            if (typeof item.images == "string") {
                                item.images = item.images.split(",");
                            }
                        });
                    });
                }
            });
        },
        //创建订单
        getOrder() {
            //定义一个总订单
            var orderInfo = {};
            //定义一个字订单
            var cartOrderInfo = [];
            this.$store.state.car.forEach(item => {
                //  var cartOrderInfo = [];
                var status = 1;
                var shopId = item.shopId;
                var payment = 0;
                var carInfo = {};
                var orderItems = [];
                item.tbCarts.forEach(second => {
                    if (second.checked == 1) {
                        payment += second.price * second.num;
                        var obj = {
                            itemId: second.itemId,
                            num: second.num,
                            price: second.price,
                            propertyId:second.reserve3
                        };
                        orderItems.push(obj);
                    }
                });

                carInfo = {
                    payment: payment,
                    status: 1,
                    shopId: item.shopId,
                    orderItems: orderItems
                };
                if (carInfo.payment) {
                    cartOrderInfo.push(carInfo);
                }
            });
            orderInfo = {
                cartOrderInfo: cartOrderInfo,
                price: this.$store.getters.payPrice
            };
            api.createShopOrder(orderInfo).then(res => {
                //保存订单ID (商品结算页需要根据订单ID来查询)
                if (res.code == 200) {
                    api.getCar().then(res => {
                        if (res.data) {
                            this.$store.state.car = res.data;
                            this.status = false;
                            this.$store.state.car.forEach(item => {
                                item.tbCarts.forEach(item => {
                                    if (typeof item.images == "string") {
                                        item.images = item.images.split(",");
                                    }
                                });
                            });
                        } else {
                            this.$store.state.car = [];
                            this.status = true;
                        }
                    });
                    if (typeof res.data == "number") {
                        this.$router.push({
                            path: "/pay/pay",
                            query: { orderId: res.data }
                        });
                    }
                    if (res.data == null) {
                        this.$dialog
                            .alert({
                                title: "提示",
                                message: "没有收货地址请添加"
                            })
                            .then(() => {
                                this.$router.push({
                                    path: "/addr/addAdress",
                                    query: { isCar: 1 }
                                });
                            });
                    }
                }
            });
        },
        //修改购物车中商品的数量
        updNum(params) {
            api.updataNum(params).then(res => {});
        }
    },
    mounted() {
        // bridge.setupWebViewJavascriptBridge();
        this.getGoodsCar();
    }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";

.goodsCar {
    min-height: 590px;
    position: fixed;
    [v-cloak] {
        display: none;
    }
    .contentBox {
        min-height: 590px;
    }
    .van-pull-refresh {
        min-height: 590px;
        overflow: none;
        .van-pull-refresh__track {
            min-height: 590px;
            overflow: none;
        }
    }
    .empty {
        background-color: #fff;
        height: 667px;
        padding-top: 100px;
        padding-bottom: 20px;
        img {
            width: 30%;
            margin-left: 35%;
            display: block;
        }
        button {
            display: block;
            border: 1px solid #eee;
            margin: auto auto;
            width: tr(224px);
            height: tr(81px);
            text-align: center;
            line-height: tr(33px);
            color: #9647fd;
            font-size: tr(32px) !important;
        }
        p {
            text-align: center;
            display: block;
            height: 50px;
            line-height: 50px;
        }
    }
     @media screen and (min-width: 750px) {
        .empty {
            min-width: 750px;
        }
    }
    font-family: "PingFang-SC";
    background-color: #f7f7f7 !important;
    // margin-bottom: tr(98px);
    width: 100%;
    padding-bottom: tr(98px);
    position: relative;
    .circl {
        width: tr(42px);
        height: tr(42px);
    }
    background-color: rgba(255, 255, 255, 1);

    .van-nav-bar {
        background: linear-gradient(
            270deg,
            rgb(233, 68, 180),
            rgb(79, 72, 179)
        );
        border-bottom: 1px solid #ccc;
        color: #fff;
        position: relative;
        .navRigth {
            width: 24px;
            height: 23px;
        }
        .navLeft {
            width: 8px;
            height: 13px;
        }
    }
    #goodsItem {
        background-color: #fff;
        border-radius: 10px;
        i {
            color: #fff !important;
        }
        margin: tr(10px) tr(10px) 0 tr(10px);
        .circl {
            margin-right: tr(20px);
        }
        input {
            width: tr(20px);
            padding-right: tr(5px);
        }
        .card-content {
            width: 100%;
            border-radius: tr(10px);
            // padding-top: tr(10px);
            .seller {
                width: 100%;
                height: tr(70px);
                padding-left: tr(20px);
                // padding-right: tr(20px);
                // padding-bottom: tr(20px);
                padding-top: tr(15px);
                border-bottom: 1px solid #eee;
                font-size: tr(28px);
                //  font-family: "Helvetica Neue";
                font-family: "PingFang-SC-Bold";
                .sellerLogo {
                    width: tr(40px);
                    height: tr(35px);
                    margin-right: tr(10px);
                }
                .next {
                    width: tr(18px);
                    height: tr(26px);
                    margin-left: tr(20px);
                    margin-bottom: tr(5px);
                }
            }
        }
        .card-content-inner {
            width: 100%;
            height: tr(240px);
            border-bottom: tr(1px) solid #eee;
            .van-cell-swipe {
                height: 100%;
                .van-cell-swipe__wrapper {
                    height: 100%;
                }

                .van-cell-swipe__right {
                    border-bottom-right-radius: tr(40px);
                    overflow: hidden;

                    span {
                        width: 80px;
                        display: block;
                        height: tr(260px);
                        background-color: #5f10ff;
                        color: #fff;
                        font-size: tr(28px);
                        margin-left: 1px;
                        height: tr(240px);
                        border-bottom-right-radius: 15px;
                        padding-top: 60%;
                        box-sizing: border-box;
                        text-align: center;
                        // padding-top: 60%;
                        img {
                            width: tr(48px);
                            height: tr(48px);
                            display: inline-block;
                            text-align: center;
                        }
                        p {
                            padding-left: 0;
                            margin-top: tr(10px);
                        }
                    }
                }
            }
            // display: flex;
            // align-items: center;
            position: relative;
            .checked {
                position: absolute;
                left: tr(20px);
                top: tr(100px);
            }
            .imgBox {
                overflow: hidden;
                border-radius: 10px;
                width: tr(220px);
                height: tr(220px);
                position: absolute;
                top: tr(10px);
                left: tr(80px);
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .title {
                overflow-y: hidden;
                height: tr(80px);
                padding-right: tr(10px);
                font-size: tr(24px);
                margin-bottom: tr(10px);
                word-break: break-all;
                word-wrap: break-word;
                font-family: "Helvetica Neue";
                white-space: normal;
                -webkit-line-clamp: 2;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }
            p {
                padding-left: tr(10px);
                padding-right: tr(10px);
                .van-stepper {
                    float: right;
                    width: tr(250px);
                    margin-left: tr(5px);
                    // width: tr(240px);
                }
            }
            .info {
                height: tr(240px);
                padding-left: tr(300px);
                width: 100%;
                padding-top: tr(20px);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-bottom: tr(20px);
                .weight {
                    float: left;
                    width: tr(58px);
                    height: tr(20px);
                    line-height: tr(25px);
                    background-color: #ccc;
                    border: tr(1px) solid #ccc;
                    border-radius: 30%;
                    text-align: center;
                    padding-left: tr(7px);
                }
                .price {
                    margin-top: tr(10px);
                    font-size: tr(32px);
                    float: left;
                    color: #9647fd;
                    font-weight: bolder;
                    .sign {
                        font-size: tr(24px);
                    }
                }
                .gift {
                    padding-left: 10px;
                    margin-bottom: 6px;
                    span {
                        word-break: break-all;
                        word-wrap: break-word;
                        display: inline-block;
                        max-width: 40%;
                        height: tr(40px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        border-radius: 50px;
                        padding: tr(10px);
                        background-color: #f7f7f7;
                        margin-right: 10px;
                        font-size: tr(22px) !important;
                    }
                }
                .small {
                    font-size: tr(22px);
                    float: left;
                    margin-top: tr(20px);
                    color: #9647fd;
                }
            }
        }
    }
    #goPay {
        .footerLeft {
            padding-top: tr(25px);
            float: left;
            width: tr(500px);
            height: 100%;
        }
        background-color: #fff;
        box-sizing: border-box;
        padding-left: tr(20px);
        width: 100%;
        border-top: tr(1px) solid #ccc;
        border-bottom: tr(1px) solid #ccc;
        position: fixed;
        bottom: 0;
        left: 0;
        height: tr(96px);
        line-height: tr(48px);
        text-align: left;
        img {
            display: inline-block;
            width: tr(44px) !important;
            height: tr(44px) !important;
            margin-bottom: tr(10px);
        }
        .checkAll {
            display: inline-block;
            width: tr(90px);
            font-size: tr(32px);
            font-weight: bolder;
            margin-left: tr(40px);
            // margin-top: tr(30px);
            color: #9647fd;
        }
        .and {
            padding-left: tr(20px);
            padding-right: tr(5px);
            font-size: tr(28px);
        }
        .andPrice {
            // background: linear-gradient(270deg, rgb(233, 68, 180), rgb(79, 72, 179));
            // -webkit-background-clip: text;
            // color: transparent;

            font-size: tr(32px);
            font-family: "PingFang-SC-Bold";
        }
        button {
            position: absolute;
            right: tr(10px);
            top: tr(6px);
            width: tr(224px);
            height: tr(81px);
            text-align: center;
            line-height: tr(33px);
            // background: linear-gradient(270deg, rgb(233, 68, 180), rgb(79, 72, 179));
            background: #9647fd;
            color: #fff;
            // border-radius: tr(40px);
            font-size: tr(32px) !important;
        }
    }
}
</style>



