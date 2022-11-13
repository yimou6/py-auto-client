<script setup lang="ts">
// @ts-nocheck
import DialogView from "../DialogView.vue";
import {ref, watch} from 'vue'
import {EMouseRightMenu} from '../../types'
import {stepTypes} from './config'
import useStepStore from '../../stores/step'
import { storeToRefs } from 'pinia'
import { StepClass } from '../../types/Step.Class'

const stepStore = useStepStore()
const { nowScriptTitle } = storeToRefs(stepStore)

const props = defineProps<{
  visible: boolean,
  menuKey: string,
  stepInfo: StepClass,
  parentIds: string[]
}>()
const emits = defineEmits(['update:visible', 'refresh'])
const title = ref('')
watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.menuKey !== undefined) {
          if (props.menuKey === EMouseRightMenu.edit) {
            title.value = '修改'
            if (props.stepInfo) {
              formModel.value.copyValue(props.stepInfo)
            }
          } else {
            title.value = '新增'
          }
        }
      }
    }
)

const formModel = ref<StepClass>(new StepClass())

/**
 * 关闭弹窗
 */
function handleClose() {
  emits('update:visible', false)
  formModel.value.clearAllField()
}

/**
 * 步骤类型选择回调
 */
function typeChange(val: string) {
  formModel.value.setDefaultValue(val)
}

/**
 * 选择图片
 */
async function selectImage() {
  const img = await window.ipc.selectImage()
  formModel.value.opera = img[0]
}

/**
 * 提交表单
 */
async function handleSubmit() {
  console.log(formModel.value.validate())
  if (title.value === '新增') {
    await createStep()
  } else {
    await updateStep()
  }
}

async function createStep() {
  console.log({
    filename: nowScriptTitle.value,
    step: formModel.value.validate(),
    opera: props.menuKey,
    parentIds: JSON.parse(JSON.stringify(props.parentIds))
  })
  const result = await window.ipc.createStep({
    filename: nowScriptTitle.value,
    step: formModel.value.validate(),
    opera: props.menuKey,
    parentIds: JSON.parse(JSON.stringify(props.parentIds))
  })
  if (result) {
    handleClose()
    emits('refresh')
  }
}

async function updateStep() {
  const result = await window.ipc.modifyStep({
    filename: nowScriptTitle.value,
    step: formModel.value.validate(),
    parentIds: JSON.parse(JSON.stringify(props.parentIds))
  })
  if (result) {
    handleClose()
    emits('refresh')
  }
}
</script>

<template>
  <dialog-view v-model:visible="visible" :title="title">
    <el-form size="small" label-width="85px" :model="formModel">

      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="formModel.name" maxlength="35" clearable></el-input>
      </el-form-item>

      <el-form-item label="步骤类型">
        <el-select v-model="formModel.type" :filterable="true" @change="typeChange" style="width: 100%">
          <el-option v-for="item of stepTypes" :key="item" :label="item.name" :value="item.name">
<!--            <span class="tag" :style="{ backgroundColor: item.color }">{{ item.name }}</span>-->
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="下一步等待">
        <el-input v-model="formModel.lastTime"></el-input>
      </el-form-item>

      <el-form-item label="鼠标" v-if="formModel.type === '单击图片'">
        <el-radio-group v-model="formModel.button">
          <el-radio-button label="left">左键</el-radio-button>
          <el-radio-button label="right">右键</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="图片" v-if="formModel.type.indexOf('图片') !== -1">
        <el-image style="width: 64px; height: 64px"
                  :src="formModel.opera"
                  :preview-src-list="[formModel.opera]"
                  fit="contain"></el-image>
        <el-button size="small" type="primary" style="margin-left: 10px" @click="selectImage">选择</el-button>
      </el-form-item>

      <template v-if="['单击图片', '双击图片', '单击坐标'].includes(formModel.type)">
        <el-form-item :label="`${formModel.type === '单击坐标' ? '坐标x' : '偏移坐标x'}`">
          <el-input v-model="formModel.x"></el-input>
        </el-form-item>
        <el-form-item :label="`${formModel.type === '单击坐标' ? '坐标y' : '偏移坐标y'}`">
          <el-input v-model="formModel.y"></el-input>
        </el-form-item>
      </template>

      <template v-if="formModel.type === '判断日期'">
        <el-form-item label="频次">
          <el-select v-model="formModel.dayType">
            <el-option label="每周" value="每周"></el-option>
            <el-option label="每月" value="每月"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-select v-model="formModel.day">
            <el-option v-for="item in (formModel.dayType === '每周' ? 7 : 31)" :label="item + 1" :value="item + 1"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item :label="formModel.type === '等待' ? '等待时间' : '最长等待时间'"
                    v-if="['判断图片出现', '等待'].includes(formModel.type)">
        <el-input v-model="formModel.maxTime"></el-input>
      </el-form-item>

      <el-form-item label="字符" v-if="formModel.type === '输入字符'">
        <el-input v-model="formModel.opera"></el-input>
      </el-form-item>

      <template v-if="formModel.type === '键盘按键'">
        <el-form-item label="按键">
          <el-input v-model="formModel.opera"></el-input>
        </el-form-item>
        <el-form-item label="按键次数">
          <el-input v-model="formModel.frequency"></el-input>
        </el-form-item>
      </template>

      <el-form-item label="快捷键" v-if="formModel.type === '快捷键'">
        <div class="quick-btn">
          <el-input v-model="formModel.hotkey[0]" style="width: 60px"></el-input>
          <el-input v-model="formModel.hotkey[1]" style="width: 60px"></el-input>
          <el-input v-model="formModel.hotkey[2]" style="width: 60px"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="循环次数" v-if="formModel.type === '循环'">
        <el-input v-model="formModel.frequency"></el-input>
      </el-form-item>
      <el-form-item label="出错是否中断">
        <el-radio-group v-model="formModel.errorStop">
          <el-radio-button :label="1">是</el-radio-button>
          <el-radio-button :label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>

    </el-form>

    <template #footer>
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
    </template>

  </dialog-view>
</template>

<style lang="scss">
.quick-btn {
  .el-input + .el-input {
    margin-left: 10px;
  }
}
</style>