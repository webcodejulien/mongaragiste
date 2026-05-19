import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email requis.' }, { status: 400 })

    // Toujours répondre OK (sécurité — ne pas révéler si l'email existe)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ ok: true })

    // Supprimer les anciens tokens
    await prisma.passwordResetToken.deleteMany({ where: { email } })

    // Créer un nouveau token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1h

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    // Envoyer l'email
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from:    `"MonGaragiste" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to:      email,
      subject: 'Réinitialisation de votre mot de passe — MonGaragiste',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 16px">
          <div style="margin-bottom:24px">
            <span style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:#111">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#1D9E75"></span>
              MonGaragiste
            </span>
          </div>
          <h1 style="font-size:20px;font-weight:600;color:#111;margin:0 0 8px">Réinitialisez votre mot de passe</h1>
          <p style="font-size:14px;color:#6B6E72;margin:0 0 24px;line-height:1.6">
            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#1D9E75;color:#fff;font-size:14px;font-weight:500;padding:12px 24px;border-radius:8px;text-decoration:none;margin-bottom:24px">
            Réinitialiser mon mot de passe
          </a>
          <p style="font-size:12px;color:#9EA3A9;margin:0;line-height:1.6">
            Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
          <p style="font-size:11px;color:#D1D5DB;margin-top:24px">
            Ou copiez ce lien : ${resetUrl}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[forgot-password]', err)
    // On retourne OK même en cas d'erreur SMTP pour ne pas bloquer l'UX
    return NextResponse.json({ ok: true })
  }
}
