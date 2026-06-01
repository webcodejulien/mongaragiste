import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const userId = (session.user as any).id
    const client = await prisma.client.findUnique({ where: { userId } })
    if (!client) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

    const { appointmentId, rating, comment } = await req.json()

    if (!appointmentId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
    }

    // Vérifier que le RDV appartient bien à ce client et est terminé
    const appt = await prisma.appointment.findFirst({
      where: { id: appointmentId, clientId: client.id, status: 'DONE' },
    })
    if (!appt) return NextResponse.json({ error: 'RDV introuvable ou pas encore terminé.' }, { status: 400 })

    // Vérifier qu'il n'y a pas déjà un avis pour ce RDV
    const existing = await prisma.review.findUnique({ where: { appointmentId } })
    if (existing) return NextResponse.json({ error: 'Avis déjà soumis.' }, { status: 409 })

    // Créer l'avis
    const review = await prisma.review.create({
      data: {
        garageId:      appt.garageId,
        clientId:      client.id,
        appointmentId,
        rating,
        comment:       comment?.trim() || null,
      },
    })

    // Recalculer la note moyenne du garage
    const agg = await prisma.review.aggregate({
      where:   { garageId: appt.garageId },
      _avg:    { rating: true },
      _count:  { rating: true },
    })
    await prisma.garage.update({
      where: { id: appt.garageId },
      data:  {
        rating:      Math.round((agg._avg.rating ?? 0) * 10) / 10,
        reviewCount: agg._count.rating,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    console.error('[client/reviews POST]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
