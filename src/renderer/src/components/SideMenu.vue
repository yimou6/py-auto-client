<template>
  <div class="side-menu">
    <div class="side-menu-create" @click="handleCreate">
      <el-icon><Plus /></el-icon>
      <span>新建</span>
    </div>
    <el-menu class="menu-container" :default-active="defaultActive">
      <el-menu-item v-for="(menu) in menus" :key="menu.id" :index="menu.id">{{ menu.title }}</el-menu-item>
    </el-menu>
  </div>

  <el-dialog v-model="visible" :title="title" :show-close="false">
    <el-form ref="form" :model="formModel" :rules="rules" size="small">
      <el-form-item label="名称" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入名称" maxlength="10"></el-input>
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button type="default" size="small" @click="cancelDialog">取消</el-button>
      <el-button type="primary" size="small" @click="submitDialog">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import pinyin from 'pinyin'

const validateTitle = (rule, value, callback) => {
  if (/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value) && value.length >= 3 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('只能输入3-10位的汉字、字母和数字'))
  }
}

const props = defineProps({
  menus: {
    type: Array,
    default: function () {
      return []
    }
  }
})

const emits = defineEmits(['updateConfig'])

const form = ref(null)
const title = ref('')
const visible = ref(false)
const formModel = reactive({
  title: ''
})
const rules = reactive({
  title: [
    { required: true, trigger: 'blur', message: '名称不能为空' },
    { validator: validateTitle, trigger: 'blur' }
  ]
})

const defaultActive = ref('')
watch(
  () => props.menus,
  (newVal) => {
    console.log(newVal)
    if (newVal.length > 0) {
      if (!newVal.find((item) => item.id === defaultActive.value)) {
        defaultActive.value = newVal[0].id
      }
    } else {
      defaultActive.value = ''
    }
  },
  { deep: true, immediate: true }
)
function cancelDialog() {
  formModel.title = ''
  form.value.clearValidate()
  visible.value = false
}
function submitDialog() {
  form.value.validate(async (valid) => {
    if (valid) {
      const strTitle = pinyin(formModel.title, { style: 'normal' }).join('')
      const err = await window.api.modifyScript({
        title: strTitle
      })
      if (!err) {
        emits('updateConfig')
        cancelDialog()
      }
    }
  })
}
function handleCreate() {
  title.value = '新建'
  visible.value = true
}
</script>

<style scoped lang="less">
.side-menu {
  width: 200px;
  border-right: 1px solid #dddddd;
  height: 100%;
  position: relative;
  .side-header {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #dddddd;
    box-sizing: content-box;
    &-btn {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }

  .side-menu-create {
    border: 1px solid #dddddd;
    width: 160px;
    margin: 10px auto;
    text-align: center;
    padding: 5px 0;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
    border-radius: 5px;
    span {
      display: inline-block;
      margin-left: 10px;
    }
  }
}
</style>
