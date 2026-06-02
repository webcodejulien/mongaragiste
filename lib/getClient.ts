import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { prisma } from './prisma'

/** Retourne le profil client de l'utilisateur connecté, ou null */
export async function getClientFromSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const userId = (session.user as { id?: string }).id
  if (!userId) return null

  return prisma.client.findUnique({
    where: { userId },
    include: { user: { select: { email: true } } },
  })
}

/** Retourne l'ID du client depuis la session */
export async function getClientId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const userId = (session.user as { id?: string }).id
  if (!userId) return null

  const client = await prisma.client.findUnique({
    where: { userId },
    select: { id: true },
  })
  return client?.id ?? null
}
