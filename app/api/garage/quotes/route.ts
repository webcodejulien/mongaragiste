import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function generateQuoteNr(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
  return `${year}${month}-${random}`
}

interface QuoteItemInput {
  description: string
  quantity: number
  unitPrice: number
}

export async function GET(req: NextRequest) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const quotes = await prisma.quote.findMany({
    where: {
      garageId,
      ...(status ? { status: status as any } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(quotes)
}

export async function POST(req: NextRequest) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const body = await req.json()
  const {
    clientName,
    clientEmail,
    clientPhone,
    vehicleModel,
    vehiclePlate,
    items,
    notes,
    validUntil,
  } = body

  if (!clientName) {
    return NextResponse.json({ error: 'Le nom du client est requis.' }, { status: 400 })
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Au moins une prestation est requise.' }, { status: 400 })
  }

  const processedItems = (items as QuoteItemInput[]).map((item) => ({
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    total: Math.round(Number(item.quantity) * Number(item.unitPrice) * 100) / 100,
  }))

  const subtotalHt = Math.round(processedItems.reduce((sum, i) => sum + i.total, 0) * 100) / 100
  const tva = Math.round(subtotalHt * 0.21 * 100) / 100
  const total = Math.round((subtotalHt + tva) * 100) / 100

  // Génère un quoteNr unique
  let quoteNr = generateQuoteNr()
  let attempts = 0
  while (attempts < 5) {
    const existing = await prisma.quote.findUnique({ where: { quoteNr } })
    if (!existing) break
    quoteNr = generateQuoteNr()
    attempts++
  }

  const quote = await prisma.quote.create({
    data: {
      quoteNr,
      garageId,
      clientName,
      clientEmail: clientEmail ?? null,
      clientPhone: clientPhone ?? null,
      vehicleModel: vehicleModel ?? null,
      vehiclePlate: vehiclePlate ?? null,
      items: processedItems,
      subtotalHt,
      tva,
      total,
      notes: notes ?? null,
      validUntil: validUntil ? new Date(validUntil) : null,
      status: 'DRAFT',
    },
  })

  return NextResponse.json(quote, { status: 201 })
}
