<script setup lang="ts">
import {
  IStep,
  IClickRightNode,
  IClickImage,
  IJudgeImage,
  IKeyboard,
  IWriteChar,
  IKeyboardHot,
  IClickPosition, IWaitTime, ILoop, IJudgeDate, StepInfo
} from '../../types/step'
import { onMounted, reactive, watch } from 'vue'

const props = defineProps<{
  data: IStep,
  parent?: IStep
}>()

const emits = defineEmits(['click-left', 'click-right'])

// 1、类型 - 用不同颜色区分
// 2、基础信息 - 灰底黑字，重点加粗
// 3、补充信息 - 灰底黑字，重点用不同颜色区分
const stepInfo = reactive<StepInfo>({
  type: '',
  image: '',
  baseInfo: [],
  otherInfo: []
})

watch(
    () => props.data,
    () => {
      formatInfo()
    }
)

onMounted(() => formatInfo())
const formatInfo = () => {
  const { data } = props
  const type = data.type
  let image = ''
  let baseInfo = []
  let otherInfo = [setNextWait(data.nextWait)]
  if (data.type === '点击图片') {
    const options: IClickImage = data.options as IClickImage
    image = options.opera
    baseInfo.push(
        setButton(options.button),
        setClicks(options.clicks),
        setPosition(options.x, options.y, type)
    )
    otherInfo.push(
        setError(options.error)
    )
  } else if (data.type === '判断图片') {
    const options: IJudgeImage = data.options as IJudgeImage
    image = options.opera
    baseInfo.push(
        setJudgeTime(options.waitTime)
    )
    otherInfo.push(
        setError(options.error)
    )
  } else if (data.type === '键盘按键') {
    const options: IKeyboard = data.options as IKeyboard
    baseInfo.push(
        setKeyboard(options.opera, options.presses)
    )
  } else if (data.type === '输入字符') {
    const options: IWriteChar = data.options as IWriteChar
    baseInfo.push(
        setWriteChar(options.opera)
    )
  } else if (data.type === '快捷键') {
    const options: IKeyboardHot = data.options as IKeyboardHot
    baseInfo.push(
        setHotKey(options.hotkey.filter(item => item))
    )
  } else if (data.type === '单击坐标') {
    const options: IClickPosition = data.options as IClickPosition
    baseInfo.push(
        setButton(options.button),
        setClicks(options.clicks),
        setPosition(options.x, options.y, type)
    )
  } else if (data.type === '等待') {
    const options: IWaitTime = data.options as IWaitTime
    baseInfo.push(
        setWait(options.waitTime)
    )
  } else if (data.type === '循环') {
    const options: ILoop = data.options as ILoop
    baseInfo.push(
        setLoop(options.presses)
    )
  } else if (data.type === '判断时间') {
    const options: IJudgeDate = data.options as IJudgeDate
    baseInfo.push(
        setJudgeDate(options.presses, options.day)
    )
  }

  stepInfo.type = type
  stepInfo.image = image
  stepInfo.baseInfo = baseInfo
  stepInfo.otherInfo = otherInfo
}

const setButton = (button: string) => {
  return `<div class="info-default">鼠标 <strong>${button === 'left' ? '左' : '右'}</strong> 键</div>`
}
const setClicks = (clicks: string) => {
  return `<div class="info-default"><strong>${clicks === 'single' ? '单' : '双'}</strong> 击图片</div>`
}
const setPosition = (x: number, y: number, type: string) => {
  return `<div class="info-default">${type === '单击坐标' ? '位置：' : '位置偏移：'}<strong>${x}</strong> x <strong>${y}</strong></div>`
}
const setNextWait = (time: string) => {
  return `<div class="info-default">完成<strong>${time}</strong>秒后进行下一步</div>`
}
const setError = (error: string) => {
  return `<div class="${error} info-default">出错<span>${error === 'continue' ? '继续' : '终止'}</span></div>`
}
const setJudgeTime = (time: string) => {
  return `<div class="info-default">判断时间：<strong>${time}</strong>秒</div>`
}
const setKeyboard = (opera: string, presses: string) => {
  return `<div class="info-default">按<strong>${opera}</strong>键<strong>${presses}</strong>次</div>`
}
const setWriteChar = (opera: string) => {
  return `<div class="info-default">输入字符：<strong>${opera}</strong></div>`
}
const setHotKey = (hotkey: string[]) => {
  return `<div class="info-default">快捷键：<strong>${hotkey.join('+')}</strong></div>`
}
const setWait = (waitTime: string) => {
  return `<div class="info-default">等待：<strong>${waitTime}秒</strong></div>`
}

const setLoop = (loop: string) => {
  return `<div class="info-default">循环<strong>${loop}次</strong></div>`
}
const setJudgeDate = (presses: string, day: string) => {
  return `<div class="info-default">${presses === '1' ? '每周' : '每月'} ${presses === '1' ? '周' : ''}${day}${presses === '1' ? '' : '日'}</div>`
}

/**
 * @param val
 */
function getNodes(val: IStep[] | MouseEvent): IStep[] {
  let store: IStep[] = []
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
  let store: IStep[] = []
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

function handleClick(payload: IStep[] | MouseEvent) {
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
      <div class="step-item-image" v-if="stepInfo.image">
        <img :src="stepInfo.image" alt="图片">
      </div>
      <div class="step-item-info">
        <div class="step-item-info-item info-type">
          <div>{{ stepInfo.type }}</div>
        </div>
        <div class="step-item-info-item base-info">
          <div v-for="item of stepInfo.baseInfo" :key="item" v-html="item"></div>
        </div>
        <div class="step-item-info-item other-info">
          <div v-for="item of stepInfo.otherInfo" :key="item" v-html="item"></div>
        </div>
      </div>

    </div>

    <div class="step-item-child" v-if="data.children">
      <StepItem v-for="item of data.children"
                :key="item.id"
                :class="item.childKey"
                :data="item"
                :parent="data"
                @click-left="handleClick"
                @click-right="handleRightClick"></StepItem>
    </div>
  </div>
</template>

<style scoped lang="scss">
.step-item {
  width: calc(100% - 10px);
  padding-bottom: 10px;

  &-title {
    font-size: 14px;
    padding: 4px 0 4px 4px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    border: 1px solid #d9d9d9;
    border-left: 2px solid #696969;

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
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      &-item {
        display: flex;
        font-weight: lighter;
        border-radius: 2px;
        margin-bottom: 2px;
        div + div {
          margin-left: 4px;
        }
        :deep(.info-default) {
          background-color: #dadada;
          padding: 1px 8px;
        }
        :deep(.continue) {
          background-color: #0ac959;
          font-weight: bold;
          display: inline-block;
          color: #ffffff;
          border-radius: 2px;
        }
        :deep(.stop) {
          background-color: #e04242;
          font-weight: bold;
          display: inline-block;
          color: #ffffff;
          border-radius: 2px;
        }
      }
      &-item:last-child {
        margin-bottom: 0;
      }
      .info-type {
        background-color: #2c8db0;
        padding: 1px 8px;
        color: #ffffff;
      }
      .other-info {

      }
    }
  }
}

.step-item-child {
  padding-left: 20px;
  padding-top: 10px;

  .step-item {
    width: 100%;
    .step-item-title {
      border-left: none;
    }
    &.success {
      border-left: 2px solid #00ca53;
    }
    &.fail {
      border-left: 2px solid #e04242;
    }
    &.finally {
      border-left: 2px solid #2c8db0;
    }
  }
}
</style>