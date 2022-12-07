<template>
  <div class="footer-nav">
    <div @click="handleExplorer" title="打开文件夹">
      <i class="iconfont icon-file-open"></i>
    </div>
    <div @click="handleDelScript" title="删除脚本">
      <i class="iconfont icon-delete"></i>
    </div>
    <div @click="handleRun" title="运行">
      <i class="iconfont icon-play"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useStepStore from '../stores/step'
import { ElMessageBox } from 'element-plus'

const stepStore = useStepStore()
const { nowScriptTitle, scripts } = storeToRefs(stepStore)

/**
 * 打开脚本所在文件夹
 */
function handleExplorer() {
  window.ipcRenderer.sendEvent('openExplorer', { filename: nowScriptTitle.value })
}

/**
 * 删除脚本
 */
async function handleDelScript() {
  if (!nowScriptTitle.value) return
  const index = scripts.value.findIndex(script => script.filename === nowScriptTitle.value)
  ElMessageBox.confirm(
      `是否确认删除脚本：${scripts.value[index].title}`,
      '提示',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    window.ipcRenderer.sendEvent('deleteScript', {
      filename: nowScriptTitle.value
    })
    stepStore.$patch((state) => {
      state.scripts.splice(index, 1)
    })
  }).catch(() => ({}))
}

/**
 * 运行脚本
 */
function handleRun() {
  window.ipcRenderer.sendEvent('runCmd', {
    cmd: nowScriptTitle.value
  })
}
</script>

<style scoped lang="scss">
.footer-nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 30px;
  border-bottom: 1px solid #dfdfdf;
  padding: 0 10px;

  div {
    color: #333333;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid transparent;
    width: 26px;
    height: 26px;
    text-align: center;
    line-height: 27px;
    border-radius: 2px;
    & + div {
      margin-left: 10px;
    }
    &:hover {
      border-color: #00ca53;
    }
  }
}
</style>