import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'
import { sendEmail, sendSMS } from '@/lib/email'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { id } = params

  try {
    const reminder = await prisma.maintenanceReminder.findFirst({
      where: { id, garageId },
      include: {
        client: { include: { user: { select: { email: true } } } },
        garage: { select: { name: true, slug: true, phone: true } },
      },
    })

    if (!reminder) {
      return NextResponse.json({ error: 'Rappel introuvable.' }, { status: 404 })
    }

    if (reminder.status === 'SENT') {
      return NextResponse.json({ error: 'Rappel déjà envoyé.' }, { status: 400 })
    }

    const clientEmail = reminder.client.user?.email
    const clientPhone = reminder.client.phone
    const clientName  = `${reminder.client.firstName} ${reminder.client.lastName}`
    const garageName  = reminder.garage.name
    const baseUrl     = process.env.NEXTAUTH_URL ?? 'https://mongaragiste.app'
    const bookingUrl  = `${baseUrl}/garage/${reminder.garage.slug}`

    // Calcul du délai en jours
    let daysText = ''
    if (reminder.dueDate) {
      const now  = new Date()
      const due  = new Date(reminder.dueDate)
      const diff = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (diff > 0) {
        daysText = `dans ${diff} jour${diff > 1 ? 's' : ''}`
      } else if (diff === 0) {
        daysText = "aujourd'hui"
      } else {
        daysText = `il y a ${Math.abs(diff)} jour${Math.abs(diff) > 1 ? 's' : ''}`
      }
    }

    const dueDateFr = reminder.dueDate
      ? new Date(reminder.dueDate).toLocaleDateString('fr-BE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null

    const dueLine = dueDateFr
      ? `le ${dueDateFr}${daysText ? ` (${daysText})` : ''}`
      : reminder.dueMileage
        ? `à ${reminder.dueMileage.toLocaleString('fr-BE')} km`
        : 'prochainement'

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
          ${reminder.vehicleModel ? `<div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Véhicule</span><br><strong>${reminder.vehicleModel}${reminder.vehiclePlate ? ` · ${reminder.vehiclePlate}` : ''}</strong></div>` : ''}
          ${reminder.notes ? `<div><span style="color:#888;font-size:12px">Remarque</span><br><strong>${reminder.notes}</strong></div>` : ''}
        </div>
        <p style="color:#555;margin:0 0 24px">Votre garagiste <strong>${garageName}</strong> vous invite à prendre rendez-vous.</p>
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
      })
    }

    if (clientPhone) {
      const smsContent = `[${garageName}] Rappel : votre ${reminder.type} est prévu(e) ${dueLine}. Prenez RDV : ${bookingUrl}`
      await sendSMS({ to: clientPhone, content: smsContent })
    }

    const updated = await prisma.maintenanceReminder.update({
      where: { id },
      data:  { sentAt: new Date(), status: 'SENT' },
      include: { client: { include: { user: { select: { email: true } } } } },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[garage/reminders/:id/send]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
