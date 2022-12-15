export const getScripts = async () => await window.ipcRenderer.sendEvent('script_get', {})

export const openExplorer = (filename: string) => window.ipcRenderer.sendEvent('openExplorer', { filename })

export const deleteScript = (filename: string) => window.ipcRenderer.sendEvent('script_del', { filename })

export const runCmd = (cmd: string) => window.ipcRenderer.sendEvent('runCmd', { cmd })

