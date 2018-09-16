<template>
    <div class="goodsDatil" ref="goodsDatil">
        <Headertitle :title='faTitle'></Headertitle>
        <div class="faheader">
            <div class="header-left">
                <div class="title">{{data.name}}</div>
                <div class="hot">
                    <span>人气{{data.popularity}}</span>
                    <img src="~/assets/images/hot.png" alt="">
                    <img src="~/assets/images/hot.png" alt="">
                    <img src="~/assets/images/hot.png" alt="">
                    <span>{{data.des}}</span>
                    <span>人均{{data.avgprice}}元</span>
                </div>
            </div>
            <div class="header-right">
                <img src="~/assets/images/buy.png" alt="" @click="createOrder">
            </div>
        </div>
        <div class="imgBox" ref="imgBox">
            <ul ref='imgUl'>
                <li ref="imgLi" v-for="(item,index) in data.images" :key="index">
                    <img :src="item" alt="">
                </li>
            </ul>
        </div>
        <div class="position" @click="goMap">
            <img src="~/assets/images/location.png" alt="">
            <span class="adress">{{data.address}}</span>|
            <span class="road">距你{{data.juli | fmtlevel}}</span>
        </div>
        <div class="icon">
            <ul>
                <li @click="goMap">
                    <img src="~/assets/images/car2.png" alt="">
                </li>
                <li>
                    <img src="~/assets/images/tel.png" alt="">
                </li>
            </ul>

        </div>
        <div class="bar" ref="bar">
            <el-tabs v-model="activeName" @tab-click="handleClick" sticky>
                <el-tab-pane label="优惠" name="first"></el-tab-pane>
                <el-tab-pane label="评价" name="second"></el-tab-pane>
                <el-tab-pane label="商家信息" name="third"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="favourable" ref="favourable">
            <p>买单优惠</p>
            <div class="buyBox">
                <div class="buyBox-left">
                    <div><img src="~/assets/images/reduce.png" alt="">
                        <span>买单立减</span>
                    </div>
                    <div v-if="data.sale">9.5 折</div>
                    <div v-if="!data.sale">满{{data.man}}减{{data.jian}}</div>
                </div>
                <div class="buyBox-right">
                    <button>立即领取</button>
                    <p>{{commentNum.checknum}}人已领取</p>
                </div>
            </div>
        </div>
        <div class="comment" ref="comment">
            <div class="data">
                <p>真实评价
                    <span>({{commentNum.commentNum}})</span>
                </p>
                <div class="true-data">
                    <ul>
                        <li class="data-left">
                            <div><img src="~assets/images/comment.png" alt="">
                                <span>用户交易评价</span>
                            </div>
                            <div>{{data.praise}}%</div>
                        </li>
                        <li class="data-right">
                            <div>
                                <span class="comment-type">超赞</span>
                                <van-progress pivot-text="" :percentage="greatnum || 0" />
                                <span class="comment-num">{{commentNum.greatnum || 0}}</span>
                            </div>
                            <div>
                                <span class="comment-type">满意</span>
                                <van-progress pivot-text="" :percentage="satisfiednum || 0" />
                                <span class="comment-num">{{commentNum.satisfiednum || 0}}</span>
                            </div>
                            <div>
                                <span class="comment-type">一般</span>
                                <van-progress pivot-text="" :percentage="satisfiednum || 0" />
                                <span class="comment-num">{{commentNum.satisfiednum || 0}}</span>
                            </div>
                            <div>
                                <span class="comment-type">失望</span>
                                <van-progress pivot-text="" :percentage="disappointemntnum || 0" />
                                <span class="comment-num">{{commentNum.disappointemntnum || 0}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="comment-tag">
                    <el-tag :color="color1">有图1W</el-tag>
                    <el-tag :color="color2">舒适环境5000</el-tag>
                    <el-tag :color="color3">店家热请200</el-tag>
                    <el-tag :color="color4">好美味200</el-tag>
                    <el-tag :color="color1">好美味200</el-tag>
                </div>
                <div class="all-comment">
                    <ul>
                        <li v-for="(item,index) in comment" :key="index">
                            <div><img :src="item.myimage" alt="">
                                <div>
                                    <p>
                                        <span>{{item.myname}}</span>
                                        <span>{{item.time}}</span>
                                    </p>
                                    <button>{{item.levelcontent}}</button>
                                </div>
                            </div>
                            <div>
                                <p>{{item.content}}</p>
                                <div>
                                    <img v-for="(item,index) in item.image" :key="index" :src="item" alt="">
                                </div>
                            </div>
                            <div>
                                <img src="~assets/images/like.png" alt="">
                                <span>1.5W</span><img src="~assets/images/message.png" alt="">
                                <span>5986</span>
                            </div>
                        </li>
                    </ul>
                    <button>{{commentNum.commentNum?'查看全部评论...':'暂无评论...'}}</button>
                </div>
                <div class="shop-info" ref="shopInfo">
                    <p>商家信息</p>
                    <span>• 有WiFi</span>
                    <span>• 有宝宝椅</span>
                    <span>• 有大桌</span>
                    <span>• 有沙发位</span>
                    <h4>查看其他家门店 (3家)</h4>
                </div>
                <div class="suggest">
                    <ul>
                        <li v-for="(item,index) in random" :key='index' @click="goShopDetail(item.id,item.typeId)">
                            <div><img :src="item.logo" alt=""></div>
                            <div>
                                <p>{{item.name}}</p>
                                <p>
                                    <span>人气 {{item.popularity}}</span><img src="~assets/images/hot.png" alt="">
                                    <span>{{item.juli | fmtlevel}}</span>
                                </p>
                                <P>
                                    <button>{{item.des}}</button>
                                    <!-- <button>{{item.des[1]}}</button> -->
                                </P>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import VueTouch from "vue-touch";
import { Progress } from "vant";
import ts from "coordtransform";
import api from "~/api/index.js";
import Headertitle from "~/components/header/title.vue";
export default {
    components: {
        Headertitle
    },
    data() {
        return {
            faTitle: "",
            comment: "",
            //评论总数
            commentNum: 0,
            //领取总数量
            checknum: 0,
            // 超赞
            greatnum: 0,
            //满意
            satisfiednum: 0,
            //一般
            commonlynum: 0,
            //失望
            disappointemntnum: 0,
            //四个加起来的数量
            persent: 0,

            data: "",
            activeName: "first",
            color1: "#E6E6FA",
            color2: "#FFE4E1",
            color3: "#C1FFC1",
            color4: "#FAFAD2",
            current: 0,
            target: 0,
            ulLeft: 0,
            //记录上一次的滑动位置
            beforeClient: 0,
            random: [],
            active: 0,
            barPosition: 0
        };
    },
    methods: {
        onscroll() {},
        onSwipeLeft() {},
        onSwipeRight() {},
        toPosition(target) {
            var before = 0;
            var time = setInterval(function() {
                var step = 10;
                if (
                    (document.documentElement &&
                        document.documentElement.scrollTop) ||
                    document.documentElement.scrollTop
                ) {
                    if (target > document.documentElement.scrollTop) {
                        document.documentElement.scrollTop += step;
                    } else {
                        document.documentElement.scrollTop -= step;
                    }
                    if (
                        Math.abs(target - document.documentElement.scrollTop) <=
                        step
                    ) {
                        document.documentElement.scrollTop = target - 20;
                        clearInterval(time);
                    }
                    if (before == target - document.documentElement.scrollTop) {
                        document.documentElement.scrollTop = target - 20;
                        clearInterval(time);
                    }
                    before = target - document.documentElement.scrollTop;
                } else {
                    if (target > document.body.scrollTop) {
                        document.body.scrollTop += step;
                    } else {
                        document.body.scrollTop -= step;
                    }
                    if (Math.abs(target - document.body.scrollTop) <= step) {
                        document.body.scrollTop = target - 20;
                        clearInterval(time);
                    }
                    if (before == target - document.body.scrollTop) {
                        document.body.scrollTop = target - 20;
                        clearInterval(time);
                    }
                    before = target - document.body.scrollTop;
                }
            }, 5);
        },
        handleClick(tab, e) {
            if (tab.index == 0) {
                var favourable = this.$refs.favourable;
                var y = favourable.offsetTop;
                this.toPosition(y);
            } else if (tab.index == 1) {
                var comment = this.$refs.comment;
                var y = comment.offsetTop;
                this.toPosition(y);
            } else {
                var shopInfo = this.$refs.shopInfo;
                var y = shopInfo.offsetTop;
                this.toPosition(y);
            }
        },
        // touchmove(e) {
        //     console.log(e);
        //     if (e.changedTouches[0].clientX < this.beforeClient) {
        //         this.$refs.imgUl.style.left = -8 + this.ulLeft + "px";
        //     } else {
        //         if (parseInt(this.$refs.imgUl.style.left) >= 0) {
        //             return;
        //         }
        //         this.$refs.imgUl.style.left = 8 + this.ulLeft + "px";
        //     }
        //     this.ulLeft = parseInt(this.$refs.imgUl.style.left);
        //     this.beforeClient = e.changedTouches[0].clientX;
        //     e.preventDefault();
        // },
        goMap() {
            this.$router.push({
                path: "/payment/shopping/shopmap",
                query: { lng: this.data.jingdu, lat: this.data.weidu }
            });
        },
        //跳转至其他商家
        goShopDetail(id, typeid) {
            this.$router.push({
                path: "/payment/shopping/goodsDetail",
                query: { shopId: id, typeid: typeid }
            });
            this.getData(id);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },

        // 创建优惠买单
        createOrder() {
            let id = this.$route.query.shopId;
            let params = { shopId: id };
            localStorage.setItem("shopId", id);
            api.createOrder(params).then(res => {
                if (res.data) {
                    var billId = res.data;
                    this.$router.push({
                        path: "/payment/shopping/pay",
                        query: { shopId: id, billId: billId }
                    });
                } else {
                    Toast.fail("创建订单失败");
                }
            });
        },
        // 获取页面数据
        getData(shopId) {
            var coordinate = this.$store.state.coordinate;
            var lng = coordinate.lng;
            var lat = coordinate.lat;
            var params = {
                lng: lng,
                lat: lat,
                id: shopId
            };

            //
            api.getPaymentShops(params).then(res => {
                this.faTitle = res.data.name;
                this.data = res.data;
                this.data.images = this.data.images.split(",");
            });
            var width = this.$refs.imgUl.children.offsetWidth;
            var length = this.$refs.imgUl.children.length;
            this.$refs.imgUl.style.width = (width + 10) * length + "px";

            var commentParams = {
                id: shopId,
                pageNum: 1,
                pagesize: 3
            };
            api.getPaymentShopsComment(commentParams).then(res => {
                if (res.code == 200) {
                    this.comment = res.data;
                    this.comment.forEach(item => {
                        item.image = item.image.split(",");
                    });
                }
            });
            params = shopId;
            api.getPaymentShopsCommentNum(params).then(res => {
                this.persent =
                    parseInt(res.data.satisfiednum) +
                    parseInt(res.data.commonlynum) +
                    parseInt(res.data.disappointemntnum) +
                    parseInt(res.data.greatnum);

                this.commentNum = res.data;
                this.greatnum =
                    parseInt(res.data.greatnum) / this.persent * 100;

                this.satisfiednum =
                    parseInt(res.data.satisfiednum) / this.persent * 100;
                this.commonlynum =
                    parseInt(res.data.commonlynum) / this.persent * 100;
                this.disappointemntnum =
                    parseInt(res.data.disappointemntnum) / this.persent * 100;
                if (!this.commentNum.commentNum) {
                    this.commentNum.commentNum = 0;
                }
            });
            params = {
                lng: lng,
                lat: lat,
                typeid: this.$route.query.typeid,
                addr: "杭州"
            };
            api.getRoundShops(params).then(res => {
                this.random = res.data;
                this.random.forEach(item => {
                    if (item.des) {
                        //   item.des = item.des.split("-");
                    }
                });
            });
        },
        handleScroll() {
            console.log(11);
            var headerHeight = 0;
            if (localStorage.getItem("isBridge")) {
                var header = document.getElementById('header')
                headerHeight = parseInt(header.offsetHeight)
            }
            console.log(headerHeight)
            var bar = this.$refs.bar;
            var height = this.$refs.bar.offsetHeight;
            if (document.documentElement.scrollTop >= this.barPosition) {
                bar.style.position = "fixed";
                bar.style.top = headerHeight + "px";
                bar.style.left = 0 + "px";
                bar.style.backgroundColor = "#f7f7f7";
                this.$refs.goodsDatil.style.paddingTop = height + 20 + "px";
            } else {
                bar.style.position = "static";
                bar.style.backgroundColor = "#fff";
                this.$refs.goodsDatil.style.paddingTop = 0 + "px";
            }
        }
    },
    created() {},
    mounted() {
        localStorage.setItem("typeid", this.$route.query.typeid);
        this.barPosition = this.$refs.bar.offsetTop;
        window.addEventListener("scroll", this.handleScroll);
        var shopId = this.$route.query.shopId;
        this.getData(shopId);
    },
    destroyed() {
        window.removeEventListener("scroll", this.handleScroll);
    }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.goodsDatil {
    /deep/ .van-ellipsis {
        bottom: 0;
    }
    background-color: #fff;
    overflow: hidden;
    width: 100%;
    > div {
        width: 100%;
    }
    .faheader {
        width: 100%;
        padding: tr(20px);
        height: tr(180px);
        .header-left {
            width: 60%;
            float: left;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            .title {
                word-break: break-all;
                word-wrap: break-word;
                font-weight: bold;
                font-size: tr(36px);
                font-style: oblique;
                word-spacing: 0;
            }
            .hot {
                margin-top: tr(16px);
            }
            span:nth-child(1) {
                line-height: 1;
                word-spacing: 2px;
                color: #ff1400;
                vertical-align: middle;
            }
            span {
                font-size: tr(24px);
                color: #999;
                vertical-align: middle;
                margin-left: tr(8px);
            }
            img {
                display: inline-block;
                width: tr(22px);
                height: tr(26px);
                vertical-align: middle;
            }
        }
        .header-right {
            float: right;
            font-size: tr(26px);
        }
        .header-right {
            text-align: center;
            height: 100%;
            margin-top: tr(50px);
            img {
                width: tr(220px);
                height: tr(100px);
            }
        }
    }
    .imgBox::-webkit-scrollbar {
        width: 0 !important;
    }
    .imgBox {
        box-sizing: border-box;
        margin-left: tr(20px);
        width: 100%;
        height: tr(180px);
        //     overflow-x: scroll;
        //     // position: relative;
        //     //滑动效果

        overflow-y: hidden;
        overflow-x: scroll;
        //  -webkit-overflow-scrolling:touch;
        ul {
            // overflow-x:scroll;
            // overflow: hidden;
            height: tr(180px);
            li {
                margin-right: 5px;
                float: left;
                width: tr(224px);
                height: tr(180px);
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .position {
        word-spacing: 2px;
        padding: tr(30px) tr(20px) 0 tr(20px);
        img {
            width: tr(22px);
            height: tr(26px);
            display: inline-block;
        }
        .adress {
            color: #333;
            padding-right: tr(10px);
        }
        .road {
            padding-left: tr(10px);
            color: #ccc;
        }
    }
    .icon {
        margin: tr(20px);
        background-color: #f7f7f7;
        height: tr(70px);
        ul {
            height: 100%;
            width: 100%;
            li {
                height: 100%;
                text-align: center;
                width: 50%;
                float: left;
                img {
                    margin: 0 auto;
                    height: 100%;
                    display: inline-block;
                }
            }
        }
    }
    .bar {
        padding: 0 tr(20px);
    }
    .favourable {
        width: 100%;
        padding: 0 tr(20px);
        height: tr(190px);
        p {
            font-weight: bold;
            font-size: tr(32px);
            font-style: oblique;
        }
        .buyBox {
            margin-top: tr(10px);
            width: 100%;
            height: tr(140px);
            background-color: #f3f3fe;
            .buyBox-left {
                padding: tr(20px);
                width: 65%;
                float: left;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;

                img {
                    width: tr(84px);
                    height: tr(40px);
                    vertical-align: middle;
                    display: inline-block;
                }
                span {
                    vertical-align: middle;
                }
                div:nth-child(2) {
                    font-weight: bold;
                    font-size: tr(32px);
                    // font-style: oblique;
                    color: #5f10ff;
                }
            }
            .buyBox-right {
                float: right;
                padding: tr(30px);
                button {
                    width: tr(140px);
                    height: tr(60px);
                    background-color: #5f10ff;
                    border-radius: tr(30px);
                    color: #fff;
                }
                p {
                    margin-top: tr(10px);
                    font-style: normal;
                    font-size: tr(20px);
                    color: #ccc;
                    font-weight: normal;
                    text-align: center;
                }
            }
        }
    }
    .comment {
        width: 100%;
        padding: tr(20px);
        .data {
            p {
                word-break: break-all;
                word-wrap: break-word;
                font-weight: bold;
                font-size: tr(32px);
                font-style: oblique;
                span {
                    font-size: tr(28px);
                    font-weight: normal;
                    margin-left: tr(16px);
                }
            }
            .true-data {
                margin-top: tr(30px);
                ul {
                    width: 100%;
                    height: tr(200px);
                    li {
                        height: 100%;
                        float: left;
                    }
                    li:nth-child(1) {
                        width: 45%;
                    }
                    li:nth-child(2) {
                        width: 55%;
                    }
                    .data-left {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding: 0 0 tr(40px) tr(20px);
                        div:nth-child(1) {
                            img {
                                width: tr(84px);
                                height: tr(44px);
                                vertical-align: middle;
                            }
                            span {
                                padding-left: tr(20px);
                                vertical-align: middle;
                            }
                        }
                        div:nth-child(2) {
                            font-size: 36px;
                            //  text-align: center;
                            color: #ff3b38;
                            font-style: oblique;
                            font-weight: bold;
                        }
                    }
                    .data-right {
                        > div {
                            height: 25%;
                            padding: 0 tr(60px);
                            position: relative;
                            .comment-type {
                                position: absolute;
                                top: tr(-14px);
                                left: 0;
                            }
                            .comment-num {
                                position: absolute;
                                top: tr(-14px);
                                right: 0;
                            }
                        }
                    }
                }
            }
        }
        .comment-tag {
            span {
                margin-right: tr(20px);
                margin-top: tr(20px);
                display: inline-block;
                height: tr(50px);
                font-family: "Adobe Heiti Std R";
            }
            span:nth-child(1) {
                color: #8346fd;
            }
            span:nth-child(2) {
                color: #ff3b38;
            }
            span:nth-child(3) {
                color: #26c539;
            }
            span:nth-child(4) {
                color: #c5bc26;
            }
            span:nth-child(5) {
                color: #8346fd;
            }
            span:nth-child(6) {
                color: #ff3b38;
            }
            span:nth-child(7) {
                color: #26c539;
            }
            span:nth-child(8) {
                color: #8346fd;
            }
            span:nth-child(9) {
                color: #ff3b38;
            }
            span:nth-child(10) {
                color: #ff3b38;
            }
        }
        .el-tag {
            line-height: tr(50px);
            padding: 0 tr(10px);
        }
        .all-comment {
            width: 100%;
            margin-top: tr(40px);
            ul {
                width: 100%;
                li {
                    margin-bottom: tr(40px);
                    width: 100%;
                    > div:nth-child(1) {
                        height: tr(70px);
                        img {
                            width: tr(60px);
                            height: tr(60px);
                            border-radius: tr(30px);
                            float: left;
                            vertical-align: middle;
                        }
                        div {
                            vertical-align: middle;
                            float: left;
                            width: 90%;

                            p {
                                height: tr(40px);
                                span:nth-child(1) {
                                    float: left;
                                    vertical-align: middle;
                                    font-size: tr(28px);
                                    font-weight: bold;
                                    font-style: oblique;
                                }
                                span:nth-child(2) {
                                    float: right;
                                    vertical-align: middle;
                                    color: #999;
                                    font-size: tr(28px);
                                }
                            }
                            button {
                                font-size: tr(18px);
                                width: tr(52px);
                                height: tr(30px);
                                border-radius: tr(14px);
                                color: #8346fd;
                                background-color: #fff;
                                border: 1px solid #8346fd;
                                margin-left: tr(20px);
                            }
                        }
                    }
                    > div:nth-child(2) {
                        padding-left: tr(60px);
                        padding-top: tr(20px);
                        p {
                            font-family: "PingFang SC";
                            font-weight: normal;
                            font-size: tr(28px);
                            padding-bottom: tr(20px);
                        }
                        img {
                            width: tr(200px);
                            height: tr(200px);
                            margin-right: tr(10px);
                        }
                    }
                    > div:nth-child(3) {
                        margin-top: tr(40px);
                        margin-left: 62%;
                        img {
                            width: tr(26px);
                            height: tr(30px);
                            vertical-align: middle;
                            margin-right: tr(10px);
                        }
                        span {
                            vertical-align: middle;

                            font-family: "PingFangSC-Regular";
                            color: #999;
                        }
                        span:nth-child(2) {
                            margin-right: tr(40px);
                        }
                    }
                }
            }
            > button {
                width: tr(200px);
                height: tr(40px);
                margin: 0 auto;
                display: block;
                border-radius: 10px;
                border: 1px solid #999;
                color: #999;
                background-color: #fff;
            }
        }
        .shop-info {
            p {
                margin-bottom: tr(20px);
            }
            span {
                display: inline-block;
                // width: tr(86px);
                // height: tr(24px);
                color: #999;
                font-size: tr(24px);
                padding: tr(4px);
                margin-right: tr(40px);
                margin-bottom: tr(20px);
            }
            h4 {
                font-size: tr(32px);
                padding-top: tr(20px);
                border-top: 1px solid #e6e6e6;
                font-weight: normal;
            }
        }
    }
    .suggest {
        padding-top: tr(30px);
        width: 100%;
        > p {
            padding-bottom: tr(30px);
        }
        ul {
            width: 100%;
            li {
                height: tr(230px);
                width: 100%;
                padding: tr(20px) 0;
                border-bottom: 1px solid #e6e6e6;
                > div {
                    float: left;
                }
                > div:nth-child(1) {
                    img {
                        width: tr(210px);
                        height: tr(190px);
                    }
                }
                > div:nth-child(2) {
                    padding: tr(20px);
                    height: tr(190px);
                    display: flex;
                    width: 70%;
                    flex-direction: column;
                    justify-content: space-between;
                    p:nth-child(1) {
                        font-size: tr(30px);
                    }
                    p:nth-child(2) {
                        span:nth-child(3) {
                            float: right;
                        }
                        span {
                            color: #ff1400;
                        }
                        img {
                            width: tr(24px);
                            height: tr(22px);
                        }
                    }
                    p:nth-child(3) {
                        button {
                            height: tr(32px);
                            padding: 0 tr(20px);
                            font-size: tr(20px);
                            background-color: #fff;
                            margin-right: tr(20px);
                            color: #999;
                            border: 1px solid #999;
                            border-radius: tr(4px);
                        }
                    }
                }
            }
        }
    }
}
</style>


