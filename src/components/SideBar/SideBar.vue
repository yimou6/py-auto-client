<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import useStepStore from '../../stores/step'
import { storeToRefs } from 'pinia'
import ScriptModify from '../ScriptModify/ScriptModify.vue'
import { IScript } from '../../types'
import Dialog from '../Dialog/Dialog.vue'
import EButton from '../EButton/EButton.vue'

const store = useStepStore()
const { activeScriptId, scriptEdit, activeScript } = storeToRefs(store)
const list = ref<IScript[]>([])
const activeId = ref<string>('')
const visible = ref(false)
const title = ref('新增')
const delVisible = ref(false)

store.$subscribe((mutation, state) => {
    if (state.scriptEdit) {
        visible.value = true
        title.value = '修改'
    }
    if (state.scriptDel) {
        delVisible.value = true
    }
})

onMounted(() => {
    getList()
})

// 获取列表
const getList = async () => {
    const { code, data } = await window.ipcRenderer.sendEvent('script_get', {})
    if (code) {
        list.value = data
        if (list.value.length > 0) {
            setActive()
        } else {
            store.changeActive('')
        }
    }
}

// 点击列表
const clickItem = async (value: IScript) => {
    store.changeActive(value.filename)
    store.changeScript(value)
    activeId.value = activeScriptId.value
}

// 设置选中
const setActive = async (id?: string) => {
    let index = -1
    if (id) {
        index = list.value.findIndex(it => it.filename === id)
    } else {
        if (activeScriptId.value) {
            index = list.value.findIndex(it => it.filename === activeScriptId.value)
            if (index === -1) {
                index = 0
            }
        } else {
            if (list.value.length > 0) {
                index = 0
            }
        }
    }
    if (index !== -1) {
        clickItem(list.value[index])
    }
}

const handleAdd = () => {
    title.value = '新增'
    visible.value = true
}
const handleRefresh = async (id: string) => {
    await getList()
    setActive(id)
}
const handleClose = () => {
    delVisible.value = false
    store.changeDelScript(false)
}
const handleSubmit = async () => {
    await window.ipcRenderer.sendEvent('script_del', {
        filename: activeId.value
    })
    delVisible.value = false
    store.changeDelScript(false)
    getList()
}

</script>

<template>
    <div class="sidebar">
        <div class="sidebar-warp">
            <div class="sidebar-button">
                <button @click="handleAdd">新增</button>
            </div>

            <ul class="sidebar-list">
                <li v-for="item of list" :key="item.filename" :class="{ 'active': activeId === item.filename }"
                    @click="clickItem(item)">
                    <span>{{ item.title }}</span>
                </li>
            </ul>
        </div>
    </div>

    <ScriptModify v-model:visible="visible" :title="title" show-close :script-value="activeScript.title"
        @refresh="handleRefresh"></ScriptModify>

    <Dialog :visible.sync="delVisible" title="提示">
        <div>
            是否确认删除？
        </div>

        <template #footer>
            <EButton @click="handleClose">关闭</EButton>
            <EButton type="primary" @click="handleSubmit">确认</EButton>
        </template>
    </Dialog>
</template>

<style lang="scss">
.sidebar {
    width: 200px;
    height: 560px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 10px;

    .sidebar-warp {
        max-height: 550px;
        background-color: #4d4d4d;
        border-radius: 10px;
        width: 180px;
        padding-bottom: 10px;

        .sidebar-button {
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;

            button {
                background-color: transparent;
                border: none;
                background-color: #00ca53;
                color: #ffffff;
                border-radius: 4px;
                height: 32px;
                width: 150px;
                font-size: 14px;
                line-height: 32px;
                cursor: pointer;
            }
        }

        .sidebar-list {
            width: 100%;
            list-style: none;
            padding: 0;
            margin: 0;
            overflow-x: hidden;
            overflow-y: auto;
            max-height: 490px;

            li {
                height: 32px;
                line-height: 32px;
                text-align: left;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                color: #ffffff;
                padding: 0 16px;
                transition: background-color 0.3s;
                user-select: none;

                &.active {
                    background-color: #323232;
                    color: #00ca53;

                    &:hover {
                        color: #00ca53;
                    }
                }

                &:hover {
                    background-color: #323232;
                }
            }
        }
    }


}

.script-input {
    text-align: center;
}
</style>
