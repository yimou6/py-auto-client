<template>
  <div class="nav-bar">
    <img src="../assets/tool.ico" alt="ico">
    <div>
      <span @click="handleMinimize">
      <i class="iconfont icon-jianhao"></i>
    </span>
      <span @click="handleAppClose">
      <i class="iconfont icon-guanbi"></i>
    </span>
    </div>
  </div>
</template>

<script setup lang="ts">

/**
 * 最小化
 */
function handleMinimize() {
  window.ipcRenderer.sendEvent('minimize', {})
}

/**
 * 最大化
 */
function handleAppClose() {
  window.ipcRenderer.sendEvent('appClose', {})
}
</script>

<style scoped lang="scss">
.nav-bar {
  height: 32px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  background-color: #ffffff;
  border-bottom: 1px solid #dfdfdf;
  img {
    width: 24px;
    height: 24px;
    margin-left: 10px;
  }
  span {
    -webkit-app-region: no-drag;
    display: inline-block;
    height: 32px;
    width: 32px;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
    color: #606060;
    &:hover {
      background-color: #8d8d8d;
      color: #f0f0f0;
    }
  }
}
</style>