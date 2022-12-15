<script setup lang="ts">
import Layout from './layout/layout.vue'
</script>

<template>
  <layout />
</template>

<style lang="scss">

html, body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: calc(100% - 2px);
  border: 1px solid #333333;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: transparent;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #838383;
}




.button {
  border: 1px solid #dfdfdf;
  border-radius: 2px;
  font-size: 12px;
  font-weight: normal;
  text-align: center;
  background-color: #ffffff;
  cursor: pointer;
  user-select: none;
  outline: none;
  -webkit-app-region: no-drag;
  padding: 4px 16px;

  & + & {
    margin-left: 10px;
  }
}

// input type=number 去掉上下箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
}
input[type='number'] {
  appearance: textfield;
}

</style>
