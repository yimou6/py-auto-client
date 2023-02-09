export const STEP_TYPES0 = [
    { label: '点击图片', value: '点击图片' },
    { label: '判断图片', value: '判断图片' },
    { label: '键盘按键', value: '键盘按键' },
    { label: '组合键', value: '组合键' }
]
export const STEP_TYPES1 = [
    { label: '等待', value: '等待' },
    { label: '输入字符', value: '输入字符' },
    { label: '单击坐标', value: '单击坐标' },
    { label: '循环', value: '循环' },
    { label: '判断时间', value: '判断时间' }
]

export const MOUSES = [
    { label: '左键', value: 'left' },
    { label: '右键', value: 'right' }
]

export const CLICKS = [
    { label: '单击', value: 1 },
    { label: '双击', value: 2 }
]

export const ERROR_NEXT = [
    { label: '继续', value: 'continue' },
    { label: '中断', value: 'stop' }
]

export const DAY_TYPES = [
    { label: '每周', value: 1 },
    { label: '每月', value: 2 }
]

export const WEEK = [
    { label: '周日', value: 7 },
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 }
]
export const KEYBOARD: Array<Array<{ name: string, value: string, size?: number }>> = [
    [
        { name: 'Esc', value: 'esc', size: 1.2 },
        { name: 'F1', value: 'f1', size: 1.2 },
        { name: 'F2', value: 'f2', size: 1.2 },
        { name: 'F3', value: 'f3', size: 1.2 },
        { name: 'F4', value: 'f4', size: 1.2 },
        { name: 'F5', value: 'f5', size: 1.2 },
        { name: 'F6', value: 'f6', size: 1.2 },
        { name: 'F7', value: 'f7', size: 1.2 },
        { name: 'F8', value: 'f8', size: 1.2 },
        { name: 'F9', value: 'f9', size: 1.2 },
        { name: 'F10', value: 'f10', size: 1.2 },
        { name: 'F11', value: 'f11', size: 1.2 },
        { name: 'F12', value: 'f12', size: 1.25 },
    ],
    [
        { name: '`', value: '`' },
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
        { name: '4', value: '4' },
        { name: '5', value: '5' },
        { name: '6', value: '6' },
        { name: '7', value: '7' },
        { name: '8', value: '8' },
        { name: '9', value: '9' },
        { name: '0', value: '0' },
        { name: '-', value: '-' },
        { name: '=', value: '=' },
        { name: 'Backspace', value: 'backspace', size: 2.5 }
    ],
    [
        { name: 'Tab', value: 'tab', size: 1.8 },
        { name: 'Q', value: 'q' },
        { name: 'W', value: 'w' },
        { name: 'E', value: 'e' },
        { name: 'R', value: 'r' },
        { name: 'T', value: 't' },
        { name: 'Y', value: 'y' },
        { name: 'U', value: 'u' },
        { name: 'I', value: 'i' },
        { name: 'O', value: 'o' },
        { name: 'P', value: 'p' },
        { name: '[', value: '[' },
        { name: ']', value: ']' },
        { name: '\\', value: '\\', size: 1.7 }
    ],
    [
        { name: 'Caps', value: 'capslock', size: 2.3 },
        { name: 'A', value: 'a' },
        { name: 'S', value: 's' },
        { name: 'D', value: 'd' },
        { name: 'F', value: 'f' },
        { name: 'G', value: 'g' },
        { name: 'H', value: 'h' },
        { name: 'J', value: 'j' },
        { name: 'K', value: 'k' },
        { name: 'L', value: 'l' },
        { name: ';', value: ';' },
        { name: '"', value: '"' },
        { name: 'Enter', value: 'enter', size: 2.3 }
    ],
    [
        { name: 'Shift', value: 'shiftleft', size: 2.9 },
        { name: 'Z', value: 'z' },
        { name: 'X', value: 'x' },
        { name: 'C', value: 'c' },
        { name: 'V', value: 'v' },
        { name: 'B', value: 'b' },
        { name: 'N', value: 'n' },
        { name: 'M', value: 'm' },
        { name: ',', value: ',' },
        { name: '.', value: '.' },
        { name: '/', value: '/' },
        { name: 'Shift', value: 'shiftright', size: 2.9 }
    ],
    [
        { name: 'Ctrl', value: 'ctrlleft', size: 1.5 },
        { name: 'Win', value: 'winleft', size: 1.5 },
        { name: 'Alt', value: 'altleft', size: 1.5 },
        { name: 'Space', value: 'space', size: 5.93 },
        { name: 'Win', value: 'winright', size: 1.5 },
        { name: 'Alt', value: 'altright', size: 1.5 },
        { name: 'Fn', value: 'fn', size: 1.5 },
        { name: 'Ctrl', value: 'ctrlright', size: 1.5 }
    ]
]

export const menuChildKeyMap: Record<string, string> = {
    '成功步骤': 'success',
    '失败步骤': 'fail',
    '最后步骤': 'finally'
}