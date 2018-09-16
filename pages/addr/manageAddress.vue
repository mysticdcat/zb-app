<template>
  <div class="all">
    <!-- title组件 -->
    <headerTitle :title='title'></headerTitle>
    <div @click="toAdd" class="add">+添加新地址</div>
    <div class="p">
      <van-cell-swipe :right-width="65" :left-width="0" :on-close="onClose" v-for="(data,index) in dataList" :key="index">
        <van-cell-group class="cell">
          <div class="p1">
            <div class="h">
              <div class="h1" v-show=" data.id == selected ? true : false ">
                【默认地址】
              </div>
            </div>
            <div class="h2">
              <div class="left">
                <div class="imgbox" @click="shower(index,data.id,data)">
                  <img src="../../assets/carImage/checked.png" alt="" v-show=" data.id == selected ? true : false ">
                </div>
              </div>
              <div class="middle" @click="udataOrder(data.id)">
                <div class="m1">
                  <p>{{data.name}}</p>
                  <p>{{data.tel}}</p>
                  <p>{{data.province}}{{data.city}}{{data.county}}{{data.addressdetaill}}</p>
                </div>
              </div>
              <div class="right1">
                <van-icon name="edit" class="iconedit" @click.self="toEdit(data.id)" />
              </div>
            </div>
          </div>
        </van-cell-group>
        <span slot="right" @click="deleter(data.id,index)" class="deleter">
          <van-icon name="delete" class="icon" />
        </span>
      </van-cell-swipe>
    </div>
    <div class="save">
      <button type="button" @click="submitter" v-if='isShow'>确认</button>
    </div>
  </div>
</template>

<script>
import { Dialog,Toast } from "vant";
import headerTitle from '~/components/header/title'
import api from "~/api";
export default {
  head() {
    return {
      title: "收货地址"
    };
  },
  components: {
    headerTitle
  },
  data() {
    return {
      title: '收货地址',
      dataList: [],
      showis: false,
      displayNO: true,
      isdefault: true,
      selected: null,
      isShow: false
    };
  },
  methods: {
    toAdd() {
      this.$router.push({
        path: "/addr/addAdress",
        query: { orderId: this.$route.query.orderId }
      });
    },
    toEdit(id) {
      this.$router.push({
        path: "/addr/edit",
        query: { id: id,orderId: this.$route.query.orderId }
      });
    },
    deleter(id,index) {
      // this.dataList.splice(index,1);
      // api.postAdressIdDelete(id).then(res => { });
      //将点击的id与索引存储起来
      localStorage.setItem("deleteId",id);
      localStorage.setItem("deleteIndex",index);
    },
    // back() {
    //   this.$router.go(-1);
    // },
    shower(index,id,data) {
      localStorage.setItem("selected",id);
      this.selected=id;
      var params={
        id: id,
        isdefault: true
      };
      api.updateDefault(params).then(res => { });
    },
    onClose(clickPosition,instance) {
      //滑动删除
      switch(clickPosition) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          Dialog.confirm({
            message: "确定删除吗？"
          })
            .then(() => {
              instance.close();
              Toast.success("删除成功");
              const deleteId=localStorage.getItem("deleteId");
              const deleteIndex=localStorage.getItem("deleteIndex");
              this.dataList.splice(deleteIndex,1);
              api.postAdressIdDelete(deleteId).then(res => { });
            })
            .catch(() => {
              Toast.fail("已取消删除");
            });
          break;
      }
    },
    initList(params) {
      api.getAddress(params).then(res => {
        this.dataList=res.data;
        this.dataList.forEach(item => {
          if(item.isdefault==true) {
            this.selected=item.id;
          }
        });
      });
    },
    //点击确认跳转到支付界面
    submitter() {
      if(this.$route.query.orderId) {
        this.$router.push({
          path: "/pay/pay",
          query: { orderId: this.$route.query.orderId }
        });
      }
    },

    udataOrder(id) {
      var params={
        id: this.$route.query.orderId,
        addrId: id
      };
      api.updataOrderAddr(params).then(res => {
        if(res.code==200) {
          this.$router.push({
            path: "/pay/pay",
            query: { orderId: this.$route.query.orderId }
          });
        }
      });
    }
  },
  mounted() {
    this.initList();
    if(this.$route.query.orderId) {
      this.isShow=true;
    } else {
      this.isShow=false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.all {
  .van-cell-swipe__right {
    margin-left: 1px;
  }
  margin: 0 auto;
  background: #f7f7f7;
  .add {
    width: 100%;
    height: tr(88px);
    line-height: tr(88px);
    text-align: center;
    font-size: tr(28px);
    background: rgb(230, 230, 230);
    color: #000000;
  }
  .p {
    padding: 0 tr(20px);
    width: 100%;
    height: 100%;
    .cell {
      background: #eee;
      .p1 {
        width: 100%;
        height: tr(170px);
        border-radius: tr(20px);
        background: #ffffff;
        display: flex;
        margin-top: tr(20px);
        flex-direction: column;
        .h {
          height: tr(40px);
          .h1 {
            font-size: tr(28px);
            text-align: right;
            color: blue;
            margin-top: tr(10px);
          }
        }
        .h2 {
          display: flex;
          .left {
            width: tr(45px);
            display: flex;
            margin-left: tr(20px);
            .imgbox {
              margin: auto;
              width: tr(40px);
              height: tr(40px);
              border-radius: tr(22px);
              border: 1px solid #eee;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .middle {
            font-size: tr(28px);
            width: 85%;
            padding-left: tr(20px);
            m1 {
              margin: auto 0;
            }
          }
          .right1 {
            width: tr(45px);
            display: flex;
            text-align: right;
            .iconedit {
              font-size: tr(50px);
              margin: auto;
            }
          }
        }
      }
    }
    .deleter {
      line-height: tr(170px);
      width: tr(100px);
      background: blue;
      display: inline-block;
      text-align: center;
      border-radius: 0 tr(20px) tr(20px) 0;
      .icon {
        font-size: tr(40px);
        color: #fff;
      }
    }
  }
}
.save {
  width: tr(750px);
  height: tr(88px);
  line-height: tr(88px);
  display: flex;

  button {
    display: block;
    width: tr(335px);
    height: tr(88px);
    border-radius: tr(40px);
    background: linear-gradient(270deg, rgb(233, 68, 180), rgb(79, 72, 179));
    position: fixed;
    bottom: tr(20px);
    left: 25%;
    color: #ffffff;
    font-size: tr(32px);
  }
  /deep/ .van-cell-swipe__right {
    right: -4px !important;
  }
}
</style>
