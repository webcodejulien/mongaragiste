import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'Fichier manquant.' }, { status: 400 })
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: 'Fichier trop grand (max 2MB).' }, { status: 400 })
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return NextResponse.json({ error: 'Format non supporté. Utilisez JPG, PNG ou WebP.' }, { status: 400 })
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const blob = await put(`logos/${garageId}.${ext}`, file, {
    access: 'public',
    addRandomSuffix: false,
  })

  await prisma.garage.update({ where: { id: garageId }, data: { logoUrl: blob.url } })
  return NextResponse.json({ logoUrl: blob.url })
}
