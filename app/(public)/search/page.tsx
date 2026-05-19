'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { GarageCard } from '@/components/GarageCard'
import { Input } from '@/components/ui/Input'

const allGarages = [
  { name: 'Garage Dubois & Fils', slug: 'garage-dubois-fils', city: 'Bruxelles', address: 'Rue de la Loi 42', rating: 4.8, reviewCount: 124, services: ['Vidange', 'Freins', 'Révision', 'Pneus', 'Climatisation'], phone: '+32 2 123 45 67', nextSlot: 'Aujourd\'hui 14:30' },
  { name: 'Auto Expert Molenbeek', slug: 'auto-expert-molenbeek', city: 'Molenbeek', address: 'Chaussée de Ninove 88', rating: 4.6, reviewCount: 87, services: ['Freins', 'Révision', 'Diagnostic', 'Embrayage'], phone: '+32 2 456 78 90', nextSlot: 'Demain 09:00' },
  { name: 'Garage Léonard', slug: 'garage-leonard', city: 'Ixelles', address: 'Avenue Louise 210', rating: 4.9, reviewCount: 211, services: ['Vidange', 'Pneus', 'Révision', 'Carrosserie'], phone: '+32 2 789 01 23', nextSlot: 'Aujourd\'hui 16:00' },
  { name: 'Mécanique Centrale Anderlecht', slug: 'mecanique-centrale-anderlecht', city: 'Anderlecht', address: 'Rue Wayez 135', rating: 4.4, reviewCount: 63, services: ['Freins', 'Vidange', 'Climatisation', 'Diagnostic'], phone: '+32 2 321 98 76' },
  { name: 'Garage Van den Berg', slug: 'garage-van-den-berg', city: 'Schaerbeek', address: 'Boulevard Lambermont 74', rating: 4.7, reviewCount: 152, services: ['Révision', 'Pneus', 'Freins', 'Embrayage', 'Vidange'], phone: '+32 2 654 32 10', nextSlot: 'Aujourd\'hui 11:30' },
  { name: 'Quick Garage Uccle', slug: 'quick-garage-uccle', city: 'Uccle', address: 'Chaussée de Waterloo 892', rating: 4.5, reviewCount: 98, services: ['Vidange', 'Pneus', 'Freins'], phone: '+32 2 987 65 43', nextSlot: 'Demain 10:00' },
  { name: 'Garage Smeets Etterbeek', slug: 'garage-smeets-etterbeek', city: 'Etterbeek', address: 'Rue Beckers 14', rating: 4.3, reviewCount: 45, services: ['Freins', 'Embrayage', 'Distribution', 'Électricité'], phone: '+32 2 111 22 33' },
  { name: 'AutoTech Laeken', slug: 'autotech-laeken', city: 'Laeken', address: 'Avenue du Laerbeek 88', rating: 4.6, reviewCount: 78, services: ['Diagnostic', 'Révision', 'Vidange', 'Freins'], phone: '+32 2 444 55 66', nextSlot: 'Demain 14:00' },
]

const SERVICES_LIST = ['Vidange', 'Freins', 'Pneus', 'Révision', 'Climatisation', 'Diagnostic', 'Embrayage', 'Carrosserie']
const CITIES = ['Toutes', 'Bruxelles', 'Molenbeek', 'Ixelles', 'Anderlecht', 'Schaerbeek', 'Uccle', 'Etterbeek', 'Laeken']

function SearchContent() {
  const searchParams = useSearchParams()
  const [cityFilter, setCityFilter] = useState('Toutes')
  const [serviceFilter, setServiceFilter] = useState(searchParams.get('service') || '')
  const [availOnly, setAvailOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews'>('rating')
  const [query, setQuery] = useState('')

  const filtered = allGarages
    .filter((g) => {
      if (query && !g.name.toLowerCase().includes(query.toLowerCase()) && !g.city.toLowerCase().includes(query.toLowerCase())) return false
      if (cityFilter !== 'Toutes' && g.city !== cityFilter) return false
      if (serviceFilter && !g.services.includes(serviceFilter)) return false
      if (availOnly && !g.nextSlot) return false
      return true
    })
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : b.reviewCount - a.reviewCount)

  return (
    <div className="flex gap-6">
      {/* Filters sidebar */}
      <aside className="w-56 flex-shrink-0">
        <div className="bg-white border border-gray-100 rounded-lg p-4 sticky top-20 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Ville</p>
            <div className="space-y-1">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCityFilter(c)}
                  className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${cityFilter === c ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Service</p>
            <div className="space-y-1">
              <button
                onClick={() => setServiceFilter('')}
                className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${!serviceFilter ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Tous les services
              </button>
              {SERVICES_LIST.map((s) => (
                <button
                  key={s}
                  onClick={() => setServiceFilter(s === serviceFilter ? '' : s)}
                  className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${serviceFilter === s ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Disponibilité</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={availOnly}
                onChange={(e) => setAvailOnly(e.target.checked)}
                className="rounded border-gray-300 text-primary-400 focus:ring-primary-400"
              />
              <span className="text-sm text-gray-700">Disponible aujourd'hui</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un garage..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xs text-gray-500">Trier :</span>
            {(['rating', 'reviews'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-2.5 py-1.5 text-xs rounded border transition-colors ${sortBy === s ? 'bg-primary-400 text-white border-primary-400' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
              >
                {s === 'rating' ? 'Note' : 'Avis'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-900">{filtered.length}</span> garage{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          {serviceFilter && <span> pour <strong>{serviceFilter}</strong></span>}
          {cityFilter !== 'Toutes' && <span> à <strong>{cityFilter}</strong></span>}
        </p>

        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-2">Aucun garage trouvé avec ces critères.</p>
            <button
              onClick={() => { setCityFilter('Toutes'); setServiceFilter(''); setAvailOnly(false); setQuery('') }}
              className="text-sm text-primary-400 hover:text-primary-600 font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filtered.map((g) => (
              <GarageCard key={g.slug} {...g} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-400 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">MonGaragiste</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Connexion</Link>
            <Link href="/register/garage" className="text-sm bg-primary-400 text-white px-4 py-2 rounded hover:bg-primary-600 font-medium">
              Inscrire mon garage
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Trouver un garage</h1>
        <p className="text-sm text-gray-500 mb-6">Comparez et réservez votre garagiste en quelques clics</p>
        <Suspense fallback={<div className="text-sm text-gray-500">Chargement...</div>}>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  )
}
