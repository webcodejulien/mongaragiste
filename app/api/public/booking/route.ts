import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendEmail, sendSMS, tplBookingRequest } from '@/lib/email'
import { isValidEmail, isValidTime, sanitize } from '@/lib/validate'

function slugify(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const garageSlug   = sanitize(body.garageSlug   ?? '')
    const serviceId    = sanitize(body.serviceId    ?? '')
    const date         = sanitize(body.date         ?? '')
    const startTime    = sanitize(body.startTime    ?? '')
    const endTime      = sanitize(body.endTime      ?? '')
    const vehiclePlate = sanitize(body.vehiclePlate ?? '').slice(0, 15)
    const vehicleModel = sanitize(body.vehicleModel ?? '')
    const notes        = sanitize(body.notes        ?? '')
    const firstName    = sanitize(body.firstName    ?? '')
    const lastName     = sanitize(body.lastName     ?? '')
    const email        = (body.email ?? '').trim()
    const phone        = sanitize(body.phone        ?? '')

    if (!garageSlug || !serviceId || !date || !startTime || !firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 })
    }
    if (!isValidTime(startTime)) {
      return NextResponse.json({ error: 'Format d\'heure invalide (HH:MM attendu).' }, { status: 400 })
    }
    if (firstName.length < 1 || lastName.length < 1) {
      return NextResponse.json({ error: 'Prénom et nom requis.' }, { status: 400 })
    }
    // Vérifier que la date n'est pas dans le passé
    const apptDate = new Date(date)
    apptDate.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (apptDate < today) {
      return NextResponse.json({ error: 'La date du RDV ne peut pas être dans le passé.' }, { status: 400 })
    }

    // Trouver le garage
    const garage = await prisma.garage.findUnique({
      where: { slug: garageSlug },
      include: { user: { select: { email: true } } },
    })
    if (!garage) return NextResponse.json({ error: 'Garage introuvable.' }, { status: 404 })

    // Trouver ou créer l'utilisateur client
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      const tempPw = await bcrypt.hash(Math.random().toString(36), 10)
      user = await prisma.user.create({
        data: {
          email,
          password: tempPw,
          role: 'CLIENT',
          client: { create: { firstName, lastName, phone: phone || null } },
        },
      })
    }

    // Vérifier que le client existe
    let client = await prisma.client.findUnique({ where: { userId: user.id } })
    if (!client) {
      client = await prisma.client.create({
        data: { userId: user.id, firstName, lastName, phone: phone || null },
      })
    }

    // Vérifier le service
    const service = await prisma.garageService.findFirst({
      where: { id: serviceId, garageId: garage.id },
    })
    if (!service) return NextResponse.json({ error: 'Service introuvable.' }, { status: 404 })

    // Créer le RDV
    const appt = await prisma.appointment.create({
      data: {
        garageId:     garage.id,
        clientId:     client.id,
        serviceId:    service.id,
        date:         new Date(date),
        startTime,
        endTime:      endTime || startTime,
        vehiclePlate: vehiclePlate || null,
        vehicleModel: vehicleModel || null,
        notes:        notes || null,
        status:       'PENDING',
      },
    })

    // Notification au garagiste
    await prisma.notification.create({
      data: {
        userId:  garage.userId,
        type:    'NEW_APPOINTMENT',
        title:   'Nouvelle demande de RDV',
        message: `${firstName} ${lastName} — ${service.name} — le ${new Date(date).toLocaleDateString('fr-BE')} à ${startTime}`,
      },
    })

    // Envoi des emails via Brevo (non bloquant)
    const tpl = tplBookingRequest({
      clientName:  `${firstName} ${lastName}`,
      garageName:  garage.name,
      serviceName: service.name,
      date:        new Date(date).toLocaleDateString('fr-BE', { weekday:'long', day:'numeric', month:'long' }),
      time:        startTime,
      garageEmail: garage.user.email,
    })
    sendEmail({ to: [{ email, name: `${firstName} ${lastName}` }], subject: tpl.client.subject, html: tpl.client.html }).catch(console.error)
    sendEmail({ to: [{ email: garage.user.email, name: garage.name }], subject: tpl.garage.subject, html: tpl.garage.html }).catch(console.error)

    if (phone) {
      sendSMS({
        to: phone,
        content: `Demande RDV reçue ✓ ${garage.name} — ${service.name} le ${new Date(date).toLocaleDateString('fr-BE')} à ${startTime}. Confirmation à venir.`,
      }).catch(console.error)
    }

    return NextResponse.json({ id: appt.id, ok: true }, { status: 201 })
  } catch (err) {
    console.error('[public/booking]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
