import {
    existsSync, mkdirSync, readdirSync,
    readFileSync, rmdirSync, writeFileSync,
    unlinkSync
} from 'fs'
import { join } from 'path'
import { existsMkdir, copyImage, rmDir } from '../utils'
import { dataDir } from '../utils'
import { batStr, pyStr } from './file.config'

/**
 * 返回字段格式
 *  code:
 *      0：失败
 *      1：成功
 *  msg：描述信息
 *  data?：返回数据
 */


function replyData(code: number, msg: string, data?: any) {
    return data ? { code, msg, data } : { code, msg }
}

/**
 * @desc 创建脚本文件夹以及初始化基础信息
 * @param title {string}
 */
export function script_create({ title }) {
    const time = new Date().toLocaleString()
    const filename = `${Date.now()}`
    // 使用【时间戳】做目录
    const dir = join(dataDir, `${filename}`)
    // 已有脚本目录则不创建
    if (existsSync(dir)) return replyData(0, '已存在该项')

    const config = {
        title: title,
        filename,
        createdAt: time,
        updatedAt: time
    }
    try {
        // 新建脚本文件夹
        mkdirSync(dir)

        // 新建配置文件
        writeFileSync(
            join(dir, 'config.json'),
            JSON.stringify(config)
        )

        // 新建脚本步骤配置文件 step.json
        writeFileSync(
            join(dir, 'step.json'),
            JSON.stringify([])
        )
        // 新建脚本图片保存文件夹 images
        mkdirSync(join(dir, 'images'))
        // 新建python脚本
        writeFileSync(
            join(dir, 'start.py'),
            pyStr
        )
        // 新建bat脚本
        writeFileSync(
            join(dir, 'start.bat'),
            batStr
        )
    } catch (e) {
        // 如果创建失败则删除全部已创建的文件和文件夹
        script_del({
            filename
        })
        return replyData(0, e.toString())
    }
    return replyData(1, '创建成功', { filename })
}

/**
 * @desc 删除脚本文件夹以及内容
 * @param filename {string}
 */
export const script_del = ({ filename }) => {
    rmDir(join(dataDir, filename))
    rmdirSync(join(dataDir, filename))
}

/**
 * @desc 修改脚本名称
 * @param title {string}
 * @param filename {string}
 */
export function script_modify({ title, filename }) {
    const dir = join(dataDir, filename)
    const time = new Date().toLocaleString()
    let doc

    // 读取原配置文件 config.json
    try {
        doc = readFileSync(join(dir, 'config.json'))
        doc = JSON.parse(doc.toString())
    } catch (e) {
        return replyData(0, e.toString())
    }

    // 修改配置文件 config.json
    doc['title'] = title
    doc['updatedAt'] = time

    // 保存
    writeFileSync(join(dir, 'config.json'), JSON.stringify(doc))
    return replyData(1, '修改成功')
}

export const step_get = ({ filename }) => {
    try {
        const doc = readFileSync(join(dataDir, filename, 'step.json'))
        return replyData(1, '查询成功', {
            data: JSON.parse(doc.toString('utf-8')),
            dir: join(dataDir, filename)
        })
    } catch (e) {
        return replyData(0, e.toString())
    }
}

export const step_add = ({ ids, filename, type, info }) => {
    // console.log('step add:', { ids, filename, type, info })
    // console.log(JSON.stringify(info))
    const { code, msg, data } = step_get({ filename })
    if (code === 0) {
        return replyData(0, `数据获取失败:${msg}`)
    }

    const stepInfo = { ...info }
    // 添加ID字段
    stepInfo.id = `${Date.now()}`
    // 处理图片
    const needCopyImage = ['点击图片', '判断图片']
    if (needCopyImage.includes(stepInfo.type)) {
        stepInfo.options.opera = copyImage(
            stepInfo.options.opera,
            join(dataDir, filename, 'images')
        )
    }

    const { data: _data } = data
    if (type) {
        updateStepList(_data, ids, type, stepInfo, '添加')
    } else {
        // type 无值、空字符串 - 直接添加下一步
        _data.push(stepInfo)
    }
    try {
        writeFileSync(
            join(dataDir, filename, 'step.json'),
            JSON.stringify(_data)
        )
        return replyData(1, '操作成功', _data)
    } catch (e) {
        return replyData(0, `操作失败:${e.toString()}`)
    }
}

export const step_del = ({ filename, ids }) => {
    const { code, msg, data } = step_get({ filename })
    if (code === 0) {
        return replyData(0, `数据获取失败:${msg}`)
    }
    if (ids.length > 0) {
        const { data: _data } = data
        updateStepList(_data, ids, '', {}, '删除')
        try {
            writeFileSync(
                join(dataDir, filename, 'step.json'),
                JSON.stringify(_data)
            )
            return replyData(1, '操作成功', _data)
        } catch (e) {
            return replyData(0, `操作失败:${e.toString()}`)
        }
    } else {
        return replyData(0, '参数有误')
    }
}

export const step_modify = ({ filename, ids, info }) => {
    const { code, msg, data } = step_get({ filename })
    if (code === 0) {
        return replyData(0, `数据获取失败:${msg}`)
    }

    const stepInfo = { ...info }
    // 处理图片
    const needCopyImage = ['点击图片', '判断图片']
    if (needCopyImage.includes(stepInfo.type)) {
        if (stepInfo.options.old_opera !== stepInfo.options.opera) {
            // 删除原图片，再移动现图片到对应位置
            if (existsSync(stepInfo.options.old_opera)) {
                unlinkSync(stepInfo.options.old_opera)
            }

            stepInfo.options.opera = copyImage(
                stepInfo.options.opera,
                join(dataDir, filename, 'images')
            )
        }
        delete stepInfo.options.old_opera
    }

    const { data: _data } = data
    updateStepList(_data, ids, '', info, '修改')
    try {
        writeFileSync(
            join(dataDir, filename, 'step.json'),
            JSON.stringify(_data)
        )
        return replyData(1, '操作成功', _data)
    } catch (e) {
        return replyData(0, `操作失败:${e.toString()}`)
    }
}

const updateStepList = (stepList, ids, type, step, opera) => {
    for (let i = 0; i < stepList.length; i++) {
        if (stepList[i].id === ids[0]) {
            if (ids.length === 1) {
                // 最后
                if (opera === '添加') {
                    addStepItem(stepList, stepList[i], step, type, i)
                }
                if (opera === '删除') {
                    stepList.splice(i, 1)
                    // 如果该步骤应用了图片则删除该图片
                    const needCopyImage = ['点击图片', '判断图片']
                    if (needCopyImage.includes(stepList[i].type)) {
                        if (existsSync(stepList[i].options.opera)) {
                            unlinkSync(stepList[i].options.opera)
                        }
                    }
                }
                if (opera === '修改') {
                    Object.keys(step).forEach(key => {
                        stepList[i][key] = step[key]
                    })
                }
                break
            } else {
                ids.splice(0, 1)
                if (ids.length > 0 && stepList[i].children) {
                    updateStepList(stepList[i].children, ids, type, step, opera)
                }
            }
        }
    }
}

const addStepItem = (stepList, findStep, step, type, index) => {
    if (type === '添加上一步') {
        stepList.splice(index, 0, step)
    } else if (type === '添加下一步') {
        stepList.splice(index + 1, 0, step)
    } else {
        if (findStep.children) {
            if (type === '判断成功步骤') {
                findStep.children.unshift(step)
            } else if (type === '判断失败步骤') {
                if (findStep.children[0].childKey === 'success') {
                    findStep.children.push(step)
                } else {
                    findStep.children.unshift(step)
                }
            } else {
                findStep.children.push(step)
            }
        } else {
            findStep.children = []
            findStep.children.push(step)
        }
    }
}

/**
 * 获取所有脚本列表
 */
export function script_get() {
    // 如果路径不存在则创建
    existsMkdir(dataDir)

    // 获取文件夹列表
    const dirList = readdirSync(dataDir)
    let list = []
    if (dirList.length === 0) return list

    // 读取配置文件config.json
    dirList.forEach((item: string) => {
        const fileDir = join(dataDir, item, 'config.json')
        if (existsSync(fileDir)) {
            let doc = readFileSync(fileDir)
            let scriptConfig
            try {
                scriptConfig = JSON.parse(doc.toString('utf-8'))
                list.push(scriptConfig)
            } catch (e) {
                replyData(0, e.toString())
            }
        }
    })
    return replyData(1, '查询成功', list)
}
