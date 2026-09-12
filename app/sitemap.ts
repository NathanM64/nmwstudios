import type { MetadataRoute } from 'next'
import { ECRANS } from '@/content/ecrans'
import { OFFRES, hrefOffre } from '@/content/offres'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const chemins = [...ECRANS.map((e) => e.href), ...OFFRES.slice(1).map(hrefOffre), '/comment-je-travaille/ce-que-je-ne-fais-pas']
  // Pas de lastmod : une date de build sur toutes les pages serait une fausse fraîcheur.
  return chemins.map((chemin) => ({ url: `https://nmwstudios.com${chemin === '/' ? '/' : `${chemin}/`}` }))
}
