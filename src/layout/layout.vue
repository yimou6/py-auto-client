<template>
  <div class="layout">
    <SideBar @active="handleActive" ref="sideBar"/>
    <Container :filename="filename" @del="handleDel"/>
  </div>
</template>

<script setup lang="ts">
import SideBar from './SideBar.vue'
import Container from './Container.vue'
import { ref, nextTick } from 'vue'

const filename = ref<string>('')
function handleActive(val: string) {
  filename.value = val
}

const sideBar = ref(null)
function handleDel(name: string) {
  if (name === filename.value) {
    filename.value = ''
    nextTick(() => {
      // @ts-ignore
      sideBar.value?.getScriptList()
    })
  }
}
</script>

<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100%;
}
</style>