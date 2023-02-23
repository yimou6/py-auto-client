<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import useStepStore from '../../stores/step'

const store = useStepStore()
const { activeScript } = storeToRefs(store)

const handleClick = (command: string) => {
  if (command === 'open') {
    window.ipcRenderer.sendEvent('openExplorer', {
      filename: store.activeScriptId
    })
  } else if (command === 'run') {
    window.ipcRenderer.sendEvent('runCmd', {
      cmd: store.activeScriptId
    })
  } else if (command === 'edit') {
    store.changeEditScript(true)
  } else if (command === 'del') {
    store.changeDelScript(true)
  }
}
</script>

<template>
  <div class="header-bar">
    <div class="step-info">
      <div class="step-title">{{ activeScript.title }}</div>
    </div>
    <div class="nav-tool">
      <div title="打开文件夹" @click="handleClick('open')"><i class="iconfont icon-wenjianjia"></i></div>
      <div title="运行" @click="handleClick('run')"><i class="iconfont icon-bofang"></i></div>
      <div title="编辑" @click="handleClick('edit')"><i class="iconfont icon-bianji"></i></div>
      <div title="删除" @click="handleClick('del')"><i class="iconfont icon-shanchu"></i></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-bar {
  height: 60px;
  box-sizing: border-box;
  border-bottom: 1px solid #DFDFDF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  margin-bottom: 12px;

  .step-info {
    .step-title {
      font-size: 16px;
      font-weight: bold;
      color: #555555;
    }
  }

  .nav-tool {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &>div {
      height: 30px;
      width: 30px;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      color: #666666;
      transition: all .3s;
      border-top: 1px solid #DFDFDF;
      border-bottom: 1px solid #DFDFDF;
      border-left: 1px solid #DFDFDF;
      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:last-child {
        border-right: 1px solid #DFDFDF;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &:hover {
        font-weight: bold;
        background-color: #B99B6B;
        color: #ffffff;
        border-color: #B99B6B;
      }
    }
  }
}
</style>