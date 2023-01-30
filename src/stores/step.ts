import { defineStore } from 'pinia'
import { IScript } from '../types'

const useStepStore = defineStore('step', {
    state: () => {
        return {
            nowScriptTitle: '', // 当前显示的脚本名称
            nowScriptName: '',
            scripts: [] as IScript[], // 所有脚本标题列表
            // ---------------
            activeScriptId: '',
            activeScript: {
                id: '',
                type: '',
                title: '',
                filename: '',
                createdAt: '',
                updatedAt: ''
            } as IScript,
            scriptEdit: false,
            scriptDel: false
        }
    },
    actions: {
        changeScriptTitle(title: string, name: string) {
            this.nowScriptTitle = title
            this.nowScriptName = name
        },
        changeScripts(scripts: IScript[]) {
            this.scripts = scripts
        },
        // -------------------
        changeActive(scriptId: string) {
            this.activeScriptId = scriptId
        },
        changeScript(scriptInfo: IScript) {
            this.activeScript = scriptInfo
        },
        changeEditScript(edit: boolean) {
            this.scriptEdit = edit
        },
        changeDelScript(del: boolean) {
            this.scriptDel = del
        }
    }
})

export default useStepStore