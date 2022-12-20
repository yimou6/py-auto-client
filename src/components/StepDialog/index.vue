<template>
  <EDialog :visible="visible" :title="title">

    <e-form :model="formModel" :rules="rules" ref="formRef">
      <e-form-item label="类型">
        <ul class="radio-box" @click="handleType">
          <li :class="{ 'active': formModel.type === key }"
              v-for="(item, key) in types"
              :key="key">
            <span>{{ key }}</span>
          </li>
        </ul>
      </e-form-item>

      <keep-alive>
        <component :is="types[formModel.type]" v-model:value="formModel.options" ref="childRef"></component>
      </keep-alive>

      <e-form-item label="完成后等待" prop="nextWait">
        <EInput v-model="formModel.nextWait" type="number">
          <template #append>秒</template>
        </EInput>
      </e-form-item>
    </e-form>


    <template #footer>
      <e-button @click="handleClose">关闭</e-button>
      <e-button type="primary" @click="handleSubmit">保存</e-button>
    </template>
  </EDialog>
</template>

<script lang="ts" setup>
import EDialog from '../EDialog/dialog.vue'
import EInput from '../EInput/input.vue'
import EButton from '../EButton/button.vue'
import EFormItem from '../EForm/form-item.vue'
import EForm from '../EForm/form.vue'
import clickImage from './components/clickImage.vue'
import clickPosition from './components/clickPosition.vue'
import judgeDate from './components/judgeDate.vue'
import judgeImage from './components/judgeImage.vue'
import keyboard from './components/keyboard.vue'
import keyboardHot from './components/keyboardHot.vue'
import loopStep from './components/loopStep.vue'
import waitTime from './components/waitTime.vue'
import writeChar from './components/writeChar.vue'
import { reactive, ref, watch, computed, toRaw  } from 'vue'
import { IStep } from '../../types/step'

// @ts-ignore
const types = {
  '点击图片': clickImage,
  '判断图片': judgeImage,
  '键盘按键': keyboard,
  '输入字符': writeChar,
  '快捷键': keyboardHot,
  '单击坐标': clickPosition,
  '等待': waitTime,
  '循环': loopStep,
  '判断时间': judgeDate
}

const validNextWait = (value: string, callback: any) => {
  if (/^[0-9]+(.[0-9]{0,2})?$/.test(value)) {
    callback()
  } else {
    callback('仅支持两位小数')
  }
}

const props = defineProps<{
  visible: boolean,
  filename: string,
  info: IStep,
  menu?: string,
  ids?: string[]
}>()

const emits = defineEmits(['update:visible', 'update-step'])

const formModel = reactive<IStep>({
  type: '点击图片',
  nextWait: '1',
  options: {
    button: 'left',
    clicks: 'single',
    opera: '',
    x: 0,
    y: 0,
    error: 'continue'
  }
})
const rules = {
  nextWait: [
    { required: true, trigger: 'blur', message: '请填写' },
    { validator: validNextWait, trigger: 'blur' }
  ]
}
const formRef = ref()
const childRef = ref()

const title = computed(() => {
  return props.menu ? props.menu === '修改步骤' ? '修改' : props.menu : '新建'
})

watch(
    () => props.visible,
    (val) => {
      if (val) {
        console.log('menu', props.menu)
        console.log('ids', props.ids)
        if (title.value === '修改') {
          if (props.info) {
            Object.keys(props.info).forEach((key: string) => {
              // @ts-ignore
              formModel[key] = props.info[key]
            })
          }
        }
      }
    }
)

const handleType = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.nodeName === 'SPAN') {
    // @ts-ignore
    formModel.type = target.innerText
  }
}

const handleClose = () => {
  formModel.type = '点击图片'
  formModel.nextWait = '1'
  formModel.options = {
    button: 'left',
    clicks: 'single',
    opera: '',
    x: 0,
    y: 0,
    error: 'continue'
  }
  emits('update:visible', false)
}

const handleSubmit = async () => {
  console.log(formModel)
  if (formRef.value.validate() && childRef.value.validate()) {
    if (title.value === '修改') {
      await stepModify()
    } else {
      await stepAdd()
    }
    handleClose()
  }
}

const stepModify = async () => {
  const { code, msg, data } = await window.ipcRenderer.sendEvent('step_modify', {
    filename: props.filename,
    ids: toRaw(props.ids) || [],
    info: toRaw(formModel)
  })
  if (code) {
    emits('update-step', data)
  } else {
    console.log(msg)
  }
}

const stepAdd = async () => {
  let childKey = props.menu === '判断成功步骤'
      ? 'success' : props.menu === '判断失败步骤'
          ? 'fail' : props.menu === '判断结束步骤'
              ? 'finally' : undefined
  childKey = childKey || props.info?.childKey
  const { code, msg, data } = await window.ipcRenderer.sendEvent('step_add', {
    ids: toRaw(props.ids) || [],
    info: childKey ? { ...toRaw(formModel), childKey } : toRaw(formModel),
    type: props.menu || '',
    filename: props.filename
  })
  if (code) {
    emits('update-step', data)
  } else {
    console.log(msg)
  }
}

</script>

<style lang="scss">
.form-item {
  position: relative;
  padding: 5px 6px;
  margin-bottom: 5px;

  label {
    color: #555555;
    font-weight: normal;
    font-size: 14px;
    background-color: #ffffff;
    user-select: none;
    transition: all 0.3s;
    padding-bottom: 4px;
    margin-bottom: 4px;
    display: block;
    border-bottom: 1px solid #dfdfdf;
  }

  &__content {
  }
}

.radio-box {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 0 0 0 -10px;

  li {
    font-size: 14px;
    color: #5b5b5b;
    margin-bottom: 4px;
    margin-left: 10px;
    span {
      border: 1px solid #dddddd;
      padding: 2px 6px;
      border-radius: 2px;
      cursor: pointer;
      user-select: none;
      display: inline-block;
      &:hover {
        border-color: #00ca53;
      }
    }
    &.active span {
      background-color: #00ca53;
      border-color: #00ca53;
      color: #ffffff;
    }
  }
}

.form-item-col2 {
  display: flex;
  justify-content: space-between;
  .form-item {
    width: 50%;
  }
}
.form-item-col3 {
  display: flex;
  justify-content: space-between;
  .form-item {
    width: 33%;
  }
}
</style>