import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'
import { isValidTime, sanitize } from '@/lib/validate'

export async function GET(req: NextRequest) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const date   = searchParams.get('date')   // YYYY-MM-DD
  const week   = searchParams.get('week')   // YYYY-MM-DD (lundi)

  const where: any = { garageId }

  if (status) where.status = status

  if (date) {
    const d = new Date(date)
    const next = new Date(d); next.setDate(next.getDate() + 1)
    where.date = { gte: d, lt: next }
  }

  if (week) {
    const monday = new Date(week)
    const sunday = new Date(week); sunday.setDate(sunday.getDate() + 6)
    where.date = { gte: monday, lte: sunday }
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      client:  { include: { user: { select: { email: true } } } },
      service: true,
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })

  return NextResponse.json(appointments)
}

export async function POST(req: NextRequest) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  try {
    const body = await req.json()
    const clientId    = sanitize(body.clientId    ?? '')
    const serviceId   = sanitize(body.serviceId   ?? '')
    const date        = sanitize(body.date        ?? '')
    const startTime   = sanitize(body.startTime   ?? '')
    const endTime     = sanitize(body.endTime     ?? '')
    const vehiclePlate = sanitize(body.vehiclePlate ?? '')
    const vehicleModel = sanitize(body.vehicleModel ?? '')
    const notes       = sanitize(body.notes       ?? '')

    if (!clientId || !serviceId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
    }
    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return NextResponse.json({ error: 'Format d\'heure invalide (HH:MM attendu).' }, { status: 400 })
    }
    if (startTime >= endTime) {
      return NextResponse.json({ error: 'L\'heure de début doit être avant l\'heure de fin.' }, { status: 400 })
    }
    const apptDate = new Date(date)
    apptDate.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (apptDate < today) {
      return NextResponse.json({ error: 'La date du RDV ne peut pas être dans le passé.' }, { status: 400 })
    }

    const appt = await prisma.appointment.create({
      data: {
        garageId, clientId, serviceId,
        date: new Date(date), startTime, endTime,
        vehiclePlate: vehiclePlate || null,
        vehicleModel: vehicleModel || null,
        notes: notes || null,
        status: 'CONFIRMED',
      },
      include: { client: true, service: true },
    })

    return NextResponse.json(appt, { status: 201 })
  } catch (err) {
    console.error('[garage/appointments POST]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
