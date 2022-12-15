<template>
  <EDialog :visible.sync="visible" :title=" title || '新建'">
    <div class="form-item" :class="formItemClass">
      <label>名称</label>
      <div class="form-item__content">
        <EInput v-model="value" @focus="handleFocus" @blur="handleBlur"></EInput>
      </div>
      <span class="error-msg">{{ errorMsg }}</span>
    </div>

    <template #footer>
      <e-button @click="handleClose">关闭</e-button>
      <e-button type="primary" @click="handleSubmit">保存</e-button>
    </template>
  </EDialog>
</template>

<script setup lang="ts">
import EDialog from '../EDialog/dialog.vue'
import EInput from '../EInput/input.vue'
import EButton from '../EButton/button.vue'
import { ref, onMounted, watch } from 'vue'
import {storeToRefs} from "pinia";
import useStepStore from "../../stores/step";

import { getScripts } from '../../ipcRenderer'

const props = defineProps<{
  visible: boolean,
  title?: string,
  scriptValue?: string
}>()

const emits = defineEmits(['update:visible', 'refresh'])
const stepStore = useStepStore()
const { nowScriptTitle } = storeToRefs(stepStore)

const value = ref('')
const formItemClass = ref<string[]>([])
const rules: RegExp[] = [
  /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
]
const errorMsg = ref('')

watch(
    () => props.visible,
    (val) => {
      if (val && props.scriptValue) {
        value.value = props.scriptValue
        handleFocus()
      }
    }
)

onMounted(() => {
  formItemClass.value = value.value ? ['has'] : []
})

const handleFocus = () => {
  errorMsg.value = ''
  formItemClass.value = ['has', 'focus']
}

const handleBlur = () => {
  formItemClass.value = value.value ? ['has'] : []
  if (rules.length > 0 && value.value) {
    validate()
  }
}

// 验证
const validate = (): boolean => {
  if (rules.every(rule => rule.test(value.value))) {
    formItemClass.value = formItemClass.value.filter(val => val !== 'error')
    return true
  } else {
    if (!formItemClass.value.includes('error')) {
      formItemClass.value.push('error')
    }
    return false
  }
}

// 关闭
const handleClose = () => {
  emits('update:visible', false)
  // 初始化
  errorMsg.value = ''
  value.value = ''
  formItemClass.value = []
}

// 保存
const handleSubmit = async () => {
  if (validate()) {
    if (props.title === '修改') {
      await scriptModify()
    } else {
      await scriptCreate()
    }
    const { code, data } = await getScripts()
    if (code) {
      stepStore.changeScripts(data)
    }
    handleClose()
  }
}

const scriptModify = async () => {
  const { code, msg } = await window.ipcRenderer.sendEvent('script_modify', {
    title: value.value,
    filename: nowScriptTitle.value
  })
  if (code) {
    stepStore.changeScriptTitle(nowScriptTitle.value, value.value)
  } else {
    errorMsg.value = msg
    if (!formItemClass.value.includes('error')) {
      formItemClass.value.push('error')
    }
  }
}

const scriptCreate = async () => {
  const { code, msg, data: { filename } } = await window.ipcRenderer.sendEvent('script_create', {
    title: value.value
  })
  if (code) {
    stepStore.changeScriptTitle(filename, value.value)
  } else {
    errorMsg.value = msg
    if (!formItemClass.value.includes('error')) {
      formItemClass.value.push('error')
    }
  }
}
</script>

<style scoped lang="scss">
.form-item {
  position: relative;
  border: 1px solid #dddddd;
  border-radius: 4px;
  padding: 5px 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  label {
    font-size: 12px;
    padding-left: 10px;
    background-color: #ffffff;
    user-select: none;
    transition: all 0.3s;
    position: absolute;
    top: 12px;
    left: 10px;
    z-index: 1;
    border: none;
  }

  &__content {
    padding-left: 4px;
    width: 100%;
    :deep(.e-input .e-input__wrapper) {
      box-shadow: none;
    }
  }

  .error-msg {
    font-size: 12px;
    color: red;
    position: absolute;
    bottom: -8px;
    left: 20px;
    background-color: #ffffff;
  }

  // 状态：验证错误
  &.error {
    border-color: red;
    label {
      color: red;
    }
    :deep(.e-input .e-input__inner) {
      color: red;
    }
  }
  // 状态：有值
  &.has label{
    top: -10px;
  }
  // 状态：聚焦
  &.focus {
    border-color: #00ca53;
  }
}
</style>