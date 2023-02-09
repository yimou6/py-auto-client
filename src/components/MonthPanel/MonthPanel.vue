<script lang="ts" setup>


const props = defineProps<{
    modelValue?: string | number
}>()
const emits = defineEmits(['update:modelValue'])

const generateMonths = () => {
    let i = 1
    let months = []
    let temp = []
    while(i <= 31) {
        temp.push(i)
        if (temp.length === 7 || i === 31) {
            months.push(temp)
            temp = []
        }
        i++
    }
    return months
}

const MONTHS = generateMonths()

const handleClick = (e: Event) => {
    const { dataset } = e.target as HTMLElement
    emits('update:modelValue', dataset.value)
}
</script>

<template>
    <div class="month-panel" v-for="(item, index) of MONTHS" :key="index" @click="handleClick">
        <div v-for="child of item"
             :key="child"
             :class="{ 'active': modelValue == child }"
             :data-value="child">{{ child }}</div>
    </div>
</template>

<style lang="scss">
    .month-panel {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        & > div {
            width: 32px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-bottom: 1px solid #DFDFDF;
            border-left: 1px solid #DFDFDF;
            font-size: 14px;
            color: #666666;
            font-weight: 500;
            transition: all .3s;
            &:last-child {
                border-right: 1px solid #DFDFDF;
            }
            &:hover {
                font-weight: 600;
                color: #00ab46;
            }
            &.active {
                background-color: #00ab46;
                color: #FFFFFF;
                border-color: #00ab46;
            }
        }
        &:first-child {
            border-top: 1px solid #DFDFDF;
        }
    }
</style>