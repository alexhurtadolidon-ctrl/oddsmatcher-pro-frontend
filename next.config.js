/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: 'https://web-production-d12f7.up.railway.app',
  },
}

module.exports = nextConfig
