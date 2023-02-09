<script lang="ts" setup>
import { toRaw } from 'vue'
import { CStep } from '../../types/step.class'

const props = defineProps<{
  // 展示数据
  data: CStep,
  // 当前打开鼠标菜单的step id
  activeId?: string
}>()
const emits = defineEmits(['click-left', 'click-right'])


const handleMouseRight = (e: Event) => {
  emits('click-right', e, [toRaw(props.data)])
}

const handleClickRight = (e: Event, val: CStep[]) => {
  let temp: CStep[] = JSON.parse(JSON.stringify(val))
  temp.unshift(toRaw(props.data))
  emits('click-right', e, temp)
}
</script>

<template>
  <div class="step">
    <div class="step-warp" :class="{ 'active': activeId === data.id }" @click.right="handleMouseRight">
      <div class="step-type">{{ data.type }}</div>
      <div class="step-content">
        <div class="step-img" v-if="data.type.indexOf('图片') > -1">
          <img :src="data.options.opera" alt="图片">
        </div>
        <div class="step-info">

          <div v-if="data.type === '组合键'">
                        <span class="info-dot" v-for="key of data.options.hotkey?.filter(it => it)" :key="key">{{
                            key
                          }}</span>
          </div>

          <div v-if="data.type === '单击坐标'">
            鼠标
            <span class="info-dot">{{ data.options.button === 'left' ? '左键' : '右键' }}</span>
            <span class="info-dot">{{ data.options.clicks === 1 ? '单击' : '双击' }}</span>
            坐标:
            <span class="info-dot">x:{{ data.options.x }} , y:{{ data.options.y }}</span>
          </div>

          <div v-if="data.type === '判断时间'">
            <span class="info-dot">{{ data.options.presses === 1 ? '每周' : '每月' }}</span>
            <span class="info-dot">{{ data.options.day }}</span>
          </div>

          <div v-if="data.type === '点击图片'">
            鼠标
            <span class="info-dot">{{ data.options.button === 'left' ? '左键' : '右键' }}</span>
            <span class="info-dot">{{ data.options.clicks === 1 ? '单击' : '双击' }}</span>
            坐标偏移:
            <span class="info-dot">x:{{ data.options.x }} , y:{{ data.options.y }}</span>
          </div>

          <div v-if="data.type === '判断图片'">
            最长等待
            <span class="info-dot">{{ data.options.waitTime }}秒</span>
          </div>

          <div v-if="data.type === '键盘按键' || data.type === '输入字符'">
            <span class="info-dot">{{ data.options.opera }}</span>
            <template v-if="data.type === '键盘按键'">
              <span class="info-dot">{{ data.options.presses }}</span> 次
            </template>
          </div>

          <div v-if="data.type === '等待'">
            等待
            <span class="info-dot">{{ data.options.waitTime }}秒</span>
          </div>

          <div v-if="data.type === '循环'">
            循环
            <span class="info-dot">{{ data.options.presses }}次</span>
          </div>

          <div>
            <span class="info-dot">{{ data.nextWait }}秒</span>
            后进行下一步
          </div>
        </div>
      </div>
    </div>
    <div class="step-child" v-if="data.children">
      <Step v-for="item of data.children" :key="item.id" :data="item" :active-id="activeId" :class="[`${item.childKey || ''}`]" @click-right="handleClickRight"></Step>
    </div>
  </div>
</template>

<style lang="scss">
.step {
  &.success .step-warp::before {
    background-color: #67C23A;
  }
  &.fail .step-warp::before {
    background-color: #F56C6C;
  }
  &.finally .step-warp::before {
    background-color: #909399;
  }
  &-warp {
    padding: 5px 18px;
    transition: all .3s;
    border-bottom: 1px dashed #dbdbdb;
    border-right: 1px dashed #dbdbdb;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    &:hover {
      background-color: #f3f3f3;
    }

    &.active {
      background-color: #f3f3f3;
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0px;
      height: 100%;
      width: 8px;
      background-color: #4d4d4d;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .step-type {
      font-size: 14px;
      color: #333333;
      font-weight: bold;
    }

    .step-content {
      margin-top: 4px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      .step-img {
        width: 54px;
        height: 54px;
        background-color: #e3e3e3;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border: 2px solid transparent;
        box-sizing: border-box;
        border-radius: 2px;
        cursor: pointer;
        transition: all .3s;
        margin-right: 12px;

        img {
          width: auto;
          height: auto;
          max-height: 100%;
        }

        &:hover {
          border-color: #afafaf;
        }

      }

      .step-info {
        font-size: 12px;
        color: #434343;

        &>div {
          margin-bottom: 2px;
        }

        .info-dot {
          display: inline-block;
          height: 20px;
          line-height: 20px;
          padding-left: 6px;
          padding-right: 6px;
          border: 1px solid #dfdfdf;

          &+.info-dot {
            margin-left: 10px;
          }
        }
      }
    }

  }

  .step-child {
    padding-left: 20px;
    position: relative;

    .step::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 5px;
      width: 20px;
      background-color: #4d4d4d;
    }
  }
}
</style>