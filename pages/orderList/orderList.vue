<template>
    <div class="orderList">
        <Headertitle :title='faTitle'></Headertitle>
        <div class="content" v-if="orderData.length != 0">
            <div class="card" v-for="(item,value) in orderData" :key="value">
                <div class="orderInfo">
                    <span>订单编号: </span>
                    <span> {{item.billNo}}</span>
                    <span class="finish">{{status[item.status-1]}}</span>
                </div>
                <div id="shopItem" v-for="(second,value) in item.orderShopInfoList" :key="value" @click="goOrderInfo(second.id)">
                    <p @click="goShop(second.shopId)"><img src="../../assets/carImage/shopLogo.png" alt="">
                        <span>{{second.shopName}}</span>
                    </p>
                    <div id="goodsItem" v-for="(third,value) in second.orderItems" :key="value">
                        <div class="goodImg">
                            <img :src="third.picPath[0]" alt="">
                        </div>
                        <div class="info">
                            <p class="name"> {{third.name}}</p>
                            <p class="gift">
                                <span>{{third.reserve1}}</span>
                            </p>
                            <p>
                                <span class="small">￥</span>
                                <span class="price">{{third.price}}</span>
                                <span class="count">X{{third.num}}</span>
                            </p>
                        </div>
                    </div>

                    <div class="face" v-if="second.status == 5">

                        <button @click="pay(item)">确认收货</button>
                        <button @click="pay(item)">查看物流</button>
                    </div>
                    <div class="add">
                        <span>共计{{second.addNum}}件商品</span>
                        <span>合计：￥{{second.payment}}</span>
                    </div>
                </div>
                <div class="face" v-if="item.status == 5 || item.status == 1">
                    <span v-if="item.status == 5">实付￥ </span>
                    <span v-if="item.status == 5">{{item.payment}}</span>
                    <button @click="pay(item)">{{item.status == 1 ? '继续购买' : '再次购买'}}</button>
                </div>
            </div>
        </div>
        <div v-if="show" class="empty">
            <img src="../../assets/carImage/emptyOrder.png" alt="">
            <p>暂无订单</p>
        </div>
        <van-list v-model="loading" :finished="finished" @load="onLoad" :offset='10'>
        </van-list>
        <van-popup v-model="display" position="bottom" overlay-class="van-modal">
            <div class="payWayTop">
                <h3>确认支付</h3>
                <span><img src="../../assets/carImage/close.png" alt="" @click="payWayDisplay"></span>
            </div>
            <p class="allPrice">
                <span>支付金额</span>
                <span>￥{{payment}}</span>
            </p>
            <div class="alipay" ref="alipay" @click="changeWay(1)">
                <img src="../../assets/carImage/alipay.png" alt="">
                <span>支付宝付款</span>
            </div>
            <div class="wecaht" ref="wechat" @click="changeWay(2)">
                <img src="../../assets/top/CAC.png" alt="">
                <span>宝兆付款</span>
            </div>
            <button @click="toPay(billNo)">确认支付</button>
        </van-popup>
    </div>
</template>
<script>
import Headertitle from "~/components/header/title.vue";
import api from "../../api/index";
export default {
    components: {
        Headertitle
    },
    head() {
        return {
            title: "全部订单"
        };
    },
    data() {
        return {
            faTitle: "全部订单",
            orderData: [],
            //状态码
            status: [
                "待付款",
                "已付款",
                "未发货",
                "已发货",
                "交易成功",
                "交易关闭"
            ],
            allOrderNum: 0,
            //默认获取全部订单所有参数
            params: {
                pageNum: 1,
                pageSize: 3
            },
            //上拉加载数据
            list: [],
            loading: false,
            finished: false,
            show: false,
            display: false,
            billNo: 0,
            payment: 0,
            way: 1
        };
    },
    methods: {
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
        //控制支付面板的弹起
        payWayDisplay(item) {
            this.display = !this.display;
        },

        toPay(billNo) {
            //获取支付方式
            var payList;
            if (this.way == 1) {
                var billNo = this.billNo;
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
                                query: { message: res.msg, code: res.code }
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

        //去商家页面
        goShop(id) {
            this.$router.push({
                path: "/shopDetail/shopDetail",
                query: { shopId: id }
            });
        },

        //去订单详情
        goOrderInfo(id) {
            this.$router.push({
                path: "/orderList/orderInfo",
                query: { orderShopid: id }
            });
        },
        pay(item) {
            if (item.status == 1) {
                this.billNo = item.billNo;
                this.payment = item.payment;
                this.payWayDisplay();
                return;
            }
            var orderInfo = {};
            //定义一个字订单
            var cartOrderInfo = [];

            if (item.status == 1) {
                this.$router.push({
                    path: "/pay/pay",
                    query: { orderId: item.id }
                });
                return;
            }

            item.orderShopInfoList.forEach(item => {
                //  var cartOrderInfo = [];
                var status = 0;
                var shopId = item.shopId;
                var payment = 0;
                var carInfo = {};
                var orderItems = [];
                item.orderItems.forEach(second => {
                    payment += second.price * second.num;
                    var obj = {
                        itemId: second.itemId,
                        num: second.num,
                        price: second.price,
                        propertyId: second.reserve2
                    };
                    orderItems.push(obj);
                });
                carInfo = {
                    payment: payment,
                    status: 0,
                    shopId: item.shopId,
                    orderItems: orderItems
                };
                if (carInfo.payment) {
                    cartOrderInfo.push(carInfo);
                }
            });
            orderInfo = {
                cartOrderInfo: cartOrderInfo,
                price: item.payment
            };
            api.createShopOrder(orderInfo).then(res => {
                //保存订单ID (商品结算页需要根据订单ID来查询)
                if (res.code == 200) {
                    this.$router.push({
                        path: "/pay/pay",
                        query: { orderId: res.data }
                    });
                } else {
                    this.$dialog
                        .alert({
                            title: "提示",
                            message: "创建订单失败"
                        })
                        .then(() => {
                            return;
                        });
                }
            });
        },
        // 前往主页
        goIndex() {
            this.$router.push({ path: "../" });
            this.reload;
        },
        //返回上一级
        backgo() {
            this.$router.go(-1);
        },
        //去购物车
        //点击去商品详情
        goInfo(id) {
            this.$router.push({
                path: "/goodsDetail/goodsDetail",
                query: { shopId: id }
            });
        },
        goPay(orderId) {
            this.$router.push({
                path: "/pay/pay",
                query: { orderId: orderId }
            });
        },
        //获取所有订单信息
        getData() {
            api.allOrderList(this.params).then(res => {
                if (!res.data) {
                    return;
                }
                //  this.orderData = res.data;
                for (var i = 0; i < res.data.length; i++) {
                    this.orderData.push(res.data[i]);
                }
                this.orderData.forEach(item => {
                    item.orderShopInfoList.forEach(item => {
                        item.addNum = 0;
                        var addNum = item.addNum;
                        item.orderItems.forEach(item => {
                            item.picPath = item.picPath.split(",");
                            addNum += item.num;
                            // if (typeof item.reserve1 == "string") {
                            //     item.reserve1 = item.reserve1.split("-");
                            // }
                        });
                        item.addNum = addNum;
                    });
                });
                this.show = !res.data.length;
            });
        },
        //下拉加载数据
        onLoad() {
            setTimeout(() => {
                if (!this.orderData) {
                    this.finished = true;
                } else if (
                    this.orderData.length >= this.allOrderNum ||
                    !this.orderData.length
                ) {
                    this.finished = true;
                }
                this.loading = false;
                this.params.pageNum++;
                api.allOrderList(this.params).then(res => {
                    if (!res.data) {
                        return;
                    }
                    res.data.forEach(item => {
                        item.orderShopInfoList.forEach(item => {
                            item.addNum = 0;
                            var addNum = item.addNum;
                            item.orderItems.forEach(item => {
                                item.picPath = item.picPath.split(",");
                                addNum += item.num;
                                // if (typeof item.reserve1 == "string") {
                                //     item.reserve1 = item.reserve1.split("-");
                                // }
                            });
                            item.addNum = addNum;
                        });
                    });

                    // res.data.forEach(item => {
                    //   item.orderItems.forEach(item => {
                    //     item.picPath = item.picPath.split(",");
                    //   });
                    // });
                    this.orderData.forEach(item => {
                        res.data.forEach(second => {
                            if (item.billNo != second.billNo) {
                                this.orderData.push(second);
                            }
                        });
                    });
                    var hash = {}; //arr是要去重的对象数组
                    this.orderData = this.orderData.reduce(function(
                        item,
                        next
                    ) {
                        hash[next.billNo]
                            ? ""
                            : (hash[next.billNo] = true && item.push(next));
                        return item;
                    },
                    []);
                });
            }, 1000);
        }
    },
    mounted() {
        this.getData();
        api.getAllOrderNum().then(res => {
            this.allOrderNum = res.data.num;
            if (res.data.num == 0) {
                this.show = true;
            }
        });
    }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.orderList {
    width: 100%;
    height: 100%;
    .empty {
        background-color: #fff;
        height: 100%;
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
            margin-left: 35%;
            margin-top: 20px;
            width: tr(224px);
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
        p {
            font-size: tr(28px);
            text-align: center;
            display: block;
            height: 50px;
            line-height: 50px;
        }
    }
    background-color: #f7f7f7;

    .content {
        width: 100%;

        padding: tr(20px);
        .card {
            margin-bottom: tr(10px);
            .orderInfo {
                padding-right: tr(20px);
                font-size: tr(24px);
                // padding: tr(10px);
                position: relative;
                padding-left: tr(20px);
                height: tr(90px);
                line-height: tr(90px);
                border-bottom: 1px solid #eee;
                .finish {
                    float: right;
                    color: #5f10ff;
                }
            }
            .face {
                height: tr(80px);
                line-height: tr(80px);
                padding-left: tr(20px);
                // border-top: 1px solid #eee;
                position: relative;
                button {
                    font-size: tr(24px);
                    border: none;
                    width: tr(186px);
                    height: tr(58px);
                    line-height: tr(29px);
                    text-align: center;
                    background-color: #fff;
                    border: 1px solid black;
                    border-radius: tr(30px);
                    float: right;
                    margin-top: tr(10px);
                    margin-right: 5px;
                }
                button:nth-child(1) {
                    color: #fff;

                    background-color: #9647fd;
                }
                button:nth-child(2) {
                    color: #fff;
                    background-color: #ccc;
                }
            }
            border: 1px solid #eee;
            border-radius: 10px;
            width: 100%;
            // height: 170px;
            background-color: #fff;
            #shopItem {
                border-bottom: 1px solid #eee;
                // #goodsItem {
                //   height: tr(270px);
                //   position: relative;
                // }
                #goodsItem {
                    height: tr(190px);
                    position: relative;
                    margin-bottom: tr(20px);
                }
                .add {
                    font-size: tr(28px);
                    font-weight: floor($number: 300);

                    font-family: "PingFang-SC-Medium";
                    color: #333333;
                    padding-left: tr(20px);
                    span {
                        padding-right: tr(30px);
                    }
                }
                > p {
                    font-size: tr(24px);
                    font-weight: "Regular";
                    color: #808080;
                    font-family: PingFangSC-Regular;
                    width: 100%;
                    padding-left: tr(20px);
                    height: tr(40px);
                    margin: tr(10px) 0;
                    img {
                        width: tr(40px);
                        height: tr(35px);
                        margin-right: tr(10px);
                    }
                }
                padding: tr(10px);
                width: 100%;
                // height: tr(270px);
                position: relative;
                box-sizing: border-box;
                .goodImg {
                    position: absolute;
                    top: tr(0px);
                    left: tr(20px);
                    width: tr(190px);
                    height: tr(190px);
                    border-radius: 10%;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 100%;
                    height: 100%;
                    padding-left: tr(230px);
                    // padding-top: tr(17px);
                    // padding-bottom: tr(40px);
                    .name {
                        word-break: break-all;
                        word-wrap: break-word;
                        font-size: tr(24px);
                        height: tr(80px);
                        -webkit-line-clamp: 2;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        overflow-y: hidden;
                    }
                    .small {
                        display: inline-block;
                        font-size: tr(24px);
                        color: #5f10ff;
                    }
                }
                .gift {
                    margin-bottom: tr(20px);
                    span {
                        word-break: break-all;
                        word-wrap: break-word;
                        display: inline-block;
                        max-width: 45%;

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
                .price {
                    display: inline-block;

                    color: #5f10ff;
                    font-size: tr(36px);
                    font-weight: bolder;
                }
                .count {
                    font-size: tr(24px);
                    float: right;
                    color: #ccc;
                }
            }
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


