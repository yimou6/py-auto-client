import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 渲染器的自定义API
const api = {
  // 发送base64到main，保存为图片
  saveImage: (base64) => ipcRenderer.send('saveImage', base64),
  // 发送图片路径到main，返回base64
  transformImageToBase64: (path) => ipcRenderer.send('transformImageToBase64', path),
  // 选择脚本保存位置
  selectScriptPath: () => ipcRenderer.send('selectScriptPath'),
  // 新建或修改脚本
  modifyScript: (scriptOpt) => ipcRenderer.invoke('modifyScript', JSON.stringify(scriptOpt)),
  // 获取系统配置
  getAppConfig: () => ipcRenderer.invoke('getAppConfig')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
