import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface QuoteItemInput {
  description: string
  quantity: number
  unitPrice: number
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const quote = await prisma.quote.findFirst({
    where: { id: params.id, garageId },
    include: {
      garage: {
        select: { name: true, address: true, city: true, zipCode: true, phone: true, vatNumber: true },
      },
    },
  })

  if (!quote) return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 })

  return NextResponse.json(quote)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const quote = await prisma.quote.findFirst({
    where: { id: params.id, garageId },
  })
  if (!quote) return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 })

  const body = await req.json()
  const {
    status,
    clientName,
    clientEmail,
    clientPhone,
    vehicleModel,
    vehiclePlate,
    items,
    notes,
    validUntil,
  } = body

  const updateData: Prisma.QuoteUpdateInput = {}

  if (status !== undefined) updateData.status = status
  if (clientName !== undefined) updateData.clientName = clientName
  if (clientEmail !== undefined) updateData.clientEmail = clientEmail
  if (clientPhone !== undefined) updateData.clientPhone = clientPhone
  if (vehicleModel !== undefined) updateData.vehicleModel = vehicleModel
  if (vehiclePlate !== undefined) updateData.vehiclePlate = vehiclePlate
  if (notes !== undefined) updateData.notes = notes
  if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null

  if (items !== undefined && Array.isArray(items)) {
    const processedItems = (items as QuoteItemInput[]).map((item) => ({
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      total: Math.round(Number(item.quantity) * Number(item.unitPrice) * 100) / 100,
    }))
    const subtotalHt = Math.round(processedItems.reduce((sum, i) => sum + i.total, 0) * 100) / 100
    const tva = Math.round(subtotalHt * 0.21 * 100) / 100
    const total = Math.round((subtotalHt + tva) * 100) / 100

    updateData.items = processedItems as unknown as Prisma.InputJsonValue
    updateData.subtotalHt = subtotalHt
    updateData.tva = tva
    updateData.total = total
  }

  const updated = await prisma.quote.update({
    where: { id: params.id },
    data: updateData,
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const quote = await prisma.quote.findFirst({
    where: { id: params.id, garageId },
  })
  if (!quote) return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 })

  if (quote.status !== 'DRAFT') {
    return NextResponse.json({ error: 'Seuls les devis en brouillon peuvent être supprimés.' }, { status: 400 })
  }

  await prisma.quote.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
