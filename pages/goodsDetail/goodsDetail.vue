<template>
  <div id="pageDetail" ref='container'>
    <div class="content">
      <div class="bgheader">
        <div class="bgHeader1 fx-space-between">
          <div @click="backgo" class="m1" ref='goback'><img src="../../assets/images/back.png" alt=""></div>
          <div class="m2" ref='joincar'><img src="../../assets/images/shopcar.png" @click="goGoodsCarList"></div>
        </div>
      </div>

      <div class="scroler">
        <van-swipe class="imgbox">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <img :src="image" />
            <span class="imgNum">
              {{index+1}}/{{imagesLength}}
            </span>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="price">
        <div class="pricecolor">
          <span>￥</span>
          <span>{{orderInfo.price}}</span>
        </div>
      </div>
      <div class="quality">
        <span>{{orderInfo.sellPoint}}</span>
      </div>
      <div class="shopInfo">
        <span>{{orderInfo.title}}</span>
      </div>
      <div class="diliver fx-justify-start">
      </div>
      <div class="serve">
        <p>
          <span>服务</span>
          <span>正品保证 · 急速退款（暂不支持退换货）</span>
        </p>
        <div>
          <span>选择</span>
          <span @click='colorsBounced'>颜色分类</span>
        </div>
      </div>
      <!-- <div class="con"></div> -->
      <!-- 商品详情 -->
      <div class='footer'>
        <div class='detailsImg'>
          <div class="circle"></div>
          <span class='black'>商品详情</span>
          <!-- 要渲染的数据 -->
          <div v-for='(item,index) in imgList' :key='index'>
            <img :src="item" alt="" class='imgList'>
          </div>
        </div>
      </div>
    </div>
    <div class="shopgo ">
      <div class="go fx-justify-start">
        <div class="p3 fx-justify-start">
          <span @click='selectShow'>加入购物车</span>
          <span @click="pay">立即购买</span>
        </div>
      </div>
    </div>
    <!-- 颜色分类弹出框 -->

    <van-popup v-model="show" position="bottom" :overlay="true" :lazy-render='true' :overlay-style="overlayStyle">
      <div class='classification'>
        <img :src="images[0]" alt="" class='addressImg'>
        <span v-if='endPrice'>￥{{endPrice}}</span>
        <span v-else-if='!endPrice'>￥{{scopePrice.minPrice==scopePrice.maxPrice?scopePrice.minPrice:scopePrice.minPrice+'-'+scopePrice.maxPrice}}</span>
        <img src="~@/assets/images/close.png" alt="" @click='selectHade'>
        <p>
          <span>配送区域</span>
          <span>(配送地址会影响，请正确选择)</span>
        </p>
        <p>
          <img src="~@/assets/images/address.png" alt="">
          <span @click='locateAddress'>{{defaultAddress.province}} {{defaultAddress.city}} {{defaultAddress.county}} {{defaultAddress.addressdetaill}}</span>
        </p>
        <div class='touch'>
          <div class='touchHeight'>
            <div class='circulation' v-for='(firstChild,index) in selectClassify' :key='index'>
              <li-radio :activeItem="selectData['reserve1']" :attr="firstChild.reserve1" :label="firstChild.name" :values="firstChild.itemTypePropertyList" @radioChange="radioChange"></li-radio>
            </div>
          </div>
        </div>
        <p class='buyNum'>购买数量</p>
        <div class='selectNum'>
          <van-stepper v-model="value" integer :min="1 " :max="40 " :step="1 " />
        </div>
        <button @click='shoppingCart' v-if='isCarShow'>确 定</button>
        <button @click='nowBuy' v-if='isBuyShow'>购 买</button>
        <!-- 点击颜色分类出现在加入购物车以及立即购买 -->
        <div class='carBuy' v-if='isShow'>
          <span @click='shoppingCart'>加入购物车</span>
          <span @click='nowBuy'>立即购买</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import api from "~/api";
import { Toast } from "vant";
import LiRadio from "~/components/LiRadio";
export default {
  data() {
    return {
      overlayStyle: {
        backgroundColor: "rgba(0,0,0,.3)"
      },
      show: false,
      images: [],
      dataList: [],
      imagesLength: "",
      orderInfo: {
        itemId: 0,
        num: 0,
        price: 0,
        typeId: null,
        id: null,
        price: null,
        title: "",
        sellPoint: "",
        yhtype: ""
      },
      params: {},
      //渲染图片
      imgList: [],
      carList: {},
      /* 选择商品数量 */
      value: 1,
      /* 弹出框的数据 */
      selectClassify: [], //颜色分类以及颜色分类下面的数据包括尺码，组合
      scopePrice: {
        minPrice: null,
        maxPrice: null
      }, //弹出框中的价格范围
      popImage: "", //弹出框中的图片
      defaultAddress: {}, //默认收货地址
      whetherTheHigh: "", //点击高亮的同时选择所选中的值
      colorValue: "", //点击传入所选择的值
      sizeValue: "",
      typeValue: "",
      itemTypeId: null, //选中商品后使用这个id来查询价格
      selectPrice: null, //选中后的价格
      selectData: {}, // 选中的值存在一个对象中
      count: null, //弹出框中分类的数量
      endPrice: null, //最后的价格
      isShow: false, //点击颜色分类让弹框的购物车跟购买显示
      isCarShow: false, //点击购物车让弹框的确定显示
      isBuyShow: false, //点击购买让弹框的购买显示
      tbPropertyId: null //选中所有属性后对应的价格
    };
  },
  components: {
    "li-radio": LiRadio
  },
  methods: {
    //将弹框中请求的api封装成函数
    initList() {
      //弹出框中的数据api
      api
        .pooledData(this.orderInfo.id,this.orderInfo.typeId)
        .then(res => {
          if(res.data!=null) {
            this.selectClassify=res.data.list;
            this.count=res.data.count;
          }
        });
      //默认收货地址渲染
      api.getOrDefaultAdress().then(res => {
        if(res.data!==null) {
          this.defaultAddress=res.data;
        }
      });
      //弹出框中价格接口
      api.getPrice(this.orderInfo.id).then(res => {
        this.scopePrice.minPrice=res.data.minprice;
        this.scopePrice.maxPrice=res.data.maxprice;
      });
    },
    //点击颜色分类让弹框显示
    colorsBounced() {
      this.show=true;
      this.isShow=true;
      this.initList();
    },
    //点击加入购物车让弹框显示
    selectShow() {
      this.show=true;
      this.isCarShow=true;
      this.initList();
    },
    //通过封装的组件来得到点击的值
    radioChange(key,value,index) {
      this.selectData[key]=value;
      //传入所选中的值
      api
        .joinShopCar({
          itemId: this.orderInfo.id,
          ...this.selectData
        })
        .then(res => {
          // this.propertyId=res.data.data[0].tbPropertyId;
          //这个判断是为了防止用户直接从第二个点击报错
          if(res.data.data!==null) {
            //这个this.tbPropertyId就是想要的价格，将其传给价格api就行了
            this.tbPropertyId=res.data.data[0].tbPropertyId;
            //将选中商品后显示对应的价格所需的参数传给下面这个api
            api
              .selectCommodityPrice(this.tbPropertyId)
              .then(res => {
                this.endPrice=res.data.price;
              });
          }
        });
    },
    selectHade() {
      this.show=false;
      this.isShow=false;
      this.isCarShow=false;
      this.isBuyShow=false;
    },
    //加入购物车中的确定
    shoppingCart() {
      let keys=Object.keys(this.selectData);
      if(keys.length<this.selectClassify.length) {
        Toast("请选中商品类型");
      } else {
        var params={
          num: this.value,
          itemid: this.$route.query.shopId,
          propertyId: this.propertyId||19
        };
        api.addGoodsCar(params).then(res => {
          if(res.code==200) {
            this.show=false;
            this.isCarShow=false
            Toast.success({
              mask: false,
              message: "加入购物车成功",
              duration: 800
            });
          }
        });
      }
    },
    //立即购买的确定
    nowBuy() {
      let keys=Object.keys(this.selectData);
      if(keys.length<this.selectClassify.length) {
        Toast("请选中商品类型");
        return;
      }
      var orderBody={
        itemId: this.params.itemid,
        num: this.value,
        price: this.endPrice||this.scopePrice.minPrice,
        propertyId: this.propertyId||19
      };

      var params={
        shopId: this.orderInfo.shopId,
        payment: this.endPrice*this.value,
        status: 0,
        orderItems: [orderBody]
      };
      var untils={
        price: (this.endPrice||this.scopePrice.minPrice)*this.value,
        cartOrderInfo: [params],
      }
      api.createShopOrder(untils).then(res => {
        //保存订单ID (商品结算页需要根据订单ID来查询)
        if(res.code==200&&res.data) {
          this.$store.state.orderItems=[];
          this.$router.push({ path: "/pay/pay",query: { orderId: res.data } });
        } else {
          this.$dialog
            .alert({
              title: "提示",
              message: '请添加收货地址'
            })
            .then(() => {
              this.$router.push({
                path: "/addr/addAdress",
                query: { shopId: this.$route.query.shopId }
              });
            });
        }
      });
    },
    backgo() {
      this.$router.go(-1);
    },
    //点击跳转到收货地址
    locateAddress() {
      this.$router.push({ path: "/addr/manageAddress",query: { shopId: this.$route.query.shopId } });
    },
    //购买商品
    pay() {
      this.show=true;
      this.isBuyShow=true;
      // this.isShow=false;
      this.initList();
    },
    //去购物车页面
    goGoodsCarList() {
      this.$router.push({ path: "/goodsCar/goodsCar" });
    }
  },
  mounted() {
    api.getProductDetail(this.$route.query.shopId).then(res => {
      this.dataList=res.data;
      this.images=this.dataList.item.image.split(",");
      this.imagesLength=this.images.length;
      this.orderInfo={
        itemId: res.data.tbItemProperty.id,
        num: 1,
        price: res.data.tbItemProperty.price,
        typeId: res.data.item.typeId,
        id: res.data.item.id,
        price: res.data.tbItemProperty.price,
        title: res.data.item.title,
        sellPoint: res.data.item.sellPoint,
        shopId: res.data.item.shopId,
        yhtype: res.data.tbItemProperty.yhtype
      };
      this.params={
        itemid: res.data.tbItemProperty.itemId,
        num: 1
      };
    });
    //渲染商品下面的图片
    api.applyImg(this.$route.query.shopId).then(res => {
      this.imgList=res.data.itemDesc;
      var strImg=this.imgList.split("-");
      this.imgList=strImg;
    });
    this.$refs.goback.style.paddingTop=localStorage.getItem("statusBarHeight")+'px'
    this.$refs.joincar.style.paddingTop=localStorage.getItem("statusBarHeight")+'px'
  }
};
</script>
<style lang="scss" scoped>
// body {
//   // height: 100%;
//   // overflow: hidden;
// }
@import "~@/assets/style/px-to-rem";

#pageDetail {
  overflow: auto; /* 用于 android4+，或其他设备 */
  -webkit-overflow-scrolling: touch; /* 用于 ios5+ */
  background-color: #ccc !important;
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    background: #fff;
    overflow-x: hidden;
    .bgheader {
      width: 100%;
      .bgHeader1 {
        color: #fff;
        padding: 0 tr(20px);
        font-size: 22px;
        position: fixed;
        top: tr(25px);
        z-index: 55;
        .m1 {
          img {
            width: tr(68px);
            height: tr(68px);
            position: fixed;
            left: tr(25px);
          }
        }
        .m2 {
          img {
            width: tr(68px);
            height: tr(68px);
            position: fixed;
            right: tr(25px);
          }
        }
      }
    }
    .scroler {
      width: 100%;
      position: relative;
      .imgbox {
        width: 100%;
        // width: tr(750px);
        // height: tr(750px);
        img {
          width: 100%;
          height: 100%;
        }
        span {
          display: block;
          width: tr(80px);
          height: tr(44px);
          line-height: tr(44px);
          text-align: center;
          border-radius: tr(20px);
          z-index: 1;
          position: absolute;
          bottom: tr(30px);
          right: tr(30px);
          background: rgba(0, 0, 0, 0.5019607843137255);
          color: #fff;
        }
      }
    }
    .price {
      background: #fff;
      padding-left: tr(15px);
      padding-top: tr(15px);
      .pricecolor {
        display: inline;
        font-weight: bold;
        span {
          color: rgba(131, 70, 253, 1);
          font-size: tr(30px);
        }
      }
      .p1 {
        text-decoration: line-through;
      }
      .p2 {
        margin-left: tr(50px);
        img {
          width: tr(34px);
          height: tr(34px);
        }
      }
      .p3 {
        margin: 0 tr(10px);
      }
      .p4 {
        img {
          width: tr(34px);
          height: tr(34px);
          margin-right: tr(10px);
        }
      }
    }
    .shopInfo {
      width: tr(550px);
      height: tr(80px);
      line-height: tr(45px);
      padding-left: tr(15px);
      padding-top: tr(20px);
      color: #1a1a1a;
      font-size: tr(30px);
      font-weight: bolder;
      font-weight: PingFangSC-Regular;
    }
    .quality {
      padding-left: tr(15px);
      padding-top: tr(15px);
      color: #999;
      font-size: tr(24px);
      .p1 {
        width: tr(32px);
        height: tr(32px);
        border-radius: tr(16px);
        color: blue;
        border: 1px solid blue;
        margin-right: tr(9px);
      }
      .p3 {
        width: tr(32px);
        height: tr(32px);
        border-radius: tr(16px);
        color: blue;
        border: 1px solid blue;
        margin-left: tr(31px);
        margin-right: tr(9px);
      }
    }
    .diliver {
      color: #999;
      padding-left: tr(21px);
      padding-bottom: tr(10px);
      margin-top: tr(40px);
      border-bottom: tr(20px) solid rgb(240, 240, 240);
      span:nth-child(2) {
        margin-left: tr(190px);
        margin-right: tr(206px);
        font-size: tr(24px);
      }
    }
    .shopInformation {
      width: 100%;
      height: tr(151px);
      background-color: #fff;
      padding: tr(17px) 0 0 tr(15px);
    }
    .serve {
      margin-top: tr(10px);
      width: 100%;
      height: tr(160px);
      background-color: #fff;
      > p {
        > span:first-child {
          color: rgba(153, 153, 153, 1);
          font-size: tr(24px);
          margin-left: tr(30px);
          margin-top: tr(25px);
          display: inline-block;
        }
        > span:last-child {
          color: rgba(102, 102, 102, 1);
          font-size: tr(24px);
          margin-left: tr(31px);
        }
      }
      > div {
        > span:first-child {
          color: rgba(153, 153, 153, 1);
          font-size: tr(24px);
          margin-left: tr(30px);
          margin-top: tr(40px);
          display: inline-block;
        }
        > span:last-child {
          color: rgba(102, 102, 102, 1);
          font-size: tr(24px);
          margin-left: tr(31px);
        }
      }
    }

    .con {
      width: 100%;
      height: 100px;
    }
  }

  .shopgo {
    border-top: 1px solid #ededed;
    // margin-top: 0;
    height: tr(98px);
    background: #fff;
    z-index: 88;
    position: fixed;
    bottom: 0;
    width: 100%;
    .go {
      width: 100%;
      padding: tr(6px) 0;
      .p1 {
        width: tr(137px);
        padding-top: tr(15px);
        .icon1 {
          display: block;
          text-align: center;
          font-size: tr(40px);
        }
        .icon2 {
          display: block;
          text-align: center;
        }
      }
      .p2 {
        padding-top: tr(15px);
        width: tr(137px);
        .icon1 {
          display: block;
          text-align: center;
          font-size: tr(40px);
        }
        .icon2 {
          display: block;
          text-align: center;
        }
      }
      .p3 {
        width: tr(446px);
        height: tr(82px);
        font-size: tr(32px);
        line-height: tr(82px);
        color: #fff;
        margin-left: tr(260px);
        span:nth-child(1) {
          flex: 1;
          text-align: center;
          border-radius: tr(40px) 0 0 tr(40px);
          background: linear-gradient(
            270deg,
            rgb(157, 16, 255),
            rgb(95, 16, 255)
          );
        }
        span:nth-child(2) {
          flex: 1;
          text-align: center;
          border-radius: 0 tr(40px) tr(40px) 0;
          background: linear-gradient(
            270deg,
            rgb(245, 61, 147),
            rgb(192, 59, 247)
          );
        }
      }
    }
  }
}
.texture {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 70px;
  color: #ccc;
  font-size: 14px;
}
.share {
  width: tr(47px);
  height: tr(46px);
  position: absolute;
  right: tr(70px);
  bottom: tr(380px);
}
.footer {
  width: 100%;
  margin-bottom: 0;
  overflow: hidden;
  background-color: #eee;
  .detailsImg {
    margin-top: tr(20px);
    width: 100%;
    margin-bottom: 50px;
    background-color: #fff;
    .circle {
      display: inline-block;
      width: 6.4px;
      width: 0.4rem;
      height: 9.6px;
      height: 0.6rem;
      border-radius: 0 0.46667rem 0.46667rem 0;
      background: blue;
      margin: auto 0;
      position: relative;
      top: tr(10px);
    }
    span {
      display: inline-block;
      font-size: 0.48rem;
      font-weight: bolder;
      margin-left: tr(10px);
    }
  }
}
.imgList {
  margin-top: tr(15px);
  width: 100%;
}
.lyprice {
  margin-left: tr(4px);
  color: #999;
}
.shipping,
.gray {
  color: #999;
}
.black {
  color: #000;
}
.iconRight {
  position: relative;
  right: tr(-50px) !important;
}
.fullReduction {
  position: relative;
  right: tr(-60px) !important;
}
.reduction {
  > span:first-child {
    font-size: tr(24px);
    color: #999;
    margin-left: tr(15px);
    margin-top: tr(25px);
    display: inline-block;
    // vertical-align: middle;
  }
  img {
    width: tr(53px);
    height: tr(30px);
    margin-left: tr(30px);
    vertical-align: tr(-8px);
  }
  > span:last-child {
    margin-left: tr(20px);
    font-size: tr(24px);
    color: #666;
  }
}
.givegifts {
  margin-top: tr(40px);
  margin-left: tr(93px);
  img {
    width: tr(53px);
    height: tr(30px);
  }
  span {
    margin-left: tr(15px);
    font-size: tr(24px);
    color: #666;
  }
}
.classification {
  width: 100%;
  height: tr(878px);
  // position: fixed;
  // bottom: 0;
  // z-index: 999;
  background-color: #fff;
  padding: tr(15px) tr(15px);
  box-sizing: border-box;
  overflow: hidden;
  .addressImg {
    width: tr(140px);
    height: tr(140px);
    border-radius: 5px;
  }
  > span:nth-child(2) {
    margin-left: tr(10px);
    display: inline-block;
    vertical-align: tr(-40px);
    color: #8346fd;
    font-size: tr(26px);
  }
  img:nth-child(3) {
    width: tr(40px);
    height: tr(40px);
    position: absolute;
    right: tr(24px);
    top: tr(24px);
  }
  > p:nth-child(4) {
    margin-top: tr(15px);
    span:nth-child(1) {
      color: #333;
      font-size: tr(26px);
    }
    span:nth-child(2) {
      color: #999;
      font-size: tr(22px);
      padding-left: tr(16px);
    }
  }
  > p:nth-child(5) {
    margin-top: tr(20px);
    position: relative;
    img {
      width: tr(26px);
      height: tr(26px);
      position: absolute;
      top: tr(3px);
    }
    span {
      display: inline-block;
      margin-left: tr(35px);
      font-size: tr(24px);
      color: #666;
      margin-bottom: tr(57px);
    }
  }
  .touch {
    width: 100%;
    height: tr(320px);
    // display: -webkit-box;
    // overflow-x: hidden;
    // -webkit-overflow-scrolling: touch;
    .touchHeight {
      overflow-y: scroll;
      width: 110%;
      height: 100%;
    }
  }
  .buyNum {
    color: #333;
    font-size: tr(26px);
    margin-top: tr(41px);
    display: inline-block;
  }
  .selectNum {
    float: right;
    margin-top: tr(32px);
  }
  button {
    width: 100%;
    height: tr(76px);
    margin-top: tr(50px);
    background: -webkit-linear-gradient(
      left,
      #8346fd,
      #9c47fc
    ); /* Safari 5.1 - 6.0 */
    border-radius: tr(35px);
    font-size: tr(30px);
    color: #fff;
  }
  .carBuy {
    width: 100%;
    height: tr(76px);
    margin-top: tr(50px);
    font-size: tr(30px);
    span {
      width: 50%;
      height: 100%;
      float: left;
      text-align: center;
      line-height: tr(76px);
      color: #fff;
      font-size: tr(30px);
      &:first-child {
        border-radius: tr(40px) 0 0 tr(40px);
        background: linear-gradient(
          270deg,
          rgb(157, 16, 255),
          rgb(95, 16, 255)
        );
      }
      &:last-child {
        border-radius: 0 tr(40px) tr(40px) 0;
        background: linear-gradient(
          270deg,
          rgb(245, 61, 147),
          rgb(192, 59, 247)
        );
      }
    }
  }
}
#allmap {
  width: 300px;
  height: 300px;
}
.selectColor {
  color: #e92322 !important;
}
</style>
