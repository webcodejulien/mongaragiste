import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { id } = params

  try {
    const body = await req.json()
    const { status, dueDate, dueMileage, vehiclePlate, vehicleModel, type, notes } = body

    const updated = await prisma.maintenanceReminder.updateMany({
      where: { id, garageId },
      data: {
        ...(status !== undefined && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(dueMileage !== undefined && { dueMileage: dueMileage ? Number(dueMileage) : null }),
        ...(vehiclePlate !== undefined && { vehiclePlate }),
        ...(vehicleModel !== undefined && { vehicleModel }),
        ...(type !== undefined && { type }),
        ...(notes !== undefined && { notes }),
      },
    })

    if (updated.count === 0) {
      return NextResponse.json({ error: 'Rappel introuvable.' }, { status: 404 })
    }

    const reminder = await prisma.maintenanceReminder.findUnique({
      where: { id },
      include: { client: { include: { user: { select: { email: true } } } } },
    })

    return NextResponse.json(reminder)
  } catch (err) {
    console.error('[garage/reminders/:id PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { id } = params

  const deleted = await prisma.maintenanceReminder.deleteMany({
    where: { id, garageId },
  })

  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Rappel introuvable.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
