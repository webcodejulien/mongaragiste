import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return null
  }
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const garages = await prisma.garage.findMany({
    include: {
      user: { select: { email: true, createdAt: true } },
      _count: {
        select: { appointments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Count appointments this month for each garage
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const appointmentsThisMonth = await prisma.appointment.groupBy({
    by: ['garageId'],
    where: {
      createdAt: { gte: firstDayOfMonth },
    },
    _count: { id: true },
  })

  const apptMap = new Map(appointmentsThisMonth.map((a) => [a.garageId, a._count.id]))

  const result = garages.map((g) => ({
    id: g.id,
    name: g.name,
    city: g.city,
    plan: g.plan,
    status: g.status,
    rating: g.rating,
    reviewCount: g.reviewCount,
    totalAppointments: g._count.appointments,
    appointmentsThisMonth: apptMap.get(g.id) ?? 0,
    ownerEmail: g.user.email,
    createdAt: g.createdAt,
    slug: g.slug,
  }))

  return NextResponse.json(result)
}
