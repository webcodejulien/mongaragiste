import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const garage = await prisma.garage.findUnique({
      where: { id: params.id },
      include: { services: true, schedules: true, reviews: { include: { client: true } } },
    })
    if (!garage) return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })
    return NextResponse.json(garage)
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  try {
    const body = await req.json()
    const garage = await prisma.garage.update({
      where: { id: params.id },
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
        city: body.city,
        zipCode: body.zipCode,
        description: body.description,
      },
    })
    return NextResponse.json(garage)
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
