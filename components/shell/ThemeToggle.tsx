'use client'

import { applyTheme, type Theme } from '@/lib/theme/theme'

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={() => {
        const courant = document.documentElement.dataset.theme as Theme
        applyTheme(courant === 'light' ? 'dark' : 'light')
      }}
      aria-label="Changer de thème"
      className="rounded-md border border-border p-2 text-muted-foreground transition-colors duration-(--dur-micro) hover:text-foreground"
    >
      <span aria-hidden className="block h-4 w-4 rounded-full bg-accent" />
    </button>
  )
}
