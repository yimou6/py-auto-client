import {existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, writeFileSync} from 'fs'
import { join } from 'path'
import { existsMkdir, copyImage, rmDir } from '../utils'
import { StepClass } from '../utils/step.type'
import { EMouseRightMenu } from '../utils/types'
import { dataDir } from '../utils'
import { batStr, pyStr } from './file.config'


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
export function createScript({ title, pinyin }) {
    const dir = join(dataDir, pinyin + '_script')
    // 已有脚本目录则不创建
    if (existsSync(dir)) return { code: 0, msg: '创建失败，已存在该脚本！' }

    try {
        // 新建脚本文件夹
        mkdirSync(dir)

        // 新建配置文件
        const time = new Date().toLocaleString()
        writeFileSync(
            join(dir, 'config.json'),
            JSON.stringify({
                title: title,
                filename: pinyin + '_script',
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
        deleteScript({
            filename: pinyin + '_script'
        })
        return {
            code: 0,
            msg: e.toString()
        }
    }
    return {
        code: 1,
        msg: '创建成功！'
    }
}

/**
 * 删除脚本
 */
export function deleteScript({ filename }) {
    rmDir(join(dataDir, filename))
    rmdirSync(join(dataDir, filename))
}

/**
 * 获取步骤
 * @param filename
 */
export function getSteps({ filename }) {
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
 * 修改步骤
 */
export function modifyStep({ filename, step, parentIds }) {
    const result = getSteps({
        filename: filename
    })
    if (result) {
        console.log(step)
        updateStep(result.data, parentIds, step)
        try {
            writeFileSync(
                join(dataDir, filename, 'step.json'),
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
export function deleteStep({ filename, step, parentIds }) {
    const result = getSteps({
        filename: filename
    })
    if (result) {
        delStep(result.data, parentIds, step)
        try {
            writeFileSync(
                join(dataDir, filename, 'step.json'),
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


export function ipcAddStep(args) {
    const { step, parentIds, menuKey, scriptName } = args
    // console.log('新增脚本：')
    // console.log('step：', step)
    // console.log('parentIds：', parentIds)
    // console.log('menuKey：', menuKey)
    // console.log('scriptName：', scriptName)
    const result = getSteps(scriptName)
    if (result) {
        const needCopyImage = ['点击图片', '判断图片出现']
        if (needCopyImage.includes(step.type)) {
            step.options.opera = copyImage(
                step.options.opera,
                join(dataDir, scriptName, 'images')
            )
        }
        step.id = `${Date.now()}`
        if (parentIds.length > 0) {
            createNextStep(result.data, step, menuKey, parentIds)
        } else {
            result.data.push(step)
        }

        try {
            writeFileSync(
                join(dataDir, scriptName, 'step.json'),
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


function delStep(steps: StepClass[], parentIds: string[], step: StepClass) {
    writeStepInfo(parentIds, steps, step, '', (data, index) => {
        data.splice(index, 1)
    })
}


function updateStep(data: StepClass[], parentIds: string[], step: StepClass) {
    writeStepInfo(parentIds, data, step, '', updatedStep)
}

function updatedStep(data, index, step) {
    console.log(data[index])
    for (const key in step) {
        if (!['success', 'fail', 'last'].includes(key)) {
            data[index][key] = step[key]
        }
    }
    console.log('success')
}


/**
 * 处理 创建、修改 步骤的逻辑
 * @param data
 * @param step
 * @param opera
 * @param parentIds
 */
function createNextStep(data: StepClass[], step: StepClass, opera: string, parentIds: string[]) {
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
                    let finallyIndex = findIndex(data['last'], id)
                    if (finallyIndex === -1) {
                        // todo error
                    } else {
                        index = finallyIndex
                        childKey = 'last'
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

function findIndex(data: StepClass[], id: string) {
    return data ? data.findIndex(item => item.id === id) : -1
}

function addStep(data, index, step, opera) {
    data.splice(opera === EMouseRightMenu.next ? index + 1 : index, 0, step)
}

function addChild(data, index, step, opera) {
    const childKey = opera === EMouseRightMenu.success
        ? 'success' : opera === EMouseRightMenu.fail
            ? 'fail' : 'last'
    data[index][childKey] = [step]
}