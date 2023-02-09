<template>
  <div class="keyboard">
    <div v-for="(item, index) of KEYBOARD" :key="index" class="key-line" @click="handleClick">
      <span v-for="it of item"
            :key="it"
            :style="styles(it.size)"
            :class="classes(it.value)"
            :data-value="it.value">{{ it.name }}</span>
    </div>
    <div v-if="type !== 'one'" class="select-tag">
      <span>选中：</span>
      <span class="tag" v-for="(item, index) of hotkey" :key="index" @click="handleRemove(index)">{{ item.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { KEYBOARD } from '../data'

const props = withDefaults(defineProps<{
  modelValue?: string | string[],
  type?: 'one' | 'more'
}>(), {
  type: 'one'
})
const emits = defineEmits([
    'update:modelValue',
    'change'
])

const hotkey = ref<Array<{ label: string, value: string }>>([])
const styles = (size?: number) => {
  if (size) {
    return {
      width: size * 26 + 'px'
    }
  }
  return {}
}

const classes = (value: string) => {
  if (props.type === 'one') {
    return value === props.modelValue ? 'active' : ''
  } else {
    return (props.modelValue as string[]).includes(value) ? 'active' : ''
  }
}

const handleClick = (e: Event) => {
  const { dataset, outerText } = e.target as HTMLElement
  let value: string | string[]
  if (props.type === 'one') {
    value = dataset.value as string
  } else {
    if (hotkey.value.length < 3) {
      hotkey.value.push({
        label: outerText,
        value: dataset.value as string
      })
    }
    value = hotkey.value.map(it => it.value)
  }
  emits('update:modelValue', value)
  emits('change', value)
}

const handleRemove = (index: number) => {
  hotkey.value.splice(index, 1)
  const value = hotkey.value.map(it => it.value)
  emits('update:modelValue', value)
  emits('change', value)
}
</script>

<style scoped lang="scss">

.keyboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.key-line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 4px;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;
    border: 1px solid #dadada;
    font-size: 12px;
    color: #656565;
    font-weight: 500;
    transition: all 0.3s;
    cursor: pointer;
    & + span {
      margin-left: 2px;
    }
    &:hover {
      color: #00ab46;
      border-color: #00ab46;
    }
    &.active {
      color: #ffffff;
      background-color: #00ab46;
      border-color: #00ab46;
    }
  }
}
.select-tag {
  height: 32px;
  line-height: 32px;
  background-color: #efefef;
  width: 100%;
  font-size: 12px;
  margin-top: 12px;
  span:first-child {
    display: inline-block;
    margin-left: 12px;
  }
  & > .tag {
    border: 1px solid #00ab46;
    color: #00ab46;
    padding: 4px 10px;
    cursor: pointer;
    transition: all .5s;
    & + .tag {
      margin-left: 10px;
    }
    &:hover {
      border-color: #f17373;
      color: #f17373;
    }
  }

}
</style>