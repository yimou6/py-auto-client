<script setup lang="ts">
import { IKeyboardHot } from '../../../types/step'
import {ref, reactive, onMounted, watch} from 'vue'
import EFormItem from '../../EForm/form-item.vue'
import EForm from '../../EForm/form.vue'
import EInput from '../../EInput/input.vue'

const props = defineProps<{
  value: IKeyboardHot
}>()
const emits = defineEmits(['update:value'])

const formRef = ref()
const formModel = reactive<IKeyboardHot>({
  hotkey: ['', '', '']
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
  if (props.value.hotkey) {
    formModel.hotkey = formModel.hotkey.map((item, index) => {
      item = props.value.hotkey[index] || ''
      return item
    })
  }
})

const validate = () => formRef.value.validate()

defineExpose({
  validate
})
</script>

<template>
  <e-form :model="formModel" :rules="rules" ref="formRef">
    <div class="form-item-col2">

      <e-form-item label="键1">
        <e-input v-model="formModel.hotkey[0]"></e-input>
      </e-form-item>

      <e-form-item label="键2">
        <e-input v-model="formModel.hotkey[1]"></e-input>
      </e-form-item>

      <e-form-item label="键3">
        <e-input v-model="formModel.hotkey[2]"></e-input>
      </e-form-item>

    </div>
  </e-form>
</template>