import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getGarageId } from '@/lib/getGarage'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const garageId = await getGarageId()
    if (!garageId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const reviews = await prisma.review.findMany({
      where: { garageId },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reviews)
  } catch (err) {
    console.error('[garage/reviews GET]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
