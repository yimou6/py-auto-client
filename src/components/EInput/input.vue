<script lang="ts" setup>
import { computed, shallowRef, nextTick, watch, ref, onMounted } from 'vue';


type TargetElement = HTMLInputElement | HTMLTextAreaElement

const input = shallowRef<HTMLInputElement>()

const props = defineProps<{
    type?: string,
    placeholder?: string,
    modelValue: string | number | null | undefined
}>()

const emits = defineEmits([
    'input', 'blur', 'focus',
    'update:modelValue'
])

const nativeInputValue = computed(() => {
    return props.modelValue == null ? '' : String(props.modelValue)
})

const _ref = computed(() => input.value)

const setNativeInputValue = () => {
    const input = _ref.value
    if (!input || input.value === nativeInputValue.value) return
    input.value = nativeInputValue.value
}

onMounted(() => {
    setNativeInputValue()
})

watch(nativeInputValue, () => setNativeInputValue())

const focused = ref(false)

const handleInput = async (event: Event) => {
    let { value } = event.target as TargetElement


    if (value === nativeInputValue.value) {
        setNativeInputValue()
        return
    }

    emits('update:modelValue', value)
    emits('input', value)

    await nextTick()
    setNativeInputValue()
}

const handleBlur = (event: FocusEvent) => {
    focused.value = false
    emits('blur', event)
}

const handleFocus = (event: FocusEvent) => {
    focused.value = true
    emits('focus', event)
}

const focus = async () => {
    await nextTick()
    _ref.value?.focus()
}

const blur = () => _ref.value?.blur()

defineExpose({
    ref: _ref,
    focus,
    blur,
    input
})
</script>

<template>
    <div class="e-input">
        <div class="e-input__wrapper">
            <input ref="input" class="e-input__inner" :type="type || 'text'" :placeholder="placeholder"
                @input="handleInput" @blur="handleBlur" @focus="handleFocus">
        </div>
    </div>
</template>

<style lang="scss">
.e-input {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    vertical-align: middle;

    .e-input__wrapper {
        display: inline-flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        padding: 1px 10px;
        background-color: #ffffff;
        background-image: none;
        border-radius: 4px;
        box-shadow: 0 0 0 1px #dcdfe6;

        .e-input__inner {
            width: 100%;
            height: 28px;
            line-height: 28px;
            padding: 0;
            outline: none;
            border: none;
            background: none;
            box-sizing: border-box;
            color: #606266;
        }
    }
}
</style>