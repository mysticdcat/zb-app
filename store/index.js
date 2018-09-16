/**
 * 全局状态管理
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
//创建一个仓库
const store = () => new Vuex.Store({
  state: {
    car: [],
    allChecked: 0,
    //创建一个存放商品id的数
    allPrice: 0,
    orderItems: [],
    // 组件切换索引
    tabIndex: null,
    // 全局城市
    city: "",
    // 全局经纬度
    coordinate: {
      lng: null,
      lat: null
    }
  },
  mutations: {
    changeChecked(state, params) {
      state.allChecked = 1;
      state.car.forEach(item => {
        item.tbCarts.forEach(item => {
          if (item.id == params.id) {
            if (item.checked == 0) {
              item.checked = 1
            } else {
              item.checked = 0
            }
          }
        })
      })
      state.car.some(item => {
        item.tbCarts.forEach(item => {
          if (item.checked == 0) {
            state.allChecked = 0;
          }
        })
      })

      //和商家选中进行联动
      state.car.forEach(item => {
        if (item.shopName == params.shopName) {
          item.shopChecked = 1;

        }
      })
      state.car.forEach(item => {
        if (item.shopName == params.shopName) {
          item.tbCarts.some(second => {
            if (second.shopName == params.shopName) {
              if (second.checked == 0) {
                item.shopChecked = 0;
              }
            }
          })
        }
      })

    },
    //改变商家选中状态
    changeSeller(state, shopName) {
      state.car.forEach(item => {
        if (item.shopName == shopName) {
          if (item.shopChecked == 0) {
            item.shopChecked = 1
            item.tbCarts.forEach(item => {
              item.checked = 1;
            })
          } else {
            item.shopChecked = 0
            item.tbCarts.forEach(item => {
              item.checked = 0;
            })
          }
        }
      })
      state.allChecked = 1;
      state.car.forEach(item => {
        if (item.shopChecked == 0) {
          state.allChecked = 0;
        }
      })
    },
    //点击改变全选状态
    changeAll(state) {
      if (state.allChecked == 1) {
        state.allChecked = 0;
      } else {
        state.allChecked = 1;
      }
      state.car.forEach(item => {
        item.tbCarts.forEach(item => {
          if (state.allChecked) {
            item.checked = 1
          } else {
            item.checked = 0;
          }
        })
        if (state.allChecked == 0) {
          item.shopChecked = 0
        } else {
          item.shopChecked = 1;
        }
      })
    },
    changeTabIndex(state, index) {
      state.tabIndex = index
    },
    // 更改当前城市
    changeCity(state, name) {
      state.city = name
    },
    // 更改经纬度
    changeCoordinate(state, data) {
      state.coordinate.lng = data.lng
      state.coordinate.lat = data.lat
    }
  },
  // 过滤状态
  getters: {
    payPrice(state) {
      var allPrice = 0;
      if (state.car) {
        state.car.forEach(item => {
          item.tbCarts.forEach(item => {
            if (item.checked == 1) {
              allPrice += item.price * item.num;
            }
          })
        })
      }
      return allPrice;
    },
    num(state) {
      var num = 0;
      if (state.car) {
        state.car.forEach(item => {
          item.tbCarts.forEach(item => {
            if (item.checked == 1) {
              num++;
            }
          })
        })
      }
      return num;
    },
    filtersCar(state) {
      var hash = {}; //arr是要去重的对象数组
      if (state.car) {
        state.car = state.car.reduce(function (item, next) {
          hash[next.shopName] ?
            "" :
            (hash[next.shopName] = true && item.push(next));
          return item;
        }, []);
      }
      return state.car;
    },
  },


})

export default store;
