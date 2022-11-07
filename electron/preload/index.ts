import './appLoading'
import { contextBridge } from 'electron'
import ipc from './ipc'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('ipc', ipc)
  } catch (e) {
    console.error(e)
  }
} else {
  window["ipc"] = ipc
}



