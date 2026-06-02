'use client'
import { useEffect, useState } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      setDark(true)
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="w-[34px] h-[34px] flex items-center justify-center rounded transition-colors"
      style={{
        border: '0.5px solid var(--color-border-tertiary)',
        color: 'var(--color-text-secondary)',
        background: 'transparent',
      }}
      title={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {dark ? <IconSun size={16} /> : <IconMoon size={16} />}
    </button>
  )
}
