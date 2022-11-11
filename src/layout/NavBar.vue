<template>
  <div class="nav-bar">
    <span @click="handleMinimize">
      <i class="iconfont icon-minus"></i>
    </span>
    <span @click="handleAppClose">
      <i class="iconfont icon-close"></i>
    </span>
  </div>
</template>

<script setup lang="ts">

/**
 * 最小化
 */
function handleMinimize() {
  window.ipc.minimize()
}

/**
 * 最大化
 */
function handleAppClose() {
  window.ipc.appClose()
}
</script>

<style scoped lang="scss">
.nav-bar {
  position: fixed;
  top: 0;
  right: 0;
  color: #adadad;
  height: 32px;
  width: 612px;
  z-index: 999;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  -webkit-app-region: drag;
  span {
    -webkit-app-region: no-drag;
    display: inline-block;
    height: 32px;
    width: 32px;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
    background-color: #333333;
    &:hover {
      background-color: #8d8d8d;
      color: #f0f0f0;
    }
  }
  span:nth-child(1) {
    border-bottom-left-radius: 10px;
  }
}
</style>