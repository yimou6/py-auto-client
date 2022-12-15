<template>
  <div class="form-item" :class="formItemClass">
    <label>{{ label }}</label>
    <div class="form-item__content">
      <slot></slot>
    </div>
    <span class="form-item__error" v-if="formItemError">{{ formItemError }}</span>
  </div>
</template>

<script setup lang="ts">
import {inject, watch, ref, provide, reactive} from 'vue'
import { formContextKey, formItemContextKey } from './form.type'
const props = defineProps<{
  label: string,
  prop?: string
}>()

const formContext = inject(formContextKey, undefined)
const formItemClass = ref('')
const formItemError = ref('')

watch(
    () => formContext?.errorFiled,
    (val) => {
      if (val?.length && val.length > 0) {
        const obj = val.find(item => item.field === props.prop)
        if (obj) {
          formItemClass.value = 'error'
          formItemError.value = obj.errMsg
        }
      } else {
        formItemClass.value = ''
        formItemError.value = ''
      }
    },
    { deep: true }
)

provide(formItemContextKey, reactive({
  rules: formContext?.rules
}))

</script>

<style scoped lang="scss">
.form-item {
  position: relative;
  padding: 5px 6px;
  margin-bottom: 6px;

  label {
    color: #555555;
    font-weight: normal;
    font-size: 14px;
    background-color: #ffffff;
    user-select: none;
    transition: all 0.3s;
    padding-bottom: 4px;
    margin-bottom: 4px;
    display: block;
    border-bottom: 1px solid #dfdfdf;
  }

  &__content {
  }

  &.error {
    label {
      color: #e52f2f;
      border-color: #e52f2f;
    }
    .form-item__content {
      :deep(.e-input__wrapper) {
        box-shadow: 0 0 0 1px #e52f2f;
      }
    }
  }

  .form-item__error {
    font-size: 12px;
    color: #e52f2f;
    display: block;
    position: absolute;
    bottom: -10px;
    left: 8px;
  }
}
</style>