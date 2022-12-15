<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useStepStore from '../stores/step'
import { storeToRefs } from 'pinia'
import { IScript } from '../types'
import CreateScript from '../components/CreateScript/index.vue'
import { getScripts } from '../ipcRenderer'

const stepStore = useStepStore()
const { scripts, nowScriptTitle } = storeToRefs(stepStore)

/**
 * 获取脚本列表
 */
async function getScriptList() {
  const { code, data } = await getScripts()
  if (code) {
    stepStore.changeScripts(data)
    watchScripts(data)
  }
}

/**
 * 选中脚本，查看脚本步骤
 * @param filename
 * @param name
 */
async function handleActive(filename: string, name: string) {
  stepStore.changeScriptTitle(filename, name)
}

/**
 * 根据 scripts 改变当前选中
 * @param value
 */
function watchScripts(value: IScript[]) {
  if (value.length > 0) {
    if (!value.some((item: IScript) => item.filename === nowScriptTitle.value)) {
      handleActive(value[0].filename, value[0].title)
    }
  } else {
    handleActive('', '')
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
function handleCreate() {
  visible.value = true
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-box">

      <div class="sidebar-nav">

        <div class="sidebar-nav-create" @click="handleCreate">
          <i class="iconfont icon-plus"></i>
          <span>新建</span>
        </div>

      </div>

      <ul class="sidebar-list">
        <li v-for="menu of scripts" :key="menu.filename"
            :class="{ 'active': nowScriptTitle === menu.filename }"
            @click="handleActive(menu.filename, menu.title)">
          <span>{{ menu.title }}</span>
        </li>
      </ul>
    </div>
  </div>

  <CreateScript v-model:visible="visible"></CreateScript>
</template>

<style scoped lang="scss">
.sidebar {
  float: left;
  width: 200px;
  height: 100%;
  position: relative;

  .sidebar-box {
    background-color: #4d4d4d;
    width: 180px;
    margin: 10px auto;
    border-radius: 10px;
    height: calc(100% - 10px);
  }

  .sidebar-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;

    &-create {
      background-color: #00ca53;
      width: 160px;
      height: 32px;
      line-height: 31px;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      font-weight: bold;
      position: relative;
      border-radius: 6px;
      border: none;
      user-select: none;
      outline: none;
      cursor: pointer;
      i {
        display: inline-block;
        margin-right: 10px;
      }
      &:hover {
        background-color: rgba(0, 202, 83, 0.91);
      }
    }
  }
}

.sidebar-list {
  list-style: none;
  padding: 0;
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
    color: #ffffff;
    padding: 0 16px;
    transition: background-color 0.3s;
    user-select: none;
    &.active {
      background-color: #323232;
      color: #00ca53;
      &:hover {
        color: #00ca53;
      }
    }
  }
}
</style>