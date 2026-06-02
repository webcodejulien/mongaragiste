import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE = process.env.NEXTAUTH_URL || 'https://mongaragiste-app.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/search`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/login`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/register/garage`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Pages garage dynamiques
  let garagePages: MetadataRoute.Sitemap = []
  try {
    const garages = await prisma.garage.findMany({
      where:  { status: 'ACTIVE' },
      select: { slug: true, updatedAt: true },
    })
    garagePages = garages.map(g => ({
      url:             `${BASE}/garage/${g.slug}`,
      lastModified:    g.updatedAt,
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    }))
  } catch { /* DB indisponible au build */ }

  return [...static_pages, ...garagePages]
}
