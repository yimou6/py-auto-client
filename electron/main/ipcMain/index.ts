import { ipcMain } from 'electron'
import * as stepIpcMain from './step.ipcMain'
import * as sysIpcMain from './sys.ipcMain'
import { IpcMainFunc, IpcEventMap } from '../../../types'

const ipcMainFunc: IpcMainFunc<IpcEventMap> = {
    getScriptList: () => stepIpcMain.getScriptList(),
    createScript: (data) => stepIpcMain.createScript(data),
    deleteScript: (data) => stepIpcMain.deleteScript(data),
    getSteps: (data) => stepIpcMain.getSteps(data),
    modifyStep: (data) => stepIpcMain.modifyStep(data),
    deleteStep: (data) => stepIpcMain.deleteStep(data),
    selectImage: () => sysIpcMain.selectImage(),
    openExplorer: (data) => sysIpcMain.openExplorer(data),
    runCmd: (data) => sysIpcMain.runCmd(data),
    ipcAddStep: (data) => stepIpcMain.ipcAddStep(data)
}

export default function registerIpcMain () {
    for (let key in ipcMainFunc) {
        ipcMain.handle(key, (event, args) => ipcMainFunc[key](args))
    }
}

