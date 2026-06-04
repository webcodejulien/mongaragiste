import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

/* ─── GET /api/garage/clients/[id]/vehicles ─────────────────
   Liste les véhicules d'un client appartenant au garage connecté.
   Inclut le nombre de RDV liés à chaque véhicule via vehiclePlate.
────────────────────────────────────────────────────────────── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { id: clientId } = await params

  // Vérifier que le client a bien un RDV dans ce garage
  const belongs = await prisma.appointment.findFirst({
    where: { garageId, clientId },
    select: { id: true },
  })
  if (!belongs) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

  const vehicles = await prisma.vehicle.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  })

  // Compter les appointments liés par plaque (meilleur effort)
  const platesWithCount = await Promise.all(
    vehicles.map(async v => {
      const count = v.plate
        ? await prisma.appointment.count({
            where: { garageId, clientId, vehiclePlate: v.plate },
          })
        : 0
      return { ...v, appointmentCount: count }
    })
  )

  return NextResponse.json(platesWithCount)
}

/* ─── POST /api/garage/clients/[id]/vehicles ────────────────
   Crée un nouveau véhicule pour ce client.
   Body: { make, model, year?, plate?, vin?, mileageLast?, notes? }
────────────────────────────────────────────────────────────── */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { id: clientId } = await params

  // Vérifier appartenance
  const belongs = await prisma.appointment.findFirst({
    where: { garageId, clientId },
    select: { id: true },
  })
  if (!belongs) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

  try {
    const body = await req.json()
    const { make, model, year, plate, vin, mileageLast, notes } = body

    if (!make?.trim() || !model?.trim()) {
      return NextResponse.json({ error: 'La marque et le modèle sont obligatoires.' }, { status: 400 })
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        clientId,
        make: make.trim(),
        model: model.trim(),
        year:        year        ? Number(year)        : null,
        plate:       plate?.trim()  || null,
        vin:         vin?.trim()    || null,
        mileageLast: mileageLast ? Number(mileageLast) : null,
        mileageDate: mileageLast ? new Date() : null,
        notes:       notes?.trim()  || null,
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (err) {
    console.error('[clients/[id]/vehicles POST]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
