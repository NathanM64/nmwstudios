import type { NextConfig } from 'next'

// Export statique : le site sort en HTML dans out/ et se sert sans Node en production.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
