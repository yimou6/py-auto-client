<template>
  <button class="e-button" :class="buttonClass">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type?: 'primary' | 'info' | ''
}>()

const buttonClass = computed(() => {
  return props.type ? `e-button--${props.type}` : ''
})
</script>

<style scoped lang="scss">
.e-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 30px;
  white-space: nowrap;
  cursor: pointer;
  color: #333333;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: 0.2s;
  font-weight: normal;
  user-select: none;
  vertical-align: middle;
  background-color: #ffffff;
  border: 1px solid #dddddd;
  padding: 8px 18px;
  font-size: 14px;
  border-radius: 4px;

  & + .e-button {
    margin-left: 12px;
  }

  &:hover {
    color: #00ca53;
    border-color: #00ca53;
  }

  &.e-button--primary {
    background-color: #00ca53;
    color: #ffffff;
    border-color: #00ca53;
    &:hover {
      background-color: rgba(0, 202, 83, 0.8);
    }
  }
}
</style>