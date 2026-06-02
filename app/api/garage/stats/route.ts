import { NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const now            = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  const [
    allAppts,
    thisMonthAppts,
    lastMonthAppts,
    garage,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: { garageId, date: { gte: twelveMonthsAgo } },
      include: { service: { select: { name: true, price: true } }, client: { select: { id: true } } },
    }),
    prisma.appointment.findMany({
      where: { garageId, date: { gte: thisMonthStart } },
      include: { service: { select: { name: true, price: true } }, client: { select: { id: true } } },
    }),
    prisma.appointment.findMany({
      where: { garageId, date: { gte: lastMonthStart, lte: lastMonthEnd } },
      include: { service: { select: { price: true } } },
    }),
    prisma.garage.findUnique({
      where: { id: garageId },
      select: { rating: true, reviewCount: true },
    }),
  ])

  // ── Appointments this month vs last month ──────────────────────────────────
  const appointmentsThisMonth = thisMonthAppts.filter(a => a.status !== 'CANCELLED').length
  const appointmentsLastMonth = lastMonthAppts.filter(a => a.status !== 'CANCELLED').length

  // ── Revenue (DONE appointments only) ──────────────────────────────────────
  const revenueThisMonth = thisMonthAppts
    .filter(a => a.status === 'DONE')
    .reduce((s, a) => s + (a.service.price ?? 0), 0)
  const revenueLastMonth = lastMonthAppts
    .filter(a => a.status === 'DONE')
    .reduce((s, a) => s + ((a.service as any).price ?? 0), 0)

  // ── Unique clients this month ──────────────────────────────────────────────
  const uniqueClientsThisMonth = new Set(
    thisMonthAppts
      .filter(a => a.status !== 'CANCELLED')
      .map(a => a.client.id)
  ).size

  // ── Conversion rate (CONFIRMED + IN_PROGRESS + DONE / total) ──────────────
  const totalThisMonth = thisMonthAppts.length
  const convertedThisMonth = thisMonthAppts.filter(a =>
    a.status === 'CONFIRMED' || a.status === 'DONE' || a.status === 'IN_PROGRESS'
  ).length
  const conversionRate = totalThisMonth > 0
    ? Math.round((convertedThisMonth / totalThisMonth) * 100)
    : 0

  // ── Status breakdown (this month) ─────────────────────────────────────────
  const statusMap: Record<string, number> = {}
  for (const a of thisMonthAppts) {
    statusMap[a.status] = (statusMap[a.status] ?? 0) + 1
  }
  const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }))

  // ── Monthly data — last 12 months ─────────────────────────────────────────
  const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
  const monthlyData: { month: string; appointments: number; revenue: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const mEnd   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999)
    const mAppts = allAppts.filter(a => {
      const d = new Date(a.date)
      return d >= mStart && d <= mEnd
    })
    const doneAppts = mAppts.filter(a => a.status === 'DONE')
    monthlyData.push({
      month:        MONTHS[mStart.getMonth()],
      appointments: mAppts.filter(a => a.status !== 'CANCELLED').length,
      revenue:      Math.round(doneAppts.reduce((s, a) => s + (a.service.price ?? 0), 0) * 100) / 100,
    })
  }

  // ── Top services (last 12 months, non-cancelled) ───────────────────────────
  const serviceMap: Record<string, { count: number; revenue: number }> = {}
  for (const a of allAppts.filter(a => a.status !== 'CANCELLED')) {
    const name = a.service.name
    if (!serviceMap[name]) serviceMap[name] = { count: 0, revenue: 0 }
    serviceMap[name].count++
    serviceMap[name].revenue += a.service.price ?? 0
  }
  const topServices = Object.entries(serviceMap)
    .map(([name, v]) => ({ name, count: v.count, revenue: Math.round(v.revenue * 100) / 100 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return NextResponse.json({
    appointmentsThisMonth,
    appointmentsLastMonth,
    revenueThisMonth:    Math.round(revenueThisMonth * 100) / 100,
    revenueLastMonth:    Math.round(revenueLastMonth * 100) / 100,
    avgRating:           garage?.rating ?? 0,
    reviewCount:         garage?.reviewCount ?? 0,
    uniqueClientsThisMonth,
    conversionRate,
    monthlyData,
    topServices,
    statusBreakdown,
  })
}
