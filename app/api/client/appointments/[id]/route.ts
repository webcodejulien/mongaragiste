import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const userId = (session.user as { id?: string }).id
  if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const client = await prisma.client.findUnique({ where: { userId } })
  if (!client) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

  // Récupère le RDV et vérifie qu'il appartient au client
  const existing = await prisma.appointment.findUnique({
    where: { id: params.id },
    select: { id: true, clientId: true, status: true, date: true },
  })

  if (!existing || existing.clientId !== client.id) {
    return NextResponse.json({ error: 'Rendez-vous introuvable.' }, { status: 404 })
  }

  // Vérifie que le statut permet l'annulation
  if (!['PENDING', 'CONFIRMED'].includes(existing.status)) {
    return NextResponse.json({ error: 'Impossible d\'annuler ce rendez-vous.' }, { status: 400 })
  }

  // Vérifie que le RDV est dans le futur
  if (new Date(existing.date) <= new Date()) {
    return NextResponse.json({ error: 'Impossible d\'annuler ce rendez-vous.' }, { status: 400 })
  }

  const appt = await prisma.appointment.update({
    where: { id: params.id },
    data:  { status: 'CANCELLED' },
  })

  return NextResponse.json(appt)
}
