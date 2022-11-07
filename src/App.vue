<script setup lang="ts">
import Layout from './layout/layout.vue'
</script>

<template>
  <layout />
</template>

<style lang="scss">
/* CDN 服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: 'iconfont';  /* Project id 3286450 */
  src: url('//at.alicdn.com/t/font_3286450_5bx1ggj5p34.woff2?t=1648698334913') format('woff2'),
  url('//at.alicdn.com/t/font_3286450_5bx1ggj5p34.woff?t=1648698334913') format('woff'),
  url('//at.alicdn.com/t/font_3286450_5bx1ggj5p34.ttf?t=1648698334913') format('truetype');
}

html, body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: transparent;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}




.button {
  border: 1px solid #dfdfdf;
  border-radius: 2px;
  font-size: 12px;
  font-weight: normal;
  text-align: center;
  background-color: #ffffff;
  cursor: pointer;
  user-select: none;
  outline: none;
  -webkit-app-region: no-drag;
  padding: 4px 16px;

  & + & {
    margin-left: 10px;
  }
}

.form-item {
  margin-bottom: 12px;
  label {
    font-size: 12px;
    color: #555555;
    padding-right: 6px;
  }
}
</style>
