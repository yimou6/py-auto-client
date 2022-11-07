<template>
  <div class="container">
    <div class="title-container">
      <div class="tools">
        <span title="在文件资源管理器打开" @click="handleExplorer()">
          <i class="iconfont icon-file-open"></i>
        </span>
        <span title="删除脚本" @click="handleDelScript()">
          <i class="iconfont icon-delete"></i>
        </span>
      </div>
      <div class="menu">
        <span @click="handleMinimize"><i class="iconfont icon-minus"></i></span>
        <span @click="handleAppClose"><i class="iconfont icon-close"></i></span>
      </div>
    </div>
    <div class="step-box">
      <template v-if="stepData.length > 0">
        <CtStep :data="stepData"
                @click-left="handleClickLeft"
                @click-right="handleClickRight"></CtStep>
      </template>
      <div v-else class="step-nodata">
        <span>暂无步骤</span>
        <span @click="handleCreate">立即创建</span>
      </div>
    </div>

    <StepDialog v-model:visible="visible"
                :menu-key="menuKey"
                :filename="filename"
                :step-info="showStep"
                :parent-ids="parentIds"
                @refresh="getScript(filename)"></StepDialog>

    <MouseRightMenu v-model:visible="showStepMenu"
                    :step-info="showStep"
                    :area="area"
                    @select-menu="handleSelectMenu"></MouseRightMenu>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import CtStep from '../components/Step/Step.vue'
import { nextTick, ref, watch } from 'vue'
import { IArea, EMouseRightMenu, IClickNode } from "../types";
import MouseRightMenu from '../components/MouseRightMenu/index.vue'
import StepDialog from '../components/StepDialog/index.vue'
import { Step } from '../types/step'
const props = defineProps({
  filename: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['del'])
const stepData = ref([])
const stepDir = ref('')

/**
 * 获取脚本列表
 * @param val
 */
async function getScript(val: string) {
  const result = await window.ipc.getSteps(val)
  if (result) {
    stepData.value = result.data
    stepDir.value = result.dir
  }
}
watch(
    () => props.filename,
    (val) => {
      getScript(val)
    }
)

/**
 * 更新显示的步骤列表
 * @param data
 */
function handleUpdateData(data: Step[]) {
  stepData.value = data
}

/**
 * 最小化
 */
function handleMinimize() {
  window.ipc.minimize()
}

/**
 * 最大化
 */
function handleAppClose() {
  window.ipc.appClose()
}

/**
 * 在文件资源管理器打开
 */
function handleExplorer() {
  window.ipc.openExplorer(props.filename)
}

const visible = ref<boolean>(false)
const step = ref<Step>(new Step())
const showStepMenu = ref(false)
const showStep = ref<Step>(new Step())
const area = ref<IArea>({ x: 0, y: 0 })
async function delStep() {
  await window.ipc.deleteStep({
    filename: props.filename,
    step: JSON.parse(JSON.stringify(showStep.value)),
    parentIds: JSON.parse(JSON.stringify(parentIds.value))
  })
  await getScript(props.filename)
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

/**
 * 立即创建
 */
function handleCreate() {
  showStep.value = new Step()
  visible.value = true
  menuKey.value = ''
}

let parentIds = ref<string[]>([])
/**
 * 点击步骤
 *  打开修改弹窗
 */
function handleClickLeft(val: Step[]) {
  console.log(val)
  visible.value = true
  menuKey.value = EMouseRightMenu.edit
  showStep.value = val[val.length - 1]
  parentIds.value = val.map(item => item.id) || []
}

/**
 * 右键点击步骤
 *  打开右键菜单
 */
function handleClickRight(val: IClickNode) {
  console.log('&&', val)
  showStepMenu.value = true
  showStep.value = val.nodes[val.nodes.length - 1]
  parentIds.value = val.nodes.map(item => item.id) || []
  nextTick().then(() => {
    area.value.x = val.position.x
    area.value.y = val.position.y
  })
}

async function handleDelScript() {
  await window.ipc.deleteScript(props.filename)
  emits('del', props.filename)
}
</script>

<style scoped lang="scss">
.container {
  margin-left: 200px;
  height: 100%;
  background-color: #ffffff;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;

  .title-container {
    height: 32px;
    -webkit-app-region: drag;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;

    .tools {
      height: 32px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      -webkit-app-region: no-drag;
      span {
        display: inline-block;
        cursor: pointer;
        color: #353535;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        &:hover {
          color: #f0f0f0;
          background-color: #2f82ff;
        }
      }
      span + span {
        margin-left: 12px;
      }
      span:nth-child(2) {
        &:hover {
          background-color: #d7365c;
        }
      }
    }

    .menu {
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #353535;
      -webkit-app-region: no-drag;
      border-top-right-radius: 8px;
      overflow: hidden;
      span {
        display: inline-block;
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: #e0e0e0;
        }
      }
    }
  }

  .step-box {
    padding: 10px;
    height: 540px;

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