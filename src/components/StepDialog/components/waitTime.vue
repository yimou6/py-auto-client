<script setup lang="ts">
import { IWaitTime } from '../../../types/step'
import {ref, reactive, onMounted, watch} from 'vue'
import EFormItem from '../../EForm/form-item.vue'
import EForm from '../../EForm/form.vue'
import EInput from '../../EInput/input.vue'

const props = defineProps<{
  value: IWaitTime
}>()
const emits = defineEmits(['update:value'])

const formRef = ref()
const formModel = reactive<IWaitTime>({
  waitTime: '10'
})
const rules = reactive({})

watch(
    () => formModel,
    (val) => {
      emits('update:value', val)
    },
    { deep: true, immediate: true }
)

onMounted(() => {
  formModel.waitTime = props.value.waitTime || '10'
})

const validate = () => formRef.value.validate()

defineExpose({
  validate
})
</script>

<template>
  <e-form :model="formModel" :rules="rules" ref="formRef">

    <e-form-item label="等待时间" prop="waitTime">
      <e-input v-model="formModel.waitTime" type="number"></e-input>
    </e-form-item>

  </e-form>
</template>