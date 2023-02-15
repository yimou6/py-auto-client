import { join } from 'path'
import { app, shell, dialog } from 'electron'
import { dataDir } from '../utils'
import { exec } from 'child_process'

export async function openExplorer({ filename }) {
    await shell.openPath(join(dataDir, filename))
}

export const step_image = () => {
    return dialog.showOpenDialogSync({
        title: '选择图片',
        filters: [
            {
                name: 'Images',
                extensions: ['jpg', 'png']
            }
        ],
        properties: ['openFile']
    })
}

export function runCmd({ cmd, id }: { cmd: string, id?: string }) {
    exec('start.bat', {
        cwd: join(app.getPath('userData'), 'step', cmd)
    })
}