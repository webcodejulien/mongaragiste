import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

interface QuoteItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const quote = await prisma.quote.findFirst({
    where: { id: params.id, garageId },
    include: { garage: true },
  })
  if (!quote) return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 })

  if (!quote.clientEmail) {
    return NextResponse.json({ error: 'Ce devis n\'a pas d\'adresse email client.' }, { status: 400 })
  }

  const items = (quote.items as unknown) as QuoteItem[]

  const itemRows = items
    .map(
      (item) => `
      <tr style="border-bottom:1px solid #F3F4F6">
        <td style="padding:12px;font-size:13px;color:#111">${item.description}</td>
        <td style="padding:12px;text-align:right;font-size:13px;color:#374151">${item.quantity}</td>
        <td style="padding:12px;text-align:right;font-size:13px;color:#374151">${item.unitPrice.toFixed(2)} €</td>
        <td style="padding:12px;text-align:right;font-size:13px;font-weight:600;color:#111">${item.total.toFixed(2)} €</td>
      </tr>`
    )
    .join('')

  const validityBlock = quote.validUntil
    ? `<p style="color:#555;font-size:13px;margin:0 0 16px">
        Ce devis est valable jusqu'au <strong>${new Date(quote.validUntil).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
       </p>`
    : ''

  const vehicleBlock =
    quote.vehicleModel || quote.vehiclePlate
      ? `<div style="margin-bottom:10px">
          <span style="color:#888;font-size:12px">Véhicule</span><br>
          <strong>${[quote.vehicleModel, quote.vehiclePlate].filter(Boolean).join(' — ')}</strong>
         </div>`
      : ''

  const html = `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
    <div style="margin-bottom:24px">
      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#1D9E75;margin-right:8px"></span>
      <strong style="font-size:16px">MonGaragiste</strong>
    </div>

    <h1 style="font-size:22px;font-weight:700;margin:0 0 4px">Votre devis N° ${quote.quoteNr}</h1>
    <p style="color:#555;margin:0 0 24px">Bonjour ${quote.clientName}, veuillez trouver ci-dessous votre devis de la part de <strong>${quote.garage.name}</strong>.</p>

    <div style="background:#F7F8FA;border-radius:10px;padding:20px;margin-bottom:24px">
      <div style="margin-bottom:10px">
        <span style="color:#888;font-size:12px">Garage</span><br>
        <strong>${quote.garage.name}</strong>
      </div>
      <div style="margin-bottom:10px">
        <span style="color:#888;font-size:12px">Adresse</span><br>
        <strong>${quote.garage.address}, ${quote.garage.zipCode} ${quote.garage.city}</strong>
      </div>
      ${vehicleBlock}
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead>
        <tr style="background:#F9FAFB;border-bottom:1px solid #E5E7EB">
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em">Prestation</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em">Qté</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em">Prix HT</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em">Total HT</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div style="display:flex;justify-content:flex-end;margin-bottom:24px">
      <div style="min-width:240px">
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #E5E7EB">
          <span style="font-size:13px;color:#6B7280">Sous-total HT</span>
          <span style="font-size:13px;color:#111;font-weight:500">${quote.subtotalHt.toFixed(2)} €</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #E5E7EB">
          <span style="font-size:13px;color:#6B7280">TVA 21%</span>
          <span style="font-size:13px;color:#111;font-weight:500">${quote.tva.toFixed(2)} €</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 12px;margin-top:4px;border-radius:8px;background:#F0FDF4">
          <span style="font-size:15px;font-weight:700;color:#065F46">Total TTC</span>
          <span style="font-size:15px;font-weight:700;color:#065F46">${quote.total.toFixed(2)} €</span>
        </div>
      </div>
    </div>

    ${validityBlock}

    ${quote.notes ? `<div style="background:#FFFBEB;border-left:3px solid #F59E0B;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:24px"><p style="font-size:13px;color:#555;margin:0">${quote.notes}</p></div>` : ''}

    <p style="color:#555;font-size:13px">Pour toute question, contactez-nous au <strong>${quote.garage.phone}</strong>.</p>

    <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
    <p style="color:#aaa;font-size:11px">MonGaragiste · Votre garagiste à portée de clic</p>
  </div>`

  await sendEmail({
    to: [{ email: quote.clientEmail, name: quote.clientName }],
    subject: `Votre devis N° ${quote.quoteNr} — ${quote.garage.name}`,
    html,
  })

  await prisma.quote.update({
    where: { id: params.id },
    data: { status: 'SENT' },
  })

  return NextResponse.json({ success: true })
}
