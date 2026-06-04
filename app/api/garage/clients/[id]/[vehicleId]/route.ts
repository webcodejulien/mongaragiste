import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

/* ─── Helper: vérifie qu'un véhicule appartient à un client du garage ── */
async function checkOwnership(garageId: string, clientId: string, vehicleId: string) {
  const belongs = await prisma.appointment.findFirst({
    where: { garageId, clientId },
    select: { id: true },
  })
  if (!belongs) return null

  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, clientId },
  })
  return vehicle
}

/* ─── PATCH /api/garage/clients/[id]/vehicles/[vehicleId] ───
   Met à jour un ou plusieurs champs du véhicule.
────────────────────────────────────────────────────────────── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; vehicleId: string }> }
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { id: clientId, vehicleId } = await params
  const vehicle = await checkOwnership(garageId, clientId, vehicleId)
  if (!vehicle) return NextResponse.json({ error: 'Véhicule introuvable.' }, { status: 404 })

  try {
    const body = await req.json()
    const { make, model, year, plate, vin, mileageLast, notes } = body

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...(make         !== undefined && { make: make.trim() }),
        ...(model        !== undefined && { model: model.trim() }),
        ...(year         !== undefined && { year: year ? Number(year) : null }),
        ...(plate        !== undefined && { plate: plate?.trim() || null }),
        ...(vin          !== undefined && { vin: vin?.trim() || null }),
        ...(notes        !== undefined && { notes: notes?.trim() || null }),
        ...(mileageLast  !== undefined && {
          mileageLast: mileageLast ? Number(mileageLast) : null,
          mileageDate: mileageLast ? new Date() : null,
        }),
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[clients/[id]/vehicles/[vehicleId] PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

/* ─── DELETE /api/garage/clients/[id]/vehicles/[vehicleId] ──
   Supprime un véhicule.
────────────────────────────────────────────────────────────── */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; vehicleId: string }> }
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { id: clientId, vehicleId } = await params
  const vehicle = await checkOwnership(garageId, clientId, vehicleId)
  if (!vehicle) return NextResponse.json({ error: 'Véhicule introuvable.' }, { status: 404 })

  await prisma.vehicle.delete({ where: { id: vehicleId } })
  return NextResponse.json({ ok: true })
}
