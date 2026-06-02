'use client'

import Link from 'next/link'
import { IconSearch, IconMapPin, IconStar, IconShieldCheck, IconClock, IconArrowRight, IconPhone } from '@tabler/icons-react'
import { useLang, LangToggle } from './LangToggle'

const SERVICES = [
  { label:'Vidange',       nlLabel:'Olieverversing', icon:'🛢️' },
  { label:'Freins',        nlLabel:'Remmen',         icon:'🔧' },
  { label:'Pneus',         nlLabel:'Banden',         icon:'🔄' },
  { label:'Révision',      nlLabel:'Revisie',        icon:'🔍' },
  { label:'Diagnostic',    nlLabel:'Diagnose',       icon:'💡' },
  { label:'Climatisation', nlLabel:'Airco',          icon:'❄️' },
  { label:'Embrayage',     nlLabel:'Koppeling',      icon:'⚙️' },
  { label:'Carrosserie',   nlLabel:'Carrosserie',    icon:'🚗' },
]

const STEPS_FR = [
  { n:'1', title:'Recherchez', desc:'Entrez votre ville et sélectionnez le service dont vous avez besoin.', icon:'🔍' },
  { n:'2', title:'Comparez',   desc:'Consultez les avis, les prix et les disponibilités en temps réel.',    icon:'⚖️' },
  { n:'3', title:'Réservez',   desc:'Choisissez votre créneau et confirmez en quelques secondes.',          icon:'✅' },
]
const STEPS_NL = [
  { n:'1', title:'Zoeken',      desc:'Voer uw stad in en selecteer de dienst die u nodig hebt.',         icon:'🔍' },
  { n:'2', title:'Vergelijken', desc:'Bekijk beoordelingen, prijzen en beschikbaarheid in realtime.',    icon:'⚖️' },
  { n:'3', title:'Reserveren',  desc:'Kies uw tijdslot en bevestig in enkele seconden.',                 icon:'✅' },
]

function StarRow({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-3 h-3" fill={i<=n?'#EF9F27':'#E5E7EB'} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  )
}

interface Props {
  garages:          any[]
  garageCount:      number
  appointmentCount: number
  cityCount:        number
}

export function LandingBody({ garages, garageCount, appointmentCount, cityCount }: Props) {
  const { lang } = useLang()
  const nl = lang === 'nl'

  const STEPS = nl ? STEPS_NL : STEPS_FR

  const T = {
    badge:        nl ? '✓ 200+ geverifieerde garages in België' : '✓ 200+ garages vérifiés en Belgique',
    heroTitle:    nl ? 'Uw garagist,\nop één klik.' : 'Votre garagiste,\nà portée de clic.',
    heroSub:      nl ? 'Vind, vergelijk en boek uw garagist online.\nOlieverversing, remmen, revisie — kies uw tijdslot direct.'
                     : 'Trouvez, comparez et réservez votre garagiste en ligne.\nVidange, freins, révision — choisissez votre créneau directement.',
    searchCity:   nl ? 'Stad of gemeente (bv. Brussel)' : 'Ville ou commune (ex: Bruxelles)',
    searchSvc:    nl ? 'Alle diensten'       : 'Tous les services',
    searchBtn:    nl ? 'Zoeken'              : 'Rechercher',
    quickSearch:  nl ? 'Snel zoeken:'        : 'Recherche rapide :',
    statLabels:   nl ? ['Geverifieerde garages','Gemiddelde score','Afspraken','Steden']
                     : ['Garages vérifiés','Note moyenne','RDV pris','Villes couvertes'],
    garagesTitle: nl ? 'Beschikbare garages' : 'Garages disponibles',
    garagesSub:   nl ? 'Gesorteerd op beoordeling' : 'Triés par note',
    seeAll:       nl ? 'Alles zien'          : 'Voir tout',
    dispo:        nl ? 'Beschikbaar'         : 'Dispo',
    newGarage:    nl ? 'Nieuwe garage'       : 'Nouveau garage',
    reserve:      nl ? 'Reserveren →'        : 'Réserver →',
    reviewWord:   nl ? 'beoordelingen'       : 'avis',
    howTitle:     nl ? 'Hoe werkt het?'      : 'Comment ça marche ?',
    howSub:       nl ? 'Boek uw afspraak in 3 eenvoudige stappen' : 'Réservez votre rendez-vous en 3 étapes simples',
    whyTitle:     nl ? 'Waarom MonGaragiste?' : 'Pourquoi MonGaragiste ?',
    whyCards:     nl ? [
      { title:'Geverifieerde garages', desc:'Elke garage wordt gecontroleerd: verzekering, erkenning en echte klantbeoordelingen.' },
      { title:'Realtime beschikbaar',  desc:'Bekijk beschikbare tijdslots en boek direct, 24/7.' },
      { title:'Gecertificeerde reviews', desc:'Beoordelingen worden alleen achtergelaten door klanten die een effectieve afspraak hadden.' },
    ] : [
      { title:'Garages vérifiés',      desc:'Chaque garage est contrôlé : assurance, agrément et avis clients authentiques.' },
      { title:'Dispo en temps réel',   desc:'Consultez les créneaux disponibles et réservez instantanément, 24h/24.' },
      { title:'Avis certifiés',        desc:'Les avis sont uniquement laissés par des clients ayant eu un RDV effectif.' },
    ],
    proTitle:     nl ? 'Bent u een garagist?' : 'Vous êtes garagiste ?',
    proSub:       nl ? 'Sluit u aan bij MonGaragiste en beheer uw afspraken online. Slimme agenda, automatische herinneringen, statistieken — alles in één.'
                     : 'Rejoignez MonGaragiste et gérez vos rendez-vous en ligne. Agenda intelligent, rappels automatiques, statistiques — tout en un.',
    proBtn:       nl ? 'Mijn garage registreren' : 'Inscrire mon garage gratuitement',
    proLogin:     nl ? 'Al geregistreerd? Inloggen' : 'Déjà inscrit ? Connexion',
    navSearch:    nl ? 'Garage vinden'      : 'Trouver un garage',
    navPro:       nl ? 'Bent u garagist?'   : 'Êtes-vous garagiste ?',
    navLogin:     nl ? 'Inloggen'           : 'Connexion',
    navRegister:  nl ? 'Garage registreren' : 'Inscrire mon garage',
    footerTagline:nl ? '— Uw garagist, op één klik.' : '— Votre garagiste, à portée de clic.',
    footerPro:    nl ? 'Voor garagisten'    : 'Pour les garagistes',
    footerLinks:  nl
      ? [{ label:'AVG', href:'/cgu' }, { label:'Privacy', href:'/confidentialite' }, { label:'Contact', href:'/contact' }]
      : [{ label:'CGU', href:'/cgu' }, { label:'Confidentialité', href:'/confidentialite' }, { label:'Contact', href:'/contact' }],
    copyright:    nl ? '© 2024 MonGaragiste' : '© 2024 MonGaragiste',
  }

  const STATS = [
    { value: garageCount > 0 ? `${garageCount}+` : '—', label: T.statLabels[0] },
    { value: '4.8★',                                      label: T.statLabels[1] },
    { value: appointmentCount > 0 ? `${appointmentCount}+` : '—', label: T.statLabels[2] },
    { value: cityCount > 0 ? `${cityCount}` : '—',       label: T.statLabels[3] },
  ]

  return (
    <div className="min-h-screen" style={{ background:'var(--color-background-secondary)' }}>

      {/* HEADER */}
      <header className="sticky top-0 z-30 h-14" style={{ background:'var(--color-background-primary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background:'#1D9E75' }}/>
            <span className="text-[15px] font-semibold" style={{ color:'var(--color-text-primary)' }}>MonGaragiste</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-[13px]" style={{ color:'var(--color-text-secondary)' }}>{T.navSearch}</Link>
            <Link href="/login" className="text-[13px]" style={{ color:'var(--color-text-secondary)' }}>{T.navLogin}</Link>
            <LangToggle />
            <Link href="/garagiste" className="px-4 py-2 rounded-lg text-[13px] font-medium text-white" style={{ background:'#1D9E75' }}>
              {T.navRegister}
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background:'#085041' }}>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium mb-6"
            style={{ background:'rgba(29,158,117,0.3)', color:'#9FE1CB' }}>
            {T.badge}
          </div>
          <h1 className="text-[40px] font-bold leading-tight mb-4 text-white">
            {T.heroTitle.split('\n').map((line, i) => <span key={i}>{line}{i===0 && <br/>}</span>)}
          </h1>
          <p className="text-[16px] mb-10" style={{ color:'#9FE1CB' }}>
            {T.heroSub.split('\n').map((line, i) => <span key={i}>{line}{i===0 && <br/>}</span>)}
          </p>
          <div className="bg-white rounded-xl p-2 flex gap-2 max-w-2xl mx-auto shadow-lg">
            <div className="flex-1 flex items-center gap-2 px-3 min-w-0">
              <IconMapPin size={16} style={{ color:'#9CA3AF', flexShrink:0 }}/>
              <input type="text" placeholder={T.searchCity}
                className="flex-1 text-[13px] bg-transparent focus:outline-none min-w-0" style={{ color:'#111' }}/>
            </div>
            <div className="w-px bg-gray-200"/>
            <div className="flex-1 flex items-center gap-2 px-3 min-w-0">
              <IconSearch size={16} style={{ color:'#9CA3AF', flexShrink:0 }}/>
              <select className="flex-1 text-[13px] bg-transparent focus:outline-none appearance-none cursor-pointer min-w-0" style={{ color:'#6B7280' }}>
                <option value="">{T.searchSvc}</option>
                {SERVICES.map(s => <option key={s.label} value={s.label}>{nl ? s.nlLabel : s.label}</option>)}
              </select>
            </div>
            <Link href="/search" className="px-5 py-2.5 rounded-lg text-[13px] font-medium text-white flex-shrink-0" style={{ background:'#1D9E75' }}>
              {T.searchBtn}
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-[20px] font-bold text-white">{s.value}</p>
                <p className="text-[11px]" style={{ color:'#9FE1CB' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES RAPIDES */}
      <section style={{ background:'var(--color-background-primary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-medium flex-shrink-0" style={{ color:'var(--color-text-tertiary)' }}>{T.quickSearch}</span>
            {SERVICES.map(s => (
              <Link key={s.label} href={`/search?service=${s.label}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                style={{ border:'0.5px solid var(--color-border-secondary)', color:'var(--color-text-secondary)', background:'var(--color-background-primary)', whiteSpace:'nowrap' }}>
                <span>{s.icon}</span> {nl ? s.nlLabel : s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GARAGES */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {garages.length > 0 && (
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-bold" style={{ color:'var(--color-text-primary)' }}>{T.garagesTitle}</h2>
              <p className="text-[13px] mt-1" style={{ color:'var(--color-text-secondary)' }}>{T.garagesSub}</p>
            </div>
            <Link href="/search" className="flex items-center gap-1 text-[13px] font-medium" style={{ color:'#1D9E75' }}>
              {T.seeAll} <IconArrowRight size={14}/>
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {garages.map(g => (
            <Link key={g.slug} href={`/garage/${g.slug}`}
              className="rounded-xl p-5 transition-all hover:shadow-sm group"
              style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden" style={{ background:'var(--color-primary-light)' }}>
                    {g.logoUrl
                      ? <img src={g.logoUrl} alt={g.name} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-lg">🔧</div>}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold leading-tight" style={{ color:'var(--color-text-primary)' }}>{g.name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color:'var(--color-text-tertiary)' }}>{g.address}, {g.city}</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background:'#E1F5EE', color:'#085041' }}>
                  {T.dispo}
                </span>
              </div>
              {g.reviewCount > 0 ? (
                <div className="flex items-center gap-1.5 mb-3">
                  <StarRow n={Math.round(g.rating)}/>
                  <span className="text-[12px] font-medium" style={{ color:'var(--color-text-primary)' }}>{g.rating.toFixed(1)}</span>
                  <span className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>({g.reviewCount} {T.reviewWord})</span>
                </div>
              ) : (
                <p className="text-[11px] mb-3" style={{ color:'var(--color-text-tertiary)' }}>{T.newGarage}</p>
              )}
              <div className="flex flex-wrap gap-1 mb-4">
                {g.services.slice(0,3).map((s: any) => (
                  <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background:'var(--color-background-secondary)', color:'var(--color-text-secondary)' }}>
                    {s.name}
                  </span>
                ))}
                {g.services.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background:'var(--color-background-secondary)', color:'var(--color-text-secondary)' }}>
                    +{g.services.length - 3}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-3" style={{ borderTop:'0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-1.5 text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>
                  <IconPhone size={12}/> {g.phone}
                </div>
                <span className="text-[12px] font-medium" style={{ color:'#1D9E75' }}>{T.reserve}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section style={{ background:'var(--color-background-primary)', borderTop:'0.5px solid var(--color-border-tertiary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-[22px] font-bold" style={{ color:'var(--color-text-primary)' }}>{T.howTitle}</h2>
            <p className="text-[14px] mt-2" style={{ color:'var(--color-text-secondary)' }}>{T.howSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map(s => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl" style={{ background:'var(--color-primary-light)' }}>
                  {s.icon}
                </div>
                <div className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mb-2 text-white" style={{ background:'#1D9E75' }}>{s.n}</div>
                <h3 className="text-[16px] font-semibold mb-2" style={{ color:'var(--color-text-primary)' }}>{s.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color:'var(--color-text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-[22px] font-bold text-center mb-10" style={{ color:'var(--color-text-primary)' }}>{T.whyTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {T.whyCards.map((c, i) => {
            const icons = [<IconShieldCheck key={0} size={22} style={{color:'#1D9E75'}}/>, <IconClock key={1} size={22} style={{color:'#1D9E75'}}/>, <IconStar key={2} size={22} style={{color:'#1D9E75'}}/>]
            return (
              <div key={c.title} className="rounded-xl p-5" style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background:'var(--color-primary-light)' }}>
                  {icons[i]}
                </div>
                <h3 className="text-[14px] font-semibold mb-1.5" style={{ color:'var(--color-text-primary)' }}>{c.title}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color:'var(--color-text-secondary)' }}>{c.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA GARAGISTE */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="rounded-2xl px-10 py-12 text-center" style={{ background:'#085041' }}>
          <h2 className="text-[26px] font-bold text-white mb-3">{T.proTitle}</h2>
          <p className="text-[14px] mb-8 max-w-md mx-auto" style={{ color:'#9FE1CB' }}>{T.proSub}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/register/garage" className="px-6 py-3 rounded-xl text-[14px] font-semibold" style={{ background:'#fff', color:'#085041' }}>
              {T.proBtn}
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-xl text-[14px] font-medium text-white" style={{ border:'0.5px solid rgba(255,255,255,0.3)' }}>
              {T.proLogin}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'var(--color-background-primary)', borderTop:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background:'#1D9E75' }}/>
            <span className="text-[13px] font-semibold" style={{ color:'var(--color-text-primary)' }}>MonGaragiste</span>
            <span className="text-[12px]" style={{ color:'var(--color-text-tertiary)' }}>{T.footerTagline}</span>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            {T.footerLinks.map(l => (
              <Link key={l.href} href={l.href} className="text-[12px]" style={{ color:'var(--color-text-tertiary)' }}>{l.label}</Link>
            ))}
            <Link href="/garagiste" className="text-[12px] font-medium" style={{ color:'#1D9E75' }}>{T.footerPro}</Link>
          </div>
          <p className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>{T.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
