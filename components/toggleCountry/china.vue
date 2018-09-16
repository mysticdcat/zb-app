<template>
    <div>
        <!-- 最近访问，热门城市 -->
        <div class='centerSection'>
            <!-- 最近访问的三个城市 -->
            <ul>
                <li class='latelyVisit'>
                    <span>定位/最近访问</span>
                    <ul class='threeCity'>
                        <li v-for='(item,index) in threeVisit' :key='index' @click='threeCity($event)'>{{item}}</li>
                    </ul>
                </li>
            </ul>
            <!-- 热门城市 -->
            <ul>
                <li class='hotCity'>
                    <span>热门城市</span>
                    <ul class='threeCity'>
                        <li v-for='(item,index) in nineVisit' :key='index' @click='nineCity($event)'>{{item}}</li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- 省市区地址 -->
        <ul class='selectedAddress'>
            <li v-for='grop in dataList' :key='grop.name'>
                <span class='letter'>{{grop.name}}</span>
                <ul class='allCity'>
                    <li v-for='item in grop.cities' :key='item.cityid' class='insideCity'>
                        <span @click='selectAllCity($event)'>{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import chinaJson from '~/assets/js/chinaJson.js'
export default {
    data() {
        return {
            dataList: chinaJson,           //json数据
            threeVisit: ['北京','上海','杭州'],
            nineVisit: ['北京','上海','杭州','武汉','深圳','长沙','广州','重庆','四川'],
        }
    },
    methods: {
        /* 点击最近访问的城市,将值保存到vuex中 */
        threeCity(e) {
            this.$store.commit("changeCity", e.toElement.innerText);
            this.$router.push({path: "/payment/payment"});
        },
        /* 点击九个热门城市，将值保存到vuex中藏 */
        nineCity(e) {
            this.$store.commit("changeCity", e.toElement.innerText);
            this.$router.push({path: "/payment/payment"});
        },
        /* 所有的城市中，点击当前城市把存起来 */
        selectAllCity(e) {
            this.$store.commit("changeCity", e.toElement.innerText);
            this.$router.push({path: "/payment/payment"});
            console.log(this.$store.state.city)
        },
    }
}
</script>
<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
.centerSection {
  width: 100%;
  height: tr(500px);
  padding: tr(20px);
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  .latelyVisit {
    span {
      font-size: tr(26px);
      display: inline-block;
      height: tr(60px);
    }
    > .threeCity {
      width: 100%;
      height: tr(100px);
      > li {
        width: 30%;
        height: tr(60px);
        text-align: center;
        line-height: tr(60px);
        background-color: #fff;
        float: left;
        border-radius: tr(5px);
        &:nth-child(2) {
          margin: 0 5%;
        }
      }
    }
  }
  .hotCity {
    width: 100%;
    span {
      font-size: tr(26px);
      display: inline-block;
      height: tr(60px);
    }
    > .threeCity {
      width: 100%;
      height: tr(100px);
      > li {
        width: 30%;
        height: tr(60px);
        text-align: center;
        line-height: tr(60px);
        background-color: #fff;
        margin-bottom: tr(20px);
        float: left;
        border-radius: tr(5px);
        &:nth-child(2),
        &:nth-child(5),
        &:nth-child(8) {
          margin: 0 5%;
        }
      }
    }
  }
}
.selectedAddress {
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  .letter {
    width: 100%;
    font-size: tr(28px);
    display: block;
    padding: tr(20px);
    box-sizing: border-box;
    background-color: #eee;
  }
  .allCity {
    width: 100%;
    .insideCity {
      width: 100%;
      padding: tr(20px);
      border-bottom: 1px solid #eee;
      font-size: tr(26px);
      box-sizing: border-box;
    }
  }
}
</style>

