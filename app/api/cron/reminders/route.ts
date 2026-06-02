import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, tplReminder24h } from '@/lib/email'

export const dynamic = 'force-dynamic'

// Appelé par Vercel Cron chaque jour à 09:00
export async function GET(req: NextRequest) {
  // Sécurité : vérifier le header Vercel Cron
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  // RDV confirmés pour demain
  const appts = await prisma.appointment.findMany({
    where: {
      status: 'CONFIRMED',
      date:   { gte: new Date(tomorrowStr + 'T00:00:00'), lte: new Date(tomorrowStr + 'T23:59:59') },
    },
    include: {
      client:  { include: { user: { select: { email: true } } } },
      service: true,
      garage:  { select: { name: true, phone: true, address: true, city: true, slug: true } },
    },
  })

  let sent = 0
  for (const appt of appts) {
    const clientEmail = appt.client.user?.email
    if (!clientEmail) continue

    const tpl = tplReminder24h({
      clientName:    `${appt.client.firstName} ${appt.client.lastName}`,
      garageName:    appt.garage.name,
      serviceName:   appt.service?.name ?? '',
      date:          tomorrow.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' }),
      time:          appt.startTime,
      garagePhone:   appt.garage.phone ?? undefined,
      garageAddress: appt.garage.address ? `${appt.garage.address}, ${appt.garage.city}` : undefined,
    })

    await sendEmail({
      to:      [{ email: clientEmail, name: `${appt.client.firstName} ${appt.client.lastName}` }],
      subject: tpl.subject,
      html:    tpl.html,
    }).catch(console.error)

    sent++
  }

  console.log(`[cron/reminders] ${sent} rappels envoyés pour le ${tomorrowStr}`)
  return NextResponse.json({ ok: true, sent, date: tomorrowStr })
}
