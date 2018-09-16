<template>
    <div class="shopmap">
        <div id="container" ref="container">
        </div>
        <!-- 返回 -->
        <div class="topBack" @click="back">
            <i class="icon iconfont icon-back-copy"></i>
        </div>
        <!-- 定位按钮 -->
        <div class="position_img"  :class="{'active': poasShow ===true}"  @click="getpos" ref="position"></div>
        <!-- 信息框 -->
        <footer class="shop_info">
            <div class="shop_word">
              <p>{{shopname}}</p>
              <p>{{shopway}}</p>
            </div>
            <div class="shop_way">
              <div class="green_bg" @click="showWay">
                <div class="white_bg">
                  <span class="icon_road"><i class="iconfont icon-luxian"></i></span>
                </div>
              </div>
            </div>
        </footer>
        <van-popup v-model="show" position="bottom">
            <div class="select_box">
              <p @click=" getline">显示路线</p>
              <p @click="goGaoDe">高德地图</p>
              <p @click="close">取消</p>
            </div>
        </van-popup>
    </div>
</template>

<script>
import api from "~/api";
import { MP } from "~/assets/js/amap.js";
import { Toast, Popup } from "vant";

export default {
  data() {
    return {
      poasShow: false, //定位点击阴影
      map: null,
      geo: null,
      marker1: null,
      zoom: 14, //地图级别(显示范围)
      position: [], //商家位置
      ownpos: [], //个人位置
      shopname: "金鼎轩/南北点心专门店",
      shopway: "西湖区余杭塘路西溪银泰四号楼211(迪卡侬正门对面，华为手机楼上)",
      show: false
    };
  },
  methods: {
    getpos() {
      this.poasShow = true;
      setTimeout(() => {
        this.poasShow = false;
      }, 200);
      this.getownpos();
    },
    // 定位显示到自己的位置
    getownpos() {
      let geo = this.geo;
      let mapObj = this.map;
      geo.getCurrentPosition();
      AMap.event.addListener(geo, "complete", result => {
        mapObj.panTo(result.position);
        mapObj.setZoomAndCenter(16, result.position);
      });
      AMap.event.addListener(geo, "error", result => {
      });
    },
    // 规划路线
    getline() {
      let mapObj = this.map;
      let startLngLat = this.ownpos;
      let endLngLat = this.position;
      const that = this;
      mapObj.plugin("AMap.Driving", function() {
        var driving = new AMap.Driving({
          map: mapObj,
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          policy: AMap.DrivingPolicy.LEAST_TIME,
          hideMarkers: true
        });
        driving.search(startLngLat, endLngLat, function(status, result) {
          // 未出错时，result即是对应的路线规划方案
          that.show = false;
        });
      });
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 地图选择
    showWay() {
      this.show = true;
    },
    // 点击取消(关闭)
    close() {
      this.show = false;
    },
    //打开高德地图app
    goGaoDe() {
      var marker = new AMap.Marker({
        position: this.position
      });
      marker.markOnAMAP({
        position: marker.getPosition(),
        name: this.shopname //name属性在移动端有效
      });
    }
  },
  beforeCreate() {
    let lng = this.$route.query.lng;
    let lat = this.$route.query.lat;
    // 获取店家经纬度(定位店家的位置)
    // let lng = 121.07407659739079;
    // let lat = 30.293483522481587;
    var that = this;
    MP()
      .then(function() {
        var mapObj = new AMap.Map("container", {
          resizeEnable: true,
          zooms: [4, 18],
          viewMode: "2D",
          animateEnable: true
        });
        // 地图实例化对象赋给全局(点击定位使用)
        that.map = mapObj;
        mapObj.plugin(["AMap.Geolocation", "AMap.Scale"], function() {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认：true
            timeout: 10000, // 设置定位超时时间，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            showButton: true, //显示定位按钮，默认：true
            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
            zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false,
            buttonDom: that.$refs.position,
            buttonPosition: "RB", //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 102), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            panToLocation: false, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          mapObj.addControl(geolocation);
          // geolocation对象赋给全局(点击定位使用)
          that.geo = geolocation;
          var scale = new AMap.Scale();
          mapObj.addControl(scale);
          //添加marker 展示商家位置
          var marker1 = new AMap.Marker({
            position: new AMap.LngLat(lng, lat) // 经纬度对象，如 new AMap.LngLat(116.39, 39.9); 也可以是经纬度构成的一维数组[116.39, 39.9]
          });
          mapObj.add(marker1);
          // marker1对象赋给全局(点击定位使用)
          that.marker1 = marker1;
          // 设置缩放级别和中心点
          mapObj.setZoomAndCenter(that.zoom, [lng, lat]);
          // 个人位置定位
          geolocation.getCurrentPosition();
          // 监听定位成功/失败的回调
          // 实例化地图并获取个人位置
          AMap.event.addListener(geolocation, "complete", result => {
            let mypos = { p: [result.position.lng, result.position.lat] };
            that.ownpos = mypos.p;
            // 继续展示商家位置
            mapObj.setZoomAndCenter(that.zoom, [lng, lat]);
          });
          AMap.event.addListener(geolocation, "error", result => {
          });
        });
      })
      .catch(err => {
        // 地图加载失败返回到上级(未加载toast)
        this.$router.go(-1);
      });
  },
  mounted() {

    let lng = this.$route.query.lng;
    let lat = this.$route.query.lat;

    // let lng = 120.07407659739079;
    // let lat = 30.293483522481587;
    if (lng && lat) {
      let shoppos = { p: [lng, lat] };
      this.position = shoppos.p;
    } else {
      // 提示 (未获取到商家位置)
      Toast({
        mask: false,
        message: "未获取到商家位置",
        duration: 800
      });
      // 为获取到商家位置返回到上级
      // this.$router.go(-1);
    }
  }
};
</script>
<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
.shopmap {
  width: 100%;
  height: 100%;
  #container {
    width: 100%;
    height: 100%;
  }
  .position_img {
    width: tr(100px);
    height: tr(100px);
    z-index: 200;
    background-image: url(~/assets/payimg/pos.png);
    background-size: 100% 100%;
  }
  .position_img.active {
    background-image: url(~/assets/payimg/posa.png);
  }
  .topBack {
    width: tr(60px);
    height: tr(60px);
    border-radius: 4px;
    line-height: tr(60px);
    text-align: center;
    position: fixed;
    top: tr(25px);
    left: tr(25px);
    background-color: rgba(0, 0, 0, 0.4);
    i {
      font-size: tr(50px);
      color: #fff;
    }
  }
  .shop_info {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: tr(170px);
    background-color: #ffffff;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    padding: tr(20px) tr(20px);
    .shop_word {
      width: 78%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p:nth-of-type(1) {
        width: 100%;
        overflow: hidden;
        font-size: tr(40px);
        line-height: tr(40px);
        overflow: hidden; /*自动隐藏文字*/
        text-overflow: ellipsis; /*文字隐藏后添加省略号*/
        white-space: nowrap; /*强制不换行*/
      }
      p:nth-of-type(2) {
        font-size: tr(22px);
        line-height: tr(26px);
        margin-top: tr(10px);
        color: #999;
        word-break: break-all;
        text-overflow: ellipsis; //显示为省略号
        display: -webkit-box; //对象作为伸缩盒子模型显示
        -webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
        -webkit-line-clamp: 2; //显示行数## 标题文字 ##
        overflow: hidden;
      }
    }
    .shop_way {
      width: 22%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .green_bg {
        width: tr(102px);
        height: tr(100px);
        border-radius: 50%;
        background-color: rgb(7, 180, 2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: tr(20px);
        .white_bg {
          width: tr(36px);
          height: tr(36px);
          background-color: #fff;
          transform: rotate(45deg);
          border-radius: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon_road {
            color: rgb(7, 180, 2);
            display: inline-block;
            transform: rotate(-45deg);
            i {
              font-size: tr(40px);
              margin-left: tr(2px);
            }
          }
        }
      }
    }
  }
  .select_box {
    width: 100%;
    background-color: rgba(133, 139, 145, 0.2);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    p {
      width: 100%;
      height: tr(90px);
      font-size: tr(36px);
      line-height: tr(90px);
      text-align: center;
      background-color: #ffffff;
    }
    p:nth-of-type(1) {
      margin-bottom: tr(8px);
      border: none;
    }
    p:not(:nth-of-type(3)) {
      border-bottom: 1px solid #eee;
    }
  }
}
</style>