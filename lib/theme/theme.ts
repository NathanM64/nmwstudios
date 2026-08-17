export const THEME_COOKIE = 'nmw-theme'
export const THEME_MAX_AGE = 60 * 60 * 24 * 365

export type Theme = 'dark' | 'light'

/** Pose `data-theme` avant le premier rendu ; sans lui, flash de thème. */
export function themeInitScript(): string {
  return `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)${THEME_COOKIE}=(dark|light)/);var t=m?m[1]:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})()`
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=${THEME_MAX_AGE};samesite=lax`
}
