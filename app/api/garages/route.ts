import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')
    const service = searchParams.get('service')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')

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

    return NextResponse.json({ garages, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[garages GET]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
