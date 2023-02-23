<script lang="ts" setup>
import Dialog from '../Dialog/Dialog.vue'
import EButton from '../EButton/EButton.vue'
import EInput from '../EInput/EInput.vue';
import { ref, toRaw, watch } from 'vue'
import useStepStore from '../../stores/step'
import { storeToRefs } from 'pinia'
import Radio from '../Radio/Radio.vue'
import NumberInput from '../NumberInput/NumberInput.vue'
import {
  menuChildKeyMap,
  DAY_TYPES,
  WEEK,
  STEP_TYPES,
  STEP_TYPES_CHILD,
  IStepForm
} from './step.modify'
import MonthPanel from '../MonthPanel/MonthPanel.vue'
import ClickImage from './components/ClickImage.vue'
import JudgeImage from './components/JudgeImage.vue'
import PressKeyboard from "./components/PressKeyboard.vue";
import HotKeyboard from "./components/HotKeyboard.vue";
import ClickPosition from "./components/ClickPosition.vue";
import notify from '../Notify/notify'

const store = useStepStore()
const { activeScriptId } = storeToRefs(store)

const props = defineProps<{
  visible: boolean,
  title: string,
  showClose: boolean,
  value: IStepForm,
  ids: string[],
  menu: string
}>()
const emits = defineEmits(['update:visible', 'refresh'])

const formModel = ref<IStepForm>(new IStepForm())

watch(
    () => props.visible,
    () => {
      if (props.visible) {
        const { value } = props
        if (props.title === '修改') {
          formModel.value.setValue(value)
          formModel.value.oldImag = value.img
          console.log(value.img)
          handleChange()
        } else {
          formModel.value = new IStepForm()
          if (value.childKey) formModel.value.childKey = value.childKey
        }
      }
    }
)

const handleChange = () => {
  if (formModel.value.type === '鼠标点击') {
    formModel.value.secType = '点击图片'
  } else if (formModel.value.type === '键盘按键') {
    formModel.value.secType = '单键'
  } else {
    formModel.value.secType = ''
  }
}

const handleClose = (data?: IStepForm) => {
  emits('update:visible', false)
  if (data) {
    emits('refresh', data)
  }
}

const handleSubmit = () => {
  const childKey = menuChildKeyMap[props.menu] || formModel.value.childKey
  const temp = toRaw(formModel.value.formatFormKeyValue())
  let info = JSON.parse(JSON.stringify(delObjUndefined(Object.assign(temp, { childKey }))))
  if (props.title.indexOf('新增') > -1) {
    stepAdd(info)
  } else {
    stepUpdate(info)
  }
}

async function stepAdd (info: object) {
  const { code, data, msg } = await window.ipcRenderer.sendEvent('step_add', {
    ids: toRaw(props.ids),
    filename: activeScriptId.value,
    type: props.menu,
    info: info
  })
  if (code) {
    handleClose(data)
  } else {
    notify({ type: 'danger', message: msg })
  }
}
async function stepUpdate (info: object) {
  const { code, data, msg } = await window.ipcRenderer.sendEvent('step_modify', {
    filename: activeScriptId.value,
    ids: toRaw(props.ids),
    info: info
  })
  if (code) {
    handleClose(data)
  } else {
    notify({ type: 'danger', message: msg })
  }
}

function delObjUndefined(o: Record<string, any>) {
  Object.keys(o).forEach(k => {
    if (o[k] === undefined) {
      delete o[k]
    } else if (Object.prototype.toString.call(o[k]) === '[object Object]') {
      delObjUndefined(o[k])
    }
  })
  return o
}

</script>

<template>
  <Dialog :visible.sync="visible" :title="title" :show-close="showClose" width="650px" @close="handleClose()">

    <div class="form-item">
      <label>步骤类型</label>
      <div class="form-item-content">
        <Radio v-model="formModel.type" :data="STEP_TYPES" type="button" @change="handleChange"></Radio>
      </div>
    </div>

    <div class="form-item" v-if="['鼠标点击', '键盘按键'].includes(formModel.type)">
      <label>二级类型</label>
      <div class="form-item-content">
<!--        @ts-ignore -->
        <Radio v-model="formModel.secType" :data="STEP_TYPES_CHILD[formModel.type]" type="button"></Radio>
      </div>
    </div>

    <template v-if="formModel.type === '判断时间'">
      <div class="form-item">
        <label>时间类别</label>
        <div class="form-item-content">
          <Radio v-model="formModel.dayType" :data="DAY_TYPES" type="button"></Radio>
        </div>

      </div>
      <div class="form-item">
        <label>具体时间</label>
        <div class="form-item-content">
          <Radio v-model="formModel.day" :data="WEEK" type="button" v-if="formModel.dayType === '每周'"></Radio>
          <template v-else>
            <MonthPanel v-model="formModel.day"></MonthPanel>
          </template>
        </div>
      </div>
    </template>

    <ClickPosition v-if="formModel.secType === '点击坐标'"
                   v-model:button="formModel.button"
                   v-model:clicks="formModel.clicks"
                   v-model:x="formModel.x"
                   v-model:y="formModel.y"></ClickPosition>

    <ClickImage v-if="formModel.secType === '点击图片'"
                v-model:button="formModel.button"
                v-model:clicks="formModel.clicks"
                v-model:wait="formModel.wait"
                v-model:error="formModel.error"
                v-model:x="formModel.x"
                v-model:y="formModel.y"
                v-model:opera="formModel.img"></ClickImage>

    <JudgeImage v-if="formModel.type === '判断图片'"
                v-model:error="formModel.error"
                v-model:opera="formModel.img"
                v-model:wait-time="formModel.wait"/>

    <PressKeyboard v-if="formModel.secType === '单键'"
                   v-model:opera="formModel.keyboard"
                   v-model:presses="formModel.frequency"/>

    <HotKeyboard v-if="formModel.secType === '组合键'"
                 v-model:hotkey="formModel.hotkey"/>

    <template v-if="formModel.type === '等待'">
      <div class="form-item">
        <label>等待时间(秒)</label>
        <div class="form-item-content">
          <NumberInput v-model="formModel.wait" :min="1" :max="500" :step="1"></NumberInput>
        </div>
      </div>
    </template>

    <template v-if="formModel.secType === '输入字符'">
      <div class="form-item">
        <label>输入字符</label>
        <div class="form-item-content">
          <EInput v-model:value="formModel.chart"></EInput>
        </div>
      </div>
    </template>

    <template v-if="formModel.type === '循环'">
      <div class="form-item">
        <label>循环次数</label>
        <div class="form-item-content">
          <NumberInput v-model="formModel.frequency" :min="1" :max="500" :step="1"></NumberInput>
        </div>
      </div>
    </template>

    <template v-if="formModel.type === '移动光标'">
      <div class="form-item">
        <label>横纵坐标</label>
        <div class="form-item-content" style="display: flex;justify-content: flex-start">
          <EInput v-model:value="formModel.x" style="width: 120px" prepend="X" type="number"></EInput>
          <EInput v-model:value="formModel.y" style="width: 120px;margin-left: 10px" prepend="Y" type="number"></EInput>
        </div>
      </div>
    </template>

    <div class="form-item">
      <label>结束等待(秒)</label>
      <div class="form-item-content">
        <NumberInput v-model="formModel.nextWait" :min="0" :max="500" :step="0.5" :precision="1"></NumberInput>
      </div>
    </div>

    <div class="form-item">
      <label>备注</label>
      <div class="form-item-content">
        <EInput v-model:value="formModel.desc"></EInput>
      </div>
    </div>

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