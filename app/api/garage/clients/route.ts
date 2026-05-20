import { NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  // Récupère tous les clients ayant eu un RDV dans ce garage
  const appointments = await prisma.appointment.findMany({
    where: { garageId },
    include: {
      client: {
        include: { user: { select: { email: true } } },
      },
      service: { select: { name: true } },
    },
    orderBy: { date: 'desc' },
  })

  // Regrouper par client
  const clientMap = new Map<string, any>()
  for (const appt of appointments) {
    const c = appt.client
    if (!clientMap.has(c.id)) {
      clientMap.set(c.id, {
        id: c.id,
        firstName: c.firstName,
        lastName:  c.lastName,
        phone:     c.phone,
        email:     c.user.email,
        totalRdv:  0,
        lastVisit: appt.date,
        appointments: [],
      })
    }
    const entry = clientMap.get(c.id)
    entry.totalRdv++
    if (new Date(appt.date) > new Date(entry.lastVisit)) {
      entry.lastVisit = appt.date
    }
    entry.appointments.push({
      id:        appt.id,
      date:      appt.date,
      service:   appt.service.name,
      status:    appt.status,
      vehicle:   appt.vehicleModel,
      plate:     appt.vehiclePlate,
    })
  }

  return NextResponse.json(Array.from(clientMap.values()))
}
