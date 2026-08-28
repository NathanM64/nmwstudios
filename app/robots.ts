import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/schema'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    // Next exporte la charge RSC en .txt à côté de chaque page : même contenu, sans canonique
    // ni balise robots possibles. robots.txt est le seul endroit d'où les sortir.
    // /_next/ reste ouvert : le bloquer empêcherait Google de rendre la page.
    rules: { userAgent: '*', allow: ['/', '/llms.txt'], disallow: '/*.txt$' },
    sitemap: `${SITE}/sitemap.xml`,
  }
}
