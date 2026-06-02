import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const garage = await prisma.garage.findUnique({
    where:   { slug: params.slug },
    select:  { name: true, city: true, description: true },
  }).catch(() => null)

  if (!garage) {
    return { title: 'Garage introuvable' }
  }

  const title = `${garage.name} — Réservation en ligne`
  const desc  = garage.description
    ?? `Prenez rendez-vous en ligne avec ${garage.name} à ${garage.city}. Disponibilités en temps réel.`

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
    },
  }
}

export default function GarageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
