export type TStepType = '' | '单击图片' | '双击图片' | '判断图片' | '判断时间' | '输入字符' | '键盘按键' | '快捷键' | '单击坐标' | '等待'


type StepFile = 'button' | 'x' | 'y' | 'maxTime' | 'frequency' | 'hotkey' | 'dayType' | 'day' | 'success' | 'fail' | 'finally'

export class StepClass {
    id?: string
    name: string
    type: string
    opera: string
    lastTime: number // 下一步等待时间
    errorStop: 0 | 1 // 出错时是否中断
    button?: 'left' | 'right' // 鼠标左键/右键
    x?: number // 坐标x/偏移坐标x
    y?: number // 坐标x/偏移坐标x
    maxTime?: number // 最长等待时间(秒)
    frequency?: number // 按键次数
    hotkey?: string[] // 热键/快捷键
    dayType?: string // 日期类型：每月，每周
    day?: number // 具体日期：1-31日；周1-周日
    sleep?: number // 等待时间(sec)
    success?: StepClass[]
    fail?: StepClass[]
    finally?: StepClass[]

    constructor() {
        this.name = ''
        this.type = ''
        this.opera = ''
        this.lastTime = 1
        this.errorStop = 0
    }

    /**
     * 清空所有的值
     */
    public clearAllField() {
        this.id = ''
        this.name = ''
        this.type = ''
        this.opera = ''
        this.lastTime = 1
        this.errorStop = 0
        this.button = 'left'
        this.x = 0
        this.y = 0
        this.maxTime = 2
        this.frequency = 1
        this.hotkey = ['', '', '']
        this.dayType = ''
        this.day = 1
        this.sleep = 1
    }

    /**
     * 将source的值复制到object中
     * @param source
     */
    public copyValue(source: StepClass) {
        this.id = source.id
        this.name = source.name
        this.type = source.type
        this.opera = source.opera
        this.lastTime = source.lastTime || 1
        this.errorStop = source.errorStop || 0
        this.button = source.button || 'left'
        this.x = source.x || 0
        this.y = source.y || 0
        this.maxTime = source.maxTime || 2
        this.frequency = source.frequency || 1
        this.hotkey = source.hotkey || ['', '', '']
        this.dayType = source.dayType || ''
        this.day = source.day || 1
        this.sleep = source.sleep || 1
    }

    /**
     * 验证字段
     * 根据type，保留对应type需要的字段
     */
    public validate() {
        let obj = new StepClass()
        obj.id = this.id
        obj.name = this.name
        obj.type = this.type
        obj.opera = this.opera
        obj.lastTime = this.lastTime || 1
        obj.errorStop = this.errorStop || 0

        if (this.type === '单击图片') {
            obj.button = this.button
            obj.x = this.x
            obj.y = this.y
            obj.delField(['maxTime', 'frequency', 'hotkey', 'dayType', 'day'])
        }
        if (this.type === '双击图片') {
            obj.x = this.x
            obj.y = this.y
            obj.delField(['button', 'maxTime', 'frequency', 'hotkey', 'dayType', 'day'])
        }
        if (this.type === '判断图片') {
            obj.maxTime = this.maxTime
            obj.delField(['button', 'x', 'y', 'frequency', 'hotkey', 'dayType', 'day'])
        }
        if (this.type === '判断时间') {
            obj.dayType = this.dayType
            obj.day = this.day
            obj.delField(['button', 'x', 'y', 'frequency', 'hotkey'])
        }
        if (this.type === '输入字符') {
            obj.delField(['button', 'x', 'y', 'maxTime', 'frequency', 'hotkey', 'dayType', 'day'])
        }
        if (this.type === '键盘按键') {
            obj.frequency = this.frequency
            obj.delField(['button', 'x', 'y', 'hotkey', 'dayType', 'day'])
        }
        if (this.type === '快捷键') {
            obj.hotkey = this.hotkey
            obj.delField(['button', 'x', 'y', 'frequency', 'dayType', 'day'])
        }
        if (this.type === '单击坐标') {
            obj.x = this.x
            obj.y = this.y
            obj.delField(['button', 'maxTime', 'frequency', 'hotkey', 'dayType', 'day'])
        }
        if (this.type === '等待') {
            console.log('maxTime', this.maxTime)
            obj.maxTime = this.maxTime
            obj.delField(['button', 'x', 'y', 'frequency', 'hotkey', 'dayType', 'day'])
        }
        obj.delField(['success', 'fail', 'finally'])
        return JSON.parse(JSON.stringify(obj))
    }

    private delField(fields: string[]) {
        fields.forEach(field => {
            // @ts-ignore
            delete this[field]
        })
    }
}