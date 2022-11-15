export class IStep {
    id?: string
    name: string // 步骤名称
    type: string // 步骤类型
    nextWait: number // 下一步等待
    options: {
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
    success?: IStep[]
    fail?: IStep[]
    last?: IStep[]

    constructor() {
        this.name = ''
        this.type = ''
        this.nextWait = 1
        this.options = {}
    }

    public clearAllValue() {
        this.name = ''
        this.type = ''
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

    public copyValue(source: IStep) {
        this.name = source.name
        this.type = source.type
        this.nextWait = source.nextWait || 1
        this.options.opera = source.options.opera || ''
        this.options.button = source.options.button || 'left',
        this.options.x = source.options.x || 0,
        this.options.y = source.options.y || 0,
        this.options.clicks = source.options.clicks || 'single',
        this.options.waitTime = source.options.waitTime || 2,
        this.options.presses = source.options.presses || 1, // todo
        this.options.errorStop = source.options.errorStop || 0,
        this.options.day = source.options.day || 1,
        this.options.hotkey = source.options.hotkey || ['', '', '']
    }

    public formatterStepData(): any {
        let obj = new IStep()
        obj.name = this.name
        obj.type = this.type
        obj.nextWait = this.nextWait
        obj.options = {}
        switch (this.type) {
            case '点击图片':
                obj.options.opera = this.options.opera
                obj.options.x = this.options.x
                obj.options.y = this.options.y
                obj.options.button = this.options.button
                obj.options.clicks = this.options.clicks
                obj.options.errorStop = this.options.errorStop
                break
            case '判断图片出现':
                obj.options.opera = this.options.opera
                obj.options.waitTime = this.options.waitTime
                obj.options.errorStop = this.options.errorStop
                break
            case '键盘按键':
                obj.options.opera = this.options.opera
                obj.options.presses = this.options.presses
                break
            case '输入字符':
                obj.options.opera = this.options.opera
                break
            case '快捷键':
                obj.options.hotkey = this.options.hotkey
                break
            case '单击坐标':
                obj.options.button = this.options.button
                obj.options.clicks = this.options.clicks
                obj.options.x = this.options.x
                obj.options.y = this.options.y
                break
            case '等待':
                obj.options.waitTime = this.options.waitTime
                break
            case '循环':
                obj.options.presses = this.options.presses
                break
            case '判断日期':
                obj.options.presses = this.options.presses
                obj.options.day = this.options.day
                break
        }
        delete obj.success
        delete obj.fail
        delete obj.last
        return JSON.parse(JSON.stringify(obj))
    }
}