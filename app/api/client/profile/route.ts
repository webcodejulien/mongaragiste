import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const userId = (session.user as any).id
  const client = await prisma.client.findUnique({
    where: { userId },
    select: { firstName: true, lastName: true, phone: true },
  })
  if (!client) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  return NextResponse.json({ ...client, email: user?.email })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const userId = (session.user as any).id
  const { firstName, lastName, phone } = await req.json()

  const updated = await prisma.client.update({
    where: { userId },
    data: {
      ...(firstName !== undefined && { firstName }),
      ...(lastName  !== undefined && { lastName  }),
      ...(phone     !== undefined && { phone: phone || null }),
    },
  })

  return NextResponse.json(updated)
}
