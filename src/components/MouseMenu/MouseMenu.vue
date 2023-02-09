<script lang="ts" setup>
import { computed } from 'vue'
import { default as vClickOutside } from '../../directives/click-outside'
import { IStep } from '../Step/step'

const props = defineProps<{
    visible: boolean
    x: number
    y: number,
    value: IStep
}>()
const emits = defineEmits(['update:visible', 'menu'])

// 是否显示 成功、失败、最后步骤
const showOtherMenu = computed(() => {
    return props.value.type === '判断图片' || props.value.type === '判断时间'
})
// 是否显示 失败、最后步骤
const showFailLastMenu = computed(() => {
    return props.value.type === '循环'
})

const disabledSuccessMenu = computed(() => {
    if (showOtherMenu || showFailLastMenu) {
        if (props.value.children && props.value.children.length > 0) {
            return props.value.children.some(item => item.childKey === 'success')
        }
        return false
    }
    return false
})

const disabledFailMenu = computed(() => {
    if (showOtherMenu || showFailLastMenu) {
        if (props.value.children && props.value.children.length > 0) {
            return props.value.children.some(item => item.childKey === 'fail')
        }
        return false
    }
    return false
})

const disabledFinallyMenu = computed(() => {
    if (showOtherMenu || showFailLastMenu) {
        if (props.value.children && props.value.children.length > 0) {
            return props.value.children.some(item => item.childKey === 'finally')
        }
        return false
    }
    return false
})

const handleClick = (e: Event) => {
    const { dataset, className } = e.target as HTMLElement
    if (className.indexOf('disabled') > -1) return
    emits('menu', dataset.menu)
    emits('update:visible', false)
}
const handleClose = () => {
    emits('update:visible', false)
}
</script>

<template>
    <div class="mouse-menu" v-if="visible" v-click-outside="handleClose" :style="{ top: x + 'px', left: y + 'px' }"
        @click="handleClick">
        <div data-menu="从此步开始运行" v-if="!value.childKey">从此步开始运行</div>
        <div data-menu="下一步">下一步</div>
        <div data-menu="上一步">上一步</div>
        <template v-if="showOtherMenu || showFailLastMenu">
            <div data-menu="成功步骤" :class="{ 'disabled': disabledSuccessMenu }">成功步骤</div>
            <div data-menu="失败步骤" v-if="!showFailLastMenu" :class="{ 'disabled': disabledFailMenu }">失败步骤</div>
            <div data-menu="最后步骤" v-if="!showFailLastMenu" :class="{ 'disabled': disabledFinallyMenu }">最后步骤</div>
        </template>

        <div data-menu="修改">修改</div>
        <div data-menu="删除">删除</div>
    </div>
</template>

<style lang="scss">
.mouse-menu {
    position: fixed;
    padding: 10px 0;
    background-color: #fff;
    box-shadow: 1px 0 12px #999;
    border-radius: 2px;

    &>div {
        font-size: 13px;
        color: #454545;
        height: 26px;
        line-height: 26px;
        width: 100px;
        padding: 0 10px;
        cursor: pointer;
        font-weight: 500;
        transition: all .3s;
        user-select: none;

        &:hover {
            background-color: #f3f3f3;
            font-weight: 600;
        }

        &.disabled {
            color: #c0c4cc;
            cursor: not-allowed;
            background-image: none;
            &:hover {
                background-color: transparent !important;
                font-weight: 500 !important;
            }
        }
    }
}
</style>