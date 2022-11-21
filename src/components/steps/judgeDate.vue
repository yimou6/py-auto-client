<script setup lang="ts">
/**
 * 判断时间
 */
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

defineProps<{
  value: { presses: number, day: number }
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

    <el-form-item label="频次">
      <el-select v-model="value.presses">
        <el-option label="每周" :value="0"></el-option>
        <el-option label="每月" :value="1"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="时间">
      <el-select v-model="value.day">
        <template v-if="value.presses === 0">
          <el-option v-for="item in 7" :key="item" :label="`星期${item}`" :value="item"></el-option>
        </template>
        <template v-else>
          <el-option v-for="item in 31" :label="`${item}日`" :value="item"></el-option>
        </template>
      </el-select>
    </el-form-item>

  </el-form>
</template>