<template>
  <div class="sidebar">
    <div class="sidebar-nav">
      <div class="sidebar-logo"></div>
      <div class="sidebar-title">Python 自动化工具</div>
    </div>
    <ul class="sidebar-list">
      <li v-for="menu of menuList" :key="menu.filename" :class="{ 'active': active === menu.filename }" @click="handleActive(menu.filename)">
        <span>{{ menu.title }}</span>
      </li>
    </ul>
    <div class="button sidebar-button" @click="handleCreate">添加</div>
  </div>

  <dialog-view :visible="visible" title="添加自动脚本">
    <div class="form-item">
      <el-input v-model="scriptTitle" name="scriptTitle" size="small" placeholder="脚本名称"></el-input>
    </div>
    <template #footer>
      <div class="button" @click="handleClose">取消</div>
      <div class="button" @click="handleSubmit">确定</div>
    </template>
  </dialog-view>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import pinyin from 'pinyin'
import DialogView from '../components/DialogView.vue'
defineExpose({
  getScriptList
})
const menuList = ref<{ filename: string, title: string }[]>([])
onMounted(() => {
  getScriptList()
})
async function getScriptList() {
  menuList.value = await window.ipc.getScriptList()
  if (menuList.value.length > 0) {
    if (!menuList.value.some(item => item.filename === active.value)) {
      active.value = menuList.value[0].filename
      await handleActive(active.value)
    }
  } else {
    active.value = ''
  }

}

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
  const result = await window.ipc.createScript({
    title: scriptTitle.value,
    pinyin: pinyin(scriptTitle.value, { style: 'normal' }).join('')
  })
  console.log(result)
  if (result) {
    handleClose()
    await getScriptList()
  }
}

const active = ref<string>('')
const emits = defineEmits(['active'])
async function handleActive(filename: string) {
  active.value = filename
  emits('active', filename)
}
</script>

<style scoped lang="scss">
.sidebar {
  float: left;
  width: 200px;
  height: 100%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #f6f8fa;
  position: relative;

  .sidebar-nav {
    height: 60px;
    width: 170px;
    -webkit-app-region: drag;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    margin: 0 auto;

    .sidebar-logo {
      width: 40px;
      height: 40px;
      background-image: url("../assets/tool.ico");
      background-size: cover;
      border-radius: 5px;
    }

    .sidebar-title {
      color: #595959;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .sidebar-button {
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 145px;
    border-radius: 5px;
  }
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 10px;
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
    overflow-x: hidden;
    overflow-y: auto;
    &.active {
      background-color: #ffffff;
      color: #333333;
      box-shadow: 1px 1px 10px #f0f0f0;
      &:hover {
        background-color: #ffffff;
        color: #333333;
      }
    }
    &:hover {
      background-color: #f6f6f6;
    }
  }
}
</style>