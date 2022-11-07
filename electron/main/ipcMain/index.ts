import { ipcMain } from 'electron'
import * as stepIpcMain from './step.ipcMain'
import * as sysIpcMain from './sys.ipcMain'

export default function registerIpcMain () {
    for (let key in Object.assign(stepIpcMain, sysIpcMain)) {
        ipcMain.handle(key, (event, args) => stepIpcMain[key](args))
    }
}