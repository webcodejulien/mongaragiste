import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { garageSlug, rating, comment, appointmentId } = await req.json()

    // Validation de base
    if (!garageSlug || typeof garageSlug !== 'string') {
      return NextResponse.json({ error: 'Garage manquant.' }, { status: 400 })
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'La note doit être entre 1 et 5.' }, { status: 400 })
    }
    if (!appointmentId || typeof appointmentId !== 'string') {
      return NextResponse.json({ error: 'Identifiant de rendez-vous manquant.' }, { status: 400 })
    }

    // Récupérer le garage
    const garage = await prisma.garage.findUnique({
      where: { slug: garageSlug },
      select: { id: true },
    })
    if (!garage) {
      return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })
    }

    // Vérifier que le RDV existe, appartient à ce garage et est terminé
    const appt = await prisma.appointment.findFirst({
      where: { id: appointmentId, garageId: garage.id, status: 'DONE' },
      select: { id: true, clientId: true },
    })
    if (!appt) {
      return NextResponse.json({ error: 'Rendez-vous introuvable ou pas encore terminé.' }, { status: 400 })
    }

    // Vérifier qu'il n'y a pas déjà un avis pour ce RDV
    const existing = await prisma.review.findUnique({ where: { appointmentId } })
    if (existing) {
      return NextResponse.json({ error: 'Un avis a déjà été soumis pour ce rendez-vous.' }, { status: 409 })
    }

    // Résoudre le clientId : préférer le client connecté si disponible
    const session = await getServerSession(authOptions)
    let clientId  = appt.clientId

    if (session?.user) {
      const userId     = (session.user as any).id
      const sessionCli = await prisma.client.findUnique({ where: { userId }, select: { id: true } })
      // Utiliser le client de la session seulement s'il correspond au RDV
      if (sessionCli && sessionCli.id === appt.clientId) {
        clientId = sessionCli.id
      }
    }

    // Créer l'avis
    const review = await prisma.review.create({
      data: {
        garageId:     garage.id,
        clientId,
        appointmentId,
        rating:       Math.round(rating),
        comment:      comment?.trim()?.slice(0, 500) || null,
      },
    })

    // Recalculer la note moyenne du garage
    const agg = await prisma.review.aggregate({
      where:  { garageId: garage.id },
      _avg:   { rating: true },
      _count: { rating: true },
    })
    await prisma.garage.update({
      where: { id: garage.id },
      data:  {
        rating:      Math.round((agg._avg.rating ?? 0) * 10) / 10,
        reviewCount: agg._count.rating,
      },
    })

    // Notification en DB pour le garagiste
    const garageUser = await prisma.garage.findUnique({
      where:  { id: garage.id },
      select: { userId: true, name: true },
    })
    if (garageUser) {
      await prisma.notification.create({
        data: {
          userId:  garageUser.userId,
          type:    'NEW_REVIEW',
          title:   'Nouvel avis',
          message: `Note ${rating}/5 · ${comment?.trim()?.slice(0, 60) ?? 'Avis sans commentaire'}`,
        },
      }).catch(console.error)
    }

    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    console.error('[public/reviews POST]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
