import { NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') ?? '30j'

  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Plage selon la période
  const periodStart = (() => {
    if (period === '7j')  return new Date(now.getTime() - 7  * 86400000)
    if (period === '3m')  return new Date(now.getFullYear(), now.getMonth() - 3, 1)
    if (period === '12m') return new Date(now.getFullYear(), now.getMonth() - 11, 1)
    return new Date(now.getFullYear(), now.getMonth(), 1) // 30j = mois en cours
  })()

  const prevStart = (() => {
    if (period === '7j')  return new Date(now.getTime() - 14 * 86400000)
    if (period === '3m')  return new Date(now.getFullYear(), now.getMonth() - 6, 1)
    if (period === '12m') return new Date(now.getFullYear() - 1, now.getMonth() - 11, 1)
    return new Date(now.getFullYear(), now.getMonth() - 1, 1)
  })()

  const prevEnd = new Date(periodStart.getTime() - 1)

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0)

  const [allAppts, todayAppts, periodAppts, prevAppts] = await Promise.all([
    prisma.appointment.findMany({
      where: { garageId },
      include: { service: { select: { name: true, price: true } } },
    }),
    prisma.appointment.findMany({
      where: { garageId, date: { gte: today }, status: { not: 'CANCELLED' } },
    }),
    prisma.appointment.findMany({
      where: { garageId, date: { gte: periodStart }, status: 'DONE' },
      include: { service: { select: { name: true, price: true } } },
    }),
    prisma.appointment.findMany({
      where: { garageId, date: { gte: prevStart, lte: prevEnd }, status: 'DONE' },
      include: { service: { select: { price: true } } },
    }),
  ])

  const revenueThisMonth = periodAppts.reduce((s, a) => s + (a.service.price ?? 0), 0)
  const revenueLastMonth = prevAppts.reduce((s, a) => s + ((a.service as any).price ?? 0), 0)
  const revenueDelta = revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) : null

  // RDV par service (sur la période sélectionnée)
  const serviceCount: Record<string, { count: number; revenue: number }> = {}
  for (const a of periodAppts) {
    const name = a.service.name
    if (!serviceCount[name]) serviceCount[name] = { count: 0, revenue: 0 }
    serviceCount[name].count++
    serviceCount[name].revenue += a.service.price ?? 0
  }

  // Nombre de mois selon la période
  const nbMonths = period === '12m' ? 12 : period === '3m' ? 3 : 2
  const monthlyData: { month: string; count: number; revenue: number }[] = []
  for (let i = nbMonths - 1; i >= 0; i--) {
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
    thisMonth:     periodAppts.length,
    pending:       allAppts.filter(a => a.status === 'PENDING').length,
    cancelled:     allAppts.filter(a => a.status === 'CANCELLED' && new Date(a.date) >= periodStart).length,
    revenueMonth:  revenueThisMonth,
    revenueDelta,
    serviceBreakdown: Object.entries(serviceCount).map(([name, v]) => ({ name, ...v })).sort((a,b) => b.count - a.count),
    monthlyData,
  })
}
