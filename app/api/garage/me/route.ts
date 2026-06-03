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
    const { name, phone, address, city, zipCode, description, mechanicCount, slotDuration, schedules, services, notifPrefs, vatNumber, iban } = body

    const data: any = {
      ...(name          !== undefined && { name }),
      ...(phone         !== undefined && { phone }),
      ...(address       !== undefined && { address }),
      ...(city          !== undefined && { city }),
      ...(zipCode       !== undefined && { zipCode }),
      ...(description   !== undefined && { description }),
      ...(mechanicCount !== undefined && { mechanicCount }),
      ...(slotDuration  !== undefined && { slotDuration }),
      ...(notifPrefs    !== undefined && { notifPrefs }),
      ...(vatNumber     !== undefined && { vatNumber: vatNumber || null }),
      ...(iban          !== undefined && { iban: iban || null }),
    }

    // Geocode avec timeout 4s — non bloquant si ça échoue
    if (address !== undefined || city !== undefined) {
      try {
        const q = encodeURIComponent(`${address ?? garage.address} ${city ?? garage.city} Belgium`)
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 4000)
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
          { headers: { 'User-Agent': 'MonGaragiste/1.0' }, signal: controller.signal }
        ).then(r => r.json()).catch(() => [])
        clearTimeout(timer)
        if (Array.isArray(geo) && geo[0]) {
          data.lat = parseFloat(geo[0].lat)
          data.lng = parseFloat(geo[0].lon)
        }
      } catch { /* geocoding échoué — on continue sans lat/lng */ }
    }

    const updated = await prisma.garage.update({
      where: { id: garage.id },
      data,
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
      const incomingIds = services.filter((s: any) => s.id).map((s: any) => s.id as string)

      // Supprimer uniquement les services qui ne sont plus dans la liste ET qui n'ont pas de RDV liés
      const toDelete = await prisma.garageService.findMany({
        where: { garageId: garage.id, ...(incomingIds.length > 0 ? { id: { notIn: incomingIds } } : {}) },
        include: { _count: { select: { appointments: true } } },
      })
      const deletableIds = toDelete
        .filter((s: any) => s._count.appointments === 0)
        .map((s: any) => s.id)
      if (deletableIds.length > 0) {
        await prisma.garageService.deleteMany({ where: { id: { in: deletableIds } } })
      }

      // Upsert chaque service : update si id connu, create sinon
      for (const s of services) {
        const svcData = {
          name:     String(s.name),
          duration: parseInt(s.duration, 10) || 60,
          price:    s.price != null ? parseFloat(s.price) : null,
        }
        if (s.id) {
          await prisma.garageService.update({ where: { id: s.id }, data: svcData })
        } else {
          await prisma.garageService.create({ data: { garageId: garage.id, ...svcData } })
        }
      }
    }

    // Retourner les données fraîches avec services et schedules
    const fresh = await prisma.garage.findUnique({
      where: { id: garage.id },
      include: {
        services:  { orderBy: { name: 'asc' } },
        schedules: { orderBy: { dayOfWeek: 'asc' } },
      },
    })
    return NextResponse.json(fresh)
  } catch (err) {
    console.error('[garage/me PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
