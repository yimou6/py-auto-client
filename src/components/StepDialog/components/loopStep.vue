<script setup lang="ts">
import { ILoop } from '../../../types/step'
import {ref, reactive, onMounted, watch} from 'vue'
import EFormItem from '../../EForm/form-item.vue'
import EForm from '../../EForm/form.vue'
import EInput from '../../EInput/input.vue'

const props = defineProps<{
  value: ILoop
}>()
const emits = defineEmits(['update:value'])

const formRef = ref()
const formModel = reactive<ILoop>({
  presses: '10'
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
  formModel.presses = props.value.presses || '10'
})

const validate = () => formRef.value.validate()

defineExpose({
  validate
})
</script>

<template>
  <e-form :model="formModel" :rules="rules" ref="formRef">

    <e-form-item label="循环次数">
      <e-input v-model="formModel.presses" type="number"></e-input>
    </e-form-item>

  </e-form>
</template>