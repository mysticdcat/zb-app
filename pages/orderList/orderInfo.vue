<template>
    <div class="orderList" v-if="show">
         <Headertitle :title='faTitle'></Headertitle>
        <div class="content">
          <div class="address">
          <h3>收货地址</h3>
            <p>
              <span><span>{{orderData.TbShoppingAddress.name}}</span></span>
              <span>{{orderData.TbShoppingAddress.tel}}</span>
            </p>
            <p><span>{{orderData.TbShoppingAddress.country}}{{orderData.TbShoppingAddress.province}}{{orderData.TbShoppingAddress.city}}{{orderData.TbShoppingAddress.county}}{{orderData.TbShoppingAddress.addressdetaill}}</span></p>
        </div>
            <div class="card">
                <div id="shopItem">
                    <p @click="goShop(orderData.OrderShopInfo.shopId)"><img src="../../assets/carImage/shopLogo.png" alt=""><span>{{orderData.OrderShopInfo.shopName}}</span></p>
                  <div id="goodsItem" v-for="(third,value) in orderData.OrderShopInfo.orderItems" :key="value">
                
                    <div class="goodImg">
                    <img :src="third.picPath[0]" alt="">
                    </div>
                    <div class="info">
                       <p class="name" @click="goInfo(third.itemId)">  {{third.name}}</p>
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
                <div class="freight">
                  <span>运费</span>
                  <span>￥ {{orderData.OrderShopInfo.postFee}}</span>
                 </div>
                 <!-- <div class="freight">
                  <span>已生效优惠</span>
                  <span>{{'满一百减三十；积分已抵扣八元'}}</span>
                 </div> -->
                 <div class="freight">
                  <span>订单编号</span>
                  <span>{{orderData.OrderShopInfo.billNos}}</span>
                 </div>
                 <div class="freight">
                  <span>下单时间</span>
                  <span>{{orderData.time}}</span>
                 </div>
                 <div class="freight">
                  <span>订单总价</span>
                  <span>{{orderData.OrderShopInfo.payment}}</span>
                 </div>
                 <div class="freight allPrice">
                  <span>实付款</span>
                  <span>￥ {{orderData.OrderShopInfo.payment}}</span>
                 </div>
              </div>
                 
            </div>
        </div>
         <div class="face" v-if="!orderData.OrderShopInfo.status"> 
          <button>确认收货</button>
          <button>查看物流</button>
        </div>
         <!-- <div class="face" v-if="!orderData.status"> 
          <button>继续付款</button>
        </div> -->
    </div>
</template>
<script>
import api from "../../api/index";
import Headertitle from '~/components/header/title.vue'
export default {
    components: {
        Headertitle
    },
    head() {
    return {
      title: '订单详情'
    };
  },
  data() {
    return {
         faTitle:'订单详情',
      orderData: {},
      //状态码
      status: ["待付款", "已付款", "未发货", "已发货", "交易成功", "交易关闭"],
      allOrderNum: 0,
      show: false
      //默认获取全部订单所有参数
    };
  },
  methods: {
    //去商家页面
    goShop(id) {
      this.$router.push({
        path: "/shopDetail/shopDetail",
        query: { shopId: id }
      });
    },
    //返回上一级
    backgo() {
      this.$router.go(-1);
    },
    //点击去商品详情
    goInfo(id) {
      this.$router.push({
        path: "/goodsDetail/goodsDetail",
        query: { shopId: id  }
      });
    },
    goPay(orderId) {
      this.$router.push({ path: "/pay/pay", query: { orderId: orderId  } });
    },
    //获取订单详情
    getData() {
      var params = this.$route.query.orderShopid;
      api.getOrderInfo(params).then(res => {
        this.orderData = res.data;
        this.orderData.OrderShopInfo.orderItems.forEach(item => {
          item.picPath = item.picPath.split(",");
        });
        this.show = true;
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.orderList {
    font-size: tr(24px);
  .face {
    width: 100%;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    right: 0;
    height: tr(80px);
    line-height: tr(80px);
    padding-left: tr(20px);
    // border-top: 1px solid #eee;
    button {
      border: none;
      width: tr(186px);
      height: tr(58px);
      line-height: tr(29px);
      text-align: center;
      background-color: #fff;
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
  .allPrice {
    color: #000 !important;
    font-size: tr(28px);
    font-weight: 700;
    span:nth-child(2) {
      color: #9647fd;
    }
  }
  .empty {
    background-color: #fff;
    height: 667px;
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
      background: linear-gradient(270deg, rgb(233, 68, 180), rgb(79, 72, 179));
      color: #fff;
      border-radius: tr(40px);
      font-size: tr(32px) !important;
    }
    p {
      text-align: center;
      display: block;
      height: 50px;
      line-height: 50px;
    }
  }
  .address {
    padding: 20px;
    margin: tr(20px) 0;
    background-color: #fff;
    border-radius: 10px;
    p {
      font-family: "PingFang-SC-Regular";
      // color: rgb(102, 102, 102) !important;
      font-size: tr(28px);
      padding: 5px 0;
      > span:nth-child(1) {
        //   width: tr(120px);
        display: inline-block;
        margin-right: 20px;
        vertical-align: middle;
        span {
          float: right;
        }
      }
    }
    p:nth-child(3) {
      color: rgb(103, 103, 103);
      span {
        text-align: center;
        border-radius: 30px;
        display: inline-block;
        // background-color: #8346fd;
        // color: #fff;
      }
    }
  }
  background-color: #f7f7f7;

  .content {
    // padding-bottom: tr(80px);
    width: 100%;

    .freight {
      line-height: tr(80px);
      height: tr(80px);
      color: #999;
      padding: 0 10px;
      span:nth-child(1) {
        float: left;
      }
      span:nth-child(2) {
        float: right;
      }
    }
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
          height: tr(210px);
          position: relative;
          margin-bottom: tr(30px);
          border-bottom: 1px solid #eee;
          padding-bottom: tr(20px);
        }
        .add {
          font-size: 14px;
          font-weight: floor($number: 300);

          font-family: "PingFang-SC-Medium";
          color: #333333;
          padding-left: tr(20px);
          span {
            padding-right: tr(30px);
          }
        }
        > p {
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
            font-size: 12px;
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
          font-size: 18px;
          font-weight: bolder;
        }
        .count {
          float: right;
          color: #ccc;
        }
      }
    }
  }
}
</style>


