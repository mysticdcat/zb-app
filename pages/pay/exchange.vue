<template>
    <div class="exchange" v-if="status">
        <div class="top">
            <div class="keyInput">
                <div id="inputMoney"><input type="number" v-model="inputMoney" @keyup="changeMoney" :max="cash" :maxlength="length"></div>
                <div id="equal">=</div>
                <div id="money"><input type="text" disabled v-model="money"></div>
            </div>
            <div class="info">
                <div class="scale">兑换比例 :</div>
                <div class="value">
                    <p>IPM兑换美元
                        <span>{{exchange.ipm1toUSD}} : 1</span>
                    </p>
                    <p>IPM兑换宝兆币
                        <span>{{Math.round(exchange.ipm1toCAC)}} : 1</span>
                    </p>
                    <p>IPM兑换人民币
                        <span>{{exchange.ipm1toCNY}} : 1</span>
                    </p>
                </div>
            </div>
            <p class="go">起兑币:
                <span>10000</span>
            </p>
        </div>
        <div class="buy">
            <button @click="goChange">我要兑换</button>
        </div>
    </div>
</template>
<script>
import api from "~/api/index.js";
import { Toast } from "vant";
export default {
    head() {
        return {
            title: "金币兑换"
        };
    },
    data() {
        return {
            inputMoney: "",
            money: 0,
            cash: "",
            status: true,
            exchange: "",
            length: 0,
            billNo: "",
            ipm1toIDR: 0, //印度尼西亚卢比
            ipm1toPHP: 0, //菲律宾比索
            ipm1toBDT: 0, //孟加拉塔卡
            ipm1toAUD: 0, //澳元
            ipm1toCNY: 0, //人民币
            ipm1toRUB: 0, //俄罗斯卢布
            ipm1toHKD: 0, //港元
            ipm1toTWD: 0, //新台币
            ipm1toEUR: 0, //欧元
            ipm1toUSD: 0, //美元
            ipm1toCAC: 0, //宝兆币
            ipm1toMYR: 0, //马来西亚林吉特
            ipm1toVND: 0, //越南盾
            ipm1toINR: 0, //印度卢比
            ipm1toTHB: 0, //泰铢
            ipm1toSGD: 0, //新加坡元
            ipm1toKRW: 0, //韩元
            ipm1toJPY: 0, //日元
            ipm1toGBP: 0,//英镑
        };
    },
    methods: {
        changeMoney() {
            if (this.inputMoney > this.cash) {
                this.inputMoney = this.cash;
            }
            this.money = this.inputMoney / 2100;
            this.money = this.money.toFixed(2);
        },
        goChange() {
            var totalcoin = Math.round(
                Math.round(this.exchange.ipm1toCAC) * this.inputMoney
            );
            var params = {
                payment: this.inputMoney,
                totalcoin: totalcoin
            };
            api.getGoldEchangeOrder(params).then(res => {
                this.billNo = res.data;
                api.goldExchange(this.billNo).then(res => {
                });
            });
        }
    },
    mounted() {
        if (this.$route.query.key) {
            var key = this.$route.query.key;
        } else {
            var key = localStorage.getItem("key");
        }
        api.getChange(key).then(res => {
            this.cash = res.data;
            if (this.cash) {
                this.length = this.cash.length;
            } else {
                this.cash = 0;
            }
            this.status = true;
        });
        api.getExhcangeScale().then(res => {
            this.exchange = res.data.ipm1toIDR;
            this.ipm1toPHP = res.data.ipm1toPHP;
            this.ipm1toBDT = res.data.ipm1toBDT;
            this.ipm1toAUD = res.data.ipm1toAUD;
            this.ipm1toCNY = res.data.ipm1toCNY;
            this.ipm1toRUB = res.data.ipm1toRUB;
            this.ipm1toHKD = res.data.ipm1toHKD;
            this.ipm1toTWD = res.data.ipm1toTWD;
            this.ipm1toEUR = res.data.ipm1toEUR;
            this.ipm1toUSD = res.data.ipm1toUSD;
            this.ipm1toCAC = res.data.ipm1toCAC;
            this.ipm1toMYR = res.data.ipm1toMYR;
            this.ipm1toVND = res.data.ipm1toVND;
            this.ipm1toINR = res.data.ipm1toINR;
            this.ipm1toTHB = res.data.ipm1toTHB;
            this.ipm1toSGD = res.data.ipm1toSGD;
            this.ipm1toKRW = res.data.ipm1toKRW;
            this.ipm1toJPY = res.data.ipm1toJPY;
            this.ipm1toGBP = res.data.ipm1toGBP;
        });
    }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.exchange {
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;

    .top {
        background-color: #fff;
        padding: 0 tr(40px);
        width: 100%;
        height: tr(500px);
        > p:nth-child(1) {
            color: #ccc;
        }
        > p {
            float: left;
            vertical-align: middle;
        }
        > p:nth-child(2) {
            margin-top: 0 !important;
            margin-left: tr(100px);
        }
        .info {
            width: 100%;
            overflow: hidden;
        }
        .scale {
            color: #ccc;
            padding-left: tr(40px);
            float: left;
            width: 30%;
            height: 100%;
            line-height: 100%;
        }
        .value {
            width: 50%;
            float: left;
            p {
                letter-spacing: 1px;
                color: #000;
                height: tr(40px);
                margin-left: tr(20px);
                line-height: tr(40px);
                span {
                    color: #9347fc;
                }
            }
        }
        .go {
            margin-top: tr(40px);
            padding-left: tr(40px);
            color: #ccc;
            span {
                margin-left: tr(20px);
                color: #9347fc;
            }
        }
        > p:nth-child(2) {
            color: #000;
            margin-top: tr(10px);
            font-size: tr(42px);
        }
        .keyInput {
            position: relative;
            width: 100%;
            height: tr(80px);
            margin-top: tr(80px);
            margin-bottom: tr(40px);
            input {
                width: 100%;
                height: 100%;
                color: #9347fc;
                display: block;
                border-radius: 10px;
                border: none;
                font-size: 14px;
                overflow: hidden;
            }

            #inputMoney {
                float: left;
                width: tr(280px);
                height: tr(80px);
                overflow: hidden;
                border: 1px solid #ccc;
                border-radius: 10px;
                position: relative;
                padding-left: tr(40px);
            }
            #inputMoney::after {
                content: "币";
                position: absolute;
                right: tr(16px);
                top: tr(20px);
                color: #ccc;
            }

            #money {
                padding-left: tr(40px);
                float: right;
                position: relative;
                top: 0;
                right: 0;
                width: tr(280px);
                height: tr(80px);
                border: 1px solid #ccc;
                border-radius: 10px;
                background-color: #f6f6f6;
                input {
                    background-color: #f6f6f6;
                }
            }
            #money::after {
                content: "IPM";
                position: absolute;
                right: tr(16px);
                top: tr(24px);
                color: #ccc;
            }
            #equal {
                width: tr(40px);
                height: tr(80px);
                position: absolute;
                left: 48%;
                top: 0%;
                line-height: tr(80px);
                font-size: tr(28px);
                margin: 0 auto;
                // margin-left: -5%;
            }
        }
    }
    .buy {
        margin: 0 auto;
        width: 90%;
        height: tr(90px);
        margin-top: tr(50px);
    }
    button {
        width: 100%;
        height: 100%;
        background-color: #9347fc;
        font-size: tr(28px);
        color: #fff;
        border-radius: 30px;
    }
}
</style>


