import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://nmwstudios.com'
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/reprise-et-maintenance/`, priority: 0.9 },
    { url: `${base}/mentions-legales/`, priority: 0.2 },
  ]
}
