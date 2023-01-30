<script lang="ts" setup>
import { shallowRef, onMounted, computed } from 'vue'

const props = defineProps<{
    value: string
}>()
const emits = defineEmits(['update:value'])
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

const handleInput = (e: Event) => {
    let { value } = e.target as HTMLInputElement
    emits('update:value', value)
}
</script>

<template>
    <div class="e-input">
        <input type="text" ref="inputRef" @input="handleInput">
    </div>
</template>

<style lang="scss">
.e-input {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 2px 12px;
    display: inline-block;
    input {
        outline: none;
        border: none;
        padding: 0;
        width: 100%;
    }
}
</style>
