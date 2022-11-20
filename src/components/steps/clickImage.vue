<script setup lang="ts">
/**
 * 单击图片
 */
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

const props = defineProps<{
  value: { button: string, x: number, y: number, opera: string, clicks: string, errorStop: number }
}>()

const formRef = ref<FormInstance>()

const rules = reactive({})

/**
 * 选择图片
 */
async function selectImage() {
  const img = await window.ipcRenderer.sendEvent('selectImage', {})
  props.value.opera = img[0]
}

const validate = (callback: Function) => {
  formRef.value?.validate(valid => callback(valid))
}

defineExpose({
  validate
})
</script>

<template>
  <el-form :model="value" size="small" label-width="85px" ref="formRef" :rules="rules">
    <el-form-item label="鼠标">
      <el-radio-group v-model="value.button">
        <el-radio-button label="left">左键</el-radio-button>
        <el-radio-button label="right">右键</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="点击">
      <el-radio-group v-model="value.clicks">
        <el-radio-button label="single">单击</el-radio-button>
        <el-radio-button label="double">双击</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="偏移坐标x">
      <el-input v-model.number="value.x"></el-input>
    </el-form-item>
    <el-form-item label="偏移坐标y">
      <el-input v-model.number="value.y"></el-input>
    </el-form-item>

    <el-form-item label="图片">
      <el-image style="width: 64px; height: 64px"
                :src="value.opera"
                :preview-src-list="[value.opera]"
                fit="contain"></el-image>
      <el-button size="small"
                 type="primary"
                 style="margin-left: 10px"
                 @click="selectImage">选择</el-button>
    </el-form-item>

    <el-form-item label="出错是否中断" prop="errorStop">
      <el-radio-group v-model="value.errorStop">
        <el-radio-button :label="1">是</el-radio-button>
        <el-radio-button :label="0">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>