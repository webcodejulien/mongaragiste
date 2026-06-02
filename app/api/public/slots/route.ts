import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/public/slots?slug=garage-slug&date=2026-06-10&serviceId=xxx
 * Retourne les créneaux disponibles pour un garage, une date et un service donnés.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug      = searchParams.get('slug')
  const dateStr   = searchParams.get('date')
  const serviceId = searchParams.get('serviceId')

  if (!slug || !dateStr) {
    return NextResponse.json({ error: 'slug et date requis.' }, { status: 400 })
  }

  const garage = await prisma.garage.findUnique({
    where:   { slug },
    include: { schedules: true },
  })
  if (!garage) return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })

  // Durée du service (ou slotDuration du garage par défaut)
  let serviceDuration = garage.slotDuration
  if (serviceId) {
    const svc = await prisma.garageService.findFirst({ where: { id: serviceId, garageId: garage.id } })
    if (svc) serviceDuration = svc.duration
  }

  // Jour de la semaine — convention app: 1=lun … 6=sam, 7=dim
  const date      = new Date(dateStr + 'T00:00:00')
  const jsDay     = date.getDay() // 0=dim, 1=lun … 6=sam
  const dayOfWeek = jsDay === 0 ? 7 : jsDay

  // Trouver l'horaire du jour
  const schedule = garage.schedules.find(s => s.dayOfWeek === dayOfWeek)
  if (!schedule || schedule.isClosed || !schedule.openTime || !schedule.closeTime) {
    return NextResponse.json([]) // garage fermé ce jour
  }

  // Générer tous les créneaux possibles entre openTime et closeTime
  function toMinutes(t: string) {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  function toTime(min: number) {
    return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
  }

  const openMin  = toMinutes(schedule.openTime)
  const closeMin = toMinutes(schedule.closeTime)
  const step     = garage.slotDuration // incrément entre créneaux

  const allSlots: string[] = []
  for (let t = openMin; t + serviceDuration <= closeMin; t += step) {
    allSlots.push(toTime(t))
  }

  // RDV déjà pris pour ce garage ce jour-là (non annulés)
  const dateStart = new Date(dateStr + 'T00:00:00')
  const dateEnd   = new Date(dateStr + 'T23:59:59')
  const existing  = await prisma.appointment.findMany({
    where: {
      garageId: garage.id,
      date:     { gte: dateStart, lte: dateEnd },
      status:   { notIn: ['CANCELLED'] },
    },
    select: { startTime: true, endTime: true },
  })

  // Filtrer les créneaux passés si la date est aujourd'hui
  const now        = new Date()
  const isToday    = dateStr === now.toISOString().split('T')[0]
  const nowMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0

  // Filtrer les créneaux indisponibles
  // Un créneau est dispo si le nombre de RDV qui se chevauchent < mechanicCount
  const available = allSlots.filter(slot => {
    const slotStart = toMinutes(slot)
    const slotEnd   = slotStart + serviceDuration

    // Exclure les créneaux déjà passés (aujourd'hui uniquement)
    if (isToday && slotStart <= nowMinutes) return false

    const overlapping = existing.filter(a => {
      const aStart = toMinutes(a.startTime)
      const aEnd   = toMinutes(a.endTime || a.startTime)
      return !(aEnd <= slotStart || aStart >= slotEnd)
    }).length

    return overlapping < garage.mechanicCount
  })

  return NextResponse.json(available)
}
