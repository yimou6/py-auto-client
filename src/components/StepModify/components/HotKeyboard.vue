<template>
  <keyboard type="more" :model-value="hotkey" @change="handleHotkey"></keyboard>
</template>

<script lang="ts" setup>
import Keyboard from "./Keyboard.vue";
const props = defineProps<{
  hotkey?: string[]
}>()
const emits = defineEmits([
    'update:hotkey'
])

const handleHotkey = (value: string[]) => emits('update:hotkey', value)
</script>

<style scoped>

</style>