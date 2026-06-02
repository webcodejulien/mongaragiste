import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const appt = await prisma.appointment.findFirst({
    where: { id: params.id, garageId },
    include: {
      client:  { include: { user: { select: { email: true } } } },
      service: true,
      garage:  true,
    },
  })
  if (!appt) return NextResponse.json({ error: 'RDV introuvable.' }, { status: 404 })

  // Numéro de facture : YYYYMM-XXXXX (basé sur l'id du RDV)
  const date     = new Date(appt.date)
  const year     = date.getFullYear()
  const month    = String(date.getMonth() + 1).padStart(2, '0')
  const shortId  = appt.id.slice(-5).toUpperCase()
  const invoiceNr = `${year}${month}-${shortId}`

  const price    = appt.service?.price ?? 0
  const tvaRate  = 0.21
  const htva     = price > 0 ? price / (1 + tvaRate) : 0
  const tva      = price > 0 ? price - htva : 0

  return NextResponse.json({
    invoiceNr,
    date:        date.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' }),
    dateIso:     appt.date,
    garage: {
      name:      appt.garage.name,
      address:   appt.garage.address,
      city:      appt.garage.city,
      zipCode:   appt.garage.zipCode,
      phone:     appt.garage.phone,
      vatNumber: appt.garage.vatNumber ?? '',
      iban:      appt.garage.iban ?? '',
    },
    client: {
      name:  `${appt.client.firstName} ${appt.client.lastName}`,
      email: appt.client.user?.email ?? '',
      phone: appt.client.phone ?? '',
    },
    service: {
      name:     appt.service?.name ?? 'Prestation',
      duration: appt.service?.duration ?? 0,
      price:    price,
      htva:     Math.round(htva * 100) / 100,
      tva:      Math.round(tva * 100) / 100,
      ttc:      price,
    },
    vehicle: {
      model: appt.vehicleModel ?? '',
      plate: appt.vehiclePlate ?? '',
    },
    startTime: appt.startTime,
    notes:     appt.notes ?? '',
  })
}
