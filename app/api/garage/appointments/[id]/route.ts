import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { status } = await req.json()
  const valid = ['PENDING','CONFIRMED','IN_PROGRESS','DONE','CANCELLED']
  if (!valid.includes(status)) return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 })

  const appt = await prisma.appointment.update({
    where: { id: params.id, garageId },
    data: { status },
    include: { client: true, service: true },
  })

  return NextResponse.json(appt)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  await prisma.appointment.delete({ where: { id: params.id, garageId } })
  return NextResponse.json({ ok: true })
}
