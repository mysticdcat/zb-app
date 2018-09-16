<template>
    <div class="pay">
        <Headertitle :title='faTitle'></Headertitle>
        <div class="box">
            <div>
                <span>消费总额:</span><input type="text" placeholder="请输入价格" v-model="inputPrice" @keyup="change"></div>
            <div>
                <span>折扣</span>
                <p>-￥{{agio}}</p>
            </div>
            <div>
                <span>实付金额</span>
                <p>￥{{fact}}</p>
            </div>
            <button @click="payWayDisplay">确认买单</button>
        </div>
        <van-popup v-model="display" position="bottom" overlay-class="van-modal">
            <div class="payWayTop">
                <h3>确认支付</h3>
                <span><img src="~/assets/carImage/close.png" alt="" @click="payWayDisplay"></span>
            </div>
            <p class="allPrice">
                <span>支付金额</span>
                <span>￥{{fact}}</span>
            </p>
            <div class="alipay" ref="alipay" @click="changeWay(1)">
                <img src="~/assets/carImage/alipay.png" alt="">
                <span>支付宝付款</span>
            </div>
            <div class="wecaht" ref="wechat" @click="changeWay(2)">
                <img src="~/assets/top/CAC.png" alt="">
                <span>宝兆付款</span>
            </div>
            <button @click="toPay(billNo)">确认支付</button>
        </van-popup>
    </div>
</template>
<script>
import api from "@/api/index";
import Headertitle from "~/components/header/title.vue";
import { Toast } from "vant";
export default {
    components: {
        Headertitle
    },
    head() {
        return {
            title: "优惠购物"
        };
    },
    data() {
        return {
            faTitle: "买单",
            inputPrice: "",
            agio: 0,
            fact: 0,
            man: 0,
            jian: 0,
            billId: null,
            show: false,
            display: false,
            way: 1,
            billNo: 0,
            payment: 0,
            way: 1,
            orderId: ""
        };
    },
    methods: {
        payWayDisplay(billNo, payment) {
            this.display = !this.display;
            this.billNo = billNo;
            this.payment = payment;
        },
        //改变支付方式
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
        //获取优惠信息
        getDetailShop(id) {
            api.getDetailShop(id).then(res => {
                this.$metaInfo.title = res.data.name;
                this.man = res.data.man;
                this.jian = res.data.jian;
            });
        },
        //改变价格
        change() {
            this.inputPrice = this.inputPrice.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            this.inputPrice = this.inputPrice.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            this.inputPrice = this.inputPrice
                .replace(".", "$#$")
                .replace(/\./g, "")
                .replace("$#$", ".");
            this.inputPrice = this.inputPrice.replace(
                /^(\-)*(\d+)\.(\d\d).*$/,
                "$1$2.$3"
            ); //只能输入两个小数
            if (this.inputPrice.indexOf(".") < 0 && this.inputPrice != "") {
                //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                this.inputPrice = parseFloat(this.inputPrice);
            }

            if (this.inputPrice >= this.man && this.inputPrice >= 0) {
                if (this.jian) {
                    this.agio = this.jian;
                } else {
                    this.agio = 0;
                }
                this.fact = this.inputPrice - this.jian;
            } else {
                if (this.inputPrice) {
                    this.agio = 0;
                    this.fact = this.inputPrice;
                } else {
                    this.agio = 0;
                    this.fact = 0;
                }
            }
        },
        //买单
        toPay() {
            if (this.inputPrice > 0) {
                var params = {
                    billId: this.billId,
                    price: this.inputPrice,
                    discount: this.agio,
                    userPrice: this.fact
                };
                api.updataOrder(params).then(res => {
                    this.orderId = res.data;
                    if (res.code == 200) {
                        if (this.way == 1) {
                            var key = localStorage.getItem("key");

                            var language = localStorage.getItem("language");

                            window.location.href = `http://api.ickapay.com/pay/payDiscount/alipay?billNo=${
                                this.orderId
                            }&key=${key}&openType=${0}&language=${language}`;
                        } else {
                            api.getPayList(3).then(res => {
                                var coinType =
                                    res.data.payChannelList[0].coinType;

                                var params = {
                                    way: 3,
                                    coinType: coinType,
                                    billNo: this.orderId
                                };
                                api.ipmpay(params).then(res => {
                                    if (res.code !== 200) {
                                        this.$router.push({
                                            path: "/payment/shopping/paymentsuccess",
                                            query: {
                                                message: res.msg,
                                                code: res.code,
                                                billId: this.orderId,
                                                key: localStorage.getItem("key")
                                            }
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
                    } else {
                        Toast.fail({
                            mask: false,
                            message: "买单失败",
                            duration: 1000
                        });
                    }
                });
            } else {
                Toast({
                    mask: false,
                    message: "请输入金额",
                    duration: 800
                });
            }
        }
    },
    mounted() {
        let id = this.$route.query.shopId;
        this.billId = this.$route.query.billId;
        this.getDetailShop(id);
    }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.pay {
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    padding: tr(20px);
    .box {
        > div {
            height: tr(90px);
            letter-spacing: 1px;
            padding-left: tr(30px);
            border: 1px solid #eee;
            border-radius: tr(20px);
            background-color: #fff;
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flexbox;
            display: flex;
            justify-content: space-between;
            align-items: center;
            input {
                color: #121212;
                background-color: #fff;
                margin-right: tr(23px);
                text-align: right;
                font-size: tr(32px);
            }
            input::-webkit-input-placeholder {
                color: #999;
            }
            input:-moz-placeholder {
                color: #999;
            }
            input:-ms-input-placeholder {
                color: #999;
            }
        }
        div:nth-child(1) {
            margin-bottom: tr(20px);
            span {
                color: #121212;
                font-size: tr(32px);
                font-weight: 540;
                font-family: "PingFang-SC-Regular";
            }
        }
        div:nth-child(2),
        div:nth-child(3) {
            font-size: tr(32px);
            color: #666666;
            font-family: "PingFang-SC-Regular";
            font-weight: "Regular";
            position: relative;
        }
        div:nth-child(2) {
            padding-right: tr(20px);
            p {
                color: #b2b2b2;
            }
        }
        div:nth-child(3) {
            padding-right: tr(20px);
            p {
                background: linear-gradient(
                    270deg,
                    rgb(233, 68, 180),
                    rgb(79, 72, 179)
                );
                -webkit-background-clip: text; /*必需加前缀 -webkit- 才支持这个text值 */
                -webkit-text-fill-color: transparent; /*text-fill-color会覆盖color所定义的字体颜色： */
            }
        }
        button {
            width: 95%;
            height: tr(90px);
            display: block;
            margin: 0 auto;
            margin-top: 50px;
            border-radius: 30px;
            background: -webkit-linear-gradient(
                170deg,
                rgb(233, 68, 180),
                rgb(79, 72, 179)
            ); /* 背景色渐变 */
            color: #fff;
            font-size: tr(28px);
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
                font-size: tr(36px);
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
            font-size: tr(28px);
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
            padding: tr(20px) tr(40px);
            line-height: 1;
            span {
                padding-left: tr(50px);
                font-size: tr(28px);
            }
            img {
                width: tr(48px);
                height: tr(48px);
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
            font-size: tr(28px);
            margin-top: tr(20px);
            margin-left: 2.5%;
            letter-spacing: 2px;
        }
    }
}
</style>

