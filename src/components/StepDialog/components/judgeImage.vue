<script setup lang="ts">
import { IJudgeImage } from '../../../types/step'
import {ref, reactive, onMounted, watch} from 'vue'
import EFormItem from '../../EForm/form-item.vue'
import EForm from '../../EForm/form.vue'
import EInput from '../../EInput/input.vue'

const errors = [
  { label: '中断', value: 'stop' },
  { label: '继续', value: 'continue' }
]

const props = defineProps<{
  value: IJudgeImage
}>()
const emits = defineEmits(['update:value'])

const formRef = ref()
const formModel = reactive<IJudgeImage>({
  waitTime: '5',
  opera: '',
  error: 'continue',
  old_opera: ''
})

const rules = reactive({})
watch(
    () => formModel,
    (val) => {
      emits('update:value', val)
    },
    { deep: true, immediate: true }
)

onMounted(() => {
  formModel.waitTime = props.value.waitTime || '5'
  formModel.opera = props.value.opera || ''
  formModel.old_opera = props.value.opera || ''
  formModel.error = props.value.error || 'continue'
})

const handleRadio = (event: Event, key: 'error' | 'button' | 'clicks') => {
  const target = event.target as HTMLElement
  if (target.nodeName === 'SPAN') {
    // @ts-ignore
    formModel[key] = target.dataset.value || ''
  }
}
const handleImage = async () => {
  const img = await window.ipcRenderer.sendEvent('step_image', {})
  if (img) {
    formModel.opera = img[0]
  }
}

const validate = () => formRef.value.validate()

defineExpose({
  validate
})
</script>

<template>
  <e-form :model="formModel" :rules="rules" ref="formRef">
    <div class="form-item-col2">

      <e-form-item label="图片" prop="opera">
        <div class="image-box"
             @click="handleImage">
          <img v-if="formModel.opera" :src="formModel.opera" alt=".">
        </div>
      </e-form-item>

      <div>
        <e-form-item label="最长等待时间" prop="waitTime" style="width: 100%">
          <e-input v-model="formModel.waitTime" type="number"></e-input>
        </e-form-item>
        <e-form-item label="出错是否中断" style="width: 100%">
          <ul class="radio-box" @click="handleRadio($event, 'error')">
            <li :class="{ 'active': formModel.error === item.value }"
                v-for="item of errors"
                :key="item.value">
              <span :data-value="item.value">{{ item.label }}</span>
            </li>
          </ul>
        </e-form-item>
      </div>

    </div>
  </e-form>
</template>