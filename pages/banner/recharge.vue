<template>
    <div class="recharge" v-if="isshow">
         <Headertitle :title='faTitle'></Headertitle>
       <div class="bg_img">
          <img src="../../assets/top/recharge.png" alt="">
        </div>
        <div class="content_box fx-column-align-center">
          <div class="recharge_box">
              <div class="recharge_toplist">
                  <img class="toplist_img" src="../../assets/top/toplist_img.png" alt="">
                  <div class="order" v-for="(item,index) in data.slice(0,3)" :key='index'>
                        <!-- 头像框 -->
                        <img class="order_firstimg" v-if="index == 0" src="../../assets/top/order0.png" alt="">
                        <img class="order_secondimg" v-if="index == 1" src="../../assets/top/order1.png" alt="">
                        <img class="order_thirdimg" v-if="index == 2" src="../../assets/top/order2.png" alt="">
                        <!--头像 -->
                        <div class="avatar_box">
                          <img class="avatar_photo" :src="item.smallpic" alt="">
                        </div>
                        <!-- 信息 -->
                        <p class="order_name">{{item.myname}}</p>
                        <p class="order_num"><span>{{item.rechargeFee}}</span>&nbsp;贡献值</p>
                  </div>
              </div>
          </div>
         <div class="order_box flex1">
            <div class="order_content">
              <div class="order_content_title">
                <p class="title1">排名</p>
                <p class="title2">头像</p>
                <p class="title3">昵称</p>
                <p class="title4">&nbsp;贡献值</p>
              </div>
              <ul class="order_list">
                <li class="order_list_li" v-for="(item,value) in data.slice(3)" :key='value'>
                  <div class="person_order">
                      <span>{{value+1}}</span>
                  </div>
                  <div class="person_avatar">
                    <img :src="item.smallpic" alt="">
                  </div>
                  <div class="person_name">
                    {{item.myname}}
                  </div>
                  <div class="person_grade">
                      {{item.rechargeFee}}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
     <div v-else class="nodata">
      <div class="img_box">
          <img src="../../assets/top/empty.png" alt="">
          <p>暂无数据...</p>
      </div>
    </div>
</template>

<script>
import api from "~/api";
import Headertitle from '~/components/header/title.vue'
export default {
      components: {
        Headertitle
    },
    head() {
    return {
      title: '充值榜单'
    };
  },
  data() {
    return {
        faTitle:'充值榜单',
      // 页面无数据 默认无数据
      isshow: false,
      data: []
    };
  },
  mounted() {
    api
      .getRechargeData()
      .then(res => {
        if (res.data.rankList.length > 0) {
          this.data = res.data.rankList;
          this.isshow = true;
        } else {
          this.isshow = false;
        }
      })
      .catch(err => {});
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.recharge {
  width: 100%;
  height: 100%;
  background-color: #480495;
  position: relative;
  .bg_img {
    width: 100%;
    height: tr(430px);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content_box {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    padding-top: tr(294px);
    .recharge_box {
      width: 100%;
      padding: 0 tr(20px) 0 tr(20px);
      position: relative;
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flexbox;
      display: flex;
      justify-content: center;
      .recharge_toplist {
        width: 100%;
        height: tr(365px);
        position: relative;
        .toplist_img {
          width: 100%;
          height: 100%;
        }
        .order {
          text-align: center;
          .order_name {
            color: #8346fd;
            font-size: tr(28px);
            margin-top: tr(18px);
            overflow: hidden; /*自动隐藏文字*/
            text-overflow: ellipsis; /*文字隐藏后添加省略号*/
            white-space: nowrap; /*强制不换行*/
          }
          .order_num {
            color: #000;
            font-size: tr(24px);
            line-height: tr(28px);
            margin-top: tr(16px);
            overflow: hidden; /*自动隐藏文字*/
            text-overflow: ellipsis; /*文字隐藏后添加省略号*/
            white-space: nowrap; /*强制不换行*/
            span {
              color: #8346fd;
            }
          }
        }
        .order:nth-of-type(1) {
          width: 33.3%;
          height: 100%;
          position: absolute;
          text-align: center;
          top: 0;
          left: 33.3%;
          img {
            width: tr(200px);
            height: tr(190px);
            margin-top: tr(34px);
          }
          .avatar_box {
            position: absolute;
            width: tr(123px);
            height: tr(122px);
            top: 17%;
            left: 24.5%;
            overflow: hidden;
            .avatar_photo {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              margin-top: 0;
              position: relative;
              bottom: tr(-5px);
            }
          }
        }
        .order:nth-of-type(2) {
          width: 33%;
          height: 90%;
          position: absolute;
          text-align: center;
          bottom: 0;
          left: 0;
          img {
            width: tr(180px);
            height: tr(170px);
            margin-top: tr(30px);
          }
          .avatar_box {
            position: absolute;
            width: tr(112px);
            height: tr(110px);
            top: 16.2%;
            left: 26.5%;
            overflow: hidden;
            .avatar_photo {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              margin-top: 0;
              position: relative;
              bottom: tr(-5px);
            }
          }
        }
        .order:nth-of-type(3) {
          width: 33%;
          height: 90%;
          position: absolute;
          text-align: center;
          bottom: 0;
          right: 0;
          img {
            width: tr(180px);
            height: tr(170px);
            margin-top: tr(30px);
          }
          .avatar_box {
            position: absolute;
            width: tr(112px);
            height: tr(110px);
            top: 16.2%;
            left: 26.5%;
            overflow: hidden;
            .avatar_photo {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              margin-top: 0;
              position: relative;
              bottom: tr(-5px);
            }
          }
        }
      }
    }
    .order_box {
      width: 100%;
      padding: tr(20px) tr(20px) tr(20px) tr(20px);
      position: relative;
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flexbox;
      display: flex;
      justify-content: center;
      .order_content {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: tr(16px);
        padding: tr(30px) tr(30px) tr(20px) tr(30px);
        overflow: hidden;
        overflow-y: auto;
        //滑动效果
        -webkit-overflow-scrolling: touch;
        .order_content_title {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          p {
            color: #8346fd;
            font-size: tr(28px);
          }
          .title1 {
            width: 14%;
          }
          .title2 {
            width: 22%;
            text-align: center;
          }
          .title3 {
            text-align: center;
            width: 36%;
          }
          .title4 {
            text-align: center;
            width: 28%;
          }
        }
        .order_list {
          width: 100%;
          border-radius: tr(16px);
          background-color: #fff;
          li {
            height: tr(130px);
            border-bottom: 1px solid #ededed;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .person_order {
              width: 14%;
              img {
                width: tr(42px);
                height: tr(62px);
              }
              span {
                color: #8346fd;
                text-align: center;
                width: tr(42px);
                display: inline-block;
                height: tr(62px);
                line-height: tr(62px);
                font-size: tr(32px);
              }
            }
            .person_avatar {
              width: 22%;
              text-align: center;
              img {
                width: tr(100px);
                height: tr(100px);
                border-radius: 50%;
              }
            }
            .person_name {
              width: 36%;
              text-align: center;
              color: #8346fd;
              font-size: tr(28px);
              overflow: hidden; /*自动隐藏文字*/
              text-overflow: ellipsis; /*文字隐藏后添加省略号*/
              white-space: nowrap; /*强制不换行*/
            }
            .person_grade {
              width: 28%;
              text-align: center;
              color: #8346fd;
              font-size: tr(28px);
            }
          }
        }
      }
    }
  }
}

// 无数据css
.nodata {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  text-align: center;
  .img_box {
    img {
      margin-top: tr(407px);
      width: tr(210px);
      height: tr(170px);
    }
    p {
      color: #999999;
      font-size: tr(24px);
      margin-top: tr(66px);
    }
  }
}
</style>