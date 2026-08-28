import type { MetadataRoute } from 'next'
import { LAST_MODIFIED, SITE } from '@/lib/schema'

export const dynamic = 'force-static'

// No priority: Google has ignored it since 2023. lastModified is the only field it still
// reads, and the legal notice stays out of the file since it is noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, lastModified: LAST_MODIFIED },
    { url: `${SITE}/reprise-et-maintenance/`, lastModified: LAST_MODIFIED },
    { url: `${SITE}/renfort/`, lastModified: LAST_MODIFIED },
    { url: `${SITE}/projet-complet/`, lastModified: LAST_MODIFIED },
  ]
}
