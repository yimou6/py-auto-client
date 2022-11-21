<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import type { Component } from 'vue'
import DialogView from '../DialogView.vue'
import Keyboard from '../steps/keyboard.vue'
import ClickImage from '../steps/clickImage.vue'
import JudgeImage from '../steps/judgeImage.vue'
import JudgeDate from '../steps/judgeDate.vue'
import WriteChar from '../steps/writeChar.vue'
import KeyboardHot from '../steps/keyboardHot.vue'
import ClickPosition from '../steps/clickPosition.vue'
import WaitTime from '../steps/waitTime.vue'
import LoopStep from '../steps/loopStep.vue'
import { Step } from '../../../types'
import { EMouseRightMenu } from '../../../types'
import useStepStore from '../../stores/step'
import { storeToRefs } from 'pinia'

const stepStore = useStepStore()
const { nowScriptTitle } = storeToRefs(stepStore)


const props = defineProps<{
  visible: boolean,
  step: any,
  menuKey: string,
  parentIds: string[]
}>()

interface IType {
  name: string
  component: Component
}

const title = ref<string>('新增')
const typeList: IType[] = [
  { name: '点击图片', component:ClickImage },
  { name: '判断图片', component: JudgeImage },
  { name: '键盘按键', component: Keyboard },
  { name: '输入字符', component: WriteChar },
  { name: '快捷键', component: KeyboardHot },
  { name: '单击坐标', component: ClickPosition },
  { name: '等待', component: WaitTime },
  { name: '循环', component: LoopStep },
  { name: '判断时间', component: JudgeDate }
]

const formRef = ref<FormInstance>()
const formModel = ref<Step>(new Step())

const rules = reactive({
  name: [
    { required: true, trigger: 'blur', message: '请输入步骤名称' }
  ],
  type: [
    { required: true, trigger: 'change', message: '请选择步骤类型' }
  ],
  nextWait: [
    { required: true, trigger: 'blur', message: '请输入等待时间' }
  ]
})

const nowComponent = computed(() => {
  return typeList.find(type => type.name === formModel.value.type)?.component
})

watch(
    () => props.visible,
    (val: boolean) => {
      if (val) {
        if (props.menuKey === EMouseRightMenu.edit) {
          title.value = '修改'
          formModel.value.setValue(props.step)
        } else {
          title.value = '新增'
          formModel.value.clear()
        }
      }
    }
)

const comRef = ref()

const emits = defineEmits(['update:visible', 'refresh'])
function handleClose() {
  if (formRef.value) {
    formRef.value.resetFields()
    formRef.value.clearValidate()
  }
  emits('update:visible', false)
}

function handleSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      comRef.value.validate((v: boolean) => {
        if (v) {
          console.log('提交源数据：', formModel.value.getValue())
          if (title.value === '新增') {
            createStep(formModel.value.getValue())
          } else {
            updateStep(formModel.value.getValue())
          }
        }
      })
    }
  })
}

async function updateStep(step: any) {
  const result = await window.ipcRenderer.sendEvent('modifyStep', {
    filename: nowScriptTitle.value,
    step,
    parentIds: JSON.parse(JSON.stringify(props.parentIds))
  })
  if (result) {
    handleClose()
    emits('refresh')
  }
}


async function createStep(step: any) {
  console.log({ step, parentIds: props.parentIds, menuKey: props.menuKey, scriptName: nowScriptTitle.value })
  const result = await window.ipcRenderer.sendEvent('ipcAddStep', {
    step,
    parentIds: JSON.parse(JSON.stringify(props.parentIds)),
    menuKey: props.menuKey,
    scriptName: nowScriptTitle.value
  })
  if (result) {
    handleClose()
    emits('refresh')
  }
}

</script>

<template>
  <dialog-view v-model:visible="visible" :title="title">
    <el-form size="small"
             label-width="85px"
             ref="formRef"
             :rules="rules"
             :model="formModel">

      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="formModel.name" maxlength="35" clearable></el-input>
      </el-form-item>

      <el-form-item label="步骤类型" prop="type">
        <el-select v-model="formModel.type"
                   style="width: 100%">
          <el-option v-for="item of typeList"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="下一步等待" prop="nextWait">
        <el-input-number
            v-model="formModel.nextWait"
            :min="1"
            :max="20"
            controls-position="right"
            style="width: 100%"/>
      </el-form-item>

      <template v-if="nowComponent">
        <component :is="nowComponent"
                   v-model:value="formModel.options"
                   ref="comRef"></component>
      </template>

    </el-form>

    <template #footer>
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit(formRef)">确定</el-button>
    </template>
  </dialog-view>
</template>