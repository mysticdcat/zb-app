import Vue from "vue";
// Vue.filter{
//     fmtlevel(level) {
//       if(level>=1000) {
//         var level=level/1000
//         return level.toFixed(1)+'km'
//       } else {
//         return level+'m'
//       }
//     }
// }
Vue.filter("fmtlevel", (distance, rag) => {
  if (distance >= 1000) {
    var level = distance / 1000;
    return level.toFixed(1) + "km";
  } else {
    return distance + "m";
  }
});
