import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const userId = (session.user as any).id
  const client = await prisma.client.findUnique({ where: { userId } })
  if (!client) return NextResponse.json([])

  const appts = await prisma.appointment.findMany({
    where: { clientId: client.id },
    include: {
      garage:  { select: { name: true, slug: true, address: true, city: true, phone: true } },
      service: { select: { name: true, price: true, duration: true } },
      review:  { select: { id: true, rating: true } },
    },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(appts)
}
