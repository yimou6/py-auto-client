<script lang="ts" setup>
import { watch, ref, toRaw } from 'vue'
import useStepStore from '../../stores/step'
import { storeToRefs } from 'pinia'
import Step from '../Step/Step.vue'
import MouseMenu from '../MouseMenu/MouseMenu.vue'
import StepModify from '../StepModify/index.vue'
import { IStep } from '../Step/step'
import Dialog from '../Dialog/Dialog.vue'
import EButton from '../EButton/EButton.vue'

const store = useStepStore()
const { activeScriptId, activeScript } = storeToRefs(store)
const stepList = ref<IStep[]>([])
const visible = ref(false)
const menuTop = ref(0)
const menuLeft = ref(0)

const getStep = async () => {
  if (activeScriptId.value) {
    const { code, data } = await window.ipcRenderer.sendEvent('step_get', {
      filename: activeScriptId.value
    })
    const { data: _data, dir } = data
    stepList.value = _data
  }
}

watch(
    () => store.activeScriptId,
    () => getStep(),
    { immediate: true }
)

const handleUpdate = () => {
  store.changeEditScript(true)
}
const handleRun = () => {
  window.ipcRenderer.sendEvent('runCmd', {
    cmd: store.activeScriptId
  })
}
const handleDel = () => {
  store.changeDelScript(true)
}
const handleOpenFile = () => {
  window.ipcRenderer.sendEvent('openExplorer', {
    filename: store.activeScriptId
  })
}
const handleHelp = () => { }

const handleScroll = () => {
  if (visible.value) {
    visible.value = false
  }
}


const stepVisible = ref(false)
const title = ref('新增')
const nowStep = ref<IStep>({
  id: '',
  type: '点击图片',
  nextWait: '5',
  options: {
    button: '左键',
    clicks: '单击',
    error: '继续',
    opera: '',
    x: '2',
    y: '3',
    waitTime: '30',
    presses: '10',
    hotkey: ['', '', ''],
    old_opera: '',
    day: '1'
  }
})
// 选中的step id 数组
const ids = ref<string[]>([])
// 鼠标菜单字段
const menuStr = ref('')
// 当前打开菜单的step id
// 打开菜单时，当前项为选中状态
const activeStepId = ref('')

// 展开鼠标右键菜单
const handleClickRight = (e: PointerEvent, data: IStep[]) => {
  visible.value = true
  // menuTop.value = e.y > 370 ? e.y - 202 : e.y
  menuLeft.value = e.x

  ids.value = data.map(it => it.id)
  activeStepId.value = ids.value[ids.value.length - 1]

  nowStep.value = data[data.length - 1]
  if (nowStep.value.type === '判断图片' || nowStep.value.type === '判断时间') {
    menuTop.value = e.y > 370 ? e.y - 202 : e.y
  } else if (nowStep.value.type === '循环') {
    menuTop.value = e.y > 370 ? e.y - 177 : e.y
  } else {
    menuTop.value = e.y > 370 ? e.y - 124 : e.y
  }
}
const handleAdd = () => {
  title.value = '新增'
  menuStr.value = ''
  stepVisible.value = true

}
const delVisible = ref(false)
const handleMenu = (menu: string) => {
  // 选择菜单之后，取消step的选中状态
  activeStepId.value = ''

  menuStr.value = menu
  if (menu === '删除') {
    delVisible.value = true
  } else if (menu === '从此步开始运行') {
    window.ipcRenderer.sendEvent('runCmd', {
      cmd: store.activeScriptId,
      id: ids.value[0]
    })
  } else {
    // 打开步骤弹窗
    title.value = menu === '修改' ? '修改' : `新增 ${menu}`
    stepVisible.value = true
  }
}
const stepClose = () => {
  nowStep.value = {
    id: '',
    type: '点击图片',
    nextWait: '5',
    options: {
      button: '左键',
      clicks: '单击',
      error: '继续',
      opera: '',
      x: '2',
      y: '3',
      waitTime: '30',
      presses: '10',
      hotkey: ['', '', ''],
      old_opera: '',
      day: '1'
    }
  }
  ids.value = []
  menuStr.value = ''
}
const handleRefresh = (val: IStep[]) => {
  stepList.value = val
}
const handleClose = () => {
  delVisible.value = false
}
const handleSubmit = async () => {
  const { code, data } = await window.ipcRenderer.sendEvent('step_del', {
    ids: toRaw(ids.value),
    filename: activeScriptId.value
  })
  if (code) {
    stepList.value = data
    delVisible.value = false
  }
}
</script>

<template>
  <div class="container">
    <template v-if="!!activeScriptId">
      <div class="container-nav">
        <div class="nav-title">
          <span>{{ activeScript.title }}</span>
          <div>
            <span>创建于 {{ activeScript.createdAt }}</span>
            <span>修改于 {{ activeScript.updatedAt }}</span>
          </div>
        </div>
        <ul>
          <li @click="handleOpenFile">打开文件夹</li>
          <li @click="handleDel">删除</li>
          <li @click="handleUpdate">修改</li>
          <li @click="handleRun">运行</li>
          <!-- <li @click="handleHelp">帮助</li> -->
        </ul>
      </div>
      <div class="container-step" @scroll="handleScroll">
        <Step v-for="item of stepList" :key="item['id']" :data="item" :active-id="activeStepId" @click-right="handleClickRight"></Step>

        <div v-if="stepList.length === 0" class="add-btn">
          <span @click="handleAdd">添加步骤</span>
        </div>
      </div>
    </template>

    <div v-if="!activeScriptId" class="no-data">
      <i class="iconfont icon-zanwushuju"></i>
      <span>暂无数据</span>
    </div>
  </div>

  <MouseMenu v-model:visible="visible" :x="menuTop" :y="menuLeft" :value="nowStep" @menu="handleMenu"></MouseMenu>

  <StepModify v-model:visible="stepVisible" :title="title" show-close :value="nowStep" :ids="ids" :menu="menuStr" @close="stepClose" @refresh="handleRefresh"></StepModify>

  <Dialog v-model:visible="delVisible" title="提示" show-close>
    <div class="del-info">是否确认删除此步骤?</div>
    <template #footer>
      <EButton @click="handleClose">关闭</EButton>
      <EButton type="primary" @click="handleSubmit">确认</EButton>
    </template>
  </Dialog>
</template>

<style lang="scss">
.container {
  width: calc(100% - 200px);

  &-nav {
    height: 50px;
    border-bottom: 1px solid #dfdfdf;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;

    .nav-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      &>span {
        font-weight: bolder;
        font-size: 16px;
        margin-right: 12px;
      }

      &>div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #a1a1a1;

        span {
          font-weight: 500;
          font-size: 12px;
        }
      }
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 12px;
      color: #666666;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 50px;

      li {
        cursor: pointer;
        &:hover {
          color: #00ab46;
          text-decoration: underline;
        }
      }

      li+li {
        margin-left: 10px;
      }
    }
  }

  &-step {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 500px;

    .add-btn {
      color: #00ca53;
      font-size: 14px;
      text-align: center;
      margin-top: 40px;
      cursor: pointer;
      transition: all .3s;
      font-weight: bold;

      &:hover {
        color: #00ab46;
        text-decoration: underline;
      }
    }
  }
}

.del-info {
  color: #454545;
  font-size: 14px;
}
</style>