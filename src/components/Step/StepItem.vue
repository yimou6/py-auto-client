<script setup lang="ts">
import { Step, IClickRightNode } from '../../../types'

const props = defineProps<{
  data: Step,
  parent?: Object
}>()

const emits = defineEmits(['click-left', 'click-right'])

function setInfoTxt(data: Step) {
  switch (data.type) {
    case '快捷键':
      return `${data.type}: ${data.options.hotkey?.filter(item => item).join('+')}`
    case '输入字符':
      return `${data.type}: ${data.options.opera}`
    case '点击图片':
      return `${data.type}：鼠标${data.options.button === 'left' ? '左键' : '右键'} ${data.options.clicks === 'single' ? '单击' : '双击'}`
    case '判断时间':
      return `${data.type}: ${data.options.presses === 0 ? '每周' : '每月'}${data.options.day}`
    case '单击坐标':
      return `${data.type}(x=${data.options.x || 0},y=${data.options.y || 0})`
    case '等待':
      return `${data.type} ${data.options.waitTime}秒`
    case '循环':
      return `${data.type} ${data.options.presses}次`
    case '键盘按键':
      return `${data.type}: 按${data.options.opera}键${data.options.presses}次`
    case '判断图片':
      return `${data.type}: 最多等待${data.options.waitTime}秒`
    default:
      return '未定义'
  }
}

/**
 * @param val
 */
function getNodes(val: Step[] | MouseEvent): Step[] {
  let store: Step[] = []
  if (Object.prototype.toString.call(val) === '[object Array]') {
    store = JSON.parse(JSON.stringify(val))
    store.unshift(props.data)
  } else {
    store.unshift(props.data)
  }
  return store
}

function getPosition(val: IClickRightNode | MouseEvent) {
  let position: MouseEvent
  let store: Step[] = []
  if (Object.prototype.toString.call(val) === '[object PointerEvent]') {
    position = <MouseEvent>val
    store.unshift(props.data)
  } else {
    position = (val as IClickRightNode).position
    store = JSON.parse(JSON.stringify((val as IClickRightNode).nodes))
    store.unshift(props.data)
  }
  return {
    position,
    nodes: store
  }
}

function handleClick(payload: Step[] | MouseEvent) {
  emits('click-left', getNodes(payload))
}

function handleRightClick(val: IClickRightNode | MouseEvent) {
  emits('click-right', getPosition(val))
}
</script>

<template>
  <div class="step-item">
    <div class="step-item-title"
         @click.left.stop="handleClick"
         @click.right.stop="handleRightClick">
      <div class="step-item-image" v-if="data.type.indexOf('图片') > -1">
        <img :src="data.options.opera" alt="图片">
      </div>
      <div class="step-item-info">
        <div class="step-item-info-item">
          <div class="step-item-info-item__type">{{ data.type }}</div>
        </div>
        <div class="step-item-info-item">
          <div class="step-item-info-item__options" v-if="data.options.waitTime">
            {{ data.type === '判断图片' ? '最多' : '' }}
            等待 <strong>{{data.options.waitTime}}秒</strong>
          </div>
          <div class="step-item-info-item__options" v-if="data.options.button">
            {{ data.options.button === 'left' ? '鼠标左键' : '鼠标右键' }}
          </div>
          <div class="step-item-info-item__options" v-if="data.options.clicks">
            {{ data.options.clicks === 'single' ? '单击' : '双击'}}
          </div>
          <div class="step-item-info-item__options" v-if="data.options.x !== undefined">
            坐标： {{ `${data.options.x} x ${data.options.x}` }}
          </div>
          <div class="step-item-info-item__options" v-if="data.options.presses && data.type === '循环'">
            循环 <strong>{{data.options.presses}}</strong> 次
          </div>
          <div class="step-item-info-item__options" v-if="data.options.opera && ['键盘按键', '输入字符'].includes(data.type)">
            <template v-if="data.type === '键盘按键'">
              按 <strong>{{ data.options.presses }}</strong> 次【 <strong>{{ data.options.opera }}</strong> 】键
            </template>
            <template v-if="data.type === '输入字符'">
              输入【 <strong>{{ data.options.opera }}</strong> 】
            </template>
          </div>
          <div class="step-item-info-item__options" v-if="data.type === '判断时间'">
            {{ data.options.presses === 0 ? '每周' : '每月' }}
            {{ data.options.day }}
            {{ data.options.presses === 0 ? '' : '日' }}
          </div>
        </div>
        <div class="step-item-info-item">
          <div class="step-item-info-item__nextWait">等待 <strong>{{ data.nextWait }}秒</strong> 后进行下一步</div>
          <div class="step-item-info-item__errorStop" v-if="data.options.errorStop !== undefined">失败后<strong>{{ data.options.errorStop === 0 ? '继续下一步' : '终止运行' }}</strong></div>
        </div>
      </div>

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
  border-radius: 3px;
  border: 1px solid #f0f0f0;
  width: 570px;
  & + .step-item {
    margin-top: 8px;
  }

  &:hover {
    border-color: #00ca53;
  }

  &-title {
    font-size: 14px;
    padding: 4px 0 4px 4px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .step-item-image {
      width: 50px;
      height: 50px;
      border:  1px solid #dfdfdf;
      background-color: #4d4d4d;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      img {
        max-width: 48px;
        max-height: 48px;
      }
    }

    .step-item-info {
      .step-item-info-item {
        display: flex;
        justify-content: flex-start;
        font-size: 12px;
        font-weight: lighter;
        color: #ffffff;
        div {
          padding: 1px 4px;
          border-radius: 2px;
          user-select: none;
        }
        &__type {
          background-color: #519a73;
        }
        &__nextWait {
          background-color: #7397ab;
        }
        &__options {
          background-color: #a29b7c;
        }
        &__errorStop {
          background-color: #ffb3a7;
        }
        div + div {
          margin-left: 5px;
        }
        & + .step-item-info-item {
          margin-top: 2px;
        }
      }
    }
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