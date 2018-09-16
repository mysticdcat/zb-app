<template>
  <div id="wait" class="wait">
    <nuxt/>
  </div>
</template>

<style>
.wait {
  opacity: 0;
  transition: opacity 0.3s;
}
.ok {
  opacity: 1;
}
html,
body,
#__nuxt,
#__layout,
.wait {
  margin: 0 auto;
  height: 100% !important;
  background-color: #f7f7f7;
}
.v-enter-active,
.v-leave-active {
  transition: all 2s;
}
.v-enter,
.v-leave-to {
  margin-left: 100px;
}
.v-enter-to,
.v-leave {
  margin-left: 0px;
}
.show-enter-active,
.show-leave-active {
  transition: all 2s;
}
.show-enter,
.show-leave-to {
  margin-left: 100px;
}
.show-enter-to,
.show-leave {
  margin-left: 0px;
}
</style>