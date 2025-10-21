/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/api/products': ['./prisma/dev.db'],
      '/api/orders': ['./prisma/dev.db'],
    },
  },
}

export default nextConfig
