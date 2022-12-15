<template>
  <form>
    <slot/>
  </form>
</template>

<script setup lang="ts">
import { formContextKey, ErrorField } from './form.type'
import { provide, ref, reactive, toRefs } from 'vue'

const props = defineProps<{
  model: Record<string, any>,
  rules: Partial<Record<string, any[]>>
}>()


const errorFiled = ref<ErrorField[]>([])

const validate = () => {
  errorFiled.value = Object.keys(props.rules)
      .map(key => validateField(key))
      .filter(item => item.errMsg)
  return errorFiled.value.length === 0
}

const validateField = (field: string): ErrorField => {
  let rule = props.rules[field]
  let errMsg = ''
  if (typeof rule !== 'undefined') {
    let len = rule?.length || 0
    for (let i = 0; i < len; i++) {

      if (errMsg) {
        break
      }

      if (rule[i].required) {
        if (typeof props.model[field] === 'undefined' || props.model[field] === '') {
          errMsg = rule[i].message || '该项为必填项'
        }
      }

      if (rule[i].validator) {
        rule[i].validator(props.model[field], (err: string) => {
          errMsg = err
        })
      }

    }
  }
  return { field, errMsg }
}

const clearValidate = () => {
  errorFiled.value = []
}


provide(formContextKey, reactive({
  errorFiled,
  ...toRefs(props)
}))

defineExpose({
  validate,
  clearValidate
})

</script>

<style scoped>

</style>