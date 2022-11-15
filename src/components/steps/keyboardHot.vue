<script setup lang="ts">
/**
 * 快捷键
 */
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

defineProps<{
  value: { hotkey: string[] }
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
  <el-form :model="value"
           :rules="rules"
           ref="formRef"
           size="small"
           label-width="85px">
    <el-form-item label="键1">
      <el-input v-model="value.hotkey[0]" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="键2">
      <el-input v-model="value.hotkey[1]" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="键3">
      <el-input v-model="value.hotkey[2]" placeholder="请输入"></el-input>
    </el-form-item>
  </el-form>
</template>