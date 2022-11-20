<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import pinyin from 'pinyin'
import DialogView from '../components/DialogView.vue'
import useStepStore from '../stores/step'
import { storeToRefs } from 'pinia'
import { IScript } from '../types'
import { ElMessage } from 'element-plus'

const stepStore = useStepStore()
const { scripts, nowScriptTitle } = storeToRefs(stepStore)

/**
 * 获取脚本列表
 */
async function getScriptList() {
  const result: IScript[] = await window.ipcRenderer.sendEvent('getScriptList', {})
  stepStore.changeScripts(result)
  watchScripts(result)
}

/**
 * 选中脚本，查看脚本步骤
 * @param filename
 */
async function handleActive(filename: string) {
  stepStore.changeScriptTitle(filename)
}

/**
 * 根据 scripts 改变当前选中
 * @param value
 */
function watchScripts(value: IScript[]) {
  console.log(value)
  if (value.length > 0) {
    console.log(nowScriptTitle)
    if (!value.some((item: IScript) => item.filename === nowScriptTitle.value)) {
      handleActive(value[0].filename)
    }
  } else {
    handleActive('')
  }
}

onMounted(() => {
  getScriptList()
})

watch(
    () => stepStore.scripts,
    (value: IScript[]) => watchScripts(value),
    { deep: true }
)

const visible = ref<boolean>(false)
const scriptTitle = ref<string>('')
function handleCreate() {
  visible.value = true
}
function handleClose() {
  scriptTitle.value = ''
  visible.value = false
}
async function handleSubmit() {
  const { code, msg } = await window.ipcRenderer.sendEvent('createScript', {
    title: scriptTitle.value,
    pinyin: pinyin(scriptTitle.value, { style: 'normal' }).join('')
  })
  if (code) {
    handleClose()
    ElMessage.success(msg || '创建成功。')
    await getScriptList()
  } else {
    ElMessage.error(msg || '系统出错，创建失败。')
  }
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-box">

      <div class="sidebar-nav">
        <input>
        <span @click="handleCreate">
          <i class="iconfont icon-plus"></i>
        </span>
      </div>

      <ul class="sidebar-list">
        <li v-for="menu of scripts" :key="menu.filename"
            :class="{ 'active': nowScriptTitle === menu.filename }"
            @click="handleActive(menu.filename)">
          <span>{{ menu.title }}</span>
        </li>
      </ul>
    </div>
  </div>

  <dialog-view :visible="visible" title="添加自动脚本">
    <div class="form-item">
      <el-input v-model="scriptTitle" name="scriptTitle" size="small" placeholder="脚本名称"></el-input>
    </div>
    <template #footer>
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </dialog-view>
</template>

<style scoped lang="scss">
.sidebar {
  float: left;
  width: 200px;
  height: 100%;
  position: relative;

  .sidebar-box {
    background-color: #ededed;
    width: 170px;
    margin: 10px auto;
    border-radius: 5px;
    height: calc(100% - 20px);
  }

  .sidebar-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 10px;

    input {
      width: 100px;
      background-color: transparent;
      outline: none;
      border: 1px solid #d9d9d9;
      height: 24px;
      line-height: 24px;
      padding-left: 16px;
      border-radius: 12px;
      font-size: 12px;
      color: #333333;
    }
    span {
      color: #8d8d8d;
      border-radius: 50%;
      border: 1px solid #d9d9d9;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      cursor: pointer;
      &:hover {
        border-color: #333333;
        color: #333333;
      }
    }
  }
}

.sidebar-list {
  list-style: none;
  padding: 0 6px;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100% - 65px);
  li {
    height: 32px;
    line-height: 32px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    color: #8d8d8d;
    border-radius: 4px;
    padding: 0 16px;
    margin-bottom: 2px;
    transition: background-color 0.3s;
    user-select: none;
    &.active {
      background-color: #dadada;
      color: #333333;
      box-shadow: 1px 1px 10px #f0f0f0;
      &:hover {
        background-color: #dadada;
        color: #333333;
      }
    }
    &:hover {
      background-color: #f6f6f6;
    }
  }
}
</style>