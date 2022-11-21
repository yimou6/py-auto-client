<script setup lang="ts">
/**
 * 判断图片
 */
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

const props = defineProps<{
  value: { waitTime: number, opera: string, errorStop: number }
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
    <el-form-item label="最长等待时间" prop="waitTime">
      <el-input v-model.number="value.waitTime"></el-input>
    </el-form-item>

    <el-form-item label="图片" prop="opera">
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