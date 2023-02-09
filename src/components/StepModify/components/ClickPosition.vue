<script lang="ts" setup>
import Radio from '../../Radio/Radio.vue'
import EInput from '../../EInput/EInput.vue'
import { MOUSES, CLICKS, ERROR_NEXT } from '../data'
const props = defineProps<{
    button?: string,
    clicks?: number,
    x?: number,
    y?: number
}>()
const emits = defineEmits([
    'update:button',
    'update:clicks',
    'update:x',
    'update:y',
])

const handleButton = (val: string) => emits('update:button', val)
const handleClicks = (val: string) => emits('update:clicks', val)
const handleX = (val: string) => emits('update:x', val)
const handleY = (val: string) => emits('update:y', val)

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
        <label>横纵坐标</label>
        <div class="form-item-content" style="display: flex;justify-content: flex-start">
            <EInput :value="x" style="width: 120px" prepend="X" @change="handleX" type="number"></EInput>
            <EInput :value="y" style="width: 120px;margin-left: 10px" prepend="Y" @change="handleY" type="number"></EInput>
        </div>
    </div>
</template>


<style scoped>

</style>