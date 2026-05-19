import Link from 'next/link'
import { GarageCard } from '@/components/GarageCard'

const featuredGarages = [
  {
    name: 'Garage Dubois & Fils',
    slug: 'garage-dubois-fils',
    city: 'Bruxelles',
    address: 'Rue de la Loi 42',
    rating: 4.8,
    reviewCount: 124,
    services: ['Vidange', 'Freins', 'Révision', 'Pneus', 'Climatisation'],
    phone: '+32 2 123 45 67',
    nextSlot: 'Aujourd\'hui 14:30',
  },
  {
    name: 'Auto Expert Molenbeek',
    slug: 'auto-expert-molenbeek',
    city: 'Molenbeek',
    address: 'Chaussée de Ninove 88',
    rating: 4.6,
    reviewCount: 87,
    services: ['Freins', 'Révision', 'Diagnostic', 'Embrayage'],
    phone: '+32 2 456 78 90',
    nextSlot: 'Demain 09:00',
  },
  {
    name: 'Garage Léonard',
    slug: 'garage-leonard',
    city: 'Ixelles',
    address: 'Avenue Louise 210',
    rating: 4.9,
    reviewCount: 211,
    services: ['Vidange', 'Pneus', 'Révision', 'Carrosserie'],
    phone: '+32 2 789 01 23',
    nextSlot: 'Aujourd\'hui 16:00',
  },
  {
    name: 'Mécanique Centrale Anderlecht',
    slug: 'mecanique-centrale-anderlecht',
    city: 'Anderlecht',
    address: 'Rue Wayez 135',
    rating: 4.4,
    reviewCount: 63,
    services: ['Freins', 'Vidange', 'Climatisation', 'Diagnostic'],
    phone: '+32 2 321 98 76',
  },
  {
    name: 'Garage Van den Berg',
    slug: 'garage-van-den-berg',
    city: 'Schaerbeek',
    address: 'Boulevard Lambermont 74',
    rating: 4.7,
    reviewCount: 152,
    services: ['Révision', 'Pneus', 'Freins', 'Embrayage', 'Vidange'],
    phone: '+32 2 654 32 10',
    nextSlot: 'Aujourd\'hui 11:30',
  },
  {
    name: 'Quick Garage Uccle',
    slug: 'quick-garage-uccle',
    city: 'Uccle',
    address: 'Chaussée de Waterloo 892',
    rating: 4.5,
    reviewCount: 98,
    services: ['Vidange', 'Pneus', 'Freins'],
    phone: '+32 2 987 65 43',
    nextSlot: 'Demain 10:00',
  },
]

const services = [
  { label: 'Vidange', icon: '🛢️' },
  { label: 'Freins', icon: '🔧' },
  { label: 'Pneus', icon: '🔄' },
  { label: 'Révision', icon: '🔍' },
  { label: 'Climatisation', icon: '❄️' },
  { label: 'Diagnostic', icon: '💡' },
  { label: 'Embrayage', icon: '⚙️' },
  { label: 'Carrosserie', icon: '🚗' },
]

const steps = [
  {
    step: '1',
    title: 'Recherchez',
    desc: 'Entrez votre ville ou code postal et sélectionnez le service dont vous avez besoin.',
  },
  {
    step: '2',
    title: 'Choisissez',
    desc: 'Comparez les garages, leurs avis clients et leurs disponibilités en temps réel.',
  },
  {
    step: '3',
    title: 'Réservez',
    desc: 'Sélectionnez votre créneau et confirmez votre rendez-vous en quelques secondes.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
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
            <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Trouver un garage</Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Connexion</Link>
            <Link
              href="/register/garage"
              className="text-sm bg-primary-400 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors font-medium"
            >
              Inscrire mon garage
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-3">Votre garagiste, à portée de clic.</h1>
          <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">
            Trouvez et réservez un garagiste de confiance près de chez vous. Vidange, freins, révision — choisissez votre créneau directement en ligne.
          </p>

          <div className="bg-white rounded-xl p-2 flex gap-2 max-w-2xl mx-auto shadow-sm">
            <div className="flex-1 flex items-center gap-2 px-3">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input
                type="text"
                placeholder="Ville ou code postal"
                className="flex-1 text-sm text-gray-900 focus:outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="w-px bg-gray-200" />
            <div className="flex-1 flex items-center gap-2 px-3">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <select className="flex-1 text-sm text-gray-700 focus:outline-none bg-transparent">
                <option value="">Tous les services</option>
                {services.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
              </select>
            </div>
            <Link
              href="/search"
              className="bg-primary-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex-shrink-0"
            >
              Rechercher
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-primary-200">
            <span>✓ 200+ garages vérifiés</span>
            <span>✓ Réservation instantanée</span>
            <span>✓ 100% gratuit pour les clients</span>
          </div>
        </div>
      </section>

      {/* Services pills */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-gray-500 font-medium flex-shrink-0">Services :</span>
            {services.map((s) => (
              <Link
                key={s.label}
                href={`/search?service=${s.label}`}
                className="flex-shrink-0 flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 border border-gray-200 hover:border-primary-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <span>{s.icon}</span>
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured garages */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Garages disponibles</h2>
            <p className="text-sm text-gray-500 mt-0.5">Les meilleures garages près de chez vous</p>
          </div>
          <Link href="/search" className="text-sm text-primary-400 hover:text-primary-600 font-medium">
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredGarages.map((g) => (
            <GarageCard key={g.slug} {...g} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-gray-900">Comment ça marche ?</h2>
            <p className="text-sm text-gray-500 mt-1">Réservez votre rendez-vous en 3 étapes simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-sm">{s.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for garages */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-primary-800 rounded-xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Vous êtes garagiste ?</h2>
          <p className="text-primary-100 mb-6 max-w-md mx-auto text-sm">
            Rejoignez MonGaragiste et gérez vos rendez-vous en ligne. Agenda intelligent, rappels automatiques, gestion clients — tout en un.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/register/garage"
              className="bg-white text-primary-800 font-semibold px-6 py-3 rounded-lg text-sm hover:bg-primary-50 transition-colors"
            >
              Inscrire mon garage gratuitement
            </Link>
            <Link
              href="/login"
              className="border border-primary-400 text-white px-6 py-3 rounded-lg text-sm hover:bg-primary-700 transition-colors"
            >
              Déjà inscrit ? Connexion
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary-400 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700">MonGaragiste</span>
          </div>
          <p>© 2024 MonGaragiste — Votre garagiste, à portée de clic.</p>
        </div>
      </footer>
    </div>
  )
}
