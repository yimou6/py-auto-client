type StepButton = 'left' | 'right'
type StepClick = 'single' | 'double'
type StepError = 'stop' | 'continue'

export interface RadioItem {
    label: string
    value: string
}

export interface IClickRightNode {
    position: PointerEvent
    nodes: IStep[]
}

export interface IClickImage {
    button: StepButton
    clicks: StepClick
    x: number
    y: number
    error: StepError
    opera: string
    old_opera?: string
}

export interface IClickPosition {
    button: StepButton
    clicks: StepClick
    x: number
    y: number
}

export interface IJudgeDate {
    presses: '1' | '2',
    day: string
}

export interface IJudgeImage {
    waitTime: string
    opera: string
    error: StepError
    old_opera?: string
}

export interface IKeyboard {
    opera: string,
    presses: string
}

export interface IKeyboardHot {
    hotkey: string[]
}

export interface ILoop {
    presses: string
}

export interface IWaitTime {
    waitTime: string
}

export interface IWriteChar {
    opera: string
}

type TStepOption = IClickImage | IClickPosition | IJudgeDate
    | IJudgeImage | IKeyboard | IKeyboardHot | ILoop | IWaitTime | IWriteChar

type StepType = '点击图片' | '判断图片' | '键盘按键' | '输入字符'
    | '快捷键' | '单击坐标' | '等待' | '循环' | '判断时间'

export interface IStep {
    id?: string
    childKey?: string
    children?: IStep[]
    type: StepType
    nextWait: string
    options: TStepOption
}

export interface StepInfo {
    type: StepType | '',
    image: string,
    baseInfo: string[],
    otherInfo: string[]
}

























