<script lang="ts" setup>
import Dialog from '../Dialog/Dialog.vue'
import EButton from '../EButton/EButton.vue'
import EInput from '../EInput/EInput.vue';
import { ref, toRaw, watch } from 'vue'
import useStepStore from '../../stores/step'
import { storeToRefs } from 'pinia'
import Radio from '../Radio/Radio.vue'
import NumberInput from '../NumberInput/NumberInput.vue'
import { STEP_TYPES0, STEP_TYPES1, menuChildKeyMap, DAY_TYPES, WEEK } from './data'
import { CStep } from '../../types/step.class'
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
  value: CStep,
  ids: string[],
  menu: string
}>()
const emits = defineEmits(['update:visible', 'refresh'])

const formModel = ref<CStep>(new CStep())

watch(
    () => props.visible,
    () => {
      if (props.visible) {
        const { value } = props
        if (props.title === '修改') {
          formModel.value.setKeyValue(value)
          // 当 修改+图片 时需要 old_opera
          formModel.value.options.old_opera = formModel.value.options.opera
        } else {
          formModel.value = new CStep()
          formModel.value.childKey = value.childKey
        }
      }
    }
)

const handleChange = () => {
  formModel.value.initOptions()
}

const handleClose = (data?: CStep) => {
  emits('update:visible', false)
  if (data) {
    emits('refresh', data)
  }
}

const handleSubmit = () => {
  const valid: string = formModel.value.validate()
  if (valid) {
    return notify({ type: 'danger', message: valid })
  }
  const temp: CStep = toRaw(formModel.value)
  const childKey = menuChildKeyMap[props.menu] || temp.childKey
  let info = delObjUndefined(Object.assign(temp, { childKey }))
  console.log(info)
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
  <Dialog :visible.sync="visible" :title="title" :show-close="showClose" width="500px" @close="handleClose()">
    <div class="form-item">
      <label>步骤类型</label>
      <div class="form-item-content">
        <Radio v-model="formModel.type" :data="STEP_TYPES0" type="button" @change="handleChange"></Radio>
        <Radio v-model="formModel.type" :data="STEP_TYPES1" type="button" @change="handleChange"></Radio>
      </div>
    </div>
    <div class="form-item">
      <label>结束等待(秒)</label>
      <div class="form-item-content">
        <NumberInput v-model="formModel.nextWait" :min="0" :max="500" :step="0.5" :precision="1"></NumberInput>
      </div>
    </div>

    <template v-if="formModel.type === '判断时间'">
      <div class="form-item">
        <label>时间类别</label>
        <div class="form-item-content">
          <Radio v-model="formModel.options.presses" :data="DAY_TYPES" type="button"></Radio>
        </div>

      </div>
      <div class="form-item">
        <label>具体时间</label>
        <div class="form-item-content">
          <Radio v-model="formModel.options.day" :data="WEEK" type="button" v-if="formModel.options.presses === 1"></Radio>
          <template v-else>
            <MonthPanel v-model="formModel.options.day"></MonthPanel>
          </template>
        </div>
      </div>
    </template>

    <ClickPosition v-if="formModel.type === '单击坐标'"
                   v-model:button="formModel.options.button"
                   v-model:clicks="formModel.options.clicks"
                   v-model:x="formModel.options.x"
                   v-model:y="formModel.options.y"></ClickPosition>

    <ClickImage v-if="formModel.type === '点击图片'"
                v-model:button="formModel.options.button"
                v-model:clicks="formModel.options.clicks"
                v-model:error="formModel.options.error"
                v-model:x="formModel.options.x"
                v-model:y="formModel.options.y"
                v-model:opera="formModel.options.opera"></ClickImage>

    <JudgeImage v-if="formModel.type === '判断图片'"
                v-model:error="formModel.options.error"
                v-model:opera="formModel.options.opera"
                v-model:wait-time="formModel.options.waitTime"/>

    <PressKeyboard v-if="formModel.type === '键盘按键'"
                   v-model:opera="formModel.options.opera"
                   v-model:presses="formModel.options.presses"/>

    <HotKeyboard v-if="formModel.type === '组合键'"
                 v-model:hotkey="formModel.options.hotkey"/>

    <template v-if="formModel.type === '等待'">
      <div class="form-item">
        <label>等待时间(秒)</label>
        <div class="form-item-content">
          <NumberInput v-model="formModel.options.waitTime" :min="1" :max="500" :step="1"></NumberInput>
        </div>
      </div>
    </template>

    <template v-if="formModel.type === '输入字符'">
      <div class="form-item">
        <label>输入字符</label>
        <div class="form-item-content">
          <EInput v-model:value="formModel.options.opera"></EInput>
        </div>
      </div>
    </template>

    <template v-if="formModel.type === '循环'">
      <div class="form-item">
        <label>循环次数</label>
        <div class="form-item-content">
          <NumberInput v-model="formModel.options.presses" :min="1" :max="500" :step="1"></NumberInput>
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