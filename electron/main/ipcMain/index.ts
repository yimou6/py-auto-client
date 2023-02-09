import { ipcMain } from 'electron'
import * as stepIpcMain from './step.ipcMain'
import * as sysIpcMain from './sys.ipcMain'


// @ts-ignore
import { IpcMainFunc, IpcEventMap } from '../../../src/types'

const ipcMainFunc: IpcMainFunc<IpcEventMap> = {
    openExplorer: (data) => sysIpcMain.openExplorer(data),
    runCmd: (data) => sysIpcMain.runCmd(data),
    script_create: data => stepIpcMain.script_create(data),
    script_modify: data => stepIpcMain.script_modify(data),
    script_del: data => stepIpcMain.script_del(data),
    script_get: _ => stepIpcMain.script_get(),
    step_add: data => stepIpcMain.step_add(data),
    step_image: _ => sysIpcMain.step_image(),
    step_get: data => stepIpcMain.step_get(data),
    step_del: data => stepIpcMain.step_del(data),
    step_modify: data => stepIpcMain.step_modify(data),
}

export default function registerIpcMain () {
    for (let key in ipcMainFunc) {
        ipcMain.handle(key, (event, args) => ipcMainFunc[key](args))
    }
}



