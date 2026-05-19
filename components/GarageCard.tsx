import Link from 'next/link'
import { Badge } from './ui/Badge'

interface GarageCardProps {
  name: string
  slug: string
  city: string
  address: string
  rating: number
  reviewCount: number
  services: string[]
  phone: string
  nextSlot?: string
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-0.5">{rating.toFixed(1)} ({reviewCount})</span>
    </div>
  )
}

export function GarageCard({ name, slug, city, address, rating, reviewCount, services, phone, nextSlot }: GarageCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5 hover:border-primary-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{address}, {city}</p>
          </div>
        </div>
        {nextSlot && (
          <Badge variant="success">Dispo aujourd'hui</Badge>
        )}
      </div>

      <div className="mt-3">
        <StarRating rating={rating} reviewCount={reviewCount} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {services.slice(0, 3).map((s) => (
          <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
        ))}
        {services.length > 3 && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">+{services.length - 3}</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {nextSlot ? (
          <p className="text-xs text-gray-500">Prochain créneau : <span className="font-medium text-gray-700">{nextSlot}</span></p>
        ) : (
          <p className="text-xs text-gray-500">{phone}</p>
        )}
        <Link
          href={`/garage/${slug}`}
          className="text-sm font-medium text-primary-400 hover:text-primary-600 transition-colors"
        >
          Réserver →
        </Link>
      </div>
    </div>
  )
}
