import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const date   = searchParams.get('date')

  const where: Record<string, unknown> = { garageId }
  if (status) where.status = status
  if (date) {
    const d = new Date(date)
    const next = new Date(d)
    next.setDate(next.getDate() + 1)
    where.dueDate = { gte: d, lt: next }
  }

  const reminders = await prisma.maintenanceReminder.findMany({
    where,
    include: {
      client: { include: { user: { select: { email: true } } } },
    },
    orderBy: { dueDate: 'asc' },
  })

  return NextResponse.json(reminders)
}

export async function POST(req: NextRequest) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  try {
    const body = await req.json()
    const { clientId, vehiclePlate, vehicleModel, type, dueDate, dueMileage, notes } = body

    if (!clientId || !type) {
      return NextResponse.json({ error: 'clientId et type sont requis.' }, { status: 400 })
    }

    const reminder = await prisma.maintenanceReminder.create({
      data: {
        garageId,
        clientId,
        vehiclePlate: vehiclePlate ?? null,
        vehicleModel: vehicleModel ?? null,
        type,
        dueDate: dueDate ? new Date(dueDate) : null,
        dueMileage: dueMileage ? Number(dueMileage) : null,
        notes: notes ?? null,
      },
      include: {
        client: { include: { user: { select: { email: true } } } },
      },
    })

    return NextResponse.json(reminder, { status: 201 })
  } catch (err) {
    console.error('[garage/reminders POST]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
