'use client'

import { useEffect, useState } from 'react'
import { applyTheme, type Theme } from '@/lib/theme/theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? 'dark')
  }, [])

  const next: Theme = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next)
        setTheme(next)
      }}
      aria-label={next === 'light' ? 'Passer en thème clair' : 'Passer en thème sombre'}
      className="rounded-md border border-border p-2 text-muted-foreground transition-colors duration-(--dur-micro) hover:text-foreground"
    >
      <span aria-hidden className="block h-4 w-4 rounded-full bg-accent" />
    </button>
  )
}
