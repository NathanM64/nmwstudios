import type { NextConfig } from 'next'

// Export statique : le site sort en HTML dans out/ et se sert sans Node en production.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Deux layouts racine (fr, en) : la 404 se rend en page entière, hors de tout layout.
  experimental: { globalNotFound: true },
}

export default nextConfig
