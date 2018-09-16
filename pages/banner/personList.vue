<template>
    <div class="personList ">
        <Headertitle :title='faTitle'></Headertitle>
        <img class="bg_img" src="../../assets/top/topbgimg.png" alt="">
          <div class="gift_box">
            <ul class="gift_content"> 
              <li>第<span>1</span>名荣获奖金<span>30000</span>元</li>
              <li>第<span>2</span>名和第<span>3</span>名获得<span>iPhone X</span>手机一部</li>
              <li>第<span>4</span>名和第<span>5</span>名获得<span>iPad</span>平板电脑一台</li>
              <li>第<span>6</span>名至第<span>10</span>名获得精美<span>YSL</span>口红一只</li>
              <li class="gift_content_bottom">*请上榜主播加宝兆平台官方运营微信：mlr19920808</li>
            </ul>
            <img src="../../assets/top/gift.png" alt="">
          </div>
          <div class="rule_box">
            <ul class="rule_content"> 
              <li>1.活动期间，榜单每10分钟更新一次，实时PK榜根据主播热度进行排名。</li>
              <li>2.主播根据收到666礼物进行排名。</li>
              <li>3.活动时间：<span>8</span>月<span>18</span>号凌晨6点到次日凌晨6点。</li>
              <li>5.结束倒计时:  <span v-if="isshow">&nbsp;{{`${hr}时${min}分${sec}秒`}}</span> <span v-else>计时已结束</span></li>
              <li class="rule_content_bottom" >*活动具体结束时间以服务器时间为准。</li>
            </ul>
            <img src="../../assets/top/rule.png" alt="">
          </div>
          
          <div class="order_box">
            <div class="order_content" >
              <div class="order_content_title">
                <p class="title1">排名</p>
                <p class="title2">头像</p>
                <p class="title3">昵称</p>
                <p class="title4">礼物数量</p>
              </div>
              <ul class="order_list">
                <li class="order_list_li" v-for="(item,value) in dataList" :key='value'>
                  <div class="person_order">
                      <img v-if="value == 0" src="../../assets/top/1.png" alt="">
                      <img v-if="value == 1" src="../../assets/top/2.png" alt="">
                      <img v-if="value == 2" src="../../assets/top/3.png" alt="">
                      <span v-if='value > 2'>{{value+1}}</span>
                  </div>
                  <div class="person_avatar">
                    <img :src="item.smallpic" alt="">
                  </div>
                  <div class="person_name">
                    {{item.myname}}
                  </div>
                  <div class="person_grade">
                      {{item.nums}}
                  </div>
                </li>
              </ul>
            </div>
             <img class="order_img" src="../../assets/top/order.png" alt="">
          </div>
        </div>
</template>
<script>
import api from "~/api";
import Headertitle from '~/components/header/title.vue'
import { Toast } from "vant";
export default {
    components: {
        Headertitle
    },
  head() {
    return {
      title: "主播榜单"
    };
  },
  data() {
    return {
         faTitle:'主播榜单',
      params: {
        type: 1,
        pageNum: 1,
        pageSize: 50,
        giftid: 394,
        total: 50
      },
      dataList: [],
      // 默认无数据 显示倒计时
      hr: 0,
      min: 0,
      sec: 0,
      data:'',
      isshow: true,
    };
  },
  methods: {
    countdown: function() {
      // 目标日期时间戳
      let time = "2018-8-19 06:00:00";
      let T = time.replace(/-/g, "/");
      const end = Date.parse(new Date(T));

      // 当前时间戳服务器时间为准
      this.data = this.data + 1000
      const now = this.data
      // 相差的毫秒数V
      const msec = end - now;
      // 计算时分秒数
      let hr = parseInt((msec / 1000 / 60 / 60) % 24);
      let min = parseInt((msec / 1000 / 60) % 60);
      let sec = parseInt((msec / 1000) % 60);
      // 个位数前补零
      this.hr = hr > 9 ? hr : "0" + hr;
      this.min = min > 9 ? min : "0" + min;
      this.sec = sec > 9 ? sec : "0" + sec;
      const that = this;
      var s = setTimeout(function() {
        that.countdown();
      }, 1000);

      if (msec == 0 || msec < 0) {
        clearInterval(s);
        this.isshow = false
      }
    },
    getData() {
      api.getTopList(this.params).then(res => {
        this.dataList = res.data;
      });
    }
  },
  mounted() {
    this.getData();
    api.getStopTime().then((res)=>{
      this.data = res.data
      this.countdown()
    }).catch((err)=>{

    })
    
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";

.personList {
  width: 100%;
  background-color: #03080c;
  position: relative;
  .bg_img {
    width: 100%;
    height: tr(388px);
  }
  .gift_box {
    width: 100%;
    padding: tr(30px) tr(20px) 0 tr(20px);
    position: relative;
    margin-top: tr(-120px);
    .gift_content {
      width: 100%;
      background-color: #fff;
      border-radius: tr(16px);
      padding: tr(50px) tr(45px) tr(20px) tr(39px);
      li {
        color: #8346fd;
        font-size: tr(28px);
        line-height: tr(50px);
        word-wrap: break-word;
        letter-spacing: tr(2px);
        span {
          color: #f11ca9;
        }
      }
      .gift_content_bottom {
        color: #f11ca9;
        font-size: tr(22px);
        line-height: tr(30px);
        margin-top: tr(20px);
      }
    }
    img {
      position: absolute;
      top: 0;
      left: 32%;
      display: inline-block;
      width: tr(262px);
      height: tr(60px);
    }
  }
  .rule_box {
    width: 100%;
    padding: tr(30px) tr(20px) 0 tr(20px);
    position: relative;
    margin-top: tr(20px);
    .rule_content {
      width: 100%;
      background-color: #fff;
      border-radius: tr(16px);
      padding: tr(50px) tr(45px) tr(20px) tr(39px);
      li {
        color: #8346fd;
        font-size: tr(28px);
        line-height: tr(50px);
        word-wrap: break-word;
        letter-spacing: tr(2px);
        span {
          color: #f11ca9;
        }
      }
      .rule_content_bottom {
        color: #f11ca9;
        font-size: tr(22px);
        line-height: tr(30px);
        margin-top: tr(20px);
      }
    }
    img {
      position: absolute;
      top: 0;
      left: 32%;
      display: inline-block;
      width: tr(262px);
      height: tr(60px);
    }
  }

  .order_box {
    width: 100%;
    height: tr(800px);
    margin-top: tr(40px);
    padding: tr(10px) tr(20px) tr(20px) tr(20px);
    position: relative;
    .order_content {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: tr(16px);
      padding: tr(70px) tr(30px) tr(20px) tr(30px);
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
          width: 30%;
          text-align: center;
        }
        .title3 {
          text-align: center;
          width: 36%;
        }
        .title4 {
          text-align: center;
          width: 20%;
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
            width: 30%;
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
            width: 20%;
            text-align: center;
            color: #8346fd;
            font-size: tr(28px);
          }
        }
      }
    }
    .time {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: tr(16px);
      background-image: url("../../assets/top/time_bg.png");
      background-size: 100% 100%;
      .time_down {
        top: 22%;
        position: absolute;
        width: 100%;
        text-align: center;
        height: tr(140px);
        font-size: tr(80px);
        line-height: tr(140px);
        color: #ff039d;
      }
    }
    .order_img {
      position: absolute;
      top: tr(-20px);
      left: 32%;
      display: inline-block;
      width: tr(262px);
      height: tr(60px);
    }
  }
}
</style>

