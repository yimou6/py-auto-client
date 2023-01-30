<script lang="ts" setup>
import Dialog from '../Dialog/Dialog.vue'
import EButton from '../EButton/EButton.vue'
import EInput from '../EInput/EInput.vue';
import { ref, toRaw, watch } from 'vue'
import useStepStore from '../../stores/step'
import { storeToRefs } from 'pinia'
import { IStep } from '../Step/step';
import { formatValidate } from './util'

type RadioKey = 'type' | 'button' | 'clicks' | 'error' | 'presses'

const STEP_TYPES = ['点击图片', '判断图片', '键盘按键', '组合键', '单击坐标', '等待', '输入字符', '循环', '判断时间']
const MOUSES = ['左键', '右键']
const CLICKS = ['单击', '双击']
const ERROR_NEXT = ['中断', '继续']
const DAY_TYPES = ['每周', '每月']

const store = useStepStore()
const { activeScriptId } = storeToRefs(store)

const props = defineProps<{
    visible: boolean,
    title: string,
    showClose: boolean,
    value: IStep,
    ids: string[],
    menu: string
}>()
const emits = defineEmits(['update:visible', 'refresh'])

const formModel = ref<IStep>({
    id: '',
    type: '点击图片',
    nextWait: '1',
    childKey: '',
    options: {
        button: '左键',
        clicks: '单击',
        error: '继续',
        opera: '',
        old_opera: '',
        x: '0',
        y: '0',
        waitTime: '30',
        presses: '1',
        hotkey: ['', '', ''],
        day: '1'
    }
})

watch(
    () => props.visible,
    () => {
        if (props.visible) {
            if (props.title === '修改') {
                const { value } = props
                formModel.value.id = value.id
                formModel.value.type = value.type
                formModel.value.childKey = value.childKey
                formModel.value.nextWait = value.nextWait || '1'
                formModel.value.options.button = value.options.button || '左键'
                formModel.value.options.clicks = value.options.clicks || '单击'
                formModel.value.options.error = value.options.error || '继续'
                formModel.value.options.opera = value.options.opera || ''
                formModel.value.options.old_opera = value.options.opera || ''
                formModel.value.options.x = value.options.x || '0'
                formModel.value.options.y = value.options.y || '0'
                formModel.value.options.waitTime = value.options.waitTime || '30'
                formModel.value.options.presses = value.options.presses || '10'
                formModel.value.options.hotkey = value.options.hotkey || ['', '', '']
            }
        }
    }
)

// 选择图片
const handleImage = async () => {
    const result = await window.ipcRenderer.sendEvent('step_image', {})
    if (result && result.length > 0) {
        formModel.value.options.opera = result[0]
    }
}
// radio select
const handleRadio = (e: Event, key: RadioKey) => {
    const { dataset } = e.target as HTMLElement
    if (key === 'type') {
        formModel.value.type = dataset.value as string
        
    } else {
        formModel.value.options[key] = dataset.value as string
    }
}

const handleClose = (val?: IStep[]) => {
    emits('update:visible', false)
    formModel.value = {
        id: '',
        type: '点击图片',
        nextWait: '1',
        childKey: '',
        options: {
            button: '左键',
            clicks: '单击',
            error: '继续',
            opera: '',
            old_opera: '',
            x: '0',
            y: '0',
            waitTime: '10',
            presses: '1',
            hotkey: ['', '', ''],
            day: '1'
        }
    }
    if (val) {
        emits('refresh', val)
    }
}
const handleSubmit = () => {
    const info: object | string = formatValidate(formModel.value, props.menu)
    if (typeof info === 'string') return

    if (props.title.indexOf('新增') > -1) {
        stepAdd(info)
    } else {
        stepUpdate(info)
    }
}
const stepAdd = async (info: object) => {
    const { code, data } = await window.ipcRenderer.sendEvent('step_add', {
        ids: toRaw(props.ids),
        filename: activeScriptId.value,
        type: props.menu,
        info: toRaw(info)
    })
    if (code) {
        handleClose(data)
    }
}
const stepUpdate = async (info: object) => {
    const { code, data } = await window.ipcRenderer.sendEvent('step_modify', {
        filename: activeScriptId.value,
        ids: toRaw(props.ids),
        info: toRaw(info)
    })
    if (code) {
        handleClose(data)
    }
}
</script>

<template>
    <Dialog :visible.sync="visible" :title="title" :show-close="showClose" @close="handleClose()">
        <div class="form-item">
            <label>步骤类型</label>
            <div class="form-item-content">
                <ul class="form-radio" @click="handleRadio($event, 'type')">
                    <li v-for="item of STEP_TYPES" :key="item" :data-value="item"
                        :class="{ 'active': item === formModel.type }">{{ item }}</li>
                </ul>
            </div>
        </div>
        <div class="form-item">
            <label>结束等待</label>
            <div class="form-item-content">
                <EInput v-model:value="formModel.nextWait" style="width: 60px"></EInput>
                秒
            </div>
        </div>

        <template v-if="formModel.type === '判断时间'">
            <div class="form-item">
                <label>时间类别</label>
                <div class="form-item-content">
                    <ul class="form-radio" @click="handleRadio($event, 'presses')">
                        <li v-for="item of DAY_TYPES" :key="item" :data-value="item"
                            :class="{ 'active': item === formModel.options.presses }">{{ item }}</li>
                    </ul>
                </div>
                
            </div>
            <div class="form-item">
                    <label>具体时间</label>
                    <div class="form-item-content">
                        <EInput v-model:value="formModel.options.day" style="width: 60px"></EInput>
                    </div>
                </div>
        </template>

        <template v-if="formModel.type === '单击坐标'">
            <div class="form-item">
                <label>点击坐标</label>
                <div class="form-item-content">
                    X:
                    <EInput v-model:value="formModel.options.x" style="width: 60px"></EInput>
                    Y:
                    <EInput v-model:value="formModel.options.y" style="width: 60px"></EInput>
                </div>
            </div>
        </template>
        <template v-if="formModel.type === '点击图片'">
            <div class="form-item">
                <label>鼠标按键</label>
                <div class="form-item-content">
                    <ul class="form-radio" @click="handleRadio($event, 'button')">
                        <li v-for="item of MOUSES" :key="item" :data-value="item"
                            :class="{ 'active': item === formModel.options.button }">{{ item }}</li>
                    </ul>
                </div>
            </div>
            <div class="form-item">
                <label>点击次数</label>
                <div class="form-item-content">
                    <ul class="form-radio" @click="handleRadio($event, 'clicks')">
                        <li v-for="item of CLICKS" :key="item" :data-value="item"
                            :class="{ 'active': item === formModel.options.clicks }">{{ item }}</li>
                    </ul>
                </div>
            </div>
            <div class="form-item">
                <label>坐标偏移</label>
                <div class="form-item-content">
                    X:
                    <EInput v-model:value="formModel.options.x" style="width: 60px"></EInput>
                    Y:
                    <EInput v-model:value="formModel.options.y" style="width: 60px"></EInput>
                </div>
            </div>
            <div class="form-item">
                <label>错误处理</label>
                <div class="form-item-content">
                    <ul class="form-radio" @click="handleRadio($event, 'error')">
                        <li v-for="item of ERROR_NEXT" :key="item" :data-value="item"
                            :class="{ 'active': item === formModel.options.error }">{{ item }}</li>
                    </ul>
                </div>
            </div>
            <div class="form-item">
                <label>选择图片</label>
                <div class="form-item-content">
                    <div class="step-img" @click="handleImage">
                        <img :src="formModel.options.opera">
                    </div>
                </div>
            </div>
        </template>

        <template v-if="formModel.type === '判断图片'">
            <div class="form-item">
                <label>判断时间</label>
                <div class="form-item-content">
                    <EInput v-model:value="formModel.options.waitTime" style="width: 60px"></EInput>
                    秒
                </div>
            </div>
            <div class="form-item">
                <label>错误处理</label>
                <div class="form-item-content">
                    <ul class="form-radio" @click="handleRadio($event, 'error')">
                        <li v-for="item of ERROR_NEXT" :key="item" :data-value="item"
                            :class="{ 'active': item === formModel.options.error }">{{ item }}</li>
                    </ul>
                </div>
            </div>
            <div class="form-item">
                <label>选择图片</label>
                <div class="form-item-content">
                    <div class="step-img" @click="handleImage">
                        <img :src="formModel.options.opera">
                    </div>
                </div>
            </div>
        </template>

        <template v-if="formModel.type === '键盘按键'">
            <div class="form-item">
                <label>键盘按键</label>
                <div class="form-item-content">
                    <EInput v-model:value="formModel.options.opera" style="width: 60px"></EInput>
                </div>
            </div>
            <div class="form-item">
                <label>按键次数</label>
                <div class="form-item-content">
                    <EInput v-model:value="formModel.options.presses" style="width: 60px"></EInput>
                </div>
            </div>
        </template>

        <template v-if="formModel.type === '组合键'">
            <div class="form-item">
                <label>键盘按键1</label>
                <div class="form-item-content">
                    <EInput v-model:value="formModel.options.hotkey[0]" style="width: 60px"></EInput>
                </div>
            </div>
            <div class="form-item">
                <label>键盘按键2</label>
                <div class="form-item-content">
                    <EInput v-model:value="formModel.options.hotkey[1]" style="width: 60px"></EInput>
                </div>
            </div>
            <div class="form-item">
                <label>键盘按键3</label>
                <div class="form-item-content">
                    <EInput v-model:value="formModel.options.hotkey[2]" style="width: 60px"></EInput>
                </div>
            </div>
        </template>

        <template v-if="formModel.type === '等待'">
            <div class="form-item">
                <label>等待时间</label>
                <div class="form-item-content">
                    <EInput v-model:value="formModel.options.waitTime" style="width: 60px"></EInput> 秒
                </div>
            </div>
        </template>

        <template v-if="formModel.type === '输入字符'">
            <div class="form-item">
                <label>输入字符</label>
                <div class="form-item-content">
                    <EInput v-model:value="formModel.options.opera" style="width: 120px"></EInput>
                </div>
            </div>
        </template>

        <template v-if="formModel.type === '循环'">
            <div class="form-item">
                <label>循环次数</label>
                <div class="form-item-content">
                    <EInput v-model:value="formModel.options.presses" style="width: 60px"></EInput> 次
                </div>
            </div>
        </template>


        <template #footer>
            <EButton @click="handleClose()">关闭</EButton>
            <EButton type="primary" @click="handleSubmit">确认</EButton>
        </template>
    </Dialog>
</template>

<style lang="scss">
.form-radio {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;

    li {
        color: #454545;
        border: 1px solid #afafaf;
        padding: 2px 6px;
        transition: all .3s;

        &:hover {
            color: #00ca53;
            border-color: #00ca53;
        }

        &.active {
            color: #00ca53;
            border-color: #00ca53;
        }
    }

    li+li {
        margin-left: 4px;
    }
}

.step-img {
    width: 100px;
    height: 100px;
    background-color: #afafaf;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 100%;
    }
}
</style>