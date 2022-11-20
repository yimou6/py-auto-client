import { ipcMain } from 'electron'
import * as stepIpcMain from './step.ipcMain'
import * as sysIpcMain from './sys.ipcMain'
//
// import { IpcEventMap, TSendEvent } from '../../../types'
//
// // @ts-ignore
// const IpcMainFunc: Record<T extends keyof IpcEventMap, any> = {
//     getScriptList: () => {
//         return Promise.resolve()
//     },
//     createScript: (title, pinyin) => {
//         return Promise.resolve()
//     }
// }


export default function registerIpcMain () {
    for (let key in Object.assign(stepIpcMain, sysIpcMain)) {
        ipcMain.handle(key, (event, args) => stepIpcMain[key](args))
    }
}

