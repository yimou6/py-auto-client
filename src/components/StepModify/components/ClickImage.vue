<script lang="ts" setup>
import Radio from '../../Radio/Radio.vue'
import EInput from '../../EInput/EInput.vue'
import NumberInput from "../../NumberInput/NumberInput.vue";
import { MOUSES, CLICKS, ERROR_NEXT } from '../step.modify'
const props = defineProps<{
    button?: string,
    clicks?: number,
  wait?: number,
    x?: number,
    y?: number,
    error?: string,
    opera?: string
}>()
const emits = defineEmits([
    'update:button',
    'update:clicks',
    'update:wait',
    'update:x',
    'update:y',
    'update:error',
    'update:opera'
])

const handleButton = (val: string) => emits('update:button', val)
const handleClicks = (val: string) => emits('update:clicks', val)
const handleWait = (val: string) => emits('update:wait', val)
const handleError = (val: string) => emits('update:error', val)
const handleX = (val: string) => emits('update:x', val)
const handleY = (val: string) => emits('update:y', val)

const handleImage = async () => {
    const result = await window.ipcRenderer.sendEvent('step_image', {})
    if (result && result.length > 0) {
        emits('update:opera', result[0])
    }
}
</script>
<template>
  <div class="click-image">
    <div>
      <div class="form-item">
        <label>鼠标按键</label>
        <div class="form-item-content">
          <Radio :modelValue="button" :data="MOUSES" type="button" @change="handleButton"></Radio>
        </div>
      </div>
      <div class="form-item">
        <label>点击次数</label>
        <div class="form-item-content">
          <Radio :modelValue="clicks" :data="CLICKS" type="button" @change="handleClicks"></Radio>
        </div>
      </div>
      <div class="form-item">
        <label>错误处理</label>
        <div class="form-item-content">
          <Radio :modelValue="error" :data="ERROR_NEXT" type="button" @change="handleError"></Radio>
        </div>
      </div>
      <div class="form-item">
        <label>坐标偏移</label>
        <div class="form-item-content" style="display: flex;justify-content: flex-start">
          <EInput :value="x" style="width: 120px" prepend="X" @change="handleX" type="number"></EInput>
          <EInput :value="y" style="width: 120px;margin-left: 10px" prepend="Y" @change="handleY" type="number"></EInput>
        </div>
      </div>
      <div class="form-item">
        <label>等待图片(秒)</label>
        <div class="form-item-content">
          <NumberInput :model-value="wait" :min="0" :max="500" :step="1" @change="handleWait"></NumberInput>
        </div>
      </div>
    </div>
    <div>
      <div class="form-item">
        <label>选择图片</label>
        <div class="form-item-content">
          <div class="step-img" @click="handleImage">
            <img :src="opera">
          </div>
        </div>
      </div>
      <div class="warning-info">
        <p> <strong>错误处理</strong> ：未能在屏幕中找到该图片时进行的操作。</p>
        <p> <strong>等待时间</strong> ：该图片未在第一时间出现在屏幕中，但在等待
          时间内出现，继续进行操作。(时间偏差量)</p>
      </div>
    </div>
  </div>


</template>


<style scoped lang="scss">
.click-image {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  .warning-info {
    border: 1px solid #B99B6B;
    background-color: #fdeace;
    font-size: 12px;
    color: #b68534;
    width: 90%;
    margin-left: 10px;
    padding: 8px;
    border-radius: 5px;
    p {
      padding: 0;
      margin: 0;
    }
  }
}
</style>