import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const garageId = searchParams.get('garageId')
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    const where: any = {}
    if (garageId) where.garageId = garageId
    if (status) where.status = status
    if (date) {
      const d = new Date(date)
      const next = new Date(d)
      next.setDate(next.getDate() + 1)
      where.date = { gte: d, lt: next }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: true,
        service: true,
        garage: { select: { name: true, slug: true } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })

    return NextResponse.json(appointments)
  } catch (err) {
    console.error('[appointments GET]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { garageId, clientId, serviceId, date, startTime, endTime, vehiclePlate, vehicleModel, notes } = body

    if (!garageId || !clientId || !serviceId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        garageId,
        clientId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        vehiclePlate: vehiclePlate || null,
        vehicleModel: vehicleModel || null,
        notes: notes || null,
        status: 'PENDING',
      },
    })

    await prisma.notification.create({
      data: {
        userId: (await prisma.garage.findUnique({ where: { id: garageId }, select: { userId: true } }))!.userId,
        type: 'NEW_APPOINTMENT',
        title: 'Nouvelle demande de RDV',
        message: `Un nouveau rendez-vous a été demandé pour le ${new Date(date).toLocaleDateString('fr-BE')}.`,
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (err) {
    console.error('[appointments POST]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
