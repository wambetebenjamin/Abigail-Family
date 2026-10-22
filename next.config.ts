import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Pexels CDN is blocked from the build sandbox, so images are served
    // directly by the browser from images.pexels.com. remotePatterns below is
    // still required so the same configuration works when the optimizer is
    // enabled on Vercel.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
}

export default nextConfig
