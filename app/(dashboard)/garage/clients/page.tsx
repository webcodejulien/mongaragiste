'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Badge, statusToBadge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

const clients = [
  {
    id: '1',
    firstName: 'Martin',
    lastName: 'Dupont',
    email: 'martin.dupont@gmail.com',
    phone: '+32 470 12 34 56',
    totalAppointments: 8,
    lastVisit: '2024-01-15',
    vehicles: ['Renault Clio 2019 — AB-123-CD'],
    appointments: [
      { date: '2024-01-15', service: 'Vidange', status: 'CONFIRMED', vehicle: 'Renault Clio' },
      { date: '2023-10-22', service: 'Freins', status: 'DONE', vehicle: 'Renault Clio' },
      { date: '2023-07-10', service: 'Révision', status: 'DONE', vehicle: 'Renault Clio' },
    ],
  },
  {
    id: '2',
    firstName: 'Sophie',
    lastName: 'Lambert',
    email: 'sophie.lambert@outlook.com',
    phone: '+32 475 98 76 54',
    totalAppointments: 3,
    lastVisit: '2024-01-15',
    vehicles: ['Peugeot 308 2021 — EF-456-GH'],
    appointments: [
      { date: '2024-01-15', service: 'Freins avant', status: 'IN_PROGRESS', vehicle: 'Peugeot 308' },
      { date: '2023-11-03', service: 'Vidange', status: 'DONE', vehicle: 'Peugeot 308' },
      { date: '2023-05-20', service: 'Pneus', status: 'DONE', vehicle: 'Peugeot 308' },
    ],
  },
  {
    id: '3',
    firstName: 'Jean',
    lastName: 'Moreau',
    email: 'jean.moreau@yahoo.fr',
    phone: '+32 478 11 22 33',
    totalAppointments: 12,
    lastVisit: '2024-01-15',
    vehicles: ['Citroën C3 2020 — IJ-789-KL', 'Renault Kangoo 2018 — MN-012-OP'],
    appointments: [
      { date: '2024-01-15', service: 'Révision 30 000 km', status: 'CONFIRMED', vehicle: 'Citroën C3' },
      { date: '2023-12-01', service: 'Diagnostic', status: 'DONE', vehicle: 'Renault Kangoo' },
      { date: '2023-09-14', service: 'Embrayage', status: 'DONE', vehicle: 'Citroën C3' },
    ],
  },
  {
    id: '4',
    firstName: 'Marie',
    lastName: 'Fontaine',
    email: 'marie.fontaine@gmail.com',
    phone: '+32 472 44 55 66',
    totalAppointments: 5,
    lastVisit: '2024-01-12',
    vehicles: ['VW Golf 2022 — QR-345-ST'],
    appointments: [
      { date: '2024-01-15', service: 'Pneus (x4)', status: 'PENDING', vehicle: 'VW Golf' },
      { date: '2023-08-30', service: 'Vidange', status: 'DONE', vehicle: 'VW Golf' },
    ],
  },
  {
    id: '5',
    firstName: 'Pierre',
    lastName: 'Bernard',
    email: 'pierre.bernard@hotmail.com',
    phone: '+32 479 77 88 99',
    totalAppointments: 2,
    lastVisit: '2023-11-20',
    vehicles: ['BMW 320d 2018 — UV-678-WX'],
    appointments: [
      { date: '2024-01-16', service: 'Diagnostic', status: 'CONFIRMED', vehicle: 'BMW 320d' },
      { date: '2023-11-20', service: 'Freins', status: 'DONE', vehicle: 'BMW 320d' },
    ],
  },
  {
    id: '6',
    firstName: 'Émilie',
    lastName: 'Renard',
    email: 'emilie.renard@gmail.com',
    phone: '+32 471 23 45 67',
    totalAppointments: 1,
    lastVisit: '2024-01-16',
    vehicles: ['Toyota Yaris 2020 — YZ-901-AB'],
    appointments: [
      { date: '2024-01-16', service: 'Vidange', status: 'PENDING', vehicle: 'Toyota Yaris' },
    ],
  },
]

function formatDate(d: string) {
  const date = new Date(d)
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = clients.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
  })

  const selected = clients.find((c) => c.id === selectedId)

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Clients" />
      <main className="flex-1 p-6">
        <div className="flex gap-6">
          {/* Client list */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="w-64">
                <Input
                  placeholder="Rechercher un client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <p className="text-xs text-gray-500">{filtered.length} client(s)</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_160px_80px_100px] text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                <span>Client</span>
                <span>Dernier RDV</span>
                <span className="text-center">RDV total</span>
                <span className="text-right">Fiche</span>
              </div>
              <div className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
                    className={`grid grid-cols-[1fr_160px_80px_100px] px-4 py-3 cursor-pointer transition-colors ${
                      selectedId === c.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-sm font-semibold flex-shrink-0">
                        {c.firstName.charAt(0)}{c.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-gray-500">{c.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-600">{formatDate(c.lastVisit)}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-900">{c.totalAppointments}</span>
                    </div>
                    <div className="flex items-center justify-end">
                      <button className="text-xs text-primary-400 hover:text-primary-600 font-medium">
                        {selectedId === c.id ? 'Fermer' : 'Voir →'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Client detail panel */}
          {selected && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-lg p-5 sticky top-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-lg font-bold">
                    {selected.firstName.charAt(0)}{selected.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selected.firstName} {selected.lastName}</h3>
                    <p className="text-xs text-gray-500">{selected.totalAppointments} rendez-vous</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {selected.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {selected.phone}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Véhicules</p>
                  {selected.vehicles.map((v) => (
                    <p key={v} className="text-sm text-gray-600 font-mono text-xs bg-gray-50 rounded px-2 py-1 mb-1">{v}</p>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Historique</p>
                  <div className="space-y-2">
                    {selected.appointments.map((a, i) => {
                      const badge = statusToBadge(a.status)
                      return (
                        <div key={i} className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium text-gray-800">{a.service}</p>
                            <p className="text-xs text-gray-500">{formatDate(a.date)} — {a.vehicle}</p>
                          </div>
                          <Badge variant={badge.variant} className="flex-shrink-0">{badge.label}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
