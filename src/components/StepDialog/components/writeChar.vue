<script setup lang="ts">
import { IWriteChar } from '../../../types/step'
import {ref, reactive, onMounted, watch} from 'vue'
import EFormItem from '../../EForm/form-item.vue'
import EForm from '../../EForm/form.vue'
import EInput from '../../EInput/input.vue'

const props = defineProps<{
  value: IWriteChar
}>()
const emits = defineEmits(['update:value'])

const formRef = ref()
const formModel = reactive<IWriteChar>({
  opera: ''
})
const rules = reactive({})

watch(
    () => formModel,
    (val) => {
      emits('update:value', val)
    },
    { deep: true }
)

onMounted(() => {
  formModel.opera = props.value.opera || ''
})

const validate = () => formRef.value.validate()

defineExpose({
  validate
})
</script>

<template>
  <e-form :model="formModel" :rules="rules" ref="formRef">

    <e-form-item label="字符" prop="opera">
      <e-input v-model="formModel.opera" type="number"></e-input>
    </e-form-item>

  </e-form>
</template>