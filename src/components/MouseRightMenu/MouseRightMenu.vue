<script setup lang="ts">
// @ts-nocheck
import type { PropType } from 'vue'
import { computed, ref } from 'vue'
import { default as vClickOutside } from '../../directives/click-outside'
import { IArea, Step } from '../../../types'

const props = defineProps({
  area: {
    type: Object as PropType<IArea>,
    default: () => ({ x: 0, y: 0 })
  },
  visible: {
    type: Boolean,
    default: false
  },
  stepInfo: {
    type: Object as PropType<Step>,
    default: ''
  }
})

const emits = defineEmits(['update:visible', 'select-menu'])

/**
 * 关闭右键菜单
 */
const handleClose = () => {
  emits('update:visible', false)
}
/**
 * 点击菜单项
 * @param e
 */
const handleClick = (e: PointerEvent) => {
  emits('select-menu', (e.target as HTMLElement).dataset.menu)
  handleClose()
}

const menuList = computed(() => {
  let other = []
  if (['判断图片', '判断时间', '循环'].includes(props.stepInfo?.type)) {
    console.log('*', props.stepInfo)
    if (validArr(props.stepInfo.success)) {
      other.push('判断成功步骤')
    }
    if (props.stepInfo?.type === '判断图片' || props.stepInfo?.type === '判断时间') {
      if (validArr(props.stepInfo.fail)) {
        other.push('判断失败步骤')
      }
      if (validArr(props.stepInfo.last)) {
        other.push('判断结束步骤')
      }
    }
    return ['添加上一步', '添加下一步'].concat(other, ['修改步骤', '删除步骤'])
  }
  return ['添加上一步', '添加下一步', '修改步骤', '删除步骤']
})

function validArr(arr: Step[] | undefined) {
  return arr?.length === 0 || typeof arr === 'undefined'
}

const menuRef = ref()
const position = computed(() => {

  if (menuRef.value) {
    if (props.area?.y > 380) {
      let y = props.area?.y - menuRef.value.offsetHeight
      y = y < 0 ? 0 : y
      return {
        x: props.area?.x + 5,
        y
      }
    }
  }
  return {
    x: props.area?.x + 5,
    y: props.area?.y
  }
})
</script>

<template>
  <teleport to="body">
    <div v-if="visible"
         ref="menuRef"
         class="mouse-right-menu"
         :style="{ top: position.y + 'px', left: position.x + 'px' }"
         v-click-outside="handleClose">
      <ul @click="handleClick">
        <li v-for="menu of menuList"
            :key="menu"
            :data-menu="menu">{{ menu }}</li>
      </ul>
    </div>
  </teleport>
</template>



<style scoped lang="scss">
.mouse-right-menu {
  position: fixed;
  width: 120px;
  background-color: #ffffff;
  border-radius: 2px;
  border: 1px solid #545454;
  box-shadow: 1px 2px 12px #999999;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      color: #646464;
      padding-left: 10px;
      cursor: pointer;
      font-weight: bold;
      &:hover {
        background-color: #f0f0f0;
        color: #343434;
      }
    }
  }
}
</style>