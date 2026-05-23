import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const garage = await prisma.garage.findUnique({
      where: { slug: params.slug },
      include: {
        services:  { orderBy: { name: 'asc' } },
        schedules: { orderBy: { dayOfWeek: 'asc' } },
        reviews: {
          include: { client: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!garage) return NextResponse.json({ error: 'Introuvable.' }, { status: 404 })

    const DAY_FR = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']

    return NextResponse.json({
      ...garage,
      schedules: garage.schedules.map(s => ({
        day:    DAY_FR[s.dayOfWeek] ?? `Jour ${s.dayOfWeek}`,
        open:   s.openTime,
        close:  s.closeTime,
        closed: s.isClosed,
      })),
      reviews: garage.reviews.map(r => ({
        author:   `${r.client.firstName} ${r.client.lastName.charAt(0)}.`,
        initials: `${r.client.firstName.charAt(0)}${r.client.lastName.charAt(0)}`,
        rating:   r.rating,
        comment:  r.comment || '',
        date:     new Date(r.createdAt).toLocaleDateString('fr-BE'),
        service:  '',
      })),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
