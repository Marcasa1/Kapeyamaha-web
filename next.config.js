/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Force static export - no serverless functions
  output: 'export',
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
