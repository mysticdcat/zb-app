<template>
  <div>
        <img :src="item.logo" alt="logo" v-lazy="item.logo">
        <div class="goodsList_li_info">
            <p class="goodsList_name">{{item.name}}</p>
            <div class="start">
                <el-rate v-if="level" v-model="level" disabled show-score text-color="orange" allow-half></el-rate>
                <el-rate v-else v-model="nolevel" disabled show-score text-color="orange" allow-half></el-rate>
            </div>
        </div>
  </div>
</template>

<script>
import { Lazyload } from "vant";
export default {
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      level: null,
      nolevel: 0
    };
  },
  methods: {},
  mounted() {
    this.level = this.item.level;
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
img {
  margin-top: tr(20px);
  width: tr(183px);
  height: tr(183px);
  border-radius: tr(20px);
}
.goodsList_li_info {
  margin-top: tr(20px);
  border-top: 1px solid #dddddd;
  padding: tr(14px) tr(21px);
  .goodsList_name{
    text-align: left;
    overflow: hidden; /*自动隐藏文字*/
    text-overflow: ellipsis;/*文字隐藏后添加省略号*/
    white-space: nowrap;/*强制不换行*/
    font-size: tr(32px);
    line-height: tr(32px);
    color: rgba(18, 18, 18, 1);
  }
  .start {
    margin-top: tr(50px);
    width: 100%;
  }
}
</style>
