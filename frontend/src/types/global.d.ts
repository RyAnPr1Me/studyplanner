declare global {
  interface Window {
    electronAPI?: {
      onNavigateToTask: (callback: (taskId: string) => void) => void
    }
  }
}

export {}
