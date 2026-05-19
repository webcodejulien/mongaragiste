'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Badge, statusToBadge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

const allAppointments = [
  { id: '1', date: '2024-01-15', time: '09:00', client: 'Martin Dupont', phone: '+32 470 12 34 56', service: 'Vidange', vehicle: 'Renault Clio 2019', plate: 'AB-123-CD', status: 'CONFIRMED', notes: '' },
  { id: '2', date: '2024-01-15', time: '10:30', client: 'Sophie Lambert', phone: '+32 475 98 76 54', service: 'Freins avant', vehicle: 'Peugeot 308 2021', plate: 'EF-456-GH', status: 'IN_PROGRESS', notes: 'Bruit au freinage' },
  { id: '3', date: '2024-01-15', time: '14:00', client: 'Jean Moreau', phone: '+32 478 11 22 33', service: 'Révision 30 000 km', vehicle: 'Citroën C3 2020', plate: 'IJ-789-KL', status: 'CONFIRMED', notes: '' },
  { id: '4', date: '2024-01-15', time: '15:30', client: 'Marie Fontaine', phone: '+32 472 44 55 66', service: 'Pneus (x4)', vehicle: 'VW Golf 2022', plate: 'MN-012-OP', status: 'PENDING', notes: 'Passage en 225/45 R17' },
  { id: '5', date: '2024-01-16', time: '09:00', client: 'Pierre Bernard', phone: '+32 479 77 88 99', service: 'Diagnostic', vehicle: 'BMW 320d 2018', plate: 'QR-345-ST', status: 'CONFIRMED', notes: 'Voyant moteur allumé' },
  { id: '6', date: '2024-01-16', time: '11:00', client: 'Émilie Renard', phone: '+32 471 23 45 67', service: 'Vidange', vehicle: 'Toyota Yaris 2020', plate: 'UV-678-WX', status: 'PENDING', notes: '' },
  { id: '7', date: '2024-01-14', time: '14:00', client: 'Thomas Laurent', phone: '+32 476 89 01 23', service: 'Embrayage', vehicle: 'Ford Focus 2017', plate: 'YZ-901-AB', status: 'DONE', notes: 'Embrayage complet' },
  { id: '8', date: '2024-01-13', time: '10:00', client: 'Isabelle Petit', phone: '+32 473 45 67 89', service: 'Freins', vehicle: 'Renault Megane 2019', plate: 'CD-234-EF', status: 'DONE', notes: '' },
  { id: '9', date: '2024-01-12', time: '09:00', client: 'Lucas Martin', phone: '+32 474 01 23 45', service: 'Pneus', vehicle: 'Audi A4 2020', plate: 'GH-567-IJ', status: 'CANCELLED', notes: 'Client absent' },
]

const STATUS_FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'CONFIRMED', label: 'Confirmés' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'DONE', label: 'Terminés' },
  { value: 'CANCELLED', label: 'Annulés' },
]

export default function AppointmentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = allAppointments.filter((a) => {
    const matchSearch = !search || a.client.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase()) || a.plate.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || a.status === statusFilter
    return matchSearch && matchStatus
  })

  function formatDate(d: string) {
    const date = new Date(d)
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Rendez-vous" />
      <main className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 max-w-xs">
            <Input
              placeholder="Rechercher client, service, immat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <div className="flex items-center gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  statusFilter === f.value
                    ? 'bg-primary-400 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[100px_1fr_160px_140px_120px_100px] text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <span>Date / Heure</span>
            <span>Client</span>
            <span>Service</span>
            <span>Véhicule</span>
            <span>Statut</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-gray-500">
                Aucun rendez-vous trouvé
              </div>
            )}
            {filtered.map((a) => {
              const badge = statusToBadge(a.status)
              const isExpanded = expandedId === a.id
              return (
                <div key={a.id}>
                  <div
                    className="grid grid-cols-[100px_1fr_160px_140px_120px_100px] px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : a.id)}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.time}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(a.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.client}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{a.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{a.vehicle}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{a.plate}</p>
                    </div>
                    <div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      {a.status === 'PENDING' && (
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded hover:bg-primary-100 font-medium"
                        >
                          Confirmer
                        </button>
                      )}
                      {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                  {isExpanded && a.notes && (
                    <div className="px-4 pb-3 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-1">Notes :</p>
                      <p className="text-sm text-gray-700">{a.notes}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">{filtered.length} rendez-vous</p>
      </main>
    </div>
  )
}
