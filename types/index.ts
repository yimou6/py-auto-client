export interface IpcEventMap {
    // 获取所有脚本列表
    getScriptList: {},
    // 创建脚本
    createScript: { title: string, pinyin },
    // 删除脚本
    deleteScript: { filename: string },
    // 获取步骤
    getSteps: { filename: string },
    // 修改步骤
    modifyStep: { filename: string, step: any, parentIds: string[] }
    // 删除步骤
    deleteStep: { filename: string, step: any, parentIds: string[] }
    selectImage: {}
    openExplorer: { filename: string }
    minimize?: {}
    appClose?: {}
    runCmd: { cmd: string }
    ipcAddStep: {
        step: any,
        parentIds: string[],
        menuKey: string,
        scriptName: string
    }
}

export type TSendEvent = <Name extends keyof IpcEventMap>(name: Name, data: IpcEventMap[Name]) => Promise<any>

export interface ISendEvent {
    sendEvent: TSendEvent
}

export type IpcMainFunc<T> = {
    [Property in keyof T]: (data: T[Property]) => any
}


