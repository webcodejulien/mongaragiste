import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, role, firstName, lastName, phone, garage: garageData } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // ── Inscription garagiste ─────────────────────────────
    if (role === 'GARAGE' && garageData) {
      const slug = slugify(garageData.name) + '-' + Math.random().toString(36).slice(2, 6)

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'GARAGE',
          garage: {
            create: {
              name:          garageData.name,
              slug,
              phone:         garageData.phone,
              address:       garageData.address,
              city:          garageData.city,
              zipCode:       garageData.zipCode,
              description:   garageData.description || null,
              mechanicCount: garageData.mechanicCount ?? 1,
              slotDuration:  garageData.slotDuration  ?? 30,
              status: 'PENDING',
              services: garageData.services?.length
                ? {
                    create: garageData.services.map((name: string) => ({
                      name,
                      duration: garageData.slotDuration ?? 30,
                    })),
                  }
                : undefined,
              schedules: garageData.schedules?.length
                ? {
                    create: garageData.schedules.map((s: { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }) => ({
                      dayOfWeek: s.dayOfWeek,
                      openTime:  s.openTime,
                      closeTime: s.closeTime,
                      isClosed:  s.isClosed,
                    })),
                  }
                : undefined,
            },
          },
        },
      })

      return NextResponse.json({ id: user.id }, { status: 201 })
    }

    // ── Inscription client ────────────────────────────────
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CLIENT',
        client: {
          create: {
            firstName: firstName || '',
            lastName:  lastName  || '',
            phone:     phone     || null,
          },
        },
      },
    })

    return NextResponse.json({ id: user.id }, { status: 201 })
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
