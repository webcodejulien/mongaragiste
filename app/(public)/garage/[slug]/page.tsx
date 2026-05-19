'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookingModal } from '@/components/BookingModal'
import { Badge } from '@/components/ui/Badge'

const GARAGE_DATA: Record<string, {
  name: string
  slug: string
  city: string
  address: string
  zipCode: string
  phone: string
  description: string
  rating: number
  reviewCount: number
  services: { id: string; name: string; duration: number; price?: number }[]
  schedules: { day: string; open: string; close: string; closed: boolean }[]
  reviews: { author: string; rating: number; comment: string; date: string; service: string }[]
}> = {
  'garage-dubois-fils': {
    name: 'Garage Dubois & Fils',
    slug: 'garage-dubois-fils',
    city: 'Bruxelles',
    address: 'Rue de la Loi 42',
    zipCode: '1000',
    phone: '+32 2 123 45 67',
    description: 'Votre garagiste de confiance depuis 1985. Spécialiste toutes marques, nous vous accueillons dans notre atelier moderne pour tous vos besoins d\'entretien et de réparation automobile. Équipe qualifiée, diagnostic électronique, pièces d\'origine.',
    rating: 4.8,
    reviewCount: 124,
    services: [
      { id: '1', name: 'Vidange', duration: 30, price: 30 },
      { id: '2', name: 'Freins avant', duration: 60, price: 80 },
      { id: '3', name: 'Révision complète', duration: 90, price: 150 },
      { id: '4', name: 'Pneus (x4)', duration: 60, price: 80 },
      { id: '5', name: 'Diagnostic électronique', duration: 30, price: 50 },
      { id: '6', name: 'Climatisation', duration: 45, price: 65 },
    ],
    schedules: [
      { day: 'Lundi', open: '08:00', close: '18:00', closed: false },
      { day: 'Mardi', open: '08:00', close: '18:00', closed: false },
      { day: 'Mercredi', open: '08:00', close: '18:00', closed: false },
      { day: 'Jeudi', open: '08:00', close: '18:00', closed: false },
      { day: 'Vendredi', open: '08:00', close: '18:00', closed: false },
      { day: 'Samedi', open: '09:00', close: '13:00', closed: false },
      { day: 'Dimanche', open: '', close: '', closed: true },
    ],
    reviews: [
      { author: 'Martin D.', rating: 5, comment: 'Excellent service, travail soigné et prix honnêtes. Je recommande vivement !', date: '12 jan 2024', service: 'Révision' },
      { author: 'Sophie L.', rating: 5, comment: 'Très professionnel, délai respecté et explication claire du travail effectué.', date: '08 jan 2024', service: 'Freins' },
      { author: 'Jean M.', rating: 4, comment: 'Bon garage, personnel accueillant. Petit délai d\'attente mais qualité au rendez-vous.', date: '03 jan 2024', service: 'Vidange' },
      { author: 'Marie F.', rating: 5, comment: 'Prise en charge rapide, devis transparent. Mon garage de confiance désormais.', date: '28 déc 2023', service: 'Pneus' },
    ],
  },
}

const DEFAULT_GARAGE = GARAGE_DATA['garage-dubois-fils']

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`${size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'} ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function GarageProfilePage({ params }: { params: { slug: string } }) {
  const garage = GARAGE_DATA[params.slug] ?? DEFAULT_GARAGE
  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-400 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">MonGaragiste</span>
          </Link>
          <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900">← Retour aux résultats</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <div className="bg-white border border-gray-100 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">{garage.name}</h1>
                      <p className="text-sm text-gray-500 mt-0.5">{garage.address}, {garage.zipCode} {garage.city}</p>
                    </div>
                    <Badge variant="success">Actif</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <StarDisplay rating={garage.rating} size="lg" />
                    <span className="font-bold text-gray-900">{garage.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({garage.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <a href={`tel:${garage.phone}`} className="flex items-center gap-1.5 hover:text-primary-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {garage.phone}
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(garage.address + ' ' + garage.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      Voir sur la carte
                    </a>
                  </div>
                </div>
              </div>

              {garage.description && (
                <p className="text-sm text-gray-600 mt-5 leading-relaxed border-t border-gray-100 pt-4">{garage.description}</p>
              )}
            </div>

            {/* Services */}
            <div className="bg-white border border-gray-100 rounded-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Services & tarifs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {garage.services.map((s) => (
                  <div key={s.id} className="flex items-center justify-between border border-gray-100 rounded p-3 hover:border-primary-200 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.duration} min</p>
                    </div>
                    {s.price && (
                      <span className="text-sm font-semibold text-gray-900">{s.price} €</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-gray-100 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Avis clients</h2>
                <div className="flex items-center gap-2">
                  <StarDisplay rating={garage.rating} />
                  <span className="text-sm font-bold text-gray-900">{garage.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">/ 5</span>
                </div>
              </div>
              <div className="space-y-4">
                {garage.reviews.map((r, i) => (
                  <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold">
                          {r.author.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{r.author}</span>
                      </div>
                      <span className="text-xs text-gray-500">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarDisplay rating={r.rating} />
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{r.service}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-lg p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-1">Prendre rendez-vous</h3>
              <p className="text-sm text-gray-500 mb-4">Prochain créneau disponible : <span className="text-primary-600 font-medium">Aujourd'hui 14:30</span></p>

              <button
                onClick={() => setBookingOpen(true)}
                className="w-full bg-primary-400 text-white font-medium py-3 rounded hover:bg-primary-600 transition-colors mb-4"
              >
                Réserver en ligne
              </button>

              <div className="space-y-1.5">
                <a
                  href={`tel:${garage.phone}`}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Appeler le garage
                </a>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Horaires</p>
                <div className="space-y-1.5">
                  {garage.schedules.map((s) => (
                    <div key={s.day} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{s.day}</span>
                      {s.closed ? (
                        <span className="text-red-400 font-medium">Fermé</span>
                      ) : (
                        <span className="text-gray-900 font-medium">{s.open} – {s.close}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bookingOpen && (
        <BookingModal
          garageName={garage.name}
          garageSlug={garage.slug}
          services={garage.services}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  )
}
