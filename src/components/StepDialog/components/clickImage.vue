<script setup lang="ts">
import { reactive, watch, onMounted, ref } from 'vue'
import EInput from '../../EInput/input.vue'
import { IClickImage } from '../../../types/step'
import EFormItem from '../../EForm/form-item.vue'
import EForm from '../../EForm/form.vue'

const props = defineProps<{
  value: IClickImage
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
const errors = [
  { label: '中断', value: 'stop' },
  { label: '继续', value: 'continue' }
]

const formModel = reactive<IClickImage>({
  button: 'left',
  clicks: 'single',
  x: 0,
  y: 0,
  error: 'continue',
  opera: '',
  old_opera: ''
})
const rules = {
  opera: [{ required: true, message: '请选择图片', trigger: 'change' }]
}
const formRef = ref()

watch(
    () => formModel,
    (val) => {
      emits('update:value', val)
    },
    { deep: true, immediate: true }
)

onMounted(() => {
  formModel.button = props.value.button || 'left'
  formModel.clicks = props.value.clicks || 'single'
  formModel.x = props.value.x || 0
  formModel.y = props.value.y || 0
  formModel.error = props.value.error || 'continue'
  formModel.opera = props.value.opera || ''
  formModel.old_opera = props.value.opera || ''
})

const handleCRadio = (event: Event, key: 'error' | 'button' | 'clicks') => {
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
    <div class="form-item-col3">

      <e-form-item label="鼠标">
        <ul class="radio-box" @click="handleCRadio($event, 'button')">
          <li :class="{ 'active': formModel.button === item.value }"
              v-for="item of mouses"
              :key="item.value">
            <span :data-value="item.value">{{ item.label }}</span>
          </li>
        </ul>
      </e-form-item>

      <e-form-item label="点击">
        <ul class="radio-box" @click="handleCRadio($event, 'clicks')">
          <li :class="{ 'active': formModel.clicks === item.value }"
              v-for="item of clicks"
              :key="item.value">
            <span :data-value="item.value">{{ item.label }}</span>
          </li>
        </ul>
      </e-form-item>

      <e-form-item label="出错是否中断">
        <ul class="radio-box" @click="handleCRadio($event, 'error')">
          <li :class="{ 'active': formModel.error === item.value }"
              v-for="item of errors"
              :key="item.value">
            <span :data-value="item.value">{{ item.label }}</span>
          </li>
        </ul>
      </e-form-item>

    </div>

    <div class="form-item-col2">
      <e-form-item label="图片" prop="opera">
        <div class="image-box"
             @click="handleImage">
          <img v-if="formModel.opera" :src="formModel.opera" alt=".">
        </div>
      </e-form-item>

      <div>
        <e-form-item label="偏移坐标x" style="width: 100%;">
          <EInput v-model="formModel.x" type="number"></EInput>
        </e-form-item>

        <e-form-item label="偏移坐标y" style="width: 100%;">
          <EInput v-model="formModel.y" type="number"></EInput>
        </e-form-item>
      </div>

    </div>
  </e-form>

</template>

<style lang="scss">
.image-box {
  width: 105px;
  height: 105px;
  background-color: #555555;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 100px;
    max-height: 100px;
  }
}
</style>