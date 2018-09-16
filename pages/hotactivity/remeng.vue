<template>
  <div class="remen">
    <div class="goods_list">
      <goods-list
        v-for="(item, key) in goodsList"
        :key="key"
        :item="item"
      >
      </goods-list>
    </div>
    <van-list v-model="loading" :finished="finished" @load="onLoad" :immediate-check="false" :loading-text='islanding' :offset='10'>
    </van-list>
  </div>
</template>

<script>
import api from "~/api";
import goodsList from "~/components/goodscar/goodsList";
export default {
  name: "remeng", //name 方便调试工具判断是哪一个组件
  components: {
    goodsList
  },
  data() {
    return {
      // show:false,
      goodsList: [],
      imageList: "",
      //上拉加载数据
      list: [],
      loading: false,
      finished: false,
      page: 1,
      pageSize: 12,
      goodsCount: 0,
      islanding: "数据加载中",
    };
  },
  methods: {
    // 下拉加载更多
    onLoad() {
      setTimeout(() => {
        if (this.goodsCount == this.goodsList.length) {
          this.loading = false;
          this.islanding = "没有更多数据了";
          setTimeout(() => {
            this.finished = true;
          }, 1500);
          return;
        }
        this.loading = true;
        var page = this.page;
        var pageSize = this.pageSize;
        api.getPopularpromotion(page, pageSize).then(res => {
          var newarr = this.goodsList.concat(res.data.list);
          res.data.list.forEach(item => {
            item.item.image = item.item.image.split(",");
          });
          this.goodsList = newarr;
          this.page = page + 1;
          this.loading = false;
        });
      }, 500);
    }
  },
  mounted() {
    let page = this.page;
    let pageSize = this.pageSize;
    api.getPopularpromotion(page, pageSize).then(res => {
      this.goodsList = res.data.list;
      this.goodsCount = res.data.count;
      this.page = page + 1;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
.remen {
  .goods_list {
    width: 100%;
    margin: 0 auto;
    padding: 0 tr(20px);
  }
}
</style>