<script lang="ts" setup>
defineProps<{
    visible: boolean,
    title?: string,
    showClose?: boolean
}>()

const emits = defineEmits(['update:visible', 'close'])

const handleClose = () => {
    emits('update:visible', false)
    emits('close')
}
</script>

<template>
    <Teleport to="body">
        <Transition name="dialog-animate">
            <div class="dialog" v-if="visible">
                <div class="dialog-warp">
                    <div class="dialog-title">
                        {{ title }}
                        <span v-if="showClose" class="dialog-close" @click="handleClose">
                            <i class="iconfont icon-guanbi"></i>
                        </span>
                    </div>
                    <div class="dialog-content">
                        <slot></slot>
                    </div>
                    <div class="dialog-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </Transition>

    </Teleport>
</template>

<style lang="scss">
.dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    display: flex;
    justify-content: center;
    align-items: flex-start;

    .dialog-warp {
        background-color: #fff;
        margin-top: 20px;
        border-radius: 4px;
        min-width: 300px;
    }

    .dialog-title {
        position: relative;
        color: #333;
        font-weight: bolder;
        font-size: 14px;
        height: 42px;
        line-height: 42px;
        padding-left: 12px;
        border-bottom: 1px solid #dddddd;

        .dialog-close {
            position: absolute;
            top: 6px;
            right: 10px;
            height: 28px;
            line-height: 28px;
            text-align: center;

            &:hover {
                color: #000;
            }
        }
    }

    .dialog-content {
        padding: 10px;
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 32px;
        padding: 6px 10px;
        border-top: 1px solid #dfdfdf;
    }
}

.dialog-animate-enter-from,
.dialog-animate-leave-to {
    opacity: 0;

    .dialog-warp {
        transform: scale(0.9);
    }
}

.dialog-animate-enter-active,
.dialog-animate-leave-active {
    transition: all 0.5s ease;

    .dialog-warp {
        transition: all 0.3s ease;
        transition-delay: 0.1s;
    }
}
</style>