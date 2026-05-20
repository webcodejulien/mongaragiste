'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { IconSearch, IconMapPin, IconStar, IconClock, IconAdjustments, IconArrowRight } from '@tabler/icons-react'

const GARAGES = [
  { name:'Garage Dubois & Fils',          slug:'garage-dubois-fils',          city:'Bruxelles',  zip:'1000', address:'Rue de la Loi 42',        rating:4.8, reviews:124, services:['Vidange','Freins','Révision','Pneus','Climatisation'], nextSlot:'Aujourd\'hui 14:30', priceFrom:30 },
  { name:'Garage Léonard',                slug:'garage-leonard',              city:'Ixelles',    zip:'1050', address:'Avenue Louise 210',        rating:4.9, reviews:211, services:['Vidange','Pneus','Révision','Carrosserie'],           nextSlot:'Aujourd\'hui 16:00', priceFrom:28 },
  { name:'Auto Expert Molenbeek',         slug:'auto-expert-molenbeek',       city:'Molenbeek',  zip:'1080', address:'Chaussée de Ninove 88',    rating:4.6, reviews:87,  services:['Freins','Révision','Diagnostic','Embrayage'],         nextSlot:'Demain 09:00',       priceFrom:35 },
  { name:'Garage Van den Berg',           slug:'garage-van-den-berg',         city:'Schaerbeek', zip:'1030', address:'Boulevard Lambermont 74',  rating:4.7, reviews:152, services:['Révision','Pneus','Freins','Embrayage','Vidange'],    nextSlot:'Aujourd\'hui 11:30', priceFrom:30 },
  { name:'Quick Garage Uccle',            slug:'quick-garage-uccle',          city:'Uccle',      zip:'1180', address:'Chaussée de Waterloo 892', rating:4.5, reviews:98,  services:['Vidange','Pneus','Freins'],                           nextSlot:null,                 priceFrom:25 },
  { name:'AutoTech Laeken',               slug:'autotech-laeken',             city:'Laeken',     zip:'1020', address:'Avenue du Laerbeek 88',    rating:4.6, reviews:78,  services:['Diagnostic','Révision','Vidange','Freins'],            nextSlot:'Demain 14:00',       priceFrom:50 },
  { name:'Mécanique Centrale Anderlecht', slug:'mecanique-centrale-anderlecht',city:'Anderlecht', zip:'1070', address:'Rue Wayez 135',           rating:4.4, reviews:63,  services:['Freins','Vidange','Climatisation','Diagnostic'],      nextSlot:null,                 priceFrom:30 },
  { name:'Garage Smeets Etterbeek',       slug:'garage-smeets-etterbeek',     city:'Etterbeek',  zip:'1040', address:'Rue Beckers 14',           rating:4.3, reviews:45,  services:['Freins','Embrayage','Distribution','Électricité'],    nextSlot:null,                 priceFrom:40 },
]

const SERVICES_LIST = ['Vidange','Freins','Pneus','Révision','Climatisation','Diagnostic','Embrayage','Carrosserie','Distribution','Électricité']
const CITIES = ['Bruxelles','Molenbeek','Ixelles','Anderlecht','Schaerbeek','Uccle','Etterbeek','Laeken']
const SORT_OPTIONS = [
  { value:'rating',  label:'Mieux notés' },
  { value:'reviews', label:'Plus d\'avis' },
  { value:'price',   label:'Prix croissant' },
  { value:'dispo',   label:'Disponibles en premier' },
]

function Stars({ n, size=12 }: { n:number; size?:number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} fill={i<=n?'#EF9F27':'#E5E7EB'} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  )
}

function SearchContent() {
  const params = useSearchParams()
  const [query, setQuery]       = useState('')
  const [city, setCity]         = useState('Toutes')
  const [service, setService]   = useState(params.get('service') || '')
  const [availOnly, setAvailOnly] = useState(false)
  const [sort, setSort]         = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  let results = GARAGES.filter(g => {
    if (query && !g.name.toLowerCase().includes(query.toLowerCase()) && !g.city.toLowerCase().includes(query.toLowerCase())) return false
    if (city !== 'Toutes' && g.city !== city) return false
    if (service && !g.services.includes(service)) return false
    if (availOnly && !g.nextSlot) return false
    return true
  }).sort((a,b) => {
    if (sort === 'rating')  return b.rating - a.rating
    if (sort === 'reviews') return b.reviews - a.reviews
    if (sort === 'price')   return a.priceFrom - b.priceFrom
    if (sort === 'dispo')   return (b.nextSlot?1:0) - (a.nextSlot?1:0)
    return 0
  })

  function clear() { setQuery(''); setCity('Toutes'); setService(''); setAvailOnly(false) }
  const hasFilters = city !== 'Toutes' || service || availOnly

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Barre de recherche */}
      <div className="rounded-xl p-2 flex gap-2 mb-6"
        style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="flex-1 flex items-center gap-2 px-3">
          <IconSearch size={14} style={{ color:'var(--color-text-tertiary)', flexShrink:0 }}/>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Garage ou ville…"
            className="flex-1 text-[13px] bg-transparent focus:outline-none"
            style={{ color:'var(--color-text-primary)' }}/>
        </div>
        <div className="w-px" style={{ background:'var(--color-border-tertiary)' }}/>
        <select value={service} onChange={e => setService(e.target.value)}
          className="flex-1 text-[13px] px-3 focus:outline-none bg-transparent"
          style={{ color: service ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
          <option value="">Tous les services</option>
          {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
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
          style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
          <div>
            <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{ color:'var(--color-text-tertiary)' }}>Ville</p>
            <div className="flex flex-wrap gap-1.5">
              {['Toutes', ...CITIES].map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors"
                  style={{
                    background: city===c ? '#1D9E75' : 'var(--color-background-secondary)',
                    color: city===c ? '#fff' : 'var(--color-text-secondary)',
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{ color:'var(--color-text-tertiary)' }}>Disponibilité</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)}
                className="rounded" style={{ accentColor:'#1D9E75' }}/>
              <span className="text-[12px]" style={{ color:'var(--color-text-secondary)' }}>Disponible aujourd'hui</span>
            </label>
          </div>
          {hasFilters && (
            <button onClick={clear} className="text-[12px] font-medium self-end" style={{ color:'#1D9E75' }}>
              Réinitialiser
            </button>
          )}
        </div>
      )}

      {/* Résultats header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px]" style={{ color:'var(--color-text-secondary)' }}>
          <span className="font-semibold" style={{ color:'var(--color-text-primary)' }}>{results.length}</span>
          {' '}garage{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
          {service && <> pour <strong>{service}</strong></>}
        </p>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="text-[12px] px-3 py-1.5 rounded-lg focus:outline-none"
          style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-primary)', color:'var(--color-text-secondary)' }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Liste résultats */}
      {results.length === 0 ? (
        <div className="rounded-xl py-16 text-center"
          style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
          <p className="text-[14px] font-medium mb-2" style={{ color:'var(--color-text-primary)' }}>Aucun garage trouvé</p>
          <p className="text-[12px] mb-4" style={{ color:'var(--color-text-secondary)' }}>Essayez d'élargir vos critères</p>
          <button onClick={clear} className="text-[13px] font-medium" style={{ color:'#1D9E75' }}>Réinitialiser les filtres</button>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(g => (
            <Link key={g.slug} href={`/garage/${g.slug}`}
              className="flex items-center gap-5 p-5 rounded-xl transition-all hover:shadow-sm"
              style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>

              {/* Icône */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background:'var(--color-primary-light)' }}>🔧</div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <p className="text-[15px] font-semibold truncate" style={{ color:'var(--color-text-primary)' }}>{g.name}</p>
                  {g.nextSlot && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background:'#E1F5EE', color:'#085041' }}>Dispo</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <IconMapPin size={11} style={{ color:'var(--color-text-tertiary)' }}/>
                  <span className="text-[12px]" style={{ color:'var(--color-text-secondary)' }}>{g.address}, {g.city}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {g.services.slice(0,4).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background:'var(--color-background-secondary)', color:'var(--color-text-secondary)' }}>{s}</span>
                  ))}
                  {g.services.length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:'var(--color-background-secondary)', color:'var(--color-text-tertiary)' }}>
                      +{g.services.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Droite */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1.5 justify-end mb-1">
                  <Stars n={Math.round(g.rating)}/>
                  <span className="text-[13px] font-semibold" style={{ color:'var(--color-text-primary)' }}>{g.rating}</span>
                  <span className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>({g.reviews})</span>
                </div>
                {g.nextSlot ? (
                  <div className="flex items-center gap-1 justify-end mb-3 text-[11px]" style={{ color:'var(--color-text-secondary)' }}>
                    <IconClock size={11}/> {g.nextSlot}
                  </div>
                ) : (
                  <p className="text-[11px] mb-3" style={{ color:'var(--color-text-tertiary)' }}>Sur RDV uniquement</p>
                )}
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>dès <strong style={{ color:'var(--color-text-primary)' }}>{g.priceFrom}€</strong></span>
                  <span className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white" style={{ background:'#1D9E75' }}>
                    Réserver
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen" style={{ background:'var(--color-background-secondary)' }}>
      <header className="sticky top-0 z-30 h-14" style={{ background:'var(--color-background-primary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background:'#1D9E75' }}/>
            <span className="text-[14px] font-semibold" style={{ color:'var(--color-text-primary)' }}>MonGaragiste</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-[13px]" style={{ color:'var(--color-text-secondary)' }}>Connexion</Link>
            <Link href="/register/garage" className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white" style={{ background:'#1D9E75' }}>
              Inscrire mon garage
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        <h1 className="text-[20px] font-bold mb-0.5" style={{ color:'var(--color-text-primary)' }}>Trouver un garage</h1>
        <p className="text-[13px]" style={{ color:'var(--color-text-secondary)' }}>Comparez et réservez en quelques clics</p>
      </div>

      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-4 py-12 text-center text-[13px]" style={{ color:'var(--color-text-secondary)' }}>
          Chargement…
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  )
}
