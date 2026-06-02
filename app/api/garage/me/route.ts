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

    // Geocode automatically when address or city changes
    if (address !== undefined || city !== undefined) {
      const q = encodeURIComponent(`${address ?? garage.address} ${city ?? garage.city} Belgium`)
      const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, {
        headers: { 'User-Agent': 'MonGaragiste/1.0' },
      }).then(r => r.json()).catch(() => [])
      if (geo[0]) {
        data.lat = parseFloat(geo[0].lat)
        data.lng = parseFloat(geo[0].lon)
      }
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
      await prisma.garageService.deleteMany({ where: { garageId: garage.id } })
      if (services.length > 0) {
        await prisma.garageService.createMany({
          data: services.map((s: any) => ({
            garageId: garage.id,
            name:     String(s.name),
            duration: parseInt(s.duration, 10) || 60,
            price:    s.price != null ? parseFloat(s.price) : null,
          })),
        })
      }
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[garage/me PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
