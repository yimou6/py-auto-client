<script setup lang="ts">
import { IClickPosition } from '../../../types/step'
import {ref, reactive, onMounted, watch} from 'vue'
import EFormItem from '../../EForm/form-item.vue'
import EForm from '../../EForm/form.vue'
import EInput from '../../EInput/input.vue'

const errors = [
  { label: '中断', value: 'stop' },
  { label: '继续', value: 'continue' }
]

const props = defineProps<{
  value: IClickPosition
}>()
const emits = defineEmits(['update:value'])

const mouses = [
  { label: '左键', value: 'left' },
  { label: '右键', value: 'right' }
]
const clicks = [
  { label: '单击', value: 'single' },
  { label: '双击', value: 'double' }
]

const formRef = ref()
const formModel = reactive<IClickPosition>({
  button: 'left',
  clicks: 'single',
  x: 0,
  y: 0
})
const rules = reactive({})

watch(
    () => formModel,
    (val) => {
      emits('update:value', val)
    },
    { deep: true }
)

onMounted(() => {
  formModel.button = props.value.button || 'left'
  formModel.clicks = props.value.clicks || 'single'
  formModel.x = props.value.x || 0
  formModel.y = props.value.y || 0
})

const validate = () => formRef.value.validate()

const handleRadio = (event: Event, key: 'error' | 'button' | 'clicks') => {
  const target = event.target as HTMLElement
  if (target.nodeName === 'SPAN') {
    // @ts-ignore
    formModel[key] = target.dataset.value || ''
  }
}

defineExpose({
  validate
})
</script>

<template>
  <e-form :model="formModel" :rules="rules" ref="formRef">
    <div class="form-item-col2">

      <e-form-item label="鼠标">
        <ul class="radio-box" @click="handleRadio($event, 'button')">
          <li :class="{ 'active': formModel.button === item.value }"
              v-for="item of mouses"
              :key="item.value">
            <span :data-value="item.value">{{ item.label }}</span>
          </li>
        </ul>
      </e-form-item>

      <e-form-item label="点击">
        <ul class="radio-box" @click="handleRadio($event, 'clicks')">
          <li :class="{ 'active': formModel.clicks === item.value }"
              v-for="item of clicks"
              :key="item.value">
            <span :data-value="item.value">{{ item.label }}</span>
          </li>
        </ul>
      </e-form-item>

    </div>

    <div class="form-item-col2">

      <e-form-item label="偏移坐标x">
        <e-input v-model="formModel.x" type="number"></e-input>
      </e-form-item>

      <e-form-item label="偏移坐标y">
        <e-input v-model="formModel.y" type="number"></e-input>
      </e-form-item>

    </div>
  </e-form>
</template>