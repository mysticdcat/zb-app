<template>
    <div class="pay">
        <Headertitle :title='faTitle'></Headertitle>
        <div class="address" @click="goAddr" v-if="orderData.tbShoppingAddress">
            <p>
                <span>
                    <span>{{orderData.name}}</span>
                </span>
                <span>{{orderData.tel}}</span>
            </p>
            <p>
                <span>地址</span>{{orderData.province}}{{orderData.city}}{{orderData.county}}{{orderData.addressdetaill}}</p>
        </div>
        <div class="color"><img src="../../assets/carImage/color.png" alt=""></div>
        <div class="goodsInfo" v-for="(item,value) in orderData.orderShopInfoList" :key="value">
            <p @click="goShop(item.shopId)"><img src="../../assets/carImage/shopLogo.png" alt="">
                <span>{{item.shopName}}</span>
            </p>
            <div id="goodsItem" v-for="(second,value) in item.orderItems" :key="value" @click="goInfo(second.itemId)">
                <div class="goodImg">
                    <img :src="second.picPath[0]" alt="">
                </div>
                <div class="info">
                    <p>{{second.name}}</p>
                    <p>
                        <span class="price">￥{{second.price}}</span>
                        <span class="count">
                            <i class="icon iconfont icon-clear"></i>{{second.num}}</span>
                    </p>
                </div>
            </div>
            <div class="freight">
                <span>运费</span>
                <span>{{parseInt(orderData.postFee)?'￥'+orderData.postFee:'免运费'}}</span>
            </div>
            <div class="freight add">
                <span>合计</span>
                <span>￥{{item.payment}}</span>
            </div>
        </div>
        <div class="goPay">
            <span>合计金额:</span>
            <span>￥{{orderData.payment}}</span>
            <span class="submit" @click="payWayDisplay">提交订单</span>
        </div>
        <van-popup v-model="show" position="bottom" overlay-class="van-modal">
            <div class="payWayTop">
                <h3>确认支付</h3>
                <span><img src="../../assets/carImage/close.png" alt="" @click="payWayDisplay"></span>
            </div>
            <p class="allPrice">
                <span>支付金额</span>
                <span>￥{{orderData.payment}}</span>
            </p>
            <div class="alipay" ref="alipay" @click="changeWay(1)">
                <img src="../../assets/carImage/alipay.png" alt="">
                <span>支付宝付款</span>
            </div>
            <div class="wecaht" ref="wechat" @click="changeWay(2)">
                <img src="../../assets/top/CAC.png" alt="">
                <span>宝兆付款</span>
            </div>
            <button @click="goPay">确认支付</button>
        </van-popup>
    </div>
</template>
<script>
import { Popup } from "vant";
import api from "@/api/index";
import { Toast } from "vant";
import Headertitle from '~/components/header/title.vue'
// var padDate = function(va) {
//   va = va < 10 ? "0" + va : va;
//   return va;
// };
export default {
    components: {
        Headertitle
    },
    head() {
        return {
            title: "订单支付"
        };
    },
    data() {
        return {
             //头部
            faTitle:'订单支付',
            num: 0,
            orderData: [],
            defaultAdress: [],
            url: "",
            ordertime: "",
            show: false,
            way: 1,
            coinType: ""
        };
    },
    methods: {
        //弹出支付方式
        payWayDisplay() {
            this.show = !this.show;
        },
        //   改变被选中支付样式
        changeWay(id) {
            if (id == 1) {
                this.$refs.alipay.style.border = "1px solid #ccc";
                // this.$refs.alipay.style.backgroundColor = '#eee';
                this.$refs.wechat.style.border = "none";
                this.way = 1;
            } else {
                this.$refs.wechat.style.border = "1px solid #ccc";
                // this.$refs.alipay.style.backgroundColor = '#eee';
                this.$refs.alipay.style.border = "none";
                this.way = 2;
            }
        },

        //跳转到地址
        goAddr() {
            this.$router.push({
                path: "/addr/manageAddress",
                query: { orderId: this.$route.query.orderId }
            });
        },
        //返回上一级
        backgo() {
            this.$router.go(-1);
        },
        //根据订单编号获取订单信息
        getOrder() {
            api.getOrder(this.$route.query.orderId).then(res => {
                this.orderData = res.data;
                // this.num = res.data.orderItems.length;
                this.orderData.orderShopInfoList.forEach(item => {
                    item.orderItems.forEach(item => {
                        item.picPath = item.picPath.split(",");
                    });
                });
            });
        },

        //去商家页面
        goShop(id) {
            this.$router.push({
                path: "/shopDetail/shopDetail",
                query: { shopId: id }
            });
        },

        //支付
        goPay() {
            //获取支付方式
            var payList;
            if (this.way == 1) {
                var billNo = this.orderData.billNo;
                var key = localStorage.getItem("key");
                var language = localStorage.getItem("language");
                window.location.href = `http://api.ickapay.com/pay/payMall/alipay?billNo=${billNo}&key=${key}&openType=${0}&language=${language}`;
            } else {
                api.getPayList(2).then(res => {
                    var coinType = res.data.payChannelList[0].coinType;

                    var params = {
                        way: 2,
                        coinType: coinType,
                        billNo: this.orderData.billNo
                    };
                    api.ipmpay(params).then(res => {
                        if (res.code !== 200) {
                            this.$router.push({
                                path: "/pay/success",
                                query: { message:res.msg ,code:res.code}
                            });
                        } else {
                            this.show = false;
                            Toast({
                                mask: false,
                                message: res.msg,
                                duration: 800
                            });
                        }
                    });
                });
            }
        },
        //跳转至购物车
        //点击去商品详情
        goInfo(id) {
            this.$router.push({
                path: "/goodsDetail/goodsDetail",
                query: { shopId: id }
            });
        }
        //取消订单
        // cancel() {
        //   api.deleteOrder(this.orderData.id).then(res => {
        //     if (res.code == 200) {
        //       Toast.success("取消订单成功");
        //       setTimeout(() => {
        //         this.$router.go(-1);
        //       }, 1000);
        //     }
        //   });
        // }
    },
    mounted() {
        this.$store.state.allChecked = 0;
        this.getOrder();
        // api.getExhcangeScale().then(res=> {
        //     console.log(res);
        //     this.scale = res.data
        // })
    }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.pay {
    padding-bottom: tr(92px);
    width: 100%;
    position: relative;
    font-family: "PingFang-SC-Regular";
    background-color: #f7f7f7;
    .address {
        width: 100%;
        height: tr(208px);
        background-color: #fff;
        padding: 20px;

        p {
            font-family: "PingFang-SC-Regular";
            // color: rgb(102, 102, 102) !important;
            font-size: tr(28px);
            padding: 5px 0;
            > span:nth-child(1) {
                //   width: tr(120px);
                display: inline-block;
                margin-right: 20px;
                width: 45px;
                span {
                    float: right;
                }
            }
        }
        p:nth-child(2) {
            color: rgb(103, 103, 103);
            span {
                width: 45px;
                text-align: center;
                border-radius: 30px;
                display: inline-block;
                background-color: #8346fd;
                color: #fff;
            }
        }
    }
    .add {
        color: #8346fd;
    }
    .color {
        width: 100%;
        img {
            display: block;
            width: 100%;
        }
        margin-bottom: tr(20px);
    }
    .goodsInfo {
        padding-left: tr(30px);
        padding-right: tr(30px);
        width: 95%;
        margin: 0 auto;
        padding-top: tr(20px);
        background-color: #fff;
        margin-bottom: tr(20px);
        border-radius: 5px;
        p {
            font-weight: "Regular";
            color: #808080;
            font-family: PingFangSC-Regular;
            width: 100%;
            height: tr(40px);
            img {
                width: tr(40px);
                height: tr(35px);
                margin-right: tr(10px);
            }
        }
        #goodsItem {
            padding-top: tr(20px);
            // padding-bottom: tr(30px);
            border-bottom: 1px solid #eee;

            //  padding: tr(20px) 0 0 0;
            // width: 95%;
            height: tr(180px);
            //  border-bottom: 1px solid #eee;
            //  margin: 0 auto;
            position: relative;
            .goodImg {
                position: absolute;

                width: tr(120px);
                height: tr(120px);
                border-radius: 10%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .info {
                padding-bottom: tr(30px);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;
                height: 100%;
                padding-left: tr(140px);

                p {
                    width: 100%;
                    margin: 0;
                    word-break: break-all;
                    word-wrap: break-word;
                    font-size: tr(28px);
                    // height: tr(160px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #1a1a1a;
                    width: 90%;
                }
                p:nth-child(2) {
                    width: 100%;
                    i {
                        font-size: 12px;
                    }
                }
            }

            .price {
                display: inline-block;
                width: 90%;
                color: #8346fd;
                font-size: 14px;
                font-weight: bolder;
            }
            .count {
                color: #ccc;
                float: right;
            }
        }
        .freight {
            line-height: tr(80px);
            height: tr(80px);
            color: #999;
            span:nth-child(1) {
                float: left;
            }
            span:nth-child(2) {
                float: right;
            }
        }
        .add {
            font-size: tr(28px);
            color: #8346fd;
        }
    }
    .goPay {
        z-index: 999;
        border-top: 1px solid #eee;

        width: 100%;
        height: tr(95px);
        background-color: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        span {
            display: inline-block;
            height: 100%;
            line-height: tr(95px);
            padding-left: 10px;
            box-sizing: border-box;
            font-size: 14px;
            color: #8346fd;
        }
        .submit {
            color: #fff;
            background-color: #8346fd;
            border: none;
            width: tr(192px);
            height: 100%;
            font-size: 14px;
            line-height: tr(95px);
            text-align: center;
            float: right;
        }
    }

    .van-popup {
        position: fixed;
        height: tr(700px);
        .payWayTop {
            padding: tr(20px) tr(40px);
            position: relative;
            h3 {
                text-align: center;
                line-height: tr(68px);
                font-size: 18px;
            }
            span {
                border: 1px dashed #ccc;
                position: absolute;
                right: tr(40px);

                top: tr(30px);
            }
        }
        .allPrice {
            padding: 0 tr(40px);
            font-size: 14px;
            padding-top: 10px;
            padding-bottom: 10px;
            span:nth-child(2) {
                float: right;
                color: #8346fd;
            }
        }
        .alipay,
        .wecaht {
            width: 100%;
            height: tr(100px);
            padding: 0 tr(40px);
            line-height: tr(100px);
            span {
                padding-left: tr(50px);
                font-size: 14px;
            }
            img {
                width: tr(76px);
                height: tr(76px);
            }
        }
        .alipay {
            border: 1px solid #ccc;
        }

        button {
            position: absolute;
            bottom: 20px;
            width: 95%;
            margin: 0 auto;
            height: tr(95px);
            border-radius: 30px;
            background-color: #8346fd;
            color: #fff;
            font-size: 14px;
            margin-top: tr(20px);
            margin-left: 2.5%;
            letter-spacing: 2px;
        }
    }
}
.van-modal {
    background-color: rgba(0, 0, 0, 0.3);
}
</style>


