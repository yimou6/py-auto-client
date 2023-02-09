export interface IpcEventMap {
    openExplorer: { filename: string }
    minimize?: {}
    appClose?: {}
    runCmd: { cmd: string, id?: string }
    script_create: { title: string },
    script_modify: { title: string, filename: string },
    script_del: { filename: string },
    script_get: {},
    step_image: {},
    step_add: { ids: string[], filename: string, type: string, info: any },
    step_get: { filename: string },
    step_del: { filename: string, ids: string[] },
    step_modify: { filename: string, ids: string[], info: any }
}

export type TSendEvent = <Name extends keyof IpcEventMap>(name: Name, data: IpcEventMap[Name]) => Promise<any>

export interface ISendEvent {
    sendEvent: TSendEvent
}

export type IpcMainFunc<T> = {
    [Property in keyof T]: (data: T[Property]) => any
}


export interface IScript {
    id: string
    title: string
    type: string
    filename: string
    createdAt: string
    updatedAt: string
}


