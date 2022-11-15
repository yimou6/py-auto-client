<script setup lang="ts">
/**
 * 单击坐标
 */
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

defineProps<{
  value: { button: string, x: number, y: number, clicks: string }
}>()

const formRef = ref<FormInstance>()

const rules = reactive({})

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
    <el-form-item label="坐标x">
      <el-input v-model.number="value.x"></el-input>
    </el-form-item>
    <el-form-item label="坐标y">
      <el-input v-model.number="value.y"></el-input>
    </el-form-item>
  </el-form>
</template>