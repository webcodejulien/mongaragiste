import { MetadataRoute } from 'next'

const BASE = process.env.NEXTAUTH_URL || 'https://mongaragiste.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  ['/garage/', '/api/', '/mon-compte'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
