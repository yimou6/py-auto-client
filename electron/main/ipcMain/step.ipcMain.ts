import {existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, writeFileSync} from 'fs'
import { join } from 'path'
import { existsMkdir, copyImage, rmDir } from '../utils'
import { Step } from '../utils/step.type'
import { EMouseRightMenu } from '../utils/types'
import { dataDir } from '../utils'

/**
 * 获取所有脚本列表
 */
export function getScriptList(): any[] {
    // 如果路径不存在则创建
    existsMkdir(dataDir)

    // 获取文件夹列表
    const dirList = readdirSync(dataDir)
    const scripts = dirList.filter((dir: string) => dir.includes('_script'))
    let list = []
    if (scripts.length === 0) return list

    // 读取配置文件config.json
    scripts.forEach((item: string) => {
        const fileDir = join(dataDir, item, 'config.json')
        if (existsSync(fileDir)) {
            let doc = readFileSync(fileDir)
            let scriptConfig
            try {
                scriptConfig = JSON.parse(doc.toString('utf-8'))
                list.push(scriptConfig)
            } catch (e) {
                console.error(e)
            }
        }
    })
    return list
}

/**
 * 创建脚本
 */
export function createScript(opt: { title: string, pinyin: string }) {
    const dir = join(dataDir, opt.pinyin + '_script')
    // 已有脚本目录则不创建
    if (existsSync(dir)) return 0

    // 新建脚本文件夹
    mkdirSync(dir)

    // 新建配置文件
    const time = new Date().toLocaleString()
    writeFileSync(
        join(dir, 'config.json'),
        JSON.stringify({
            title: opt.title,
            filename: opt.pinyin + '_script',
            createdAt: time,
            updatedAt: time
        })
    )

    // 新建脚本步骤配置文件 step.json
    writeFileSync(
        join(dir, 'step.json'),
        JSON.stringify([])
    )
    // 新建脚本图片保存文件夹 images
    mkdirSync(join(dir, 'images'))
    return 1
}

/**
 * 删除脚本
 */
export function deleteScript(filename) {
    rmDir(join(dataDir, filename))
    rmdirSync(join(dataDir, filename))
}

/**
 * 获取步骤
 * @param filename
 */
export function getSteps(filename: string) {
    try {
        const doc = readFileSync(join(dataDir, filename, 'step.json'))
        return {
            data: JSON.parse(doc.toString('utf-8')),
            dir: join(dataDir, filename)
        }
    } catch (e) {
        console.error(e)
        return null
    }
}

/**
 * 新建步骤
 */
export function createStep(opt: { filename: string, step: Step, opera: string, parentIds: string[] }) {
    const result = getSteps(opt.filename)
    if (result) {
        const needCopyImage = ['单击图片', '双击图片', '判断图片出现']
        if (needCopyImage.includes(opt.step.type)) {
            opt.step.opera = copyImage(
                opt.step.opera,
                join(dataDir, opt.filename, 'images')
            )
        }
        opt.step.id = `${Date.now()}`
        if (opt.parentIds.length > 0) {
            createNextStep(result.data, opt.step, opt.opera, opt.parentIds)
        } else {
            result.data.push(opt.step)
        }

        try {
            writeFileSync(
                join(dataDir, opt.filename, 'step.json'),
                JSON.stringify(result.data)
            )
            return result.data
        } catch (e) {
            console.error(e)
            return null
        }
    }
    return null
}

/**
 * 修改步骤
 */
export function modifyStep(opt: { filename: string, step: Step, parentIds: string[] }) {
    const result = getSteps(opt.filename)
    if (result) {
        updateStep(result.data, opt.parentIds, opt.step)
        try {
            writeFileSync(
                join(dataDir, opt.filename, 'step.json'),
                JSON.stringify(result.data)
            )
            return result.data
        } catch (e) {
            console.error(e)
            return null
        }
    }
    return null
}

/**
 * 删除步骤
 * @param opt
 */
export function deleteStep(opt: { filename: string, step: Step, parentIds: string[] }) {
    const result = getSteps(opt.filename)
    if (result) {
        delStep(result.data, opt.parentIds, opt.step)
        try {
            writeFileSync(
                join(dataDir, opt.filename, 'step.json'),
                JSON.stringify(result.data)
            )
            return result.data
        } catch (e) {
            console.error(e)
            return null
        }
    }
    return null
}

function delStep(steps: Step[], parentIds: string[], step: Step) {
    writeStepInfo(parentIds, steps, step, '', (data, index) => {
        data.splice(index, 1)
    })
}


function updateStep(data: Step[], parentIds: string[], step: Step) {
    writeStepInfo(parentIds, data, step, '', updatedStep)
}

function updatedStep(data, index, step) {
    data[index] = step
    console.log('success')
}


/**
 * 处理 创建、修改 步骤的逻辑
 * @param data
 * @param step
 * @param opera
 * @param parentIds
 */
function createNextStep(data: Step[], step: Step, opera: string, parentIds: string[]) {
    if (opera === EMouseRightMenu.next) {
        if (parentIds.length === 0) {
            data.push(step)
        } else {
            writeStepInfo(parentIds, data, step, opera, addStep)
        }
    } else if (opera === EMouseRightMenu.previous) {
        if (parentIds.length === 0) {
            data.unshift(step)
        } else {
            writeStepInfo(parentIds, data, step, opera, addStep)
        }
    } else {
        writeStepInfo(parentIds, data, step, opera, addChild)
    }
}

function writeStepInfo(parentIds, initData, val, opera, callback) {
    let index = -1
    let data = {}
    parentIds.forEach((id, i) => {
        if (i === 0) {
            index = findIndex(initData, id)
            if (i === parentIds.length -1) {
                callback(initData, index, val, opera)
            } else {
                data = initData[index]
            }
        } else {
            let childKey = ''
            let successIndex = findIndex(data['success'], id)
            if (successIndex === -1) {
                let failIndex = findIndex(data['fail'], id)
                if (failIndex === -1) {
                    let finallyIndex = findIndex(data['finally'], id)
                    if (finallyIndex === -1) {
                        // todo error
                    } else {
                        index = finallyIndex
                        childKey = 'finally'
                    }
                } else {
                    index = failIndex
                    childKey = 'fail'
                }
            } else {
                index = successIndex
                childKey = 'success'
            }
            if (i === parentIds.length -1) {
                callback(data[childKey], index, val, opera)
            } else {
                data = data[childKey][index]
            }
        }
    })
}

function findIndex(data: Step[], id: string) {
    return data ? data.findIndex(item => item.id === id) : -1
}

function addStep(data, index, step, opera) {
    data.splice(opera === EMouseRightMenu.next ? index + 1 : index, 0, step)
}

function addChild(data, index, step, opera) {
    const childKey = opera === EMouseRightMenu.success
        ? 'success' : opera === EMouseRightMenu.fail
            ? 'fail' : 'finally'
    data[index][childKey] = [step]
}