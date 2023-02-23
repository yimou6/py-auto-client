process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron'
import { release } from 'os'
import { join } from 'path'
import registerIpcMain from './ipcMain/index'
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';

// 禁用 Windows7 的 GPU 加速
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// 设置 Windows 10+ 通知的应用程序名称
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// 删除 electron 安全警告
// 此警告仅在开发模式下显示
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  // 取消顶部菜单栏
  Menu.setApplicationMenu(null)

  win = new BrowserWindow({
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width: 1000,
    height: 600,
    resizable: false,
    // frame: false,
    // transparent: true,
    webPreferences: {
      preload,
      // 警告：启用nodeIntegration并禁用contextIsolation在生产中不安全
      // 考虑使用contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  })
  // 注册主进程与渲染进程的通讯
  registerIpcMain()

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // 如果应用程序未打包，则打开devTool
    win.webContents.openDevTools()
  }
}

app.whenReady().then(async () => {
  // await installExtension(VUEJS3_DEVTOOLS)
  await createWindow()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})
