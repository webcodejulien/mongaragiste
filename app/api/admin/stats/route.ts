import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [activeGarages, appointmentsThisMonth, totalClients, totalReviews] = await Promise.all([
    prisma.garage.count({ where: { status: 'ACTIVE' } }),
    prisma.appointment.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
    prisma.client.count(),
    prisma.review.count(),
  ])

  return NextResponse.json({
    activeGarages,
    appointmentsThisMonth,
    totalClients,
    totalReviews,
  })
}
