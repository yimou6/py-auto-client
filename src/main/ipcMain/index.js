import path from 'path'
import fs from 'fs'
import { app } from 'electron'

export function saveImage(event, base64) {
  const str = base64.replace(/^data:image\/\w+;base64,/, '')
  const dataBuffer = new Buffer(str, 'base64')
  // todo 图片保存路径、图片名称格式
  const imgUrl = path.join(app.getPath('pictures'), 'test.png')
  fs.writeFile(imgUrl, dataBuffer, function (err) {
    if (err) {
      event.returnValue = err
    } else {
      event.returnValue = imgUrl
    }
  })
}

/**
 * 读取系统配置 system.json
 * 如果文件不存在则创建并初始化
 *    script: "{userData}/step/"
 */
export function getAppConfig() {
  const systemConfigPath = path.join(app.getPath('userData'), 'system.json')
  if (!fs.existsSync(systemConfigPath)) {
    const defaultConfig = JSON.stringify({
      script: path.join(app.getPath('userData'), 'step')
    })
    fs.writeFileSync(systemConfigPath, defaultConfig)
  }
  const doc = fs.readFileSync(systemConfigPath)
  return JSON.parse(doc.toString())
}

/**
 * 获取所有的脚本配置
 * @param address {string} 脚本目录
 */
export function getScripts(address) {
  if (!fs.existsSync(address)) {
    fs.mkdirSync(address)
    return []
  }
  const dirs = fs.readdirSync(address)
  const scriptDir = dirs.filter((dir) => dir.includes('_script'))
  let scripts = []
  if (scriptDir.length > 0) {
    scriptDir.forEach((item) => {
      if (fs.existsSync(path.join(address, item, 'config.json'))) {
        let doc = fs.readFileSync(path.join(address, item, 'config.json'))
        if (doc) {
          scripts.push(JSON.parse(doc.toString()))
        }
      }
    })
  }
  return scripts
}

/**
 * 创建脚本
 */
export async function createScript(event, args, address) {
  const scriptOpt = JSON.parse(args)
  if (scriptOpt.id) {
    //...
  } else {
    // 无id则为新建
    // 新建脚本文件夹
    const dir = path.join(address, scriptOpt.title + '_script')
    fs.mkdirSync(dir)
    // 新建脚本配置文件 config.json
    fs.writeFileSync(
      path.join(dir, 'config.json'),
      JSON.stringify({
        id: Date.now().toString(),
        title: scriptOpt.title,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      })
    )
    // 新建脚本步骤配置文件 step.json
    fs.writeFileSync(
      path.join(dir, 'step.json'),
      JSON.stringify([])
    )
    // todo 将python脚本复制到dir目录下
  }
  console.log(scriptOpt.title)
  return null
}
