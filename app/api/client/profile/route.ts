import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function getClientByUserId(userId: string) {
  return prisma.client.findUnique({
    where: { userId },
    include: { user: { select: { email: true, password: true } } },
  })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const userId = (session.user as { id?: string }).id
  if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const client = await getClientByUserId(userId)
  if (!client) return NextResponse.json({ error: 'Profil introuvable.' }, { status: 404 })

  return NextResponse.json({
    firstName: client.firstName,
    lastName:  client.lastName,
    email:     client.user.email,
    phone:     client.phone,
  })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const userId = (session.user as { id?: string }).id
  if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const client = await getClientByUserId(userId)
  if (!client) return NextResponse.json({ error: 'Profil introuvable.' }, { status: 404 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  // Mise à jour téléphone
  if ('phone' in body) {
    const phone = typeof body.phone === 'string' ? body.phone.trim() || null : null
    const updated = await prisma.client.update({
      where: { userId },
      data:  { phone },
    })
    return NextResponse.json({ phone: updated.phone })
  }

  // Mise à jour mot de passe
  if ('oldPassword' in body && 'newPassword' in body) {
    const oldPassword = body.oldPassword as string
    const newPassword = body.newPassword as string

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' }, { status: 400 })
    }

    const currentHash = client.user.password
    if (!currentHash) {
      return NextResponse.json({ error: 'Changement de mot de passe non disponible pour ce compte.' }, { status: 400 })
    }

    const isValid = await bcrypt.compare(oldPassword, currentHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Ancien mot de passe incorrect.' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data:  { password: hashed },
    })

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Aucune modification valide.' }, { status: 400 })
}
