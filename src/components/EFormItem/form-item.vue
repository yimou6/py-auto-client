<script setup lang="ts">
import { useSlots, onMounted, ref, computed } from 'vue'
const props = defineProps<{
    label: string
}>()

const handleBlur = () => {
    console.log('blur');
}

const showFocus = ref<boolean>(false)
const slotRef = ref()

const formItemClass = computed(() => showFocus.value ? 'focus' : 'blur')

onMounted(() => {
    const slots = useSlots()
    const slotDefault = slots.default ? slots.default() : null
    const temp = slotDefault && slotDefault[0]
    showFocus.value = !!temp?.props?.modelValue

    console.log(slotRef.value);
    
})

const handleClick = () => {

}


</script>

<template>
    <div ref="formItemRef" class="e-form-item" :class="formItemClass" @click="handleClick">
        <label>{{ label }}</label>
        <div class="e-form-item__content" @blur="handleBlur">
            <slot ref="slotRef"/>
        </div>
    </div>
</template>

<style lang="scss">
.e-form-item {
    position: relative;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px 6px;
    transition: all 0.3s;

    &.blur {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #747474;
    }

    &.focus {
        color: #4289e6;
        border-color: #4289e6;

        label {
            position: absolute;
            top: -9px;
            left: 20px;
            padding-left: 0;
        }
    }

    label {
        font-size: 12px;
        padding-left: 10px;
        background-color: #fff;
        user-select: none;
    }

    .e-form-item__content {
        padding-left: 4px;

        .e-input__wrapper {
            box-shadow: none;
        }
    }
}
</style>