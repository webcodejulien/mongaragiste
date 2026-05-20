import { NextRequest, NextResponse } from 'next/server'
import { getGarageFromSession } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const garage = await getGarageFromSession()
  if (!garage) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  return NextResponse.json(garage)
}

export async function PATCH(req: NextRequest) {
  const garage = await getGarageFromSession()
  if (!garage) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, phone, address, city, zipCode, description, mechanicCount, slotDuration, schedules, services } = body

    const updated = await prisma.garage.update({
      where: { id: garage.id },
      data: {
        ...(name          !== undefined && { name }),
        ...(phone         !== undefined && { phone }),
        ...(address       !== undefined && { address }),
        ...(city          !== undefined && { city }),
        ...(zipCode       !== undefined && { zipCode }),
        ...(description   !== undefined && { description }),
        ...(mechanicCount !== undefined && { mechanicCount }),
        ...(slotDuration  !== undefined && { slotDuration }),
      },
    })

    // Mettre à jour les horaires si fournis
    if (schedules) {
      await prisma.garageSchedule.deleteMany({ where: { garageId: garage.id } })
      await prisma.garageSchedule.createMany({
        data: schedules.map((s: any) => ({
          garageId:  garage.id,
          dayOfWeek: s.dayOfWeek,
          openTime:  s.openTime,
          closeTime: s.closeTime,
          isClosed:  s.isClosed,
        })),
      })
    }

    // Mettre à jour les services si fournis
    if (services) {
      await prisma.garageService.deleteMany({ where: { garageId: garage.id } })
      await prisma.garageService.createMany({
        data: services.map((s: any) => ({
          garageId: garage.id,
          name:     s.name,
          duration: s.duration,
          price:    s.price ?? null,
        })),
      })
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[garage/me PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
