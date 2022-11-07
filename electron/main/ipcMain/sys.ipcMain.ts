import { join } from 'path'
import { app, shell, dialog } from 'electron'
import { dataDir } from '../utils'

export async function openExplorer(filename: string) {
    await shell.openPath(join(dataDir, filename))
}

export function selectImage() {
    return dialog.showOpenDialogSync({
        title: '选择图片',
        defaultPath: app.getPath('pictures'),
        filters: [
            {
                name: 'Images',
                extensions: ['jpg', 'png']
            }
        ],
        properties: ['openFile']
    })
}