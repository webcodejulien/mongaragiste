import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGarageId } from '@/lib/getGarage'
import { sanitize } from '@/lib/validate'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const garageId = await getGarageId()
    if (!garageId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { reply: rawReply } = await req.json()
    if (!rawReply || typeof rawReply !== 'string' || rawReply.trim().length === 0) {
      return NextResponse.json({ error: 'Réponse vide.' }, { status: 400 })
    }
    const reply = sanitize(rawReply)
    if (reply.length < 5) {
      return NextResponse.json({ error: 'La réponse doit faire au moins 5 caractères.' }, { status: 400 })
    }
    if (reply.length > 500) {
      return NextResponse.json({ error: 'La réponse ne peut pas dépasser 500 caractères.' }, { status: 400 })
    }

    const review = await prisma.review.findFirst({
      where: { id: params.id, garageId },
    })
    if (!review) return NextResponse.json({ error: 'Avis introuvable.' }, { status: 404 })

    const updated = await prisma.review.update({
      where: { id: params.id },
      data:  { garageReply: reply, repliedAt: new Date() },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[reviews PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
