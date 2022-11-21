<template>
  <div class="container">
    <div class="step-box">
      <template v-if="stepData.length > 0">
        <CtStep :data="stepData"
                @click-right="handleClickRight"></CtStep>
      </template>
      <div v-else class="step-nodata">
        <span>暂无步骤</span>
        <span @click="handleCreate">立即创建</span>
      </div>
    </div>

    <MouseRightMenu v-model:visible="showStepMenu"
                    :step-info="showStep"
                    :area="area"
                    @select-menu="handleSelectMenu"></MouseRightMenu>

    <steps v-model:visible="visible"
           :step="showStep"
           :menu-key="menuKey"
           :parent-ids="parentIds"
           @refresh="getScript"></steps>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import CtStep from '../components/Step/Step.vue'
import { nextTick, ref, watch } from 'vue'
import MouseRightMenu from '../components/MouseRightMenu/MouseRightMenu.vue'
import useStepStore from '../stores/step'
import { storeToRefs } from 'pinia'
import Steps from '../components/steps/steps.vue'
import { IClickRightNode, Step, IArea, EMouseRightMenu } from '../../types'

const stepStore = useStepStore()
const { nowScriptTitle } = storeToRefs(stepStore)

const stepData = ref([])
const stepDir = ref('')

/**
 * 获取脚本步骤列表
 */
async function getScript() {
  if (nowScriptTitle.value) {
    const result = await window.ipcRenderer.sendEvent('getSteps', { filename: nowScriptTitle.value })
    if (result) {
      stepData.value = result.data
      stepDir.value = result.dir
    }
  }
}
watch(
    () => stepStore.nowScriptTitle,
    () => getScript(),
    { immediate: true }
)

const visible = ref<boolean>(false)
const step = ref<Step>(new Step())
const showStepMenu = ref(false)
const showStep = ref<Step>(new Step())
const area = ref<IArea>({ x: 0, y: 0 })
async function delStep() {
  await window.ipcRenderer.sendEvent('deleteStep', {
    filename: nowScriptTitle.value,
    step: JSON.parse(JSON.stringify(showStep.value)),
    parentIds: JSON.parse(JSON.stringify(parentIds.value))
  })
  await getScript()
}


/**
 * 点击右键菜单选项
 */
const menuKey = ref('')
function handleSelectMenu(key: string) {
  menuKey.value = key
  if (menuKey.value === EMouseRightMenu.del) {
    // 删除
    delStep()
  } else {
    visible.value = true
  }
}

let parentIds = ref<string[]>([])

/**
 * 立即创建
 */
function handleCreate() {
  showStep.value = new Step()
  visible.value = true
  menuKey.value = ''
  parentIds.value = []
}

/**
 * 右键点击步骤
 *  打开右键菜单
 */
function handleClickRight(val: IClickRightNode) {
  showStepMenu.value = true
  showStep.value = val.nodes[val.nodes.length - 1]
  parentIds.value = val.nodes.map(item => item.id) || []
  nextTick().then(() => {
    area.value.x = val.position.x
    area.value.y = val.position.y
  })
}
</script>

<style scoped lang="scss">
.container {
  margin-left: 200px;
  padding-top: 32px;
  height: calc(100% - 110px);

  .step-box {
    padding: 10px;
    height: 100%;

    .step-nodata {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #333333;
      span {
        display: inline-block;
        margin-right: 12px;
      }
      span:nth-child(2) {
        color: #2f82ff;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.step-menu {
  position: fixed;
  width: 120px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 1px 2px 12px #999999;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: #646464;
      padding-left: 10px;
      cursor: pointer;
      font-weight: bold;
      &:hover {
        background-color: #f0f0f0;
        color: #343434;
      }
    }
  }
}
</style>