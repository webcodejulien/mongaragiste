import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, sendSMS, tplReminder24h } from '@/lib/email'

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

  // MaintenanceReminder dont la date est dans moins de 7 jours, PENDING, non encore envoyé
  const in7Days = new Date()
  in7Days.setDate(in7Days.getDate() + 7)

  const maintenanceReminders = await prisma.maintenanceReminder.findMany({
    where: {
      status:  'PENDING',
      sentAt:  null,
      dueDate: { lte: in7Days },
    },
    include: {
      client: { include: { user: { select: { email: true } } } },
      garage: { select: { name: true, slug: true, phone: true } },
    },
  })

  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://mongaragiste.app'
  let maintenanceSent = 0

  for (const reminder of maintenanceReminders) {
    const clientEmail = reminder.client.user?.email
    const clientPhone = reminder.client.phone
    const clientName  = `${reminder.client.firstName} ${reminder.client.lastName}`
    const garageName  = reminder.garage.name
    const bookingUrl  = `${baseUrl}/garage/${reminder.garage.slug}`

    const due  = reminder.dueDate!
    const diff = Math.round((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const daysText = diff > 0
      ? `dans ${diff} jour${diff > 1 ? 's' : ''}`
      : diff === 0 ? "aujourd'hui" : `il y a ${Math.abs(diff)} jour${Math.abs(diff) > 1 ? 's' : ''}`
    const dueDateFr = due.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })
    const dueLine = `le ${dueDateFr} (${daysText})`

    if (clientEmail) {
      const html = `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#1D9E75;margin-right:8px"></span>
          <strong style="font-size:16px">MonGaragiste</strong>
        </div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Rappel d'entretien 🔧</h1>
        <p style="color:#555;margin:0 0 24px">Bonjour ${clientName},</p>
        <div style="background:#F7F8FA;border-radius:10px;padding:20px;margin-bottom:24px">
          <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Type d'entretien</span><br><strong>${reminder.type}</strong></div>
          <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Date prévue</span><br><strong>${dueLine}</strong></div>
          ${reminder.vehicleModel ? `<div><span style="color:#888;font-size:12px">Véhicule</span><br><strong>${reminder.vehicleModel}${reminder.vehiclePlate ? ` · ${reminder.vehiclePlate}` : ''}</strong></div>` : ''}
        </div>
        <a href="${bookingUrl}"
          style="display:inline-block;background:#1D9E75;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">
          Prendre rendez-vous →
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#aaa;font-size:11px">MonGaragiste · Votre garagiste à portée de clic</p>
      </div>`

      await sendEmail({
        to:      [{ email: clientEmail, name: clientName }],
        subject: `Rappel : votre ${reminder.type} est prévu(e) ${dueLine}`,
        html,
      }).catch(console.error)
    }

    if (clientPhone) {
      await sendSMS({
        to:      clientPhone,
        content: `[${garageName}] Rappel : votre ${reminder.type} est prévu(e) ${dueLine}. RDV : ${bookingUrl}`,
      }).catch(console.error)
    }

    await prisma.maintenanceReminder.update({
      where: { id: reminder.id },
      data:  { sentAt: new Date(), status: 'SENT' },
    })

    maintenanceSent++
  }

  console.log(`[cron/reminders] ${sent} rappels RDV + ${maintenanceSent} rappels entretien envoyés`)
  return NextResponse.json({ ok: true, sent, maintenanceSent, date: tomorrowStr })
}
