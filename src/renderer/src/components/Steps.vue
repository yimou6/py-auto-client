<template>
  <div class="step-container">
    <el-form :model="formModel" label-width="80px" size="small">
      <el-form-item label="步骤名称">
        <el-input
          v-show="isEdit"
          v-model="formModel.name"
          placeholder="步骤名称"
          style="width: 100%"
        ></el-input>
        <span v-show="!isEdit">{{ formModel.name || '-' }}</span>
      </el-form-item>
      <el-form-item label="步骤类型">
        <el-select v-model="formModel.key" style="width: 200px" @change="keyChange">
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="['1', '2', '3', '7'].includes(formModel.key)" label="图片">
        <image-upload v-model:value="formModel.opera" />
      </el-form-item>
      <el-form-item v-if="formModel.key === '2'" label="最长时间">
        <el-input v-model="formModel.maxTime" style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item
        v-if="['3', '4', '7'].includes(formModel.key)"
        :label="formModel.key === '4' ? '坐标x' : '偏移x'"
      >
        <el-input v-model="formModel.x" style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item
        v-if="['3', '4', '7'].includes(formModel.key)"
        :label="formModel.key === '4' ? '坐标y' : '偏移y'"
      >
        <el-input v-model="formModel.y" style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item v-if="['2', '7'].includes(formModel.key)" label="出错是否中断">
        <el-radio-group v-model="formModel.interrupt">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formModel.key === '5'" label="键盘字符">
        <el-input v-model="formModel.opera" maxlength="1" style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item v-if="formModel.key === '5'" label="按键次数">
        <el-input v-model="formModel.presses" maxlength="1" style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item v-if="formModel.key === '6'" label="输入字符">
        <el-input v-model="formModel.opera" maxlength="20" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item v-if="formModel.key === '8'" label="快捷键">
        <el-input v-model="formModel.opera[0]" style="width: 100px"></el-input>
        <span class="hot-contact">+</span>
        <el-input v-model="formModel.opera[1]" style="width: 100px"></el-input>
        <span class="hot-contact">+</span>
        <el-input v-model="formModel.opera[2]" style="width: 100px"></el-input>
      </el-form-item>
    </el-form>
    <div class="step-btn">
      <span v-show="isEdit" class="step-btn-item step-btn-check">
        <el-icon color="#ffffff"><Check /></el-icon>
      </span>
      <span v-show="!isEdit" class="step-btn-item step-btn-edit" @click="isEdit = true">
        <el-icon color="#ffffff"><Edit /></el-icon>
      </span>
      <span class="step-btn-item step-btn-close">
        <el-icon color="#ffffff"><Close /></el-icon>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Close, Edit, Check } from '@element-plus/icons-vue'
import ImageUpload from './ImageUpload.vue'

const formModel = ref({
  name: '',
  key: '',
  opera: '',
  maxTime: 15,
  interrupt: false,
  x: 0,
  y: 0,
  presses: 1
})

const isEdit = ref(false)

const types = ref([
  { label: '双击图片', value: '1' },
  { label: '判断图片是否出现', value: '2' },
  { label: '单击图片', value: '3' },
  { label: '单击坐标', value: '4' },
  { label: '点击键盘', value: '5' },
  { label: '键盘输入', value: '6' },
  { label: '重复点击图片，直至不出现', value: '7' },
  { label: '快捷键', value: '8' }
])

function keyChange(val) {
  if (val === '8') {
    // 步骤类型为快捷键时，opera变为数组
    formModel.value.opera = ['', '', '']
  } else {
    formModel.value.opera = ''
  }
}
</script>

<style scoped lang="less">
.step-container {
  border: 1px solid #dddddd;
  padding: 10px;
  margin: 10px;
  position: relative;
  box-sizing: content-box;

  .step-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    &-item {
      width: 26px;
      height: 26px;
      line-height: 27px;
      text-align: center;
      border: none;
      border-radius: 0;
      display: inline-block;
      cursor: pointer;
    }
    &-close {
      background-color: #f56c6c;
      &:hover {
        background-color: rgba(245, 108, 108, 0.89);
      }
    }
    &-edit {
      background-color: #409eff;
      &:hover {
        background-color: rgba(64, 158, 255, 0.91);
      }
    }
    &-check {
      background-color: #67c23a;
      &:hover {
        background-color: rgba(103, 194, 58, 0.93);
      }
    }
  }
}
.hot-contact {
  display: inline-block;
  color: #565656;
  font-size: 20px;
  padding: 0 10px;
}
</style>
