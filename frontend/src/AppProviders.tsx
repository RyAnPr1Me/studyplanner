import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Provider } from 'react-redux'
import { createAppTheme } from './theme'
import { store } from './store/store'

interface AppProvidersProps {
  children: (props: { mode: 'light' | 'dark'; toggleMode: () => void }) => ReactNode
}

const AppProviders = ({ children }: AppProvidersProps) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const theme = useMemo(() => createAppTheme(mode), [mode])

  const toggleMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children({ mode, toggleMode })}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default AppProviders
