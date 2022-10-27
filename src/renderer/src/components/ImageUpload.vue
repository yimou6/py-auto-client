<template>
  <div class="image-upload" :style="{ backgroundImage: `url(${bg})` }">
    <input ref="file" type="file" @change="fileChange" />
    <el-icon v-if="bg === ''" :size="20" color="#dddddd" @click="handleClick"><Plus /></el-icon>
    <div v-else class="image-upload-btn">
      <el-icon :size="18" color="#ffffff" @click="handelView"><View /></el-icon>
      <el-icon :size="18" color="#ffffff" @click="handleClick"><Edit /></el-icon>
    </div>
  </div>

  <el-dialog v-model="visible" :width="300" :show-close="false" class="image-view">
    <div class="dialog-view" :style="{ backgroundImage: `url(${bg})` }"></div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Edit, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const file = ref(null)
const bg = ref('')
const visible = ref(false)

const props = defineProps({
  value: {
    type: String,
    default: 'C:\\Users\\67074\\Pictures\\test.png'
  }
})

const emits = defineEmits(['update:value'])

onMounted(() => {
  // 初次加载时，有图片但没有用于显示的base64
  if (props.value && bg.value === '') {
    console.log(props.value)
    window.api.transformImageToBase64(props.value)
  }

  // 图片保存成功后返回图片的路径
  window.electron.ipcRenderer.on('saveImageReply', (event, args) => {
    if (typeof args === 'string') {
      emits('update:value', args)
    } else {
      ElMessage({
        message: `图片操作失败:${args}`,
        type: 'error'
      })
    }
  })
  // 获取main进程返回的base64
  window.electron.ipcRenderer.on('transformImageToBase64Reply', (event, args) => {
    if (typeof args === 'string') {
      bg.value = args
    } else {
      ElMessage({
        message: `图片读取失败:${args.toString()}`,
        type: 'error'
      })
    }
  })
})

function fileChange(e) {
  const file = e.target.files[0]
  if (checkImage(file.type, file.size)) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      console.log('base64 success!')
      window.api.saveImage(e.target.result)
      bg.value = e.target.result
    }
  } else {
    ElMessage({
      message: '仅支持格式为png、jpg、jpeg且小于5M的图片',
      type: 'warning'
    })
  }
  e.target.value = ''
}

function handleClick() {
  file.value.click()
}

// 检查图片
function checkImage(type, size) {
  // 支持的格式
  const types = ['image/png', 'image/jpg', 'image/jpeg']
  // 图片支持的大小 5M
  const maxSize = 1024 * 1024 * 5
  return types.includes(type) && size < maxSize
}

// 预览图片
function handelView() {
  visible.value = true
}
</script>

<style scoped lang="less">
.image-upload {
  width: 60px;
  height: 60px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-size: cover;
  position: relative;
  box-sizing: border-box;

  input {
    display: none;
  }

  .image-upload-btn {
    position: absolute;
    top: 0;
    right: 0;
    height: 0;
    width: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: hidden;
    transition: height 0.1s;
  }

  &:hover .image-upload-btn {
    height: 60px;
  }
}

.dialog-view {
  width: 300px;
  height: 300px;
  background-size: cover;
}
</style>
<style lang="less">
.image-view {
  background-color: transparent;
  box-shadow: none;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
