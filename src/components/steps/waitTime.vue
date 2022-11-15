<script setup lang="ts">
/**
 * 等待
 */
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

defineProps<{
  value: { waitTime: number }
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
    <el-form-item label="等待时间" prop="waitTime">
      <el-input v-model="value.waitTime" placeholder="请输入"></el-input>
    </el-form-item>
  </el-form>
</template>