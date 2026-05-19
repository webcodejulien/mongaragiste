import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  try {
    const { status } = await req.json()
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'DONE', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 })
    }

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status },
      include: { client: true, service: true },
    })

    const notifType = status === 'CONFIRMED' ? 'APPOINTMENT_CONFIRMED' : status === 'CANCELLED' ? 'APPOINTMENT_CANCELLED' : null
    if (notifType && appointment.client.userId) {
      await prisma.notification.create({
        data: {
          userId: appointment.client.userId,
          type: notifType,
          title: status === 'CONFIRMED' ? 'RDV confirmé' : 'RDV annulé',
          message: `Votre rendez-vous pour ${appointment.service.name} a été ${status === 'CONFIRMED' ? 'confirmé' : 'annulé'}.`,
        },
      })
    }

    return NextResponse.json(appointment)
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  try {
    await prisma.appointment.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
