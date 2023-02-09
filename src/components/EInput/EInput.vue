<script lang="ts" setup>
import { shallowRef, onMounted, computed } from 'vue'

const props = withDefaults(defineProps<{
  value?: string | number,
  prepend?: string,
  append?: string,
  type?: 'text' | 'number'
}>(), {
  type: 'text'
})
const emits = defineEmits([
    'update:value',
    'change',
    'blur',
    'enter'
])
const inputRef = shallowRef<HTMLInputElement>()
const _ref = computed(() => inputRef.value)

const nativeInputValue = computed(() => {
  return props.value == null ? '' : String(props.value)
})

const setNativeInputValue = () => {
  const input = _ref.value
  if (!input || input.value === nativeInputValue.value) return
  input.value = nativeInputValue.value
}

onMounted(() => {
    setNativeInputValue()
})

function getValue(e: Event) {
  let { value }: { value: number | string } = e.target as HTMLInputElement
  if (props.type === 'number') {
    value = Number(value)
  }
  return value
}

const handleInput = (e: Event) => {
    emits('update:value', getValue(e))
}
const handleChange = (e: Event) => {
    emits('change', getValue(e))
}
const handleBlur = (e: Event) => {
    emits('blur', getValue(e))
}
const handleEnter = (e: Event) => {
  emits('enter', getValue(e))
}
</script>

<template>
    <div class="e-input">
        <div v-if="prepend" class="e-input-prepend">{{ prepend }}</div>
        <input type="text" ref="inputRef" @input="handleInput" @change="handleChange" @blur="handleBlur" @keydown.enter="handleEnter">
      <div v-if="append" class="e-input-prepend">{{ append }}</div>
    </div>
</template>

<style lang="scss">
.e-input {
    border: 1px solid #dfdfdf;
    border-radius: 4px;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    input {
        outline: none;
        border: none;
        width: 100%;
        padding: 0 8px;
        height: 30px;
    }
    .e-input-prepend {
        background-color: #efefef;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        border-right: 1px solid #dfdfdf;
    }
}
</style>
