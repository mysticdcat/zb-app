<template>

  <div class="all" ref="allInfo">
    <!-- title组件 -->
    <headerTitle :title='title'></headerTitle>
    <div class="all1" @click="show=false">

      <div class="tip">
        为了提高发货速度，请填写真实信息
      </div>
      <div class="former">
        <div class="name c">
          <span>收货人</span>
          <input type="text" v-model="form.name" />
        </div>
        <div class="tel c">
          <span>联系电话</span>
          <input type="text" v-model="form.tel" class='telvalue' maxlength='11'>
        </div>
        <div class="province c">
          <span>收件地址</span>
          <input type="text" v-model="form.procitycounty" @click.stop="handle" readonly>
        </div>
        <div class="addressDeaill c">
          <span>详细地址</span>
          <textarea v-model="form.address_detail"></textarea>
        </div>

        <div class="postalCode c">
          <span>邮政编码</span>
          <input type="text" v-model="form.postal_code" class='postal_code' maxlength='6'>
        </div>
      </div>
      <div class="isDefault c">
        <span class="moren"> 默认地址</span>
        <span class="imgbox" @click="is_default = !is_default"> <img src="../../assets/carImage/checked.png" v-if="is_default" alt=""></span>
      </div>
      <div class="save">
        <button type="button" @click="submitter">保 存</button>
      </div>
    </div>
    <!-- <van-area :area-list="areaList" v-if="show" @confirm="onConfirm" @change="onChange" @cancel="onCancel" /> -->
    <van-popup v-model="isShow" position="bottom" :overlay="true" :lazy-render='true' :overlay-style="overlayStyle">
      <img src="~@/assets/images/close.png" alt="" class='close' @click='close'>
      <worldAddress @select-end="selectEnd" :affirm='show'></worldAddress>
    </van-popup>
  </div>

</template>
<script>
import worldAddress from '~/components/worldAddress.vue'
import api from "~/api";
import { Toast } from "vant";
import headerTitle from '~/components/header/title'
export default {
  components: {
    worldAddress,
    headerTitle
  },
  head() {
    return {
      title: '添加地址',
    };
  },
  data() {
    return {
      title: '添加地址',
      isShow: false,       //控制弹框显隐
      overlayStyle: {
        'backgroundColor': 'rgba(0,0,0,.3)'    //控制弹框外面的颜色深浅
      },
      dataList: [],
      show: false,
      form: {
        name: "",
        tel: "",
        procitycounty: "",
        address_detail: "",
        postal_code: "",
      },
      is_default: false,
      loading: true,
      value: [],
      country: "",
      province: "",
      city: "",
      county: "",
    };
  },
  methods: {
    /* 让弹框显示 */
    handle() {
      this.isShow=true
    },
    /* 让弹框隐藏 */
    close() {
      this.isShow=false
    },
    selectEnd(value) {
      this.form.procitycounty=value.country+value.city+value.area+value.county
      this.form.country=value.country
      this.form.province=value.city
      this.form.city=value.area
      this.form.county=value.county
      this.isShow=false;
    },
    // onConfirm(data) {
    //   this.province = data[0].name;
    //   this.city = data[1].name;
    //   this.county = data[2].name;
    //   this.procitycounty = this.province + this.city + this.county;
    //   this.show = false;
    // },
    onCancel() {
      this.show=false;
    },
    showDefalut() {
      if(this.dispalyNo==false) {
        this.dispalyNo=true;
        this.is_default=true;
      } else {
        this.dispalyNo=false;
        this.is_default=false;
      }
    },

    submitter() {
      if(!this.form.name) {
        Toast("请输入您的姓名");
        return;
      }
      //获取电话的value值
      var keyword=document.getElementsByClassName("telvalue")[0].value;
      // var keyword = search.name.value;
      if(!keyword) {
        Toast("手机号不能为空");
        return;
      } else {
        var reg=/^1[3456789]\d{9}$/;
        if(!reg.test(keyword)) {
          Toast("请正确输入11位手机号码");
          return;
        }
      }
      if(!this.form.procitycounty) {
        Toast("请输入地址");
        return;
      }
      if(!this.form.address_detail) {
        Toast("请输入详细地址");
        return;
      }
      //正则验证邮政编码
      var ss=document.getElementsByClassName("postal_code")[0].value;
      var re=/^[1-9][0-9]{5}$/;

      if(ss.length!==0&&!re.test(ss)) {
        Toast("邮政编码格式不正确");
        return;
      }
      api
        .postaddress(
          JSON.stringify({
            name: this.form.name,
            tel: this.form.tel,
            country: this.form.country,
            province: this.form.province,
            city: this.form.city,
            county: this.form.county,
            address_detail: this.form.address_detail,
            postal_code: this.form.postal_code,
            is_default: this.is_default,
            area_code: "123213"
          })
        )
        .then(res => {
          if(this.$route.query.shopId) {
            var id=this.$route.query.shopId;
            this.$router.push({
              path: "/goodsDetail/goodsDetail",
              query: { shopId: id }
            });
          } else if(this.$route.query.isCar) {
            this.$router.push({ path: "/goodsCar/goodsCar" });
          } else {
            this.$router.push({
              path: "./manageAddress",
              query: { orderId: this.$route.query.orderId }
            });
          }
        })
        .catch(err => { });
    }
  },
  mounted() { }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.all {
  width: 100%;
  height: 100%;
  .header {
    height: 44px;
    ul {
      width: 100%;
      line-height: 44px;
      font-size: 18px;
      color: #ffffff;
      background: linear-gradient(270deg, rgb(233, 68, 180), rgb(79, 72, 179));
      display: flex;
      li {
        flex: 1;
      }
      li:nth-child(1) {
        padding-left: 10px;
      }
      li:nth-child(2) {
        text-align: center;
      }
      li:nth-child(3) {
        padding-right: 10px;
        text-align: right;
      }
    }
  }
  /////////////////////////////////////////header 头部
  .tip {
    width: 100%;
    height: tr(88px);
    line-height: tr(88px);
    text-align: center;
    color: #000000;
    font-size: tr(28px);
    background: #eeeeee;
  }
  .former {
    width: 100%;
    height: 100%;
    padding: 0 tr(20px);
    background: #ffffff;
    font-size: tr(28px);
    .textarea {
      width: tr(620px);
      display: inline-block;
    }

    input {
      border: none;
      width: tr(550px);
      height: tr(86px);
    }
    textarea {
      width: tr(550px);
    }
    span {
      color: #999999;
      display: inline-block;
      width: tr(160px);
      height: tr(88px);
      line-height: tr(88px);
    }
    .c {
      height: tr(88px);
      line-height: tr(88px);
      display: flex;
    }
    .name {
      border-bottom: 1px solid #eee;
    }
    .tel {
      border-bottom: 1px solid #eee;
    }
    .province {
      border-bottom: 1px solid #eee;
    }
    .addressDeaill {
      height: tr(174px);
      border-bottom: 1px solid #eee;
    }
    .postalCode {
    }
  }
  .isDefault {
    position: relative;
    background: #fff;
    border-top: 20px solid #eee;
    padding-left: tr(20px);
    span {
      color: #000;
      display: inline-block;
      width: tr(160px);
      height: tr(88px);
      line-height: tr(88px);
      font-size: tr(28px);
    }
    .imgbox {
      width: tr(44px);
      height: tr(44px);
      position: absolute;
      right: tr(30px);
      border-radius: tr(22px);
      border: 1px solid #eee;
      top: tr(20px);
      display: flex;
      img {
        width: 100%;
        height: 100%;
        margin: auto;
      }
    }
  }
  .save {
    width: 100%;
    height: tr(88px);
    line-height: tr(88px);
    display: flex;

    button {
      display: block;
      width: 40%;
      height: tr(88px);
      border-radius: tr(40px);
      background: linear-gradient(270deg, rgb(233, 68, 180), rgb(79, 72, 179));
      position: absolute;
      bottom: tr(20px);
      left: 30%;
      color: #ffffff;
      font-size: tr(32px);
    }
  }
}
</style>
