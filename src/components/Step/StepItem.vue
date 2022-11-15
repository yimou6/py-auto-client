<script setup lang="ts">
// @ts-nocheck
import { IClickNode } from '../../types'
import { IStep } from '../../types/step.type'

const props = defineProps<{
  data: IStep,
  parent?: Object
}>()

const emits = defineEmits(['click-left', 'click-right'])

interface IClickRightNode {
  position: PointerEvent
  nodes: IStep[]
}

function setInfoTxt(data: IStep) {
  switch (data.type) {
    case '快捷键':
      return `${data.type}: ${data.options.hotkey?.filter(item => item).join('+')}`
    case '输入字符':
      return `${data.type}: ${data.options.opera}`
    case '点击图片':
      return `${data.type}：鼠标${data.options.button === 'left' ? '左键' : '右键'} ${data.options.clicks === 'single' ? '单击' : '双击'}`
    case '判断日期':
      return `${data.type}: ${data.options.presses === 0 ? '每周' : '每月'}${data.options.day}`
    case '单击坐标':
      return `${data.type}(x=${data.options.x || 0},y=${data.options.y || 0})`
    case '等待':
      return `${data.type} ${data.options.waitTime}秒`
    case '循环':
      return `${data.type} ${data.options.presses}次`
    case '键盘按键':
      return `${data.type}: 按${data.options.opera}键${data.options.presses}次`
    case '判断图片出现':
      return `${data.type}: 最多等待${data.options.waitTime}秒`
    case '单击图片':
      if (data.options.x || data.options.y) {
        return `${data.type}: 坐标偏移(x=${data.options.x},y=${data.options.y})`
      }
      return `${data.type}`
    default:
      return '未定义'
  }
}

/**
 * @param val
 */
function getNodes(val: IStep[] | PointerEvent): IStep[] {
  let store: IStep[] = []
  if (Object.prototype.toString.call(val) === '[object Array]') {
    store = JSON.parse(JSON.stringify(val))
    store.unshift(props.data)
  } else {
    store.unshift(props.data)
  }
  return store
}

function getPosition(val: IClickRightNode | PointerEvent) {
  let position: PointerEvent
  let store: IStep[] = []
  if (Object.prototype.toString.call(val) === '[object PointerEvent]') {
    position = <PointerEvent>val
    store.unshift(props.data)
  } else {
    position = (val as IClickRightNode).position
    store = JSON.parse(JSON.stringify((val as IClickNode).nodes))
    store.unshift(props.data)
  }
  return {
    position,
    nodes: store
  }
}

function handleClick(val: IStep[] | PointerEvent) {
  emits('click-left', getNodes(val))
}

function handleRightClick(val: IClickRightNode | PointerEvent) {
  emits('click-right', getPosition(val))
}
</script>

<template>
  <div class="step-item">
    <div class="step-item-title"
         @click.left.stop="handleClick"
         @click.right.stop="handleRightClick">
      <span>{{ setInfoTxt(data) }}</span>
      <span>{{ data.name }}</span>
    </div>
    <div class="step-item-child">
      <template v-if="data.success">
        <StepItem v-for="item of data.success"
                  :key="item.id"
                  :data="item"
                  class="step-item-success"
                  :parent="data"
                  @click-left="handleClick"
                  @click-right="handleRightClick"></StepItem>
      </template>
    </div>

    <div class="step-item-child">
      <template v-if="data.fail">
        <StepItem v-for="item of data.fail"
                  :key="item.id"
                  :data="item"
                  class="step-item-fail"
                  :parent="data"
                  @click-left="handleClick"
                  @click-right="handleRightClick"></StepItem>
      </template>
    </div>
    <div class="step-item-child">
      <template v-if="data.last">
        <StepItem v-for="item of data.last"
                  :key="item.id"
                  :data="item"
                  class="step-item-finally"
                  :parent="data"
                  @click-left="handleClick"
                  @click-right="handleRightClick"></StepItem>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.step-item {
  cursor: pointer;
  &-title {
    font-size: 14px;
    padding: 4px 0 4px 4px;
    position: relative;
    &:hover {
      background-color: #f0f0f0;
    }
    span:nth-child(1) {
      font-size: 12px;
      color: #727272;
      background-color: #c0c0c0;
      border-radius: 2px;
      padding: 1px 6px;
      display: inline-block;
      margin-right: 8px;
    }
    span:nth-child(2) {
      font-size: 12px;
      color: #404040;
      font-weight: bold;
    }
  }
  .step-item-success .step-item-title:before {
    background-color: green;
  }
  .step-item-fail .step-item-title:before {
    background-color: red;
  }
  .step-item-finally .step-item-title:before {
    background-color: gray;
  }
  .step-item:first-child .step-item-title:before{
    height: 22px;
    top: 4px;
    border-top-right-radius: 4px;
  }
  .step-item:last-child .step-item-title:before{
    height: 22px;
    bottom: 4px;
    border-bottom-right-radius: 4px;
  }
}

.step-item-child {
  padding-left: 20px;

  .step-item {
    &-title {
      &:before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 26px;
        position: absolute;
        left: -2px;
        top: 0;
      }
    }
  }
}
</style>