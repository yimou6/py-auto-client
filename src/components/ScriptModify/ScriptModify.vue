<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useStepStore from '../../stores/step'
import Dialog from '../Dialog/Dialog.vue'
import EInput from '../EInput/EInput.vue'
import EButton from '../EButton/EButton.vue'

const props = defineProps<{
    visible: boolean,
    title: string,
    showClose: boolean,
    scriptValue?: string
}>()
const emits = defineEmits(['update:visible', 'refresh'])

const scriptTitle = ref('')
const store = useStepStore()
const { activeScriptId } = storeToRefs(store)

const tipsStatus = computed(() => {
    if (scriptTitle.value) {
        if (/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(scriptTitle.value)) {
            return 'success'
        }
        return 'error'
    } else {
        return 'warning'
    }
})

watch(
    () => props.visible,
    () => {
        if (props.visible) {
            scriptTitle.value = props.title === '新增' ? '' : props.scriptValue || ''
        }
    }
)

const handleClose = (id?: string) => {
    scriptTitle.value = ''
    emits('update:visible', false)
    store.changeEditScript(false)
    if (typeof id === 'string') {
        console.log(id)
        emits('refresh', id)
    }
}

const handleEnter = () => {
  handleSubmit()
}

const handleSubmit = async () => {
    if (tipsStatus.value === 'success') {
        if (props.title === '新增') {
            await scriptCreate()
        } else {
            await scriptUpdate()
        }
    }
}

const scriptCreate = async () => {
    const { code, msg, data: { filename } } = await window.ipcRenderer.sendEvent('script_create', {
        title: scriptTitle.value
    })
    if (code) {
        handleClose(filename)
    }
}
const scriptUpdate = async () => {
    const { code, msg } = await window.ipcRenderer.sendEvent('script_modify', {
        title: scriptTitle.value,
        filename: activeScriptId.value
    })
    if (code) {
        handleClose(activeScriptId.value)
    }
}

</script>

<template>
    <Dialog :visible.sync="visible" :title="title" :show-close="showClose" @close="handleClose">
        <div class="form-item script-input">
            <label style="width: 40px">名称</label>
            <EInput v-model:value="scriptTitle" style="width: 100%" @enter="handleEnter"></EInput>
        </div>
        <div class="tips" :class="tipsStatus">
            名称仅支持
            <strong>数字[0-9]</strong>、
            <strong>字母[a-z]</strong>、
            <strong>中文</strong>
            以及
            <strong>下划线</strong>{{ tipsStatus }}
            {{ /^ [\u4e00 - \u9fa5_a - zA - Z0 - 9] + $ /.test(scriptTitle) }}
        </div>

        <template #footer>
            <EButton @click="handleClose">关闭</EButton>
            <EButton type="primary" @click="handleSubmit">确认</EButton>
        </template>
    </Dialog>
</template>

<style lang="scss">
.tips {
    font-size: 12px;
    border: 1px solid #f4f4f5;
    background-color: #f4f4f5;
    color: #909399;
    padding: 4px 10px;
    width: 260px;
    border-radius: 4px;

    &.warning {
        color: #e6a23c;
        background-color: #fdf6ec;
        border-color: #fdf6ec;
    }

    &.success {
        color: #67c23a;
        background-color: #f0f9eb;
        border-color: #f0f9eb;
    }

    &.error {
        color: #f56c6c;
        background-color: #fef0f0;
        border-color: #fef0f0;
    }
}
</style>