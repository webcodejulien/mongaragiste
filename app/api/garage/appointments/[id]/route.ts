import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'
import { sendEmail, sendSMS, tplBookingConfirmed, tplBookingCancelled, tplReviewRequest } from '@/lib/email'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { status } = await req.json()
  const valid = ['PENDING','CONFIRMED','IN_PROGRESS','DONE','CANCELLED']
  if (!valid.includes(status)) return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 })

  const appt = await prisma.appointment.update({
    where:   { id: params.id, garageId },
    data:    { status },
    include: {
      client:  { include: { user: { select: { email: true } } } },
      service: true,
      garage:  { select: { name: true, phone: true, address: true, slug: true } },
    },
  })

  const clientPhone = appt.client.phone ?? undefined

  const clientEmail = appt.client.user?.email
  const clientName  = `${appt.client.firstName} ${appt.client.lastName}`
  const dateStr     = new Date(appt.date).toLocaleDateString('fr-BE', { weekday:'long', day:'numeric', month:'long' })

  // Email de confirmation au client
  if (status === 'CONFIRMED' && clientEmail) {
    const tpl = tplBookingConfirmed({
      clientName,
      garageName:  appt.garage.name,
      serviceName: appt.service?.name ?? '',
      date:        dateStr,
      time:        appt.startTime,
      garagePhone: appt.garage.phone ?? undefined,
    })
    sendEmail({ to: [{ email: clientEmail, name: clientName }], subject: tpl.subject, html: tpl.html }).catch(console.error)

    if (clientPhone) {
      sendSMS({
        to: clientPhone,
        content: `RDV confirmé ✓ ${appt.garage.name} — ${appt.service?.name} le ${dateStr} à ${appt.startTime}. Pour annuler: mongaragiste.app/mon-compte`,
      }).catch(console.error)
    }

    // Notification en DB
    await prisma.notification.create({
      data: {
        userId:  appt.client.userId,
        type:    'APPOINTMENT_CONFIRMED',
        title:   'RDV confirmé',
        message: `${appt.garage.name} — ${appt.service?.name} — le ${dateStr} à ${appt.startTime}`,
      },
    }).catch(console.error)
  }

  // Email d'annulation au client
  if (status === 'CANCELLED' && clientEmail) {
    const tpl = tplBookingCancelled({
      clientName,
      garageName:  appt.garage.name,
      serviceName: appt.service?.name ?? '',
      date:        dateStr,
      time:        appt.startTime,
    })
    sendEmail({ to: [{ email: clientEmail, name: clientName }], subject: tpl.subject, html: tpl.html }).catch(console.error)

    if (clientPhone) {
      sendSMS({
        to: clientPhone,
        content: `RDV annulé — ${appt.garage.name} — ${appt.service?.name} le ${dateStr} à ${appt.startTime}. Reprenez RDV sur mongaragiste.app`,
      }).catch(console.error)
    }

    await prisma.notification.create({
      data: {
        userId:  appt.client.userId,
        type:    'APPOINTMENT_CANCELLED',
        title:   'RDV annulé',
        message: `${appt.garage.name} — ${appt.service?.name} — le ${dateStr} à ${appt.startTime}`,
      },
    }).catch(console.error)
  }

  // Email invitation avis quand RDV terminé
  if (status === 'DONE' && clientEmail) {
    const tpl = tplReviewRequest({
      clientName,
      garageName:    appt.garage.name,
      garageSlug:    appt.garage.slug,
      appointmentId: appt.id,
    })
    sendEmail({ to: [{ email: clientEmail, name: clientName }], subject: tpl.subject, html: tpl.html }).catch(console.error)
  }

  return NextResponse.json(appt)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  await prisma.appointment.delete({ where: { id: params.id, garageId } })
  return NextResponse.json({ ok: true })
}
