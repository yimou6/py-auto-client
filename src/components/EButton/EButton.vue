<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    type?: string
}>()

const emits = defineEmits(['click'])

const btnClass = computed(() => {
    return props.type ? `e-button-${props.type}` : ''
})

const handleClick = () => {
    emits('click')
}

</script>

<template>
    <button class="e-button" :class="btnClass" @click="handleClick">
        <slot></slot>
    </button>
</template>

<style lang="scss">
.e-button {
    background-color: transparent;
    outline: none;
    border: 1px solid #dddddd;
    border-radius: 4px;
    padding: 4px 15px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #454545;
    display: inline-block;
    cursor: pointer;

    &+.e-button {
        margin-left: 12px;
    }

    &:hover {
        background-color: #ededed;
    }

    &.e-button-primary {
        background-color: #00ca53;
        color: #ffffff;
        border-color: #00ca53;

        &:hover {
            background-color: #24b760;
            border-color: #24b760;
        }
    }
}
</style>