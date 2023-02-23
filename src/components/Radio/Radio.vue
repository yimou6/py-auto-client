<script lang="ts" setup>

interface RadioProps {
    data: any[],
    optLabel?: string,
    optValue?: string,
    type?: 'default' | 'button' | 'border',
    modelValue?: string | number
}

const props = withDefaults(defineProps<RadioProps>(), {
    optLabel: 'label',
    optValue: 'value',
    type: 'default'
})
const emits = defineEmits(['update:modelValue', 'change'])

const handleClick = (e: Event) => {
    const { dataset } = e.target as HTMLElement
    const value = dataset.value as string
    const temp = props.data.find(item => item[props.optValue] == value)
    emits('update:modelValue', temp[props.optValue])
    emits('change', temp[props.optValue], temp)
}
</script>

<template>
    <div class="ve-radio" :class="{ 'radio-button': type === 'button', 'radio-border': type === 'border' }">
        <ul @click.capture="handleClick">
            <li v-for="item of data" :key="item[optValue]" :data-value="item[optValue]"
                :class="{ 'active': modelValue === item[optValue] }">
                <span v-if="type !== 'button'" class="radio-dot" :data-value="item[optValue]"></span>
                <span :data-value="item[optValue]">{{ item[optLabel] }}</span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
.ve-radio {
    &.radio-button {
        ul {
            li {
                border-top: 1px solid #dfdfdf;
                border-bottom: 1px solid #dfdfdf;
                border-right: 1px solid #dfdfdf;

                &:last-child {
                    border-top-right-radius: 4px;
                    border-bottom-right-radius: 4px;
                }

                &:first-child {
                    border-left: 1px solid #dfdfdf;
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                }
                & + li {
                    border-left: none;
                }

                &.active {
                    color: #ffffff;
                    background-color: #B99B6B;
                    border-color: #B99B6B;
                }
            }
        }
    }
    &.radio-border {
        ul {
            li {
                border: 1px solid #dfdfdf;
                border-radius: 4px;
                &+li {
                    margin-left: 10px;
                }

                &.active {
                    color: #B99B6B;
                    border-color: #B99B6B;
                }
            }
        }
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        li {
            font-size: 14px;
            color: #606060;
            cursor: pointer;
            padding: 4px 12px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            position: relative;
            margin-bottom: 2px;
            box-sizing: border-box;

            .radio-dot {
                display: block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: 1px solid #c4c4c4;
                margin-right: 4px;
                box-sizing: border-box;
                &:hover {
                    border-color: #B99B6B;
                }
            }

            &.active {
                color: #B99B6B;
                .radio-dot {
                    border-width: 3px;
                    border-color: #B99B6B;
                }
            }
        }
    }
}
</style>
