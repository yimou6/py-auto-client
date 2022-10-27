<script setup>
import Steps from './components/Steps.vue'
import SideMenu from './components/SideMenu.vue'
import { onMounted, ref } from 'vue'

let menus = ref([])

updateConfig()
// onMounted(updateConfig)

async function updateConfig() {
  let config = await window.api.getAppConfig()
  config = JSON.parse(config)
  menus.value = config.scripts || []
}
</script>

<template>
  <div class="gui-app">
    <SideMenu :menus="menus" @update-config="updateConfig" />
    <div class="body-container">

      <div class="body-nav">
        <el-button-group>
          <el-button type="success">直接运行</el-button>
          <el-button type="primary">导出脚本</el-button>
        </el-button-group>
      </div>

      <div>
        <steps></steps>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';

.gui-app {
  display: flex;
  justify-content: flex-start;
  height: 100%;

  .body-container {
    width: calc(100% - 200px);
    .body-nav {
      display: flex;
      justify-content: flex-end;
      padding: 10px 10px 0 0;
    }
  }
}
</style>
