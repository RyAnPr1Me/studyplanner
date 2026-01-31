import { contextBridge, ipcRenderer } from 'electron'

const onNavigateToTask = (callback: (taskId: string) => void) => {
  const listener = (_: unknown, taskId: string) => callback(taskId)
  ipcRenderer.on('navigate-to-task', listener)
  return () => {
    ipcRenderer.removeListener('navigate-to-task', listener)
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  onNavigateToTask,
})
