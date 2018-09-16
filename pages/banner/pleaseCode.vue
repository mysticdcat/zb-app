<template>
    <div class="please" v-if="isshow">
         <Headertitle :title='faTitle'></Headertitle>
        <div class="please_user">
            <div class="please_avatar">
                <img v-if="imgurl" :src="imgurl" alt="avatar">
            </div>
            <p class="please_name">
                {{username}}
            </p>
            <div class="please_code">
                <p class="please_code_word">6位数邀请码</p>
                <div class="please_code_num">
                    <p class="num" v-for="(code,index) in pleasecode" :key="index">{{code}}</p>
                </div>
            </div>
            <div class="download_code">
                <img src="../../assets/top/4code.png" alt="">
                <p>扫描下载宝兆app</p>
                <div class="download_text">
                  <span>下载地址:</span>
                  <input type="text" value="http://api.ickapay.com/download/index.html" ref="copyObj" readonly="readonly">
                  <button @click="copy">点击复制</button>
                </div>
                
            </div>
        </div>
        <div class="please_rule">
            <p>1、邀请好友，好友注册成功后，邀请人可得3个积分，被邀请人可得6个积分。</p>
            <p>2、您推荐完成首次注册的好友数量越多，获得的积分奖励越多。</p>
        </div>
    </div>
</template>
<script>
import api from "~/api";
import { Toast } from "vant";
// import iosbridge from "~/assets/js/bridge";
import Headertitle from '~/components/header/title.vue'
export default {
     components: {
        Headertitle
    },
  head() {
    return {
      title: "我的邀请码"
    };
  },
  data() {
    return {
         faTitle:'我的邀请码',
      data: null,
      isshow: false,
      imgurl: "",
      username: "",
      pleasecode: ""
    };
  },
  methods: {
    show() {
      let device = this.$route.query.device;
      if (device == "Android") {
        // android 0隐藏 1显示
        bridge.shareButtonStatus("1");
      }
      // else {
      //   iosbridge.setupWebViewJavascriptBridge(function(bridge) {
      //     bridge.callHandler("nativeSupport", "shareButtonStatus", function(
      //       res
      //     ) {
      //       if (JSON.parse(res).result) {
      //         // vueThis.text = res.result;
      //         // bridge.callHandler(
      //         //   "navigateTo",
      //         //   {
      //         //     url: "http://api.ickapay.com:8611/test/testabc",
      //         //     options: { num: 123 },
      //         //     title: "第二个页面"
      //         //   },
      //         //   function() {}
      //         // );
      //         bridge.callHandler("shareButtonStatus", "true", function(res) {
      //           vueThis.text = res;
      //         });
      //       }
      //     });
      //   });
      // }
    },
    copy(message) {
      var input = this.$refs.copyObj
      input.select();
      input.setSelectionRange(0, input.value.length),
      document.execCommand("Copy");
      if (document.execCommand("Copy")) {
        Toast({
          mask: false,
          message: "复制成功",
          duration: 800
        });
      } else {
        Toast({
          mask: false,
          message: "复制失败",
          duration: 800
        });
      }
    }
  },
  mounted() {
    let uid = this.$route.query.useridx;
    api
      .getPleaseCode(uid)
      .then(res => {
        if (res.code == 200) {
          this.isshow = true;
          this.data = res.data;
          this.username = res.data.myname;
          this.imgurl = res.data.smallpic;
          this.pleasecode = res.data.inviteCode;
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.show();
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.please {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/top/please_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: tr(135px);
  position: relative;
  .please_user {
    width: 100%;
    height: tr(750px);
    background-image: url("../../assets/top/please_user.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
    .please_avatar {
      width: tr(104px);
      height: tr(100px);
      border-radius: 50%;
      position: absolute;
      left: 43.7%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .please_name {
      width: 100%;
      text-align: center;
      color: #5f220a;
      font-size: tr(26px);
      position: absolute;
      top: tr(100px);
    }
    .please_code {
      position: relative;
      top: tr(200px);
      .please_code_word {
        width: 100%;
        text-align: center;
        color: #5f220a;
        font-size: tr(26px);
        opacity: 0.6;
      }
      .please_code_num {
        width: 100%;
        height: tr(100px);
        display: flex;
        align-items: center;
        justify-content: center;
        .num {
          width: tr(70px);
          height: tr(70px);
          border: 1px solid #5f220a;
          border-radius: tr(6px);
          background-color: #fff;
          margin-left: tr(10px);
          margin-right: tr(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: tr(34px);
        }
      }
    }
    .download_code {
      width: 100%;
      position: absolute;
      top: tr(380px);
      text-align: center;
      img {
        width: tr(220px);
        height: tr(220px);
        display: inline-block;
      }
      p:nth-of-type(1) {
        margin-top: tr(20px);
      }
      .download_text {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: tr(20px);
        span {
          font-size: tr(22px);
          display: inline-block;
        }
        input {
          width: tr(300px);
          background: transparent;
          overflow: hidden; /*自动隐藏文字*/
          text-overflow: ellipsis; /*文字隐藏后添加省略号*/
          white-space: nowrap; /*强制不换行*/
        }
        button {
          border: 1px solid #333;
          border-radius: tr(16px);
          padding: tr(0px) tr(10px);
          margin-left: tr(10px);
          background: transparent;
        }
      }
    }
  }
  .please_rule {
    width: 100%;
    margin-top: tr(30px);
    height: tr(200px);
    padding: tr(20px) tr(80px);
    p {
      color: #fff;
      font-size: tr(24px);
      line-height: tr(40px);
      margin-top: tr(10px);
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


