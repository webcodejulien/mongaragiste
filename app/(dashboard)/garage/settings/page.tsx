'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const ALL_SERVICES = [
  'Vidange', 'Freins', 'Pneus', 'Révision', 'Climatisation',
  'Diagnostic', 'Embrayage', 'Carrosserie', 'Pare-brise', 'Batterie',
  'Distribution', 'Échappement', 'Suspension', 'Direction', 'Électricité',
]

const initialSchedules = [
  { dayOfWeek: 1, openTime: '08:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 2, openTime: '08:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 3, openTime: '08:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 4, openTime: '08:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 5, openTime: '08:00', closeTime: '18:00', isClosed: false },
  { dayOfWeek: 6, openTime: '09:00', closeTime: '13:00', isClosed: false },
  { dayOfWeek: 7, openTime: '09:00', closeTime: '12:00', isClosed: true },
]

const initialServices = [
  { id: '1', name: 'Vidange', duration: 30, price: 30 },
  { id: '2', name: 'Freins avant', duration: 60, price: 80 },
  { id: '3', name: 'Révision complète', duration: 90, price: 150 },
  { id: '4', name: 'Pneus (x4)', duration: 60, price: 80 },
  { id: '5', name: 'Diagnostic électronique', duration: 30, price: 50 },
]

type Tab = 'info' | 'schedule' | 'services' | 'notifications'

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('info')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [info, setInfo] = useState({
    name: 'Garage Dubois & Fils',
    phone: '+32 2 123 45 67',
    address: 'Rue de la Loi 42',
    city: 'Bruxelles',
    zipCode: '1000',
    description: 'Votre garagiste de confiance depuis 1985. Spécialiste toutes marques.',
  })

  const [schedules, setSchedules] = useState(initialSchedules)
  const [services, setServices] = useState(initialServices)
  const [notifSettings, setNotifSettings] = useState({
    newAppointmentEmail: true,
    newAppointmentSMS: false,
    reminder24h: true,
    reminderSMS: false,
    reviewNotif: true,
  })
  const [newService, setNewService] = useState({ name: '', duration: 60, price: '' })
  const [addingService, setAddingService] = useState(false)

  function updateInfo(field: string, value: string) {
    setInfo((p) => ({ ...p, [field]: value }))
  }

  function updateSchedule(idx: number, field: string, value: string | boolean) {
    setSchedules((p) => p.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  function removeService(id: string) {
    setServices((p) => p.filter((s) => s.id !== id))
  }

  function addService() {
    if (!newService.name) return
    setServices((p) => [...p, { id: Date.now().toString(), name: newService.name, duration: newService.duration, price: parseFloat(newService.price) || 0 }])
    setNewService({ name: '', duration: 60, price: '' })
    setAddingService(false)
  }

  async function save() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'info', label: 'Informations' },
    { id: 'schedule', label: 'Horaires' },
    { id: 'services', label: 'Services & tarifs' },
    { id: 'notifications', label: 'Notifications' },
  ]

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Paramètres" />
      <main className="flex-1 p-6 max-w-3xl">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 mb-6 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tab === t.id ? 'bg-primary-400 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'info' && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-5">Informations du garage</h3>
            <div className="space-y-4">
              <Input
                label="Nom du garage"
                value={info.name}
                onChange={(e) => updateInfo('name', e.target.value)}
              />
              <Input
                label="Téléphone"
                value={info.phone}
                onChange={(e) => updateInfo('phone', e.target.value)}
              />
              <Input
                label="Adresse"
                value={info.address}
                onChange={(e) => updateInfo('address', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Ville"
                  value={info.city}
                  onChange={(e) => updateInfo('city', e.target.value)}
                />
                <Input
                  label="Code postal"
                  value={info.zipCode}
                  onChange={(e) => updateInfo('zipCode', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={info.description}
                  onChange={(e) => updateInfo('description', e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>
            </div>
          </Card>
        )}

        {tab === 'schedule' && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-5">Horaires d'ouverture</h3>
            <div className="space-y-3">
              {DAYS.map((day, i) => (
                <div key={day} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`open-${i}`}
                    checked={!schedules[i].isClosed}
                    onChange={(e) => updateSchedule(i, 'isClosed', !e.target.checked)}
                    className="rounded border-gray-300 text-primary-400 focus:ring-primary-400"
                  />
                  <label htmlFor={`open-${i}`} className="w-24 text-sm font-medium text-gray-700">{day}</label>
                  {!schedules[i].isClosed ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={schedules[i].openTime}
                        onChange={(e) => updateSchedule(i, 'openTime', e.target.value)}
                        className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                      <span className="text-sm text-gray-400">–</span>
                      <input
                        type="time"
                        value={schedules[i].closeTime}
                        onChange={(e) => updateSchedule(i, 'closeTime', e.target.value)}
                        className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Fermé</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === 'services' && (
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Services & tarifs</h3>
              <Button size="sm" onClick={() => setAddingService(true)} variant="outline">
                + Ajouter
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-[1fr_80px_80px_40px] text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-1.5 bg-gray-50 rounded">
                <span>Service</span>
                <span className="text-center">Durée</span>
                <span className="text-center">Prix</span>
                <span />
              </div>
              {services.map((s) => (
                <div key={s.id} className="grid grid-cols-[1fr_80px_80px_40px] items-center border border-gray-100 rounded px-3 py-2.5">
                  <span className="text-sm font-medium text-gray-900">{s.name}</span>
                  <span className="text-sm text-gray-600 text-center">{s.duration} min</span>
                  <span className="text-sm text-gray-600 text-center">{s.price} €</span>
                  <button
                    onClick={() => removeService(s.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {addingService && (
              <div className="border border-primary-200 bg-primary-50 rounded p-4 space-y-3">
                <p className="text-sm font-medium text-gray-900">Nouveau service</p>
                <div className="grid grid-cols-[1fr_90px_90px] gap-2">
                  <Input
                    placeholder="Nom du service"
                    value={newService.name}
                    onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Durée (min)"
                    value={newService.duration}
                    onChange={(e) => setNewService((p) => ({ ...p, duration: parseInt(e.target.value) }))}
                  />
                  <Input
                    type="number"
                    placeholder="Prix (€)"
                    value={newService.price}
                    onChange={(e) => setNewService((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addService}>Ajouter</Button>
                  <Button size="sm" variant="ghost" onClick={() => setAddingService(false)}>Annuler</Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {tab === 'notifications' && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-5">Préférences de notifications</h3>
            <div className="space-y-4">
              {[
                { key: 'newAppointmentEmail', label: 'Nouvelle demande de RDV', sub: 'Par email', field: 'newAppointmentEmail' },
                { key: 'newAppointmentSMS', label: 'Nouvelle demande de RDV', sub: 'Par SMS', field: 'newAppointmentSMS' },
                { key: 'reminder24h', label: 'Rappel 24h avant le RDV', sub: 'Par email au client', field: 'reminder24h' },
                { key: 'reminderSMS', label: 'Rappel 24h avant le RDV', sub: 'Par SMS au client', field: 'reminderSMS' },
                { key: 'reviewNotif', label: 'Nouvel avis client', sub: 'Par email', field: 'reviewNotif' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{n.label}</p>
                    <p className="text-xs text-gray-500">{n.sub}</p>
                  </div>
                  <button
                    onClick={() => setNotifSettings((p) => ({ ...p, [n.field]: !p[n.field as keyof typeof p] }))}
                    className={`w-10 h-5.5 rounded-full transition-colors relative ${
                      notifSettings[n.field as keyof typeof notifSettings] ? 'bg-primary-400' : 'bg-gray-200'
                    }`}
                    style={{ height: '22px', width: '40px' }}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        notifSettings[n.field as keyof typeof notifSettings] ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="mt-5 flex items-center gap-3">
          <Button loading={saving} onClick={save}>
            Enregistrer les modifications
          </Button>
          {saved && <span className="text-sm text-primary-600 font-medium">✓ Modifications enregistrées</span>}
        </div>
      </main>
    </div>
  )
}
