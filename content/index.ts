import { FR } from './fr'
import { EN } from './en'
import type { CleRoute, Dictionnaire, Langue, Offre } from './types'

export const DICOS: Record<Langue, Dictionnaire> = { fr: FR, en: EN }
export const dico = (langue: Langue) => DICOS[langue]

// usePathname garde parfois la barre finale de trailingSlash : on compare sans elle.
export const sansBarre = (chemin: string) => chemin.replace(/\/+$/, '') || '/'
export const avecBarre = (chemin: string) => (chemin === '/' ? '/' : `${chemin}/`)
export const langueDuChemin = (chemin: string): Langue => (chemin === '/en' || chemin.startsWith('/en/') ? 'en' : 'fr')

// L'écran courant dans l'ordre du menu, ou -1 hors des cinq écrans (mentions légales, 404).
export function indexEcran(pathname: string): number {
  const chemin = sansBarre(pathname)
  const t = dico(langueDuChemin(chemin))
  return t.ecrans.findIndex((e) => {
    const href = t.routes[e.cle]
    return e.cle === 'accueil' ? chemin === href : chemin.startsWith(href)
  })
}

export function cleDuChemin(pathname: string): CleRoute | null {
  const chemin = sansBarre(pathname)
  const routes = Object.entries(dico(langueDuChemin(chemin)).routes) as [CleRoute, string][]
  return routes.find(([, href]) => href === chemin)?.[0] ?? null
}

// La même page dans l'autre langue ; l'accueil si le chemin n'a pas d'équivalent.
export const equivalent = (pathname: string, langue: Langue) => avecBarre(DICOS[langue].routes[cleDuChemin(pathname) ?? 'accueil'])

export const hrefOffre = (t: Dictionnaire, offre: Offre) => t.routes[`offre:${offre.cle}`]
export const offreParSlug = (t: Dictionnaire, slug: string) => t.offres.liste.find((o) => o.slug === slug)
