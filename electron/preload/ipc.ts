import { ipcRenderer } from 'electron'
import {deleteScript} from "../main/ipcMain/step.ipcMain";
export default {
    // 获取所有脚本列表
    getScriptList: () => ipcRenderer.invoke('getScriptList'),
    // 创建脚本
    createScript: ({ title, pinyin }) => ipcRenderer.invoke('createScript', { title, pinyin }),
    // 删除脚本
    deleteScript: (filename) => ipcRenderer.invoke('deleteScript', filename),
    // 获取步骤
    getSteps: (filename) => ipcRenderer.invoke('getSteps', filename),
    // 新建步骤
    createStep: ({ filename, step, opera, parentIds }) => ipcRenderer.invoke('createStep', { filename, step, opera, parentIds }),
    // 修改步骤
    modifyStep: ({ filename, step, parentIds }) => ipcRenderer.invoke('modifyStep', { filename, step, parentIds }),
    // 删除步骤
    deleteStep: ({ filename, step, parentIds }) => ipcRenderer.invoke('deleteStep', { filename, step, parentIds }),
    selectImage: () => ipcRenderer.invoke('selectImage'),
    openExplorer: (filename) => ipcRenderer.invoke('openExplorer', filename),
    minimize: () => ipcRenderer.send('minimize'),
    appClose: () => ipcRenderer.send('appClose'),
    runCmd: (cmd) => ipcRenderer.send('runCmd', cmd)
}