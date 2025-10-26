import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Redirection www vers non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.nmwstudios.com',
          },
        ],
        destination: 'https://nmwstudios.com/:path*',
        permanent: true, // 301 redirect
      },
    ]
  },
};

export default nextConfig;
