import { app, BrowserWindow, Notification } from 'electron'
import path from 'node:path'

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

const showReminder = (reminder: { task_subject: string; message: string; task_id: string }) => {
  const notification = new Notification({
    title: `Reminder: ${reminder.task_subject}`,
    body: reminder.message,
    silent: false,
  })

  notification.on('click', () => {
    mainWindow?.webContents.send('navigate-to-task', reminder.task_id)
  })

  notification.show()
}

app.whenReady().then(() => {
  createWindow()
  showReminder({ task_subject: 'Mathematics', message: 'Start studying Calculus - Derivatives', task_id: 'task-1' })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
