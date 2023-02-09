export type StepType = '单击坐标' | '点击图片' | '判断图片' | '循环' | '键盘按键' | '组合键' | '输入字符' | '等待' | '判断时间'

const StepTypeOptionMap: Record<StepType, Array<keyof StepOption>> = {
    '单击坐标': ['button', 'clicks', 'x', 'y'],
    '点击图片': ['opera', 'button', 'clicks', 'x', 'y', 'error'],
    '判断图片': ['opera', 'waitTime', 'error'],
    '循环': ['presses'],
    '键盘按键': ['opera', 'presses'],
    '判断时间': ['presses', 'day'],
    '等待': ['waitTime'],
    '组合键': ['hotkey'],
    '输入字符': ['opera']
}

class StepOption {
    opera?: string
    old_opera?: string
    button?: 'left' | 'right'
    clicks?: number
    x?: number
    y?: number
    presses?: number
    waitTime?: number
    day?: number
    error?: string
    hotkey?: string[]

    constructor(initKeys?: Array<keyof StepOption>) {
        let keys: Array<keyof StepOption> = []
        if (initKeys) {
            keys = initKeys
        } else {
            keys = StepTypeOptionMap['点击图片']
        }
        keys.forEach(key => {
            switch(key) {
                case 'opera':
                    this.opera = ''
                    break
                case 'old_opera':
                    this.old_opera = ''
                    break
                case 'button':
                    this.button = 'left'
                    break
                case 'clicks':
                    this.clicks = 1
                    break
                case 'x':
                    this.x = 0
                    break
                case 'y':
                    this.y = 0
                    break
                case 'presses':
                    this.presses = 1
                    break
                case 'waitTime':
                    this.waitTime = 10
                    break
                case 'day':
                    this.day = 1
                    break
                case 'error':
                    this.error = 'continue'
                    break
                case 'hotkey':
                    this.hotkey = []
                    break
            }
        })
    }
}

export class CStep {
    id: string
    type: StepType
    nextWait: number
    options: StepOption
    childKey?: string
    children?: CStep[]

    constructor() {
        this.id = ''
        this.type = '点击图片'
        this.nextWait = 1
        this.options = new StepOption(StepTypeOptionMap[this.type])
    }

    initOptions() {
        this.options = new StepOption(StepTypeOptionMap[this.type])
    }

    setKeyValue(newStep: CStep) {
        this.id = newStep.id
        this.type = newStep.type
        this.nextWait = newStep.nextWait
        this.options = newStep.options
        if (newStep.childKey) {
            this.childKey = newStep.childKey
        } else {
            delete this.childKey
        }
    }

    validate() {
        if (this.type === '点击图片') {
            if (isNil(this.options.opera)) {
                return '请选择图片'
            }
            if (isNil(this.options.x) || isNil(this.options.y)) {
                return '坐标偏移不能为空'
            }
        }
        if (this.type === '单击坐标') {
            if (isNil(this.options.x) || isNil(this.options.y)) {
                return '坐标偏移不能为空'
            }
        }
        if (this.type === '判断图片') {
            if (isNil(this.options.opera)) {
                return '请选择图片'
            }
        }
        if (this.type === '键盘按键') {
            if (isNil(this.options.opera)) {
                return '请选择按键'
            }
        }
        if (this.type === '组合键') {
            if (isNil(this.options.hotkey)) {
                return '请选择组合键'
            } else if (this.options.hotkey!.length < 2) {
                return '组合键至少包含2个键'
            }
        }
        if (this.type === '输入字符') {
            if (isNil(this.options.opera)) {
                return '输入字符不能为空'
            }
        }
        return ''
    }
}

function isNil(value: any) {
    return typeof value === 'undefined' || value === null || value === ''
}