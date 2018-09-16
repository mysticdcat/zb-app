<template>
    <div class='container' ref='container'>
        <ul class='ct_left'>
            <li ref='firstLi' @click='recommend'>推荐</li>
            <li>
                <ul>
                    <li v-for='(item,index) in dataJson' :key="index" @click='currentCity(index)' :class='{active:changeColor==index}'>{{item.Name}}</li>
                </ul>
            </li>
        </ul>
        <div class='ct_right'>
            <div class='recommendSecond' v-if='remShow'>
                <span>当前定位</span>
                <p class='city' @click='locationCity($event)'>{{$store.state.city}}</p>
                <span class='receents'>最近访问</span>
                <ul>
                    <li v-for='(item,index) in threeVisit' :key='index' @click='threeCity($event)'>{{item}}</li>
                </ul>
            </div>

            <ul class='ulBox'>
                <li v-for='(secondChild,key) in secondary.City' :key='key' @click='selectSecondCity($event)' v-if='cityShow'>{{secondChild.Name}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
import malaysiaJson from '~/assets/js/malaysiaJson.js'
export default {
    data() {
        return {
            remShow: true,          //点击推荐让子分类显示
            cityShow: false,        //点击一级分类让城市隐藏
            threeVisit: ['北京','上海','杭州'],  //最近访问的三个城市
            dataJson: malaysiaJson,
            changeColor: -1,
            secondary: {},   //点击当前让其对用的子级城市显示
        }
    },
    methods: {
        /* 点击一级分类中的推荐 */
        recommend(e) {
            this.$refs.firstLi.style.backgroundColor='#fff'
            this.changeColor=-1
            this.remShow=true
            this.cityShow=false
        },
        /* 点击一级分类让其对应的城市进行for循环 */
        currentCity(index) {
            this.changeColor=index
            this.$refs.firstLi.style.backgroundColor='#eee'
            this.secondary=this.dataJson[index]
            this.remShow=false
            this.cityShow=true
        },
        /* 点击当前将地址用vuex保存 */
        selectSecondCity(e) {
            this.$store.commit("changeCity",e.toElement.innerText);
            this.$router.push({ path: "/payment/payment" });
        },
        /* 点击当前定位的城市保存在vuex中 */
        locationCity(e) {
            this.$store.commit("changeCity",e.toElement.innerText);
            this.$router.push({ path: "/payment/payment" });
        },
        /* 点击最近访问将值存到vuex中 */
        threeCity(e) {
            this.$store.commit("changeCity",e.toElement.innerText);
            this.$router.push({ path: "/payment/payment" });
        }
    },
    mounted() {
        this.$refs.firstLi.style.backgroundColor='#fff'
        this.$refs.container.style.height=this.$refs.container.offsetHeight-80+'px'
    }
}
</script>
<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
.active {
  background-color: #fff;
}
.container {
  width: 100%;
  height: 100%;
  .ct_left {
    width: tr(150px);
    height: 100%;
    float: left;
    overflow-y: scroll;
    background-color: #eee;
    > li {
      width: 100%;
      height: tr(70px);
      line-height: tr(70px);
      text-align: center;
    }
  }
  .ct_right {
    height: 100%;
    overflow: scroll;
    margin-left: tr(150px);
    padding: tr(20px);
    box-sizing: border-box;
    > .recommendSecond {
      //   margin-left: 2.5%;
      > span:nth-child(1) {
        font-size: tr(26px);
        display: inline-block;
        height: tr(60px);
      }
      .city {
        width: 30%;
        height: tr(60px);
        text-align: center;
        line-height: tr(60px);
        background-color: #fff;
      }
      .receents {
        font-size: tr(26px);
        display: inline-block;
        margin-top: tr(10px);
        height: tr(60px);
        line-height: tr(60px);
      }
      li {
        width: 30%;
        height: tr(60px);
        text-align: center;
        line-height: tr(60px);
        background-color: #fff;
        border-radius: tr(5px);
        // margin-left: 2.5%;
        float: left;
        &:nth-child(2) {
          margin: 0 5%;
        }
      }
    }
    > .ulBox {
      width: 100%;
      float: left;
      > li {
        width: 30%;
        height: tr(60px);
        margin-left: 2.5%;
        float: left;
        text-align: center;
        line-height: tr(60px);
        background-color: #fff;
        border-radius: tr(5px);
        margin-bottom: tr(20px);
      }
    }
  }
}
</style>

