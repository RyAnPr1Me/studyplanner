import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  onNavigateToTask: (callback: (taskId: string) => void) => ipcRenderer.on('navigate-to-task', (_, taskId) => callback(taskId)),
})
