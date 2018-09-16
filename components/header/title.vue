<template>
    <div class="header" ref="header">
        <header id="header" v-if="show">
            <div id='status' ref="status"></div>
            <div id="myHeader">
                {{title}}
            </div>
        </header>
    </div>
</template>
<script>
import { NavBar } from "vant";
import { Toast } from "vant";
import iosBridge from "~/assets/js/bridge.js";
export default {
    props: {
        title: ""
    },

    data() {
        return {
            //要分享的内容
            //   shareData: {},
            //  device: "",
            //  support: true,
            show: true
        };
    },
    methods: {
        // share() {
        //     var vueThis = this;
        //     if (this.support) {
        //         if (this.device == "Andriod") {
        //             var result = bridge.nativeSupport("share");
        //             if (result) {
        //                 bridge.share(JSON.stringify(vueThis.shareData));
        //             } else {
        //                 Toast.success({
        //                     mask: false,
        //                     message: "当前版本不支持分享功能",
        //                     duration: 800
        //                 });
        //             }
        //         } else {
        //             iosBridge.setupWebViewJavascriptBridge(function(iosBridge) {
        //                 iosBridge.callHandler(
        //                     "nativeSupport",
        //                     "share",
        //                     function(res) {
        //                         if (JSON.parse(res).result) {
        //                             iosBridge.callHandler(
        //                                 "share",
        //                                 vueThis.shareData,
        //                                 function(res) {}
        //                             );
        //                         } else {
        //                             Toast.success({
        //                                 mask: false,
        //                                 message: "当前版本不支持分享功能",
        //                                 duration: 800
        //                             });
        //                         }
        //                     }
        //                 );
        //             });
        //         }
        //     }
        // }
    },
    mounted() {
        var isBridge = this.$route.query.bridge;
        
        this.device = this.$route.query.device;
        var statusBarHeight = parseInt(this.$route.query.statusBarHeight) || 0;
        if (isBridge) {
            localStorage.setItem("isBridge", isBridge);
            localStorage.setItem("device", this.device);
            localStorage.setItem("statusBarHeight", statusBarHeight);
        } else {
            isBridge = localStorage.getItem("isBridge");
            this.device = localStorage.getItem("device");
            statusBarHeight = parseInt(localStorage.getItem("statusBarHeight"));
        }
        if (isBridge) {
            this.show = true;
            var header = document.getElementById("status");
            header.style.height = statusBarHeight + "px";
            this.$refs.header.style.paddingTop = statusBarHeight + 44 + "px";
        } else {
            this.show = false;
        }
    }
};
</script>
<style lang="scss" scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    background-color: #fff;
    font-size: 16px;
    z-index: 9999;
    border-bottom: 1px solid #e6e6e6;
    #myHeader {
        width: 100%;
        height: 44px;
        line-height: 44px;
        // display: flex;
        // flex-direction: column;
        // justify-content: space-around;
        .share {
            float: right;
            padding-right: 10px;
        }
    }
    #status {
        width: 100%;
    }
}
</style>


