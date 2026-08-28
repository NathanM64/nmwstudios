import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/schema'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    // Next exports the RSC payload as .txt next to every page: same content, with no canonical
    // and no robots tag possible. robots.txt is the only place to take them out of crawling.
    // /_next/ stays open: blocking it would stop Google from rendering the page.
    rules: { userAgent: '*', allow: ['/', '/llms.txt'], disallow: '/*.txt$' },
    sitemap: `${SITE}/sitemap.xml`,
  }
}
