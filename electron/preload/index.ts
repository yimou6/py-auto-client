import './appLoading'
import { contextBridge, ipcRenderer } from 'electron'
import { ISendEvent } from '../../src/types'

const _ipcRenderer: ISendEvent = {
  sendEvent: (name, data) => ipcRenderer.invoke(name, data)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('ipcRenderer', _ipcRenderer)
  } catch (e) {
    console.error(e)
  }
} else {
  window['ipcRenderer'] = _ipcRenderer
}



