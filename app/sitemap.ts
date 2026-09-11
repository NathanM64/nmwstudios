import type { MetadataRoute } from 'next'
import { ECRANS } from '@/content/ecrans'
import { OFFRES, hrefOffre } from '@/content/offres'

export const dynamic = 'force-static'

// Le jour où le contenu change, pas celui du build : Google lit lastmod comme une promesse.
const MODIFIE = new Date('2026-09-11')

export default function sitemap(): MetadataRoute.Sitemap {
  const chemins = [...ECRANS.map((e) => e.href), ...OFFRES.slice(1).map(hrefOffre)]
  return chemins.map((chemin) => ({
    url: `https://nmwstudios.com${chemin === '/' ? '/' : `${chemin}/`}`,
    lastModified: MODIFIE,
  }))
}
