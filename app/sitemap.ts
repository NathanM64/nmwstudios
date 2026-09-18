import type { MetadataRoute } from 'next'
import { DICOS, avecBarre } from '@/content'
import type { CleRoute, Langue } from '@/content/types'
import { SITE } from '@/lib/meta'

export const dynamic = 'force-static'

const LANGUES: Langue[] = ['fr']

export default function sitemap(): MetadataRoute.Sitemap {
  const cles = (Object.keys(DICOS.fr.routes) as CleRoute[]).filter((c) => c !== 'legal' && c !== 'offre:applications')
  const url = (langue: Langue, cle: CleRoute) => `${SITE}${avecBarre(DICOS[langue].routes[cle])}`
  // Pas de lastmod : une date de build sur toutes les pages serait une fausse fraîcheur.
  return cles.flatMap((cle) => LANGUES.map((langue) => ({ url: url(langue, cle) })))
}
