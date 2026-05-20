import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  const userId = (session.user as any).id

  const notifs = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })
  return NextResponse.json(notifs)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  const userId = (session.user as any).id

  const { ids } = await req.json().catch(() => ({}))
  if (ids?.length) {
    await prisma.notification.updateMany({ where: { id: { in: ids }, userId }, data: { isRead: true } })
  } else {
    await prisma.notification.updateMany({ where: { userId }, data: { isRead: true } })
  }
  return NextResponse.json({ ok: true })
}
