<template>
    <div style="display:none">
          
    </div>
</template>
<script>
import api from "~/api";
export default {
  head() {
    return {
      title: "支付"
    };
  },
  data() {
    return {};
  },
  mounted() {
    //获取订单id
    function getSearchString(key) {
      // 获取URL中?之后的字符
      var str = location.search;
      str = str.substring(1, str.length);
      // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
      var arr = str.split("&");
      var obj = new Object();
      // 将每一个数组元素以=分隔并赋给obj对象
      for (var i = 0; i < arr.length; i++) {
        var tmp_arr = arr[i].split("=");
        obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
      }
      return obj[key];
    }
    var orderId = getSearchString("orderId");
    var key = getSearchString("key");
    var language = getSearchString("language");
    window.location.href = `http://api.ickapay.com/pay/payLive/alipay?billNo=${orderId}&key=${key}&openType=${0}&language=${language}`;
  }
};
</script>

