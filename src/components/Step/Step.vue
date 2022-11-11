<script setup lang="ts">
import { StepClass } from '../../types/Step.Class'
import { IClickNode } from '../../types'
import StepItem from './StepItem.vue'

defineProps<{
  data: StepClass[]
}>()
const emits = defineEmits(['click-left', 'click-right'])

function handleClick(step: StepClass[]) {
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
}
</style>