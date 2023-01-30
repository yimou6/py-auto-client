export interface IStepOptions {
    error: string
    opera: string
    waitTime: string
    hotkey: string[]
    button: string
    clicks: string
    x: string
    y: string
    presses: string,
    day: string
    old_opera: string
}

export interface IStep {
    id: string
    type: string
    children?: IStep[]
    childKey?: string
    options: IStepOptions
    nextWait: string
}