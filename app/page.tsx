import { prisma } from '@/lib/prisma'
import { LandingBody } from '@/components/LandingBody'

export default async function HomePage() {
  const [garages, garageCount, appointmentCount, cityRows] = await Promise.all([
    prisma.garage.findMany({
      where:   { status: 'ACTIVE' },
      select: {
        slug: true, name: true, address: true, city: true,
        rating: true, reviewCount: true, phone: true, logoUrl: true,
        services: { select: { name: true } },
      },
      orderBy: { rating: 'desc' },
      take:    6,
    }).catch(() => []),
    prisma.garage.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
    prisma.appointment.count().catch(() => 0),
    prisma.garage.findMany({
      where:    { status: 'ACTIVE' },
      select:   { city: true },
      distinct: ['city'],
    }).catch(() => []),
  ])

  return (
    <LandingBody
      garages={garages}
      garageCount={garageCount}
      appointmentCount={appointmentCount}
      cityCount={cityRows.length}
    />
  )
}
