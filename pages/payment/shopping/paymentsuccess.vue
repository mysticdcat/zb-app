<template>
    <div class='subject'>
        <Headertitle :title='faTitle'></Headertitle>
        <div class='headertop' v-if="payResult === true">
            <div class="header-success">
                <div class="headertop-left">
                    <img src="~/assets/images/true.png" alt="">
                    <span>支付成功</span>
                </div>
                <div class="headertop-right">
                    <button class="pingjia" @click="pingjiaHref">立即评价</button>
                </div>
            </div>
            <p class="line"></p>
            <div class="orderInfo">
                <p class="shopname">{{orderData.shopName}}</p>
                <div class="orderdetail_box">
                    <ul class="list-left">
                        <li>消费金额：￥{{orderData.price}}</li>
                        <li>商户实收：￥{{orderData.shopPrice}}</li>
                        <li>用户支付：￥{{orderData.userPrice}}</li>
                    </ul>
                    <ul class="list-right">
                        <li>订单编号：{{orderData.billNo}}</li>
                        <li>用户昵称：{{orderData.myName}}</li>
                        <li>消费时间：{{orderData.time}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="headertop" v-else>
            <div class="header-fail">
                <span>支付失败:{{payResultWord}}</span>
                <button class="zhifu" type="button" @click="zhifuHref">重新支付</button>
            </div>
        </div>
        <footer>
            <span class='circle'></span>
            <span class='more' @click="readMore">查看更多</span>
        </footer>
        <!-- 随机三个商家 -->
        <ul class="goodsList">
            <li class="goodsList_li" v-for="(item,key) in shopLists" :key='key' @click="hrefDetail(item.id)">
                <goodsCard :item="item"></goodsCard>
            </li>
        </ul>
    </div>
</template>
<script>
import api from "~/api";
import goodsCard from "~/components/payment/goodsCard.vue";
import { Toast } from "vant";
import Headertitle from "~/components/header/title.vue";
export default {
    head() {
        return {
            title: "优惠购物"
        };
    },
    components: {
        goodsCard,
        Headertitle
    },
    data() {
        return {
            faTitle: "支付结果",
            // 支付成功 or 失败
            payResult: false,
            // 支付失败信息
            payResultWord: "",
            //order详细信息
            orderData: {},
            // 重新支付  // 评论
            shopId: null,
            //3个推荐
            shopLists: [],
            //支付完成后的订单编号
            billId: "",
            // 订单类型为3字符买单
            type: 3,
            // key
            key: ""
        };
    },
    methods: {
        // 重新支付
        zhifuHref() {
            var typeid = localStorage.getItem("typeid");
            this.$router.push({
                path: "/payment/shopping/goodsDetail",
                query: { shopId: this.shopId, typeid: typeid }
            });
        },
        // 更多商品详情页
        hrefDetail(id) {
            var typeid = localStorage.getItem("typeid");
            this.$router.push({
                path: "/payment/shopping/goodsDetail",
                query: { shopId: id, typeid: typeid }
            });
        },
        // 查看更多跳转
        readMore() {
            this.$router.push({
                path: "/payment/food"
            });
        },
        // 前往评价页
        pingjiaHref() {
            this.$router.push({
                path: "/payment/shopping/comment",
                query: { shopId: this.shopId }
            });
        }
    },
    mounted() {
        this.shopId = localStorage.getItem("shopId");
        // 查看更多推荐3个
        api.getmerchant().then(res => {
            if (res.data.length >= 0) {
                this.shopLists = res.data;
            }
        });

        let code = this.$route.query.code;
        let codeNum = parseInt(code);
        if (codeNum === 200) {
            this.payResult = true;
            this.billId = this.$route.query.billId;
            let key = this.$route.query.key;
            let billId = this.billId;
            if (billId && key) {
                api.searchOrderInfo(billId, key).then(res => {
                    if (res.data) {
                        this.orderData = res.data;
                        this.shopId = res.data.shopid;
                    } else {
                        Toast({
                            mask: false,
                            message: "没有找到订单信息",
                            duration: 1000
                        });
                    }
                });
            } else {
                Toast({
                    mask: false,
                    message: "已完成支付,订单信息为找到",
                    duration: 500
                });
            }
        } else {
            this.payResult = false;
            this.payResultWord = this.$route.query.message;
        }
    }
};
</script>
<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
.subject {
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    .headertop {
        width: 100%;
        background-color: #fff;
        padding: 0 tr(20px);
        .header-success {
            width: 100%;
            height: tr(115px);
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flexbox;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .headertop-left {
                display: -webkit-flex;
                display: -moz-flex;
                display: -ms-flexbox;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                span {
                    margin-left: tr(25px);
                    font-size: tr(36px);
                    color: #1a1a1a;
                }
            }
            .headertop-right {
                .pingjia {
                    background-color: #fff;
                    color: #5f11fd;
                    font-size: tr(28px);
                    border: 1px solid #5f11fd;
                    padding: tr(12px) tr(30px);
                    border-radius: tr(30px);
                }
            }
        }
        p.line {
            border-top: 1px solid rgba(221, 221, 221, 1);
        }
        .orderInfo {
            width: 100%;
            padding: tr(32px) 0 tr(40px) 0;
            .shopname {
                color: #121212;
                font-size: tr(36px);
                line-height: tr(36px);
                margin-bottom: tr(20px);
            }
            .orderdetail_box {
                width: 100%;
                color: #666666;
                font-size: tr(24px);
                display: -webkit-flex;
                display: -moz-flex;
                display: -ms-flexbox;
                display: flex;
                justify-content: flex-start;
                .list-left {
                    width: 35%;
                    margin-left: tr(30px);
                    li {
                        margin-top: tr(20px);
                        text-align: left;
                        white-space: nowrap; /*强制不换行*/
                    }
                }
                .list-right {
                    width: 61%;
                    li {
                        margin-top: tr(20px);
                        text-align: left;
                        overflow: hidden; /*自动隐藏文字*/
                        text-overflow: ellipsis; /*文字隐藏后添加省略号*/
                        white-space: nowrap; /*强制不换行*/
                    }
                }
            }
        }
        // 支付失败css
        .header-fail {
            width: 100%;
            height: tr(115px);
            padding: 0 tr(10px);
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flexbox;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-size: tr(36px);
                color: #1a1a1a;
                display: inline-block;
                width: 60%;
            }
            .zhifu {
                background-color: #fff;
                color: #5f11fd;
                font-size: tr(28px);
                border: 1px solid #5f11fd;
                padding: tr(12px) tr(30px);
                border-radius: tr(30px);
            }
        }
    }
    footer {
        width: 100%;
        padding-top: tr(40px);
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        .circle {
            display: inline-block;
            width: tr(20px);
            height: tr(36px);
            border-radius: 0 tr(35px) tr(35px) 0;
            background: #5e0ffe;
        }
        .more {
            color: #121212;
            font-size: tr(36px);
            line-height: tr(38px);
            margin-left: tr(5px);
            display: inline-block;
        }
    }
}
.goodsList {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-top: tr(20px);
    .goodsList_li {
        margin-top: tr(21px);
        margin-left: tr(21px);
        width: tr(223px);
        height: tr(370px);
        background-color: #fff;
        border-radius: tr(20px);
        box-shadow: 0px 0px 0px rgba(207, 207, 207, 0.31);
        text-align: center;
    }
}
</style>
