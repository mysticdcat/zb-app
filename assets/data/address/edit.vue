<template>
  <div class="all" ref="allInfo">
    <div class="all1">
      <div class="tip">
        为了提高发货速度，请填写真实信息
      </div>
      <div class="former">
        <form action="./manageAddress.vue" methods='post'>
          <div class="name c">
            <span>收货人</span>
            <input type="text" v-model="form.name">
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
            <textarea v-model="form.addressdetaill"></textarea>
          </div>

          <div class="postalCode c">
            <span>邮政编码</span>
            <input type="text" v-model="form.postcode" class='postal_code' maxlength='6'>
          </div>
        </form>
      </div>
      <div class="isDefault c">
        <span class="moren"> 默认地址</span>
        <span class="imgbox" @click="form.isdefault = !form.isdefault"><img src="../../assets/carImage/checked.png" v-show="form.isdefault" alt=""></span>
      </div>

      <div class="save">
        <button type="button" @click="submitter">保存</button>
      </div>
    </div>
    <van-popup v-model="isShow" position="bottom" :overlay="true" :lazy-render='true' :overlay-style="overlayStyle">
      <img src="~@/assets/images/close.png" alt="" class='close' @click='close'>
      <worldAddress @select-end="selectEnd" :affirm='show'></worldAddress>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
import api from "~/api";
import worldAddress from '~/components/worldAddress.vue'
export default {
  components: {
    worldAddress
  },
  head() {
    return {
      title: '编辑地址'
    };
  },
  data() {
    return {
      /* 弹框地址 */
      isShow: false,
      overlayStyle: {
        'backgroundColor': 'rgba(0,0,0,.3)'
      },
      dispalyNo: false,
      dataList: [],
      show: false,
      loading: true,
      value: [],
      form: {
        name: "",
        tel: "",
        procitycounty: "",
        addressdetaill: "",
        postcode: "",
        isdefault: false,
        province: "",
        city: "",
        county: ""
      },
    };
  },
  methods: {
    selectEnd(value) {
      this.form.procitycounty=value.country+value.city+value.area+value.county
      this.form.country=value.country
      this.form.province=value.city
      this.form.city=value.area
      this.form.county=value.county
      this.isShow=false;
    },
    /* 让弹框显示 */
    handle() {
      this.isShow=true

    },
    /* 让弹框隐藏 */
    close() {
      this.isShow=false
    },
    submitter() {
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
      //正则验证邮政编码
      var ss=document.getElementsByClassName("postal_code")[0].value;
      var re=/^[1-9][0-9]{5}$/;
      if(ss.length!==0&&!re.test(ss)) {
        Toast("邮政编码格式不正确");
        return;
      }
      api
        .getEditAddress(
          JSON.stringify({
            id: this.$route.query.id,
            name: this.form.name,
            tel: this.form.tel,
            country: this.form.country,
            province: this.form.province,
            city: this.form.city,
            county: this.form.county,
            address_detail: this.form.addressdetaill,
            postal_code: this.form.postcode,
            is_default: this.form.isdefault,
            area_code: ""
          })
        )
        .then(res => {
          Toast.success("修改成功");
          if(this.$route.query.orderId) {
            this.$router.push({
              path: "./manageAddress",
              query: { orderId: this.$route.query.orderId }
            });
          } else {
            this.$router.push({ path: "./manageAddress",});
          }
        });
    }
    /* 正则匹配手机号码 */
  },
  mounted() {
    api.getFindAddressId(this.$route.query.id).then(res => {
      let data=res.data;
      this.form.name=data.name;
      this.form.tel=data.tel;
      this.form.postcode=data.postcode;
      if(data.country==null) {
        data.country=''
      }
      this.form.procitycounty=data.country+data.province+data.city+data.county;
      this.form.addressdetaill=data.addressdetaill;
      this.form.isdefault=data.isdefault;
    });
  }
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
      font-size: tr(32px);
      color: #fff;
    }
  }
}
.classification {
  width: 100%;
  height: tr(800px);
  // position: fixed;
  // bottom: 0;
  // z-index: 999;
  background-color: #fff;
}
.close {
  position: absolute;
  right: tr(15px);
  top: tr(15px);
}
</style>
