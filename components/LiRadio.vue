]<template>
    <div>
        <p class="r-label">
            {{label}}
        </p>
        <ul class="r-values">
            <li :class="{ active:item==activeValue  }" v-for="(item,index) in values" :key="index" @click="itemClcik(item,index)"> {{item}}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        label: {
            type: String,
            default: ""
        },
        attr: {
            type: String,
            default: ""
        },
        values: {
            type: Array,
            default() {
                return [];
            }
        },
        activeItem: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            activeValue: this.activeItem,
        }
    },
    watch: {
        values() {
            //this.activeItem=null;
        },
        activeValue() {
            var selectData={}
            /* selectData[this.attr]=this.values[this.activeItem];
            selectData['index']=this.activeItem; */
            this.$emit('radioChange',this.attr,this.activeValue)
        }
    },
    methods: {
        itemClcik(item,index) {
            //this.activeValue=item;
            this.activeValue=item;
        },
        getItem() {
            return {
                key: this.attr,
                value: this.activeValue,
            }
        }

    },
    mounted() {
        // this.$emit('radioChange',this.attr,this.values[this.activeItem],this.activeItem)
    }
}
</script>

<style lang='scss' scoped>
@import "~@/assets/style/px-to-rem";
.r-label {
  color: #333;
  font-size: tr(26px);
}
.r-values {
  display: flex;
  flex-wrap: wrap;
}
.r-values > li {
  padding-left: tr(21px);
  padding-right: tr(21px);
  float: left;
  background: rgba(242, 242, 242, 1);
  color: #191919;
  border-radius: tr(23px);
  text-align: center;
  height: tr(46px);
  line-height: tr(46px);
  margin-top: tr(20px);
  margin-bottom: tr(30px);
  margin-left: tr(20px);
}
.r-values .active {
  color: #e92322;
}
</style>

