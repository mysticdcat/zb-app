<template>
    <div class='container'>
        <div class='sendTop'>
            <span>配送至</span>
            <!-- <img src="~@/assets/images/close.png" alt="" @click='close'> -->
        </div>
        <ul class='selectedAddress'>
            <li @click='countryValue' :class='{activeBorder:changeBorder==1}' ref='countryBorder'>{{addressValue.country?addressValue.country:'请选择'}}</li>
            <li @click='cityValue' :class='{activeBorder:changeBorder==2}' ref='cityBorder' v-if='addressValue.city!==""'>{{addressValue.city}}</li>
            <li @click='areaValue' :class='{activeBorder:changeBorder==3}' ref='areaBorder' v-if='addressValue.area!==""'>{{addressValue.area}}</li>
            <li @click='countyValue' :class='{activeBorder:changeBorder==4}' ref='countyBorder' v-if='addressValue.county!==""'>{{addressValue.county}}</li>
        </ul>
        <transition>
            <div class='outerBox'>
                <div class='worldAddress'>
                    <ul class='country' ref='countryBox'>
                        <li :class='{active:countryColor==index}' v-for='(item,index) in dataList' @click='getCountry(item.State,$event,index)' :key="index">{{item.Name}}</li>
                    </ul>
                    <ul class='city' ref='cityBox'>
                        <li :class='{active:cityColor==index}' v-for='(item,index) in province' :key="index" v-if='item.Name?true:false' @click='getCity(item.City,$event,index)'>{{item.Name}}</li>
                        <li v-for='(item,index) in province' :key="index" else>
                            <div :class='{active:cityColor==index}' v-for='(secondItem,index) in item' :key="index" @click='getCity(item.City,$event,index)'>{{secondItem.Name}}</div>
                        </li>
                    </ul>
                    <ul class='area' ref='areaBox'>
                        <li :class='{active:areaColor==index}' v-for='(item,index) in city' :key="index" @click='getArea(item.Region,$event,index)'>{{item.Name}}</li>
                    </ul>
                    <ul class='county' ref='countyBox'>
                        <li :class='{active:countyColor==index}' v-for='(item,index) in areaCounty' :key="index" @click='getCounty(item,$event,index)'>{{item.Name}}</li>
                    </ul>
                </div>
            </div>
        </transition>

    </div>
</template>
<script>
import address from "~/assets/data/address/index.js";
export default {
    props: ["affirm"],
    data() {
        return {
            dataList: [], //世界地址
            province: [], //省
            city: [], //市
            areaCounty: [], //县
            county: [], //区
            addressValue: {
                //最终选中的城市
                country: "",
                city: "",
                area: "",
                county: ""
            },
            countryColor: -1, //点击高亮显示
            cityColor: -1,
            areaColor: -1,
            countyColor: -1,
            changeBorder: -1, //选中后的border-bottom出现红色
            isShow: false
        };
    },
    created() {
        /* 加载时第一个默认为红色边框 */
        this.changeBorder = 1;
    },
    methods: {
        /* 选择国家 */
        getCountry(province, e, index) {
            this.addressValue.city = "";
            this.addressValue.area = "";
            this.addressValue.county = "";
            this.cityColor = -1;
            this.countryColor = index;
            this.province = province;
            /* 拿到当前点击的值 */
            this.addressValue.country = e.toElement.innerText;
            /* 如果下一级有值就让其执行动画 */
            if (province) {
                this.$refs.countryBox.style.transition = "left 0.5s";
                this.$refs.countryBox.style.left = "-25%";
                this.$refs.cityBox.style.transition = "left 0.5s";
                this.$refs.cityBox.style.left = 0;
                this.addressValue.city = "请选择";
                this.changeBorder = 2;
            } else {
                this.$emit("select-end", this.addressValue);
            }
        },
        /* 选择省份 */
        getCity(city, e, index) {
            this.addressValue.area = "";
            this.addressValue.county = "";
            this.areaColor = -1;
            this.cityColor = index;
            this.city = city;
            this.addressValue.city = e.toElement.innerText;
            if (city) {
                this.$refs.cityBox.style.transition = "left 0.5s";
                this.$refs.cityBox.style.left = "-25%";
                this.$refs.areaBox.style.transition = "left 0.5s";
                this.$refs.areaBox.style.left = 0;
                this.addressValue.area = "请选择";
                this.changeBorder = 3;
            } else {
                this.$emit("select-end", this.addressValue);
            }
        },
        /* 选择县 */
        getArea(areaCounty, e, index) {
            this.addressValue.county = "";
            this.countyColor = -1;
            this.areaColor = index;
            this.areaCounty = areaCounty;
            this.addressValue.area = e.toElement.innerText;
            /* 如果下一级存在那么就让其执行动画并且让请选择以及红色边框显示 */
            if (areaCounty) {
                this.$refs.areaBox.style.transition = "left 0.5s";
                this.$refs.areaBox.style.left = "-25%";
                this.$refs.countyBox.style.transition = "left 0.5s";
                this.$refs.countyBox.style.left = 0;
                this.addressValue.county = "请选择";
                this.changeBorder = 4;
            } else {
                this.$emit("select-end", this.addressValue);
            }
        },
        /* 选择区 */
        getCounty(county, e, index) {
            this.countyColor = index;
            this.county = county;
            this.changeBorder = 4;
            this.addressValue.county = e.toElement.innerText;
            this.$emit("select-end", this.addressValue);
            /* if(county) {
                this.addressValue.county=e.toElement.innerText
            } else {

                this.$emit('select-end',this.addressValue);

            } */
        },
        /* 下面4个函数是点击已经选中的城市出现的动画效果 */
        countryValue() {
            /* 点击选中的地区出现的动画，下面3个函数一样的 */
            this.$refs.countryBox.style.transition = "left 0.5s";
            this.$refs.countryBox.style.left = 0;
            this.$refs.cityBox.style.transition = "left 0.5s";
            this.$refs.cityBox.style.left = "25%";
            this.$refs.areaBox.style.transition = "left 0.5s";
            this.$refs.areaBox.style.left = "50%";
            this.$refs.countyBox.style.transition = "left 0.5s";
            this.$refs.countyBox.style.left = "75%";
            /* 点击当前让其border-bottom展示 */
            this.changeBorder = 1;
        },
        cityValue() {
            this.$refs.countryBox.style.transition = "left 0.5s";
            this.$refs.countryBox.style.left = "-25%";
            this.$refs.cityBox.style.transition = "left 0.5s";
            this.$refs.cityBox.style.left = 0;
            this.$refs.areaBox.style.transition = "left 0.5s";
            this.$refs.areaBox.style.left = "25%";
            this.$refs.countyBox.style.transition = "left 0.5s";
            this.$refs.countyBox.style.left = "50%";
            this.changeBorder = 2;
        },
        areaValue() {
            this.$refs.countryBox.style.transition = "left 0.5s";
            this.$refs.countryBox.style.left = "-50%";
            this.$refs.cityBox.style.transition = "left 0.5s";
            this.$refs.cityBox.style.left = "-25%";
            this.$refs.areaBox.style.transition = "left 0.5s";
            this.$refs.areaBox.style.left = 0;
            this.$refs.countyBox.style.transition = "left 0.5s";
            this.$refs.countyBox.style.left = "25%";
            this.changeBorder = 3;
        },
        countyValue() {
            this.$refs.countryBox.style.transition = "left 0.5s";
            this.$refs.countryBox.style.left = "-75%";
            this.$refs.cityBox.style.transition = "left 0.5s";
            this.$refs.cityBox.style.left = "-50%";
            this.$refs.areaBox.style.transition = "left 0.5s";
            this.$refs.areaBox.style.left = "-25%";
            this.$refs.countyBox.style.transition = "left 0.5s";
            this.$refs.countyBox.style.left = 0;
            this.changeBorder = 4;
        },
        /* 关闭弹窗 */
        close() {
            this.$emit("affirm", this.isShow);
        }
    },
    mounted() {
        this.dataList = address;
    },
    updated() {}
};
</script>
<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
// .v-enter,
// .v-leave-to {
//   opacity: 0;
//   transform: translateX(100%);
// }
// .v-enter-active,
// .v-leave-active {
//   transition: all 0.5s ease;
// }
.container {
    width: 100%;
    height: tr(1000px);
    background-color: #fff;
    overflow: hidden;
    .sendTop {
        width: 100%;
        height: tr(80px);
        text-align: center;
        > span {
            line-height: tr(80px);
            font-size: tr(28px);
        }
        > img {
            position: absolute;
            right: tr(15px);
            top: tr(15px);
        }
    }
    .selectedAddress {
        width: 100%;
        height: tr(50px);
        border-bottom: 1px solid #eee;
        margin-top: tr(10px);
        > li {
            float: left;
            padding: 0 tr(20px);
            font-size: tr(26px);
            height: tr(50px);
        }
    }
    .outerBox {
        .worldAddress {
            position: relative;
            //   left: 0;
            width: 400%;
            height: tr(860px);
            //   background-color: pink;
            // overflow: hidden;
            overflow-y: scroll;
            font-size: tr(28px);
            line-height: tr(70px);
            > ul {
                width: 25%;
                float: left;
                height: tr(100px);
                padding: tr(20px) tr(30px);
                box-sizing: border-box;
            }
            .country {
                position: absolute;
                left: 0;
            }
            .city {
                position: absolute;
                left: 25%;
            }
            .area {
                position: absolute;
                left: 50%;
            }
            .county {
                position: absolute;
                left: 75%;
            }
        }
    }
}
.active {
    color: #e92323;
}
.activeBorder {
    border-bottom: 1px solid #e92323;
}
</style>

