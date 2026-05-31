import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGarageId } from '@/lib/getGarage'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const garageId = await getGarageId()
    if (!garageId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { reply } = await req.json()
    if (!reply || typeof reply !== 'string' || reply.trim().length === 0) {
      return NextResponse.json({ error: 'Réponse vide.' }, { status: 400 })
    }

    const review = await prisma.review.findFirst({
      where: { id: params.id, garageId },
    })
    if (!review) return NextResponse.json({ error: 'Avis introuvable.' }, { status: 404 })

    const updated = await prisma.review.update({
      where: { id: params.id },
      data:  { garageReply: reply.trim(), repliedAt: new Date() },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[reviews PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
