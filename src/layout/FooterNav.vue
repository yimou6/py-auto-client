<template>
  <div class="footer-nav">
    <div class="btn">
      <div class="btn-item" title="在文件资源管理器打开" @click="handleExplorer">
        <i class="iconfont icon-file-open"></i>
        <span>打开文件夹</span>
      </div>
      <div class="btn-item" title="删除脚本" @click="handleDelScript">
        <i class="iconfont icon-delete"></i>
        <span>删除脚本</span>
      </div>
    </div>
    <div class="start" @click="handleRun">直接运行{{nowScriptTitle}}</div>
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
  window.ipc.openExplorer(nowScriptTitle.value)
}

/**
 * 删除脚本
 */
async function handleDelScript() {
  if (!nowScriptTitle.value) return

  const index = scripts.value.findIndex(script => script.filename = nowScriptTitle.value)
  ElMessageBox.confirm(
      `是否确认删除脚本：${scripts.value[index].title}`,
      '提示',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    window.ipc.deleteScript(nowScriptTitle.value)
    stepStore.$patch((state) => {
      state.scripts.splice(index, 1)
    })
  }).catch(() => ({}))
}

/**
 * 运行脚本
 */
function handleRun() {
  window.ipc.runCmd(nowScriptTitle.value)
}
</script>

<style scoped lang="scss">
.footer-nav {
  position: fixed;
  bottom: 10px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 580px;
  height: 45px;
  background-color: #f9f9f9;
  border-radius: 5px;

  .btn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
    &-item {
      font-size: 12px;
      cursor: pointer;
      &:hover {
        font-weight: bold;
      }
    }
    .btn-item + .btn-item {
      margin-left: 10px;
    }
  }

  .start {
    background-color: #333333;
    border-radius: 10px;
    color: #ffffff;
    height: 45px;
    width: 180px;
    text-align: center;
    line-height: 45px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      background-color: #3f3f3f;
    }
  }
}
</style>