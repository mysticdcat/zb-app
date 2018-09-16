<template>
  <div class="pinglun_page">
      <div class="user_photo">
          <img :src="item.image" alt="logo" >
      </div>
      <div class="user_info">
          <div class="user_first">
            <span class="user_name">{{item.myname}}</span>
            <span class="comment_time">{{item.time}}</span>
          </div>
           <div class="start">
                <el-rate v-if="level" v-model="level" disabled show-score text-color="orange" allow-half></el-rate>
                <el-rate v-else v-model="nolevel" disabled show-score text-color="orange" allow-half></el-rate>
            </div>
            <p class="user_pingjia_word">
                {{item.content}}
            </p>
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
.pinglun_page {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  .user_photo {
    width: tr(85px);
    height: tr(85px);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .user_info {
    width: 100%;
    margin-left: tr(24px);
    overflow: hidden;
    .user_first {
      display: flex;
      justify-content: space-between;
      font-size: tr(28px);
      .user_name {
        color: #121212;
      }
      .comment_time {
        color: #999999;
      }
    }
    .start {
      margin-top: tr(6px);
    }
    .user_pingjia_word {
      width: 100%;
      color: #121212;
      font-size: tr(28px);
      line-height: tr(42px);
      font-weight: 580px;
      margin-top: tr(18px);
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>