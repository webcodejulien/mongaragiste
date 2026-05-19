import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// GET — vérifier si le token est valide
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token manquant.' }, { status: 400 })

  const record = await prisma.passwordResetToken.findUnique({ where: { token } })
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token invalide ou expiré.' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, email: record.email })
}

// POST — réinitialiser le mot de passe
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Données manquantes.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères.' }, { status: 400 })
    }

    const record = await prisma.passwordResetToken.findUnique({ where: { token } })
    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Lien invalide ou expiré.' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email: record.email },
      data: { password: hashed },
    })

    // Supprimer le token utilisé
    await prisma.passwordResetToken.delete({ where: { token } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[reset-password]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
