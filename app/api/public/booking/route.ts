import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

function slugify(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-')
}

async function sendEmails(opts: {
  clientEmail: string; clientName: string
  garageName: string; garageEmail: string; garagePhone: string
  service: string; date: string; time: string
  vehicle: string; plate: string
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  const baseUrl = process.env.NEXTAUTH_URL || 'https://mongaragiste-app.vercel.app'

  // Email au client
  await transporter.sendMail({
    from: `"MonGaragiste" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: opts.clientEmail,
    subject: `Demande de RDV envoyée — ${opts.garageName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 16px">
        <div style="margin-bottom:20px;display:flex;align-items:center;gap:8px">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#1D9E75"></span>
          <span style="font-size:14px;font-weight:600;color:#111">MonGaragiste</span>
        </div>
        <h1 style="font-size:20px;font-weight:600;color:#111;margin:0 0 8px">Votre demande a bien été envoyée !</h1>
        <p style="font-size:14px;color:#6B6E72;margin:0 0 24px;line-height:1.6">
          Bonjour ${opts.clientName}, votre demande de rendez-vous a été transmise à <strong>${opts.garageName}</strong>.
          Vous recevrez une confirmation dès qu'ils l'auront acceptée.
        </p>
        <div style="background:#F5F5F2;border-radius:10px;padding:20px;margin-bottom:24px">
          <p style="margin:0 0 8px;font-size:13px;color:#9EA3A9;text-transform:uppercase;letter-spacing:0.5px;font-weight:500">Récapitulatif</p>
          <table style="width:100%;font-size:14px">
            <tr><td style="color:#6B6E72;padding:4px 0">Garage</td><td style="font-weight:500;color:#111;text-align:right">${opts.garageName}</td></tr>
            <tr><td style="color:#6B6E72;padding:4px 0">Service</td><td style="font-weight:500;color:#111;text-align:right">${opts.service}</td></tr>
            <tr><td style="color:#6B6E72;padding:4px 0">Date</td><td style="font-weight:500;color:#111;text-align:right">${opts.date} à ${opts.time}</td></tr>
            <tr><td style="color:#6B6E72;padding:4px 0">Véhicule</td><td style="font-weight:500;color:#111;text-align:right">${opts.vehicle} · ${opts.plate}</td></tr>
          </table>
        </div>
        <p style="font-size:13px;color:#9EA3A9">
          Des questions ? Contactez le garage directement au <strong>${opts.garagePhone}</strong>.
        </p>
      </div>
    `,
  }).catch(console.error)

  // Email au garagiste
  await transporter.sendMail({
    from: `"MonGaragiste" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: opts.garageEmail,
    subject: `Nouvelle demande de RDV — ${opts.clientName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 16px">
        <div style="margin-bottom:20px">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#1D9E75"></span>
          <span style="font-size:14px;font-weight:600;color:#111;margin-left:6px">MonGaragiste</span>
        </div>
        <h1 style="font-size:20px;font-weight:600;color:#111;margin:0 0 8px">Nouvelle demande de rendez-vous</h1>
        <p style="font-size:14px;color:#6B6E72;margin:0 0 24px;line-height:1.6">
          <strong>${opts.clientName}</strong> a demandé un rendez-vous dans votre garage.
        </p>
        <div style="background:#F5F5F2;border-radius:10px;padding:20px;margin-bottom:24px">
          <table style="width:100%;font-size:14px">
            <tr><td style="color:#6B6E72;padding:4px 0">Client</td><td style="font-weight:500;color:#111;text-align:right">${opts.clientName}</td></tr>
            <tr><td style="color:#6B6E72;padding:4px 0">Service</td><td style="font-weight:500;color:#111;text-align:right">${opts.service}</td></tr>
            <tr><td style="color:#6B6E72;padding:4px 0">Date souhaitée</td><td style="font-weight:500;color:#111;text-align:right">${opts.date} à ${opts.time}</td></tr>
            <tr><td style="color:#6B6E72;padding:4px 0">Véhicule</td><td style="font-weight:500;color:#111;text-align:right">${opts.vehicle} · ${opts.plate}</td></tr>
          </table>
        </div>
        <a href="${baseUrl}/garage/appointments"
          style="display:inline-block;background:#1D9E75;color:#fff;font-size:14px;font-weight:500;padding:12px 24px;border-radius:8px;text-decoration:none">
          Confirmer le RDV →
        </a>
      </div>
    `,
  }).catch(console.error)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { garageSlug, serviceId, date, startTime, endTime, vehiclePlate, vehicleModel, notes, firstName, lastName, email, phone } = body

    if (!garageSlug || !serviceId || !date || !startTime || !firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 })
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

    // Envoi des emails (non bloquant)
    sendEmails({
      clientEmail:  email,
      clientName:   `${firstName} ${lastName}`,
      garageName:   garage.name,
      garageEmail:  garage.user.email,
      garagePhone:  garage.phone,
      service:      service.name,
      date:         new Date(date).toLocaleDateString('fr-BE'),
      time:         startTime,
      vehicle:      vehicleModel || 'Non précisé',
      plate:        vehiclePlate || '—',
    })

    return NextResponse.json({ id: appt.id, ok: true }, { status: 201 })
  } catch (err) {
    console.error('[public/booking]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
