import { defineStore } from 'pinia'
import { IScript } from '../types'

const useStepStore = defineStore('step', {
    state: () => ({
        nowScriptTitle: '', // 当前显示的脚本名称
        nowScriptName: '',
        scripts: [] as IScript[], // 所有脚本标题列表
    }),
    actions: {
        changeScriptTitle(title: string, name: string) {
            this.nowScriptTitle = title
            this.nowScriptName = name
        },
        changeScripts(scripts: IScript[]) {
            this.scripts = scripts
        }
    }
})

export default useStepStore