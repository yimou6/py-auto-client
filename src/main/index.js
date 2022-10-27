import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { getAppConfig, getScripts, createScript } from './ipcMain/index'

let appConfig = {}
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../../build/icon.png')
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  ipcMain.handle('modifyScript', (event, args) => createScript(event, args, appConfig.script))

  ipcMain.handle('getAppConfig', async () => {
    // 读取App系统配置
    appConfig = getAppConfig()
    appConfig['scripts'] = getScripts(appConfig.script)
    console.log('系统配置', appConfig)
    return JSON.stringify(appConfig)
  })

  ipcMain.on('saveImage', (event, args) => {
    const base64 = args.replace(/^data:image\/\w+;base64,/, '')
    const dataBuffer = new Buffer(base64, 'base64')
    // todo 图片保存路径、图片名称格式
    const imgUrl = path.join(app.getPath('pictures'), 'test.png')
    fs.writeFile(imgUrl, dataBuffer, function (err) {
      if (err) {
        event.reply('saveImageReply', err)
      } else {
        event.reply('saveImageReply', imgUrl)
      }
    })
  })

  ipcMain.on('transformImageToBase64', (event, args) => {
    fs.readFile(args, (err, data) => {
      if (err) {
        event.reply('transformImageToBase64Reply', err)
      } else {
        const extName = path.extname(args)
        const fileType = extName.replace('.', '')
        const base64 = `data:image/${fileType};base64,${data.toString('base64')}`
        event.reply('transformImageToBase64Reply', base64)
      }
    })
  })

  ipcMain.on('selectScriptPath', (event, args) => {
    const folderPath = dialog.showOpenDialogSync({
      title: '请选择脚本保存目录',
      defaultPath: args,
      properties: ['openDirectory']
    })
    if (folderPath) {
      setAppConfig('scriptPath', folderPath[0])
      event.reply('selectScriptPathReply', folderPath[0])
    } else {
      event.reply('selectScriptPathReply', folderPath)
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function setAppConfig(key, value) {
  const addr = path.join(app.getPath('userData'), 'config.json')
  const str = JSON.stringify(Object.assign(appConfig, { [key]: value }))
  fs.writeFile(addr, str, (err) => {
    if (err) {
      console.error(err)
    } else {
      appConfig[key] = value
    }
  })
}
