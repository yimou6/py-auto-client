export interface IpcEventMap {
    openExplorer: { filename: string }
    minimize?: {}
    appClose?: {}
    runCmd: { cmd: string }
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

export interface IClickRightNode {
    position: PointerEvent
    nodes: Step[]
}

export interface IArea {
    x: number
    y: number
}

export interface IScript {
    title: string
    filename: string
    createdAt: string
    updatedAt: string
}

export enum EMouseRightMenu {
    'previous' = '添加上一步',
    'next' = '添加下一步',
    'success' = '判断成功步骤',
    'fail' = '判断失败步骤',
    'finally' = '判断结束步骤',
    'edit' = '修改步骤',
    'del' = '删除步骤'
}


export type StepTypes = '点击图片' | '判断图片' | '键盘按键' | '输入字符' | '快捷键' | '单击坐标' | '等待' | '循环' | '判断时间'

interface StepOptions {
    opera?: string // 按键、图片
    presses?: number // 按键次数，日期频次，循环次数
    x?: number // 坐标x、坐标偏移x
    y?: number // 坐标y、坐标偏移y
    button?: 'left' | 'right' // 鼠标左/右键
    clicks?: 'single' | 'double' // 鼠标点击次数
    waitTime?: number // 等待时间、最长等待时间
    errorStop?: number // 出错是否中断
    day?: number // 日期
    hotkey?: string[] // 快捷键
}

export class Step {
    id?: string = ''
    name: string = ''
    type: StepTypes | '' = ''
    opera: string = ''
    // 下一步等待时间
    nextWait: number = 1
    options: StepOptions = {
        opera: '',
        presses: 1,
        x: 0,
        y: 0,
        button: 'left',
        clicks: 'single',
        waitTime: 2,
        errorStop: 0,
        day: 1,
        hotkey: ['', '', '']
    }
    success?: Step[]
    fail?: Step[]
    last?: Step[]

    setValue(source: Step) {
        Object.keys(source).forEach((key: string) => {
            if (key === 'options') {
                Object.keys(source.options).forEach((optionsKey: string) => {
                    // @ts-ignore
                    this.options[optionsKey] = source.options[optionsKey]
                })
            } else {
                // @ts-ignore
                this[key] = source[key]
            }
        })
    }
    
    getValue() {
        const typeValueMap: Record<StepTypes, string[]> = {
            '点击图片': ['opera', 'x', 'y', 'button', 'clicks', 'errorStop'],
            '判断图片': ['opera', 'waitTime', 'errorStop'],
            '键盘按键': ['opera', 'presses'],
            '输入字符': ['opera'],
            '快捷键': ['hotkey'],
            '单击坐标': ['button', 'clicks', 'x', 'y'],
            '等待': ['waitTime'],
            '循环': ['presses'],
            '判断时间': ['presses', 'day']
        }
        let obj: Step = new Step()
        obj.setValue(this)
        Object.keys(obj.options).forEach(key => {
            // @ts-ignore
            if (!typeValueMap[obj.type].includes(key)) {
                // @ts-ignore
                delete obj.options[key]
            }
        })
        return JSON.parse(JSON.stringify(obj))
    }

    clear() {
        this.name = ''
        this.type = ''
        this.opera = ''
        this.nextWait = 1
        this.options = {
            opera: '',
            presses: 1,
            x: 0,
            y: 0,
            button: 'left',
            clicks: 'single',
            waitTime: 2,
            errorStop: 0,
            day: 1,
            hotkey: ['', '', '']
        }
    }
}
