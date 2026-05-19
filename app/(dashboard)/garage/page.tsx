import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Badge, statusToBadge } from '@/components/ui/Badge'
import Link from 'next/link'

const metrics = [
  { label: 'RDV aujourd\'hui', value: '6', delta: '+2 vs hier', positive: true },
  { label: 'RDV cette semaine', value: '28', delta: '+5 vs semaine dernière', positive: true },
  { label: 'Chiffre du mois', value: '3 840 €', delta: '+12%', positive: true },
  { label: 'Note moyenne', value: '4.8 ★', delta: '37 avis', positive: true },
]

const todayAppts = [
  { id: '1', time: '09:00', client: 'Martin Dupont', service: 'Vidange', vehicle: 'Renault Clio', status: 'CONFIRMED' },
  { id: '2', time: '10:30', client: 'Sophie Lambert', service: 'Freins avant', vehicle: 'Peugeot 308', status: 'IN_PROGRESS' },
  { id: '3', time: '14:00', client: 'Jean Moreau', service: 'Révision 30 000 km', vehicle: 'Citroën C3', status: 'CONFIRMED' },
  { id: '4', time: '15:30', client: 'Marie Fontaine', service: 'Pneus', vehicle: 'VW Golf', status: 'PENDING' },
  { id: '5', time: '17:00', client: 'Pierre Bernard', service: 'Diagnostic', vehicle: 'BMW 320d', status: 'CONFIRMED' },
]

const notifications = [
  { id: '1', type: 'NEW_APPOINTMENT', message: 'Nouveau RDV — Émilie Renard — Vidange — Demain 09:00', time: 'Il y a 5 min', read: false },
  { id: '2', type: 'NEW_REVIEW', message: 'Sophie Lambert vous a laissé 5 étoiles ★★★★★', time: 'Il y a 1h', read: false },
  { id: '3', type: 'APPOINTMENT_CONFIRMED', message: 'RDV confirmé — Jean Moreau — Lundi 14:00', time: 'Il y a 2h', read: true },
]

const quickActions = [
  { href: '/garage/agenda', label: 'Voir l\'agenda', icon: '📅' },
  { href: '/garage/appointments', label: 'Tous les RDV', icon: '📋' },
  { href: '/garage/clients', label: 'Mes clients', icon: '👥' },
  { href: '/garage/settings', label: 'Paramètres', icon: '⚙️' },
]

export default function GarageDashboard() {
  const now = new Date()
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  const dateStr = `${dayNames[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Tableau de bord" />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Bonjour, Garage Dubois 👋</h2>
            <p className="text-sm text-gray-500 mt-0.5">{dateStr}</p>
          </div>
          <Link
            href="/garage/agenda"
            className="text-sm bg-primary-400 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors font-medium"
          >
            Voir l'agenda
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <p className="text-xs text-gray-500 font-medium">{m.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
              <p className={`text-xs mt-1 ${m.positive ? 'text-primary-600' : 'text-red-500'}`}>{m.delta}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's appointments */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Rendez-vous d'aujourd'hui</h3>
              <Link href="/garage/appointments" className="text-sm text-primary-400 hover:text-primary-600">Voir tout</Link>
            </div>
            <Card padding="none">
              <div className="divide-y divide-gray-50">
                {todayAppts.map((a) => {
                  const badge = statusToBadge(a.status)
                  return (
                    <div key={a.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="w-14 text-center flex-shrink-0">
                        <p className="text-sm font-semibold text-gray-900">{a.time}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{a.client}</p>
                        <p className="text-xs text-gray-500 truncate">{a.service} — {a.vehicle}</p>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <div className="flex gap-1">
                        {a.status === 'PENDING' && (
                          <button className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded hover:bg-primary-100 transition-colors font-medium">
                            Confirmer
                          </button>
                        )}
                        <button className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                          ✕
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Right column: notifications + quick actions */}
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
              <Card padding="none">
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 ${!n.read ? 'bg-primary-50/40' : ''}`}>
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-gray-700 leading-snug">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                        {!n.read && <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1 flex-shrink-0" />}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Actions rapides</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="bg-white border border-gray-100 rounded-lg p-3 hover:border-primary-200 hover:bg-primary-50 transition-colors text-center"
                  >
                    <span className="text-xl">{a.icon}</span>
                    <p className="text-xs font-medium text-gray-700 mt-1 leading-tight">{a.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
