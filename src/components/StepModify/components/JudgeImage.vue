<script lang="ts" setup>
import EInput from "../../EInput/EInput.vue";
import NumberInput from "../../NumberInput/NumberInput.vue";
import Radio from "../../Radio/Radio.vue";
import { ERROR_NEXT } from '../data'

const props = defineProps<{
  waitTime?: number,
  error?: string,
  opera?: string
}>()
const emits = defineEmits([
    'update:waitTime',
    'update:error',
    'update:opera',
])

const handleError = (val: string) => emits('update:error', val)
const handleWaitTime = (val: string) => emits('update:waitTime', val)
const handleImage = async () => {
  const result = await window.ipcRenderer.sendEvent('step_image', {})
  if (result && result.length > 0) {
    emits('update:opera', result[0])
  }
}
</script>

<template>
  <div class="form-item">
    <label>判断时间(秒)</label>
    <div class="form-item-content">
      <NumberInput :model-value="waitTime" :min="0" :max="1000" :precision="0" :step="1" @change="handleWaitTime"></NumberInput>
    </div>
  </div>
  <div class="form-item">
    <label>错误处理</label>
    <div class="form-item-content">
      <Radio :model-value="error" :data="ERROR_NEXT" type="button" @change="handleError"></Radio>
    </div>
  </div>
  <div class="form-item">
    <label>选择图片</label>
    <div class="form-item-content">
      <div class="step-img" @click="handleImage">
        <img :src="opera">
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>