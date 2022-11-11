import { defineStore } from 'pinia'
import { IScript } from '../types'

const useStepStore = defineStore('step', {
    state: () => ({
        nowScriptTitle: '', // 当前显示的脚本名称 xxx_script
        /* @type [{ title: string, filename: string, createdAt: string， updatedAt: string }] */
        scripts: [] as IScript[], // 所有脚本标题列表
    }),
    actions: {
        changeScriptTitle(title: string) {
            this.nowScriptTitle = title
        },
        changeScripts(scripts: IScript[]) {
            this.scripts = scripts
        }
    }
})

export default useStepStore