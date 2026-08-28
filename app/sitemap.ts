import type { MetadataRoute } from 'next'
import { MODIFIE_LE, SITE } from '@/lib/schema'

export const dynamic = 'force-static'

// Pas de priority : Google l'ignore depuis 2023. lastModified est le seul champ qu'il lit
// encore, et les mentions légales restent hors du fichier puisqu'elles sont en noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, lastModified: MODIFIE_LE },
    { url: `${SITE}/reprise-et-maintenance/`, lastModified: MODIFIE_LE },
    { url: `${SITE}/renfort/`, lastModified: MODIFIE_LE },
    { url: `${SITE}/projet-complet/`, lastModified: MODIFIE_LE },
  ]
}
