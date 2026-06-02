import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')
    const service = searchParams.get('service')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null
    const userLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null

    const where: any = { status: 'ACTIVE' }
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (service) {
      where.services = { some: { name: { contains: service, mode: 'insensitive' } } }
    }

    const [garages, total] = await Promise.all([
      prisma.garage.findMany({
        where,
        include: {
          services: true,
          schedules: true,
          reviews: { select: { rating: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { rating: 'desc' },
      }),
      prisma.garage.count({ where }),
    ])

    // Add distance if user coordinates provided
    const garagesWithDistance = garages.map(g => {
      if (userLat !== null && userLng !== null && g.lat !== null && g.lng !== null) {
        const dist = haversine(userLat, userLng, g.lat, g.lng)
        return { ...g, distance: Math.round(dist * 10) / 10 }
      }
      return { ...g, distance: null }
    })

    // Sort by distance if user coordinates provided
    if (userLat !== null && userLng !== null) {
      garagesWithDistance.sort((a, b) => {
        if (a.distance === null) return 1
        if (b.distance === null) return -1
        return a.distance - b.distance
      })
    }

    return NextResponse.json({ garages: garagesWithDistance, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[garages GET]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
