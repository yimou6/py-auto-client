<template>
  <transition>
    <div class="notify" :class="[`notify-${type}`]" v-show="visible">
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {ref, VNode, onMounted} from 'vue'
const props = withDefaults(defineProps<{
  duration?: number,
  message?: string | VNode,
  type?: string
}>(), {
  duration: 3000,
  message: '',
  type: 'info'
})

const visible = ref(false)

onMounted(() => {
  setTimeout(() => {
    if (visible.value) visible.value = false
  }, props.duration)
  visible.value = true
})
</script>

<style scoped lang="scss">
.notify {
  position: fixed;
  top: 15px;
  left: 50%;
  z-index: 100;
  transform: translate(-50%);
  background-color: #ffffff;
  color: #565656;
  font-size: 12px;
  box-shadow: 0 1px 6px rgb(0 0 0 / 20%);
  border-radius: 2px;
  padding: 10px 16px;
  max-width: 180px;
  min-width: 100px;
  span {
    display: block;
    width: 100%;
    word-wrap: break-word;
    word-break: normal;
  }
  &.notify-success {
    background-color: #a5eec4;
    color: #085b2c;
  }
  &.notify-danger {
    background-color: #eea5a5;
    color: #6e0505;
  }
}
</style>