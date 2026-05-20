import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

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
    const { clientId, serviceId, date, startTime, endTime, vehiclePlate, vehicleModel, notes } = body

    if (!clientId || !serviceId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
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
