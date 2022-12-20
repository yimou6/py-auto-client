<script setup lang="ts">
import { IKeyboard } from '../../../types/step'
import {ref, reactive, onMounted, watch} from 'vue'
import EFormItem from '../../EForm/form-item.vue'
import EForm from '../../EForm/form.vue'
import EInput from '../../EInput/input.vue'


// 来自：https://pyautogui.readthedocs.io/en/latest/keyboard.html
const _keyboardKeys: string[] = ['!', '"', '#', '$', '%', '&', "'", '(',
  ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7',
  '8', '9', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`',
  'a', 'b', 'c', 'd', 'e','f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~',
  'accept', 'add', 'alt', 'altleft', 'altright', 'apps', 'backspace',
  'browserback', 'browserfavorites', 'browserforward', 'browserhome',
  'browserrefresh', 'browsersearch', 'browserstop', 'capslock', 'clear',
  'convert', 'ctrl', 'ctrlleft', 'ctrlright', 'decimal', 'del', 'delete',
  'divide', 'down', 'end', 'enter', 'esc', 'escape', 'execute', 'f1', 'f10',
  'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f2', 'f20',
  'f21', 'f22', 'f23', 'f24', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9',
  'final', 'fn', 'hanguel', 'hangul', 'hanja', 'help', 'home', 'insert', 'junja',
  'kana', 'kanji', 'launchapp1', 'launchapp2', 'launchmail',
  'launchmediaselect', 'left', 'modechange', 'multiply', 'nexttrack',
  'nonconvert', 'num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6',
  'num7', 'num8', 'num9', 'numlock', 'pagedown', 'pageup', 'pause', 'pgdn',
  'pgup', 'playpause', 'prevtrack', 'print', 'printscreen', 'prntscrn',
  'prtsc', 'prtscr', 'return', 'right', 'scrolllock', 'select', 'separator',
  'shift', 'shiftleft', 'shiftright', 'sleep', 'space', 'stop', 'subtract', 'tab',
  'up', 'volumedown', 'volumemute', 'volumeup', 'win', 'winleft', 'winright', 'yen',
  'command', 'option', 'optionleft', 'optionright']

const props = defineProps<{
  value: IKeyboard
}>()
const emits = defineEmits(['update:value'])
const formRef = ref()
const formModel = reactive<IKeyboard>({
  opera: '',
  presses: '1'
})
const rules = reactive({})
watch(
    () => formModel,
    (val) => {
      emits('update:value', val)
    },
    { deep: true, immediate: true }
)

onMounted(() => {
  formModel.opera = props.value.opera || ''
  formModel.presses = props.value.presses || '1'
})

const validate = () => formRef.value.validate()

defineExpose({
  validate
})

</script>

<template>
  <e-form :model="formModel" :rules="rules" ref="formRef">
    <div class="form-item-col2">

      <e-form-item label="按键" prop="opera">
        <e-input v-model="formModel.opera"></e-input>
      </e-form-item>

      <e-form-item label="按键次数" prop="presses">
        <e-input v-model="formModel.presses" type="number"></e-input>
      </e-form-item>

    </div>
  </e-form>
</template>