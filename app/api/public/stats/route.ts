import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [garageCount, appointmentCount, cityRows] = await Promise.all([
      prisma.garage.count({ where: { status: 'ACTIVE' } }),
      prisma.appointment.count(),
      prisma.garage.findMany({
        where:  { status: 'ACTIVE' },
        select: { city: true },
        distinct: ['city'],
      }),
    ])

    return NextResponse.json({
      garageCount,
      appointmentCount,
      cityCount: cityRows.length,
    })
  } catch (err) {
    console.error('[public/stats]', err)
    return NextResponse.json({ garageCount: 0, appointmentCount: 0, cityCount: 0 })
  }
}
