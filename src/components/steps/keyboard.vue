<script setup lang="ts">
/**
 * 键盘按键
 */
import { ref, reactive, computed } from 'vue'
import type { FormInstance } from 'element-plus'

defineProps<{
  value: { opera: string, presses: number }
}>()

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

const keyboardKeys = computed(() => {
  return _keyboardKeys.map(key => {
    return {
      label: key,
      value: key
    }
  })
})

const formRef = ref<FormInstance>()
const rules = reactive({
  opera: [
    { required: true, trigger: 'change', message: '请选择按键' }
  ],
  presses: [
    { required: true, trigger: 'blur', message: '请输入按键次数' }
  ]
})

const validate = (callback: Function) => {
  formRef.value?.validate(valid => callback(valid))
}

defineExpose({
  validate
})
</script>

<template>
  <el-form :model="value"
           :rules="rules"
           ref="formRef"
           size="small"
           label-width="85px">
    <el-form-item label="按键" prop="opera">
      <el-select-v2 v-model="value.opera"
                    :options="keyboardKeys"
                 filterable
                 clearable
                 placeholder="请选择"
                 style="width: 100%">
      </el-select-v2>
    </el-form-item>
    <el-form-item label="按键次数" prop="presses">
      <el-input
          v-model.number="value.presses"
          :min="1"
          :max="20"
          style="width: 100%"/>
    </el-form-item>
  </el-form>
</template>