<script setup lang="ts">
import { IJudgeDate, RadioItem } from '../../../types/step'
import {ref, reactive, onMounted, watch} from 'vue'
import EFormItem from '../../EForm/form-item.vue'
import EForm from '../../EForm/form.vue'

const presses = [
  { label: '每周', value: '1' },
  { label: '每月', value: '2' }
]

const days = ref<RadioItem[]>([])

const props = defineProps<{
  value: IJudgeDate
}>()
const emits = defineEmits(['update:value'])

const formRef = ref()
const formModel = reactive<IJudgeDate>({
  presses: '1',
  day: '1'
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
  formModel.presses = props.value.presses || '1'
  formModel.day = props.value.day || '1'
  setDays()
})

const handleRadio = (event: Event, key: 'presses' | 'day') => {
  const target = event.target as HTMLElement
  if (target.nodeName === 'SPAN') {
    // @ts-ignore
    formModel[key] = target.dataset.value || ''
    if (key === 'presses') {
      setDays()
    }
  }
}

const setDays = () => {
  if (formModel.presses === '1') {
    days.value = setDayArray(7)
  } else {
    days.value = setDayArray(31)
  }

  function setDayArray(num: number) {
    let arr = []
    for (let i = 0; i < num; i++) {
      arr.push({ label: `${num === 7 ? `周${i + 1}` : `${i + 1}日`}`, value: `${i + 1}` })
    }
    return arr
  }
}

const validate = () => formRef.value.validate()

defineExpose({
  validate
})
</script>

<template>
  <e-form :model="formModel" :rules="rules" ref="formRef">

    <e-form-item label="频次">
      <ul class="radio-box" @click="handleRadio($event, 'presses')">
        <li :class="{ 'active': formModel.presses === item.value }"
            v-for="item of presses"
            :key="item.value">
          <span :data-value="item.value">{{ item.label }}</span>
        </li>
      </ul>
    </e-form-item>

    <e-form-item label="时间">
      <ul class="radio-box" @click="handleRadio($event, 'day')">
        <li :class="{ 'active': formModel.day === item.value }"
            v-for="item of days"
            :key="item.value">
          <span :data-value="item.value">{{ item.label }}</span>
        </li>
      </ul>
    </e-form-item>

  </e-form>
</template>