import { NextRequest, NextResponse } from 'next/server'
import { getGarageId } from '@/lib/getGarage'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function toCSV(headers: string[], rows: string[][]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  return [headers.map(escape), ...rows.map(r => r.map(escape))].map(r => r.join(',')).join('\n')
}

export async function GET(req: NextRequest) {
  const garageId = await getGarageId()
  if (!garageId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? 'appointments' // 'appointments' | 'clients'

  if (type === 'clients') {
    const clients = await prisma.client.findMany({
      where: { appointments: { some: { garageId } } },
      include: {
        user: { select: { email: true } },
        appointments: {
          where: { garageId },
          include: { service: true },
          orderBy: { date: 'desc' },
        },
      },
    })

    const rows = clients.map(c => [
      c.firstName,
      c.lastName,
      c.user?.email ?? '',
      c.phone ?? '',
      String(c.appointments.length),
      c.appointments[0]?.date ? new Date(c.appointments[0].date).toLocaleDateString('fr-BE') : '',
    ])

    const csv = toCSV(['Prénom','Nom','Email','Téléphone','Nb RDV','Dernier RDV'], rows)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="clients-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  }

  // type === 'appointments'
  const appts = await prisma.appointment.findMany({
    where:   { garageId },
    include: {
      client:  true,
      service: true,
    },
    orderBy: { date: 'desc' },
  })

  const STATUS_FR: Record<string, string> = {
    PENDING:'En attente', CONFIRMED:'Confirmé', IN_PROGRESS:'En cours', DONE:'Terminé', CANCELLED:'Annulé',
  }

  const rows = appts.map(a => [
    new Date(a.date).toLocaleDateString('fr-BE'),
    a.startTime,
    a.client.firstName,
    a.client.lastName,
    a.service?.name ?? '',
    a.vehicleModel ?? '',
    a.vehiclePlate ?? '',
    STATUS_FR[a.status] ?? a.status,
    a.notes ?? '',
  ])

  const csv = toCSV(['Date','Heure','Prénom','Nom','Service','Véhicule','Immat.','Statut','Notes'], rows)
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="rdv-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
