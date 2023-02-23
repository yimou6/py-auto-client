<script lang="ts" setup>
import { watch, ref, toRaw } from 'vue'
import useStepStore from '../../stores/step'
import { storeToRefs } from 'pinia'
import Step from '../Step/Step.vue'
import MouseMenu from '../MouseMenu/MouseMenu.vue'
import StepModify from '../StepModify/index.vue'
import { IStepForm } from "../StepModify/step.modify"
import Dialog from '../Dialog/Dialog.vue'
import EButton from '../EButton/EButton.vue'
import HeaderBar from './HeaderBar.vue'

const store = useStepStore()
const { activeScriptId, activeScript } = storeToRefs(store)
const stepList = ref<IStepForm[]>([])
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

const handleScroll = () => {
  if (visible.value) {
    visible.value = false
  }
}


const stepVisible = ref(false)
const title = ref('新增')
const nowStep = ref<IStepForm>(new IStepForm())
// 选中的step id 数组
const ids = ref<string[]>([])
// 鼠标菜单字段
const menuStr = ref('')
// 当前打开菜单的step id
// 打开菜单时，当前项为选中状态
const activeStepId = ref('')

// 展开鼠标右键菜单
const handleClickRight = (e: PointerEvent, data: IStepForm[]) => {
  visible.value = true
  // menuTop.value = e.y > 370 ? e.y - 202 : e.y
  menuLeft.value = e.x

  // @ts-ignore
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
  nowStep.value = new IStepForm()
  ids.value = []
  menuStr.value = ''
}
const handleRefresh = (val: IStepForm[]) => {
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

      <HeaderBar />

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

  &-step {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 490px;

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