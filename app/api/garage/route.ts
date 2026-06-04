import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'
import { sendEmail, sendSMS } from '@/lib/email'

export async function POST(req: NextRequest) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  try {
    const body = await req.json()
    const { clientId, channel, subject, message } = body

    if (!clientId || !channel || !message) {
      return NextResponse.json({ error: 'clientId, channel et message sont requis.' }, { status: 400 })
    }

    if (!['email', 'sms'].includes(channel)) {
      return NextResponse.json({ error: 'Canal invalide (email ou sms).' }, { status: 400 })
    }

    const client = await prisma.client.findFirst({
      where: { id: clientId },
      include: {
        user: { select: { email: true } },
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })
    }

    const garage = await prisma.garage.findUnique({
      where: { id: garageId },
      select: { name: true, user: { select: { email: true } } },
    })

    const garageName  = garage?.name ?? 'Votre garagiste'
    const garageEmail = garage?.user?.email ?? ''
    const clientName  = `${client.firstName} ${client.lastName}`

    if (channel === 'email') {
      const clientEmail = client.user?.email
      if (!clientEmail) {
        return NextResponse.json({ error: "Ce client n'a pas d'adresse email." }, { status: 400 })
      }

      const html = `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#1D9E75;margin-right:8px"></span>
          <strong style="font-size:16px">MonGaragiste</strong>
        </div>
        <h1 style="font-size:20px;font-weight:700;margin:0 0 8px">Message de ${garageName}</h1>
        <p style="color:#555;margin:0 0 20px">Bonjour ${clientName},</p>
        <blockquote style="margin:0 0 24px;padding:16px 20px;background:#F7F8FA;border-left:3px solid #1D9E75;border-radius:0 8px 8px 0;color:#1a1a1a;font-size:14px;line-height:1.6">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
        <p style="color:#555;font-size:13px">Répondez à : <a href="mailto:${garageEmail}" style="color:#1D9E75">${garageEmail}</a></p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#aaa;font-size:11px">MonGaragiste · Votre garagiste à portée de clic</p>
      </div>`

      await sendEmail({
        to:      [{ email: clientEmail, name: clientName }],
        subject: subject || `Message de ${garageName}`,
        html,
      })
    } else {
      const clientPhone = client.phone
      if (!clientPhone) {
        return NextResponse.json({ error: "Ce client n'a pas de numéro de téléphone." }, { status: 400 })
      }

      const smsContent = `[${garageName}] ${message}`
      await sendSMS({ to: clientPhone, content: smsContent })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[garage/message POST]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
