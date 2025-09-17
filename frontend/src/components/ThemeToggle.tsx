import { useEffect, useState } from 'react'
import { FormControlLabel, Switch } from '@mui/material'

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    const v = dark ? 'dark' : 'light'
    localStorage.setItem('theme', v)
    const event = new CustomEvent('theme-change', { detail: v })
    window.dispatchEvent(event)
  }, [dark])

  return (
    <FormControlLabel control={<Switch checked={dark} onChange={(_, c) => setDark(c)} />} label="Dark" sx={{ mr: 1 }} />
  )
}

