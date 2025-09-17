import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

function ThemedApp() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as any) || 'light')
  useEffect(() => {
    const handler = (e: any) => setMode(e.detail === 'dark' ? 'dark' : 'light')
    window.addEventListener('theme-change', handler)
    return () => window.removeEventListener('theme-change', handler)
  }, [])
  const theme = useMemo(() => createTheme({
    palette: { mode, primary: { main: '#0ea5e9' }, secondary: { main: '#6366f1' } },
    shape: { borderRadius: 10 }
  }), [mode])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>
)

