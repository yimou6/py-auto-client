<script lang="ts" setup>
import { toRaw } from 'vue'
import { IStepForm } from "../StepModify/step.modify";

const props = defineProps<{
  // 展示数据
  data: IStepForm,
  // 当前打开鼠标菜单的step id
  activeId?: string
}>()
const emits = defineEmits(['click-left', 'click-right'])


const handleMouseRight = (e: Event) => {
  emits('click-right', e, [toRaw(props.data)])
}

const handleClickRight = (e: Event, val: IStepForm[]) => {
  let temp: IStepForm[] = JSON.parse(JSON.stringify(val))
  temp.unshift(toRaw(props.data))
  emits('click-right', e, temp)
}
</script>

<template>
  <div class="step">
    <div class="step-warp" :class="{ 'active': activeId === data.id }" @click.right="handleMouseRight">
      <div class="step-type">{{ data.type }}</div>
      <div class="step-content">

        <div class="step-base-info">

          <div class="step-tag-warning" v-if="data.type === '判断图片'">
            <span class="warn-title">最长判断时间</span>
            <span class="warn-desc">{{ data.wait }}秒</span>
          </div>

          <div class="step-tag" v-if="['点击坐标', '点击图片'].includes(data.type)">
            {{ data.button === 'left' ? '左键' : '右键' }}
          </div>

          <template v-if="data.type === '组合键'">
            <div class="step-tag" v-for="item of data.hotkey">
              {{ item }}
            </div>
          </template>

          <div class="step-tag" v-if="['单键'].includes(data.type)">
            {{ data.keyboard }}
          </div>
          <div class="step-tag" v-if="['单键'].includes(data.type)">
            {{ data.frequency }}次
          </div>
          <div class="step-tag" v-if="data.chart">
            {{ data.chart }}
          </div>

          <div class="step-tag" v-if="data.dayType">
            {{ data.dayType }}
          </div>
          <div class="step-tag" v-if="data.day">
            {{ data.day }}
          </div>
          <div class="step-tag" v-if="data.type === '等待'">
            {{ data.wait }}
          </div>
          <div class="step-tag" v-if="data.type === '循环'">
            {{ data.frequency }}次
          </div>

          <div class="step-tag" v-if="['点击坐标', '点击图片'].includes(data.type)">
            {{ data.clicks === 1 ? '单击' : '双击' }}
          </div>

          <div class="step-tag-warning" v-if="['点击坐标', '移动光标', '点击图片'].includes(data.type)">
            <span class="warn-title">X</span>
            <span class="warn-desc">{{ data.x }}</span>
          </div>

          <div class="step-tag-warning" v-if="['点击坐标', '移动光标', '点击图片'].includes(data.type)">
            <span class="warn-title">Y</span>
            <span class="warn-desc">{{ data.y }}</span>
          </div>

          <div class="step-tag-warning">
            <span class="warn-title">下一步等待</span>
            <span class="warn-desc">{{ data.nexitWait }}秒</span>
          </div>

          <div class="step-error" :class="data.error" v-if="['判断图片', '点击图片'].includes(data.type)">
            出错{{data.error === 'stop' ? '中断' : '继续'}}
          </div>

        </div>

        <div class="step-img" v-if="data.img">
          <img :src="data.img" alt="img">
        </div>

      </div>
      <div class="step-desc">
        <strong>备注：</strong>
        <span>{{ data.desc || '空' }}</span>
      </div>
    </div>
    <div class="step-child" v-if="data.children">
      <Step v-for="item of data.children" :key="item.id" :data="item" :active-id="activeId" :class="[`${item.childKey || ''}`]" @click-right="handleClickRight"></Step>
    </div>
  </div>
</template>

<style lang="scss">
.step {
  position: relative;
  margin-bottom: 0;
  user-select: none;

  &.success {
    &::before {
      content: "";
      position: absolute;
      top: 48px;
      left: 0;
      width: 26px;
      height: 2px;
      background-color: #67C23A;
    }
    .step-warp {
      &::after {
        background-color: #67C23A;
      }
    }
  }
  &.fail {
    &::before {
      content: "";
      position: absolute;
      top: 48px;
      left: 0;
      width: 26px;
      height: 2px;
      background-color: #F56C6C;
    }
    .step-warp {
      &::after {
        background-color: #F56C6C;
      }
    }
  }
  &.finally {
    &::before {
      content: "";
      position: absolute;
      top: 48px;
      left: 0;
      width: 26px;
      height: 2px;
      background-color: #749cec;
    }
    .step-warp {
      &::after {
        background-color: #749cec;
      }
    }
  }

  &-warp {
    height: 95px;
    padding-left: 20px;
    padding-right: 20px;
    transition: all .3s;
    position: relative;
    overflow: hidden;
    display: inline-block;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: #ffffff;
    margin-top: 5px;

    &:hover {
      box-shadow: 0 1px 12px #bebebe;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
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
      height: 30px;
      line-height: 30px;
    }

    .step-content {
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #565656;
      .step-base-info {
        display: flex;
        justify-content: flex-start;
        font-size: 12px;
        & + .step-img {
          margin-left: 12px;
        }
        .step-tag {
          font-size: 12px;
          border-radius: 4px;
          border: 1px solid #dddddd;
          padding: 6px 12px;
          position: relative;
          & > div {
            position: absolute;
            top: -8px;
            left: -8px;
            background-color: #757575;
            color: #FFFFFF;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            font-size: 12px;
            text-align: center;
            line-height: 18px;
          }
          & + .step-tag,
          & + .step-error,
          & + .step-tag-warning {
            margin-left: 12px;
          }

          &:hover {
            border-color: #333333;
            color: #333333;
          }
        }
        .step-tag-warning {
          font-size: 12px;
          border: 1px solid #d2d2d2;
          border-radius: 4px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 30px;
          .warn-title {
            background-color: #e8e8e8;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 6px;
          }
          .warn-desc {
            padding: 0 10px;
          }
          & + .step-tag,
          & + .step-error,
          & + .step-tag-warning {
            margin-left: 12px;
          }
        }
        .step-error {
          height: 30px;
          line-height: 30px;
          border-radius: 4px;
          border: 1px solid #dddddd;
          padding: 0 10px;
          &.stop {
            background-color: #fcd8d8;
            color: #d95858;
            border-color: #d95858;
          }
          &.continue {
            background-color: #daf6d2;
            color: #00ab46;
            border-color: #00ab46;
          }
        }
      }
      .step-img {
        width: 70px;
        height: 70px;
        margin-bottom: 5px;
        overflow: hidden;
        background-color: #FFFFFF;
        border: 1px solid #dddddd;
        border-radius: 4px;
        img {
          max-width: 100%;
        }
        &:hover {
          border-color: #333333;
        }
      }
    }
.step-desc {
  font-size: 10px;
  color: #4d4d4d;
  padding-top: 5px;
}
  }
}

.step-child {
  border-left: 2px solid #4d4d4d;
  .step {
    padding-left: 26px;
  }
}
</style>