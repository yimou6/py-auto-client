import {
    existsSync, mkdirSync, readdirSync,
    readFileSync, writeFileSync, statSync,
    rmdirSync, unlinkSync
} from 'fs'
import { join } from 'path'
import { app } from 'electron'

export const dataDir = join(app.getPath('userData'), 'step')

/**
 * 如果路径不存在则创建对应文件夹
 * @param dir
 */
export function existsMkdir(dir: string) {
    if (!existsSync(dir)) {
        mkdirSync(dir)
    }
}

/**
 * @desc 保存图片
 * @param dir
 * @param base64
 * @returns {null|*}
 */
export function saveImage(dir, base64) {
    const str = base64.replace(/^data:image\/\w+;base64,/, '')
    const dataBuffer = new Buffer(str, 'base64')
    const imageName = Date.now() + '.png'
    const imgUrl = join(dir, imageName)
    try {
        writeFileSync(imgUrl, dataBuffer)
        return imageName
    } catch (e) {
        return null
    }
}


/**
 * 复制图片
 * @param imageDir 源图片地址
 * @param newDir 目标图片地址
 */
export function copyImage(imageDir: string, newDir: string) {
    const imgStr = readFileSync(imageDir)
    const data = saveImage(newDir, imgStr.toString('base64'))
    if (data) {
        return join(newDir, data)
    }
    return null
}

/**
 * 删除文件夹
 */
export function rmDir(dir: string) {
    if (existsSync(dir)) {
        let files = readdirSync(dir)
        let child = null
        files.forEach(item => {
            child = join(dir, item)
            if (statSync(child).isDirectory()) {
                rmDir(child)
                rmdirSync(child)
            } else {
                unlinkSync(child)
            }
        })
    }
}