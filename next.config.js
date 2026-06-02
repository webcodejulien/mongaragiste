/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'utfs.io', 'public.blob.vercel-storage.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@vercel/blob'],
  },
}

module.exports = nextConfig
