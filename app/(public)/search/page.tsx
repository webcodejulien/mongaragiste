'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { IconSearch, IconMapPin, IconStar, IconClock, IconAdjustments, IconLoader2 } from '@tabler/icons-react'

const SORT_OPTIONS = [
  { value: 'rating',  label: 'Mieux notés' },
  { value: 'reviews', label: 'Plus d\'avis' },
  { value: 'price',   label: 'Prix croissant' },
]

function Stars({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} fill={i <= n ? '#EF9F27' : '#E5E7EB'} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  )
}

function SearchContent() {
  const params = useSearchParams()

  const [query,       setQuery]       = useState(params.get('q')       || '')
  const [city,        setCity]        = useState(params.get('city')    || '')
  const [service,     setService]     = useState(params.get('service') || '')
  const [sort,        setSort]        = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  const [garages,  setGarages]  = useState<any[]>([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [services, setServices] = useState<string[]>([])
  const [cities,   setCities]   = useState<string[]>([])

  /* Autocomplétion ville */
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestRef = useRef<HTMLDivElement>(null)

  const citySuggestions = query.length >= 1
    ? cities.filter(c => c.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : []

  /* Fetch depuis la vraie API */
  useEffect(() => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (city)    qs.set('city',    city)
    if (service) qs.set('service', service)
    qs.set('limit', '50')

    fetch(`/api/garages?${qs}`)
      .then(r => r.json())
      .then(d => {
        const list: any[] = Array.isArray(d.garages) ? d.garages : []

        /* Filtrage local par nom + tri */
        const filtered = list.filter(g => {
          if (!query) return true
          const q = query.toLowerCase()
          return g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q)
        })

        const sorted = [...filtered].sort((a, b) => {
          if (sort === 'rating')  return (b.rating ?? 0) - (a.rating ?? 0)
          if (sort === 'reviews') return (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
          if (sort === 'price') {
            const aMin = Math.min(...(a.services ?? []).map((s: any) => s.price ?? 9999))
            const bMin = Math.min(...(b.services ?? []).map((s: any) => s.price ?? 9999))
            return aMin - bMin
          }
          return 0
        })

        setGarages(sorted)
        setTotal(d.total ?? sorted.length)

        /* Extraire les villes et services uniques pour les filtres */
        const allCities   = Array.from(new Set(list.map(g => g.city).filter(Boolean))) as string[]
        const allServices = Array.from(new Set(list.flatMap(g => (g.services ?? []).map((s: any) => s.name)).filter(Boolean))) as string[]
        setCities(allCities.sort())
        setServices(allServices.sort())
      })
      .finally(() => setLoading(false))
  }, [city, service, query, sort])

  /* Fermer la liste si clic en dehors */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function clear() { setQuery(''); setCity(''); setService('') }
  const hasFilters = !!(city || service)

  /* Calcul ouvert/fermé en temps réel */
  function isOpenNow(g: any): boolean | null {
    const schedules: any[] = g.schedules ?? []
    if (!schedules.length) return null
    const now = new Date()
    const jsDay = now.getDay()          // 0=dim
    const appDay = jsDay === 0 ? 7 : jsDay  // 1=lun…7=dim
    const sched = schedules.find((s: any) => s.dayOfWeek === appDay)
    if (!sched) return null
    if (sched.isClosed) return false
    if (!sched.openTime || !sched.closeTime) return null
    const [oh, om] = sched.openTime.split(':').map(Number)
    const [ch, cm] = sched.closeTime.split(':').map(Number)
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const openMin = oh * 60 + om
    const closeMin = ch * 60 + cm
    return nowMin >= openMin && nowMin < closeMin
  }

  function priceFrom(g: any) {
    const prices = (g.services ?? []).map((s: any) => s.price).filter((p: any) => p != null && p > 0)
    return prices.length > 0 ? Math.min(...prices) : null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Barre de recherche */}
      <div className="rounded-xl p-2 flex gap-2 mb-6"
        style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="flex-1 flex items-center gap-2 px-3 relative" ref={suggestRef}>
          <IconSearch size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}/>
          <input value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true) }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Garage ou ville…"
            className="flex-1 text-[13px] bg-transparent focus:outline-none"
            style={{ color: 'var(--color-text-primary)' }}/>
          {/* Suggestions d'autocomplétion */}
          {showSuggestions && citySuggestions.length > 0 && (
            <div className="absolute left-0 top-full mt-1 w-full z-50 rounded-[10px] overflow-hidden shadow-md"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              {citySuggestions.map(c => (
                <button key={c}
                  onMouseDown={e => { e.preventDefault(); setCity(c); setQuery(c); setShowSuggestions(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors hover:bg-[var(--color-background-secondary)]"
                  style={{ color: 'var(--color-text-primary)' }}>
                  <IconMapPin size={12} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }}/>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-px" style={{ background: 'var(--color-border-tertiary)' }}/>
        <select value={service} onChange={e => setService(e.target.value)}
          className="flex-1 text-[13px] px-3 focus:outline-none bg-transparent"
          style={{ color: service ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
          <option value="">Tous les services</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowFilters(p => !p)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium flex-shrink-0 transition-colors"
          style={{
            background: showFilters ? '#E1F5EE' : 'var(--color-background-secondary)',
            color: showFilters ? '#085041' : 'var(--color-text-secondary)',
          }}>
          <IconAdjustments size={14}/> Filtres {hasFilters && '●'}
        </button>
      </div>

      {/* Filtres expandables */}
      {showFilters && (
        <div className="rounded-xl p-4 mb-6 flex flex-wrap gap-5"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          {cities.length > 0 && (
            <div>
              <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>Ville</p>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setCity('')}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors"
                  style={{ background: !city ? '#1D9E75' : 'var(--color-background-secondary)', color: !city ? '#fff' : 'var(--color-text-secondary)' }}>
                  Toutes
                </button>
                {cities.map(c => (
                  <button key={c} onClick={() => setCity(city === c ? '' : c)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors"
                    style={{ background: city === c ? '#1D9E75' : 'var(--color-background-secondary)', color: city === c ? '#fff' : 'var(--color-text-secondary)' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          {hasFilters && (
            <button onClick={clear} className="text-[12px] font-medium self-end" style={{ color: '#1D9E75' }}>
              Réinitialiser
            </button>
          )}
        </div>
      )}

      {/* Header résultats */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
          {loading ? 'Recherche…' : (
            <>
              <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{garages.length}</span>
              {' '}garage{garages.length !== 1 ? 's' : ''} trouvé{garages.length !== 1 ? 's' : ''}
              {service && <> pour <strong>{service}</strong></>}
            </>
          )}
        </p>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="text-[12px] px-3 py-1.5 rounded-lg focus:outline-none"
          style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-secondary)' }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-28 rounded-xl animate-pulse"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}/>
          ))}
        </div>
      ) : garages.length === 0 ? (
        <div className="rounded-xl py-16 text-center"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          <p className="text-[14px] font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Aucun garage trouvé</p>
          <p className="text-[12px] mb-4" style={{ color: 'var(--color-text-secondary)' }}>Essayez d'élargir vos critères</p>
          <button onClick={clear} className="text-[13px] font-medium" style={{ color: '#1D9E75' }}>Réinitialiser les filtres</button>
        </div>
      ) : (
        <div className="space-y-3">
          {garages.map(g => {
            const pf = priceFrom(g)
            const svcNames: string[] = (g.services ?? []).map((s: any) => s.name)
            return (
              <Link key={g.slug} href={`/garage/${g.slug}`}
                className="flex items-center gap-5 p-5 rounded-xl transition-all hover:shadow-sm block"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>

                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'var(--color-primary-light)' }}>🔧</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <p className="text-[15px] font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{g.name}</p>
                    {(() => {
                      const open = isOpenNow(g)
                      if (open === true)  return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: '#E1F5EE', color: '#085041' }}>Ouvert</span>
                      if (open === false) return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: '#FCEBEB', color: '#A32D2D' }}>Fermé</span>
                      return null
                    })()}
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <IconMapPin size={11} style={{ color: 'var(--color-text-tertiary)' }}/>
                    <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {g.address}, {g.city}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {svcNames.slice(0, 4).map((s: string) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}>{s}</span>
                    ))}
                    {svcNames.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--color-background-secondary)', color: 'var(--color-text-tertiary)' }}>
                        +{svcNames.length - 4}
                      </span>
                    )}
                    {svcNames.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                        {svcNames.length} service{svcNames.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  {(g.reviewCount ?? 0) > 0 ? (
                    <div className="flex items-center gap-1.5 justify-end mb-1">
                      <Stars n={Math.round(g.rating ?? 0)}/>
                      <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {(g.rating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>({g.reviewCount} avis)</span>
                    </div>
                  ) : (
                    <p className="text-[11px] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Aucun avis</p>
                  )}
                  <p className="text-[11px] mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    {g.phone}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    {pf != null && (
                      <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        dès <strong style={{ color: 'var(--color-text-primary)' }}>{pf}€</strong>
                      </span>
                    )}
                    <span className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white" style={{ background: '#1D9E75' }}>
                      Réserver
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background-secondary)' }}>
      <header className="sticky top-0 z-30 h-14"
        style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#1D9E75' }}/>
            <span className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>MonGaragiste</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Connexion</Link>
            <Link href="/register/garage" className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white" style={{ background: '#1D9E75' }}>
              Inscrire mon garage
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <h1 className="text-[20px] font-bold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>Trouver un garage</h1>
        <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Comparez et réservez en quelques clics</p>
      </div>

      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center gap-2 text-[13px]"
          style={{ color: 'var(--color-text-secondary)' }}>
          <IconLoader2 size={16} className="animate-spin"/> Chargement…
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  )
}
