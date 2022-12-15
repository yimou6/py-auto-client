<template>
  <div class="footer-nav">
    <div @click="handleExplorer" title="打开文件夹">
      <i class="iconfont icon-wenjianjia"></i>
    </div>
    <div @click="handleEdit" title="修改">
      <i class="iconfont icon-bianji"></i>
    </div>
    <div @click="handleDelScript" title="删除">
      <i class="iconfont icon-shanchu"></i>
    </div>
    <div @click="handleRun" title="运行">
      <i class="iconfont icon-bofang"></i>
    </div>
    <div title="帮助">
      <i class="iconfont icon-bangzhu"></i>
    </div>
  </div>
  <CreateScript v-model:visible="visible" title="修改" :script-value="nowScriptName"></CreateScript>
  <EDialog v-model:visible="delVisible" title="提示">
    <p>{{ `是否确认删除脚本：${scripts[delIndex].title}` }}</p>
    <template #footer>
      <e-button @click="delVisible = false">关闭</e-button>
      <e-button type="primary" @click="handleSubmit">确认删除</e-button>
    </template>
  </EDialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useStepStore from '../stores/step'
import { ref } from 'vue'
import CreateScript from '../components/CreateScript/index.vue'
import EDialog from '../components/EDialog/dialog.vue'
import EButton from '../components/EButton/button.vue'
import {deleteScript, openExplorer, runCmd} from '../ipcRenderer'

const stepStore = useStepStore()
const { nowScriptTitle, scripts, nowScriptName } = storeToRefs(stepStore)
const visible = ref(false)
const delVisible = ref(false)
const delIndex = ref(-1)

/**
 * 打开脚本所在文件夹
 */
const handleExplorer = () => openExplorer(nowScriptTitle.value)

/**
 * 删除脚本
 */
const handleDelScript = async () => {
  delVisible.value = true
  if (!nowScriptTitle.value) return
  delIndex.value = scripts.value.findIndex(script => script.filename === nowScriptTitle.value)
}

const handleSubmit = () => {
  deleteScript(nowScriptTitle.value)
  stepStore.$patch((state) => {
    state.scripts.splice(delIndex.value, 1)
  })
  delVisible.value = false
}

/**
 * 运行脚本
 */
const handleRun = () => runCmd(nowScriptTitle.value)

const handleEdit = async () => {
  visible.value = true
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