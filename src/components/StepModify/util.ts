import { IStep } from "../Step/step";

const menuChildKeyMap: Record<string, string> = {
    '成功步骤': 'success',
    '失败步骤': 'fail',
    '最后步骤': 'finally'
}

const isNull = (val: string | undefined | null) => {
    return val === '' || val === undefined || val === null
}

// 正实数，不含0 /^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+|[1-9]+\d*)$/

// 结束等待 nextWait
const validNextWait = (nextWait: string) => {
    if (nextWait) {
        if (/^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+|[1-9]+\d*)$/.test(nextWait)) {
            if (Number(nextWait) > 300) {
                return '结束最多等待300秒'
            }
            return ''
        }
    }
    return '请输入结束等待时间'
}

const formatValidKeys = (model: IStep, keys: string[]) => {
    let valid = false
    if (model.type === '组合键') {
        valid = model.options.hotkey?.some(it => it !== '') as boolean
    } else {
        valid = keys.every(key => {
            if (key === 'old_opera') {
                return true
            }
            // @ts-ignore
            return !isNull(model.options[key])
        })
    }
    if (valid) {
        let temp = {}
        // @ts-ignore
        keys.map(key => ({ [key]: model.options[key] })).forEach(item => {
            Object.assign(temp, item)
        })
        return temp
    }
    return ''
}

// 表单验证
// 格式化参数
export const formatValidate = (formModel: IStep, menu: string) => {
    if (isNull(formModel.nextWait)) return ''

    const _childKey = menuChildKeyMap[menu]
    const childKey = formModel.childKey || _childKey
    const type = formModel.type
    const nextWait = formModel.nextWait
    let tempModel = { type, nextWait }
    if (childKey) {
        tempModel = Object.assign(tempModel, { childKey })
    }
    let options

    if (formModel.type === '点击图片') {
        options = formatValidKeys(formModel, ['button', 'clicks', 'error', 'opera', 'old_opera', 'x', 'y'])
    } else if (formModel.type === '判断图片') {
        options = formatValidKeys(formModel, ['error', 'opera', 'old_opera', 'waitTime'])
    } else if (formModel.type === '键盘按键') {
        options = formatValidKeys(formModel, ['opera', 'presses'])
    } else if (formModel.type === '组合键') {
        options = formatValidKeys(formModel, ['hotkey'])
    } else if (formModel.type === '单击坐标') {
        options = formatValidKeys(formModel, ['x', 'y'])
    } else if (formModel.type === '等待') {
        options = formatValidKeys(formModel, ['waitTime'])
    } else if (formModel.type === '输入字符') {
        options = formatValidKeys(formModel, ['opera'])
    } else if (formModel.type === '循环') {
        options = formatValidKeys(formModel, ['presses'])
    } else if (formModel.type === '判断时间') {
        options = formatValidKeys(formModel, ['presses', 'day'])
    }

    if (options === '') return options

    return Object.assign(tempModel, { options: { ...options } })
}