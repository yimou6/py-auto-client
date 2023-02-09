<template>
  <div class="form-item">
    <label>点击次数</label>
    <div class="form-item-content">
      <NumberInput :model-value="presses" :min="1" :max="50" :step="1"></NumberInput>
    </div>
  </div>
  <Keyboard :model-value="opera" @change="handleOpera"></Keyboard>
</template>

<script lang="ts" setup>
import NumberInput from "../../NumberInput/NumberInput.vue";
import Keyboard from "./Keyboard.vue";

const props = defineProps<{
  presses?: number,
  opera?: string
}>()
const emits = defineEmits([
    'update:opera',
    'update:presses'
])

const handleOpera = (value: string) => emits('update:opera', value)

</script>

<style lang="scss">
</style>