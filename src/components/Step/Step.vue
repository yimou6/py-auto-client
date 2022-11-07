<script setup lang="ts">
import { Step } from '../../types/step'
import StepItem from './StepItem.vue'
import { IClickNode } from './types'

defineProps<{
  data: Step[]
}>()
const emits = defineEmits(['click-left', 'click-right'])

function handleClick(step: Step[]) {
  emits('click-left', step)
}

function handleRightClick(val: IClickNode) {
  emits('click-right', val)
}
</script>

<template>
  <div class="ct-Step">
    <StepItem v-for="item of data"
              :key="item.id"
              :data="item"
              @click-left="handleClick"
              @click-right="handleRightClick"></StepItem>
  </div>
</template>

<style scoped lang="scss">
.ct-Step {
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #c8c8c8;
  }
}
</style>