import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { status } = await req.json()
  if (status !== 'CANCELLED') return NextResponse.json({ error: 'Action non autorisée.' }, { status: 403 })

  const userId = (session.user as any).id
  const client = await prisma.client.findUnique({ where: { userId } })
  if (!client) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

  const appt = await prisma.appointment.update({
    where: { id: params.id, clientId: client.id },
    data: { status: 'CANCELLED' },
  })

  return NextResponse.json(appt)
}
