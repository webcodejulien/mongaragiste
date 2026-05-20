import { NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0)

  const [allAppts, todayAppts, thisMonthAppts, lastMonthAppts] = await Promise.all([
    prisma.appointment.findMany({
      where: { garageId },
      include: { service: { select: { name: true, price: true } } },
    }),
    prisma.appointment.findMany({
      where: { garageId, date: { gte: today }, status: { not: 'CANCELLED' } },
    }),
    prisma.appointment.findMany({
      where: { garageId, date: { gte: thisMonthStart }, status: 'DONE' },
      include: { service: { select: { name: true, price: true } } },
    }),
    prisma.appointment.findMany({
      where: { garageId, date: { gte: lastMonthStart, lte: lastMonthEnd }, status: 'DONE' },
      include: { service: { select: { price: true } } },
    }),
  ])

  const revenueThisMonth = thisMonthAppts.reduce((s, a) => s + (a.service.price ?? 0), 0)
  const revenueLastMonth = lastMonthAppts.reduce((s, a) => s + ((a.service as any).price ?? 0), 0)
  const revenueDelta = revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) : null

  // RDV par service
  const serviceCount: Record<string, { count: number; revenue: number }> = {}
  for (const a of allAppts) {
    const name = a.service.name
    if (!serviceCount[name]) serviceCount[name] = { count: 0, revenue: 0 }
    serviceCount[name].count++
    serviceCount[name].revenue += a.service.price ?? 0
  }

  // RDV des 6 derniers mois
  const monthlyData: { month: string; count: number; revenue: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const mEnd   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const mAppts = allAppts.filter(a => {
      const d = new Date(a.date)
      return d >= mStart && d <= mEnd && a.status === 'DONE'
    })
    const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
    monthlyData.push({
      month:   months[mStart.getMonth()],
      count:   mAppts.length,
      revenue: mAppts.reduce((s, a) => s + (a.service.price ?? 0), 0),
    })
  }

  return NextResponse.json({
    today:         todayAppts.length,
    thisMonth:     thisMonthAppts.length,
    pending:       allAppts.filter(a => a.status === 'PENDING').length,
    cancelled:     allAppts.filter(a => a.status === 'CANCELLED').length,
    revenueMonth:  revenueThisMonth,
    revenueDelta,
    serviceBreakdown: Object.entries(serviceCount).map(([name, v]) => ({ name, ...v })).sort((a,b) => b.count - a.count),
    monthlyData,
  })
}
