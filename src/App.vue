<script setup lang="ts">
import SideBar from './components/SideBar/SideBar.vue'
import Container from './components/Container/Container.vue'
</script>

<template>
  <SideBar />
  <Container />
</template>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: #f5f5f5;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border-top: 1px solid #dfdfdf;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
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

  &+& {
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


.form-item {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 14px;
  color: #4d4d4d;

  label {
    margin-right: 10px;
    width: 80px;
    text-align: right;
    height: 30px;
    line-height: 30px;
  }
}

.no-data {
  color: #656565;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  i {
    font-size: 45px;
  }
  span {
    font-size: 14px;
  }
}
</style>
