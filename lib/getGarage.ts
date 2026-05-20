import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

/** Retourne le garage de l'utilisateur connecté, ou null */
export async function getGarageFromSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const userId = (session.user as any).id
  if (!userId) return null

  return prisma.garage.findUnique({
    where: { userId },
    include: {
      services:  { orderBy: { name: 'asc' } },
      schedules: { orderBy: { dayOfWeek: 'asc' } },
    },
  })
}

/** Retourne l'ID du garage depuis la session (sans DB) */
export async function getGarageId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const userId = (session.user as any).id
  if (!userId) return null

  const garage = await prisma.garage.findUnique({
    where: { userId },
    select: { id: true },
  })
  return garage?.id ?? null
}
