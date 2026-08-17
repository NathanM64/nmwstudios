import { beforeEach, describe, expect, it } from 'vitest'
import { JSDOM } from 'jsdom'
import { THEME_COOKIE, themeInitScript } from '@/lib/theme/theme'

function boot(options: { cookie?: string; prefersLight: boolean }) {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    runScripts: 'outside-only',
    url: 'https://nmwstudios.com/',
  })
  if (options.cookie) dom.window.document.cookie = options.cookie
  dom.window.matchMedia = ((query: string) => ({
    matches: query.includes('light') ? options.prefersLight : !options.prefersLight,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia

  dom.window.eval(themeInitScript())
  return dom.window.document.documentElement.dataset.theme
}

describe('themeInitScript', () => {
  it('applique le sombre en l\'absence de tout signal', () => {
    expect(boot({ prefersLight: false })).toBe('dark')
  })

  it('respecte une preference systeme claire', () => {
    expect(boot({ prefersLight: true })).toBe('light')
  })

  it('fait primer le cookie sur la preference systeme', () => {
    expect(boot({ cookie: `${THEME_COOKIE}=dark`, prefersLight: true })).toBe('dark')
    expect(boot({ cookie: `${THEME_COOKIE}=light`, prefersLight: false })).toBe('light')
  })

  it('ignore une valeur de cookie invalide et retombe sur le defaut', () => {
    expect(boot({ cookie: `${THEME_COOKIE}=fuchsia`, prefersLight: false })).toBe('dark')
  })

  it('tient sur une seule ligne, sans saut, pour etre injecte en attribut', () => {
    expect(themeInitScript()).not.toContain('\n')
  })
})
