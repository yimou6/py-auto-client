<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
interface NumberInputProps {
  modelValue?: number | string
  // 控制按钮位置
  controlPosition?: '' | 'right',
  // 计数器步长
  step?: number,
  // 数值精度:必须是一个非负整数，并且不能小于 step 的小数位数
  precision?: number,
  // 设置计数器允许的最小值
  min?: number,
  // 设置计数器允许的最大值
  max?: number
}

const props = withDefaults(defineProps<NumberInputProps>(), {
  controlPosition: '',
  step: 1,
  precision: 0
})
const emits = defineEmits([
  'update:modelValue',
  'change'
])

const inputValue = ref(0)
const _precision = computed(() =>{
  if (props.precision) {
    return Math.abs(props.precision)
  }
  return 0
})
onMounted(() => {
  setNativeValue()
})

// 设置初始值
const setNativeValue = () => {
  if (props.modelValue) {
    if (isNaN(Number(props.modelValue))) {
      return new Error('model value is not a number')
    } else {
      inputValue.value = parseFloat(Number(props.modelValue).toFixed(_precision.value))
    }
  }
}

// 减
const handleReduce = () => {
  if (props.min === undefined || inputValue.value - props.step >= props.min) {
    inputValue.value -= props.step
  }
  emits('update:modelValue', inputValue.value)
  emits('change', inputValue.value)
}

// 加
const handlePlus = () => {
  if (props.max === undefined || inputValue.value + props.step <= props.max) {
    inputValue.value += props.step
  }
  emits('update:modelValue', inputValue.value)
  emits('change', inputValue.value)
}

// todo: if max < min ?
const handleBlur = () => {
  if (props.max !== undefined && inputValue.value > props.max) {
    inputValue.value = props.max
  }
  if (props.min !== undefined && inputValue.value < props.min) {
    inputValue.value = props.min
  }
  emits('update:modelValue', inputValue.value)
}
const handleChange = () => {
  emits('change', inputValue.value)
}
</script>

<template>
  <div class="ve-number-input">
    <div class="arrow" @click="handleReduce">
      <i class="iconfont icon-jianhao"></i>
    </div>
    <div class="ve-number-input-content">
      <input type="number" v-model="inputValue" @blur="handleBlur" @change="handleChange">
      <div class="control" v-if="controlPosition">
        <span><i class="iconfont icon-arrow-top"></i></span>
        <span><i class="iconfont icon-arrow-bottom"></i></span>
      </div>
    </div>
    <div class="arrow" @click="handlePlus">
      <i class="iconfont icon-jiahao"></i>
    </div>
  </div>
</template>

<style lang="scss">
.ve-number-input {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #606266;
  width: 140px;

  .arrow {
    background-color: #f5f7fa;
    height: 32px;
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;

    i {
      font-size: 14px;
      color: #606266;
    }

    &:hover i {
      color: #333333;
      font-weight: 600;
    }

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

  }

  &-content {
    height: 32px;
    width: calc(100% - 64px);
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 0 0 0 10px;

    input {
      outline: none;
      border: none;
      color: #606266;
    }

    .control {
      display: flex;
      flex-direction: column;
      background-color: #f5f7fa;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;

      span {
        width: 32px;
        height: 15px;
        text-align: center;
        box-sizing: border-box;

        &:first-child {
          border-bottom: 1px solid #dcdfe6;
        }

        i {
          color: #606266;
        }

        &:hover i {
          color: #333333;
          font-weight: 600;
        }
      }
    }
  }
}
</style>