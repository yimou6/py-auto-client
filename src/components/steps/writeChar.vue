<script setup lang="ts">
/**
 * 输入字符
 */
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

defineProps<{
  value: { opera: string }
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
    <el-form-item label="字符" prop="opera">
      <el-input v-model="value.opera" placeholder="请输入"></el-input>
    </el-form-item>
  </el-form>
</template>