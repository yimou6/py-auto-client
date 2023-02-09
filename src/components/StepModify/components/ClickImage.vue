<script lang="ts" setup>
import Radio from '../../Radio/Radio.vue'
import EInput from '../../EInput/EInput.vue'
import { MOUSES, CLICKS, ERROR_NEXT } from '../data'
const props = defineProps<{
    button?: string,
    clicks?: number,
    x?: number,
    y?: number,
    error?: string,
    opera?: string
}>()
const emits = defineEmits([
    'update:button',
    'update:clicks',
    'update:x',
    'update:y',
    'update:error',
    'update:opera'
])

const handleButton = (val: string) => emits('update:button', val)
const handleClicks = (val: string) => emits('update:clicks', val)
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