import Link from 'next/link'
import { IconSearch, IconMapPin, IconStar, IconShieldCheck, IconClock, IconArrowRight, IconPhone } from '@tabler/icons-react'
import { prisma } from '@/lib/prisma'

const SERVICES = [
  { label:'Vidange',       icon:'🛢️', desc:'Huile + filtres' },
  { label:'Freins',        icon:'🔧', desc:'Disques & plaquettes' },
  { label:'Pneus',         icon:'🔄', desc:'Montage & équilibrage' },
  { label:'Révision',      icon:'🔍', desc:'Contrôle complet' },
  { label:'Diagnostic',    icon:'💡', desc:'Lecture OBD' },
  { label:'Climatisation', icon:'❄️', desc:'Recharge & contrôle' },
  { label:'Embrayage',     icon:'⚙️', desc:'Remplacement' },
  { label:'Carrosserie',   icon:'🚗', desc:'Débosselage & peinture' },
]

const STEPS = [
  { n:'1', title:'Recherchez', desc:'Entrez votre ville et sélectionnez le service dont vous avez besoin.', icon:'🔍' },
  { n:'2', title:'Comparez',   desc:'Consultez les avis, les prix et les disponibilités en temps réel.',    icon:'⚖️' },
  { n:'3', title:'Réservez',   desc:'Choisissez votre créneau et confirmez en quelques secondes.',          icon:'✅' },
]

const STATS = [
  { value:'200+', label:'Garages vérifiés' },
  { value:'4.8★', label:'Note moyenne' },
  { value:'15k+', label:'RDV pris' },
  { value:'100%', label:'Gratuit pour les clients' },
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

export default async function HomePage() {
  const garages = await prisma.garage.findMany({
    where:   { status: 'ACTIVE' },
    include: { services: { select: { name: true } } },
    orderBy: { rating: 'desc' },
    take:    6,
  }).catch(() => [])

  return (
    <div className="min-h-screen" style={{ fontFamily:'var(--font-sans)', background:'var(--color-background-secondary)' }}>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 h-14" style={{ background:'var(--color-background-primary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background:'#1D9E75' }}/>
            <span className="text-[15px] font-semibold" style={{ color:'var(--color-text-primary)' }}>MonGaragiste</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-[13px] transition-colors" style={{ color:'var(--color-text-secondary)' }}>Trouver un garage</Link>
            <Link href="/mon-compte" className="text-[13px] transition-colors" style={{ color:'var(--color-text-secondary)' }}>Mes RDV</Link>
            <Link href="/login" className="text-[13px] transition-colors" style={{ color:'var(--color-text-secondary)' }}>Connexion</Link>
            <Link href="/register/garage"
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-white"
              style={{ background:'#1D9E75' }}>
              Inscrire mon garage
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ background:'#085041' }}>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium mb-6"
            style={{ background:'rgba(29,158,117,0.3)', color:'#9FE1CB' }}>
            ✓ 200+ garages vérifiés en Belgique
          </div>
          <h1 className="text-[40px] font-bold leading-tight mb-4 text-white">
            Votre garagiste,<br/>à portée de clic.
          </h1>
          <p className="text-[16px] mb-10" style={{ color:'#9FE1CB' }}>
            Trouvez, comparez et réservez votre garagiste en ligne.<br/>
            Vidange, freins, révision — choisissez votre créneau directement.
          </p>

          {/* Barre de recherche */}
          <div className="bg-white rounded-xl p-2 flex gap-2 max-w-2xl mx-auto shadow-lg">
            <div className="flex-1 flex items-center gap-2 px-3 min-w-0">
              <IconMapPin size={16} style={{ color:'var(--color-text-tertiary)', flexShrink:0 }}/>
              <input type="text" placeholder="Ville ou commune (ex: Bruxelles)"
                className="flex-1 text-[13px] bg-transparent focus:outline-none min-w-0"
                style={{ color:'var(--color-text-primary)' }}/>
            </div>
            <div className="w-px" style={{ background:'var(--color-border-tertiary)' }}/>
            <div className="flex-1 flex items-center gap-2 px-3 min-w-0">
              <IconSearch size={16} style={{ color:'var(--color-text-tertiary)', flexShrink:0 }}/>
              <select className="flex-1 text-[13px] bg-transparent focus:outline-none appearance-none cursor-pointer min-w-0"
                style={{ color:'var(--color-text-secondary)' }}>
                <option value="">Tous les services</option>
                {SERVICES.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
              </select>
            </div>
            <Link href="/search"
              className="px-5 py-2.5 rounded-lg text-[13px] font-medium text-white flex-shrink-0"
              style={{ background:'#1D9E75' }}>
              Rechercher
            </Link>
          </div>

          {/* Stats inline */}
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

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section style={{ background:'var(--color-background-primary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-[11px] font-medium flex-shrink-0" style={{ color:'var(--color-text-tertiary)' }}>Recherche rapide :</span>
            {SERVICES.map(s => (
              <Link key={s.label} href={`/search?service=${s.label}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors"
                style={{ border:'0.5px solid var(--color-border-secondary)', color:'var(--color-text-secondary)', background:'var(--color-background-primary)', whiteSpace:'nowrap' }}>
                <span>{s.icon}</span> {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── GARAGES FEATURED ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold" style={{ color:'var(--color-text-primary)' }}>
              {garages.length > 0 ? 'Garages disponibles' : 'Bientôt disponible près de vous'}
            </h2>
            <p className="text-[13px] mt-1" style={{ color:'var(--color-text-secondary)' }}>
              {garages.length > 0 ? 'Triés par note' : 'Les garages partenaires arrivent très bientôt dans votre région'}
            </p>
          </div>
          {garages.length > 0 && (
            <Link href="/search" className="flex items-center gap-1 text-[13px] font-medium" style={{ color:'#1D9E75' }}>
              Voir tout <IconArrowRight size={14}/>
            </Link>
          )}
        </div>

        {garages.length === 0 ? (
          <div className="rounded-xl p-12 text-center"
            style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
            <p className="text-4xl mb-4">🔧</p>
            <p className="text-[15px] font-semibold mb-2" style={{ color:'var(--color-text-primary)' }}>
              Vous êtes garagiste ?
            </p>
            <p className="text-[13px] mb-6" style={{ color:'var(--color-text-secondary)' }}>
              Inscrivez votre garage gratuitement et commencez à recevoir des réservations en ligne dès aujourd'hui.
            </p>
            <Link href="/register/garage"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium text-white"
              style={{ background:'#1D9E75' }}>
              Inscrire mon garage gratuitement <IconArrowRight size={14}/>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {garages.map(g => (
              <Link key={g.slug} href={`/garage/${g.slug}`}
                className="rounded-xl p-5 transition-all hover:shadow-sm group"
                style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                      style={{ background:'var(--color-primary-light)' }}>
                      🔧
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold leading-tight group-hover:text-green-700 transition-colors"
                        style={{ color:'var(--color-text-primary)' }}>{g.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color:'var(--color-text-tertiary)' }}>{g.address}, {g.city}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background:'#E1F5EE', color:'#085041' }}>
                    Dispo
                  </span>
                </div>

                {g.reviewCount > 0 ? (
                  <div className="flex items-center gap-1.5 mb-3">
                    <StarRow n={Math.round(g.rating)}/>
                    <span className="text-[12px] font-medium" style={{ color:'var(--color-text-primary)' }}>
                      {g.rating.toFixed(1)}
                    </span>
                    <span className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>({g.reviewCount} avis)</span>
                  </div>
                ) : (
                  <p className="text-[11px] mb-3" style={{ color:'var(--color-text-tertiary)' }}>Nouveau garage</p>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {g.services.slice(0,3).map(s => (
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

                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop:'0.5px solid var(--color-border-tertiary)' }}>
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>
                    <IconPhone size={12}/> {g.phone}
                  </div>
                  <span className="text-[12px] font-medium" style={{ color:'#1D9E75' }}>Réserver →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────── */}
      <section style={{ background:'var(--color-background-primary)', borderTop:'0.5px solid var(--color-border-tertiary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-[22px] font-bold" style={{ color:'var(--color-text-primary)' }}>Comment ça marche ?</h2>
            <p className="text-[14px] mt-2" style={{ color:'var(--color-text-secondary)' }}>Réservez votre rendez-vous en 3 étapes simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
                  style={{ background:'var(--color-primary-light)' }}>
                  {s.icon}
                </div>
                <div className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mb-2 text-white"
                  style={{ background:'#1D9E75' }}>{s.n}</div>
                <h3 className="text-[16px] font-semibold mb-2" style={{ color:'var(--color-text-primary)' }}>{s.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color:'var(--color-text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-[22px] font-bold text-center mb-10" style={{ color:'var(--color-text-primary)' }}>
          Pourquoi MonGaragiste ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon:<IconShieldCheck size={22} style={{color:'#1D9E75'}}/>, title:'Garages vérifiés', desc:'Chaque garage est contrôlé : assurance, agrément et avis clients authentiques.' },
            { icon:<IconClock size={22} style={{color:'#1D9E75'}}/>,       title:'Dispo en temps réel', desc:'Consultez les créneaux disponibles et réservez instantanément, 24h/24.' },
            { icon:<IconStar size={22} style={{color:'#1D9E75'}}/>,        title:'Avis certifiés', desc:'Les avis sont uniquement laissés par des clients ayant eu un RDV effectif.' },
          ].map(c => (
            <div key={c.title} className="rounded-xl p-5"
              style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background:'var(--color-primary-light)' }}>
                {c.icon}
              </div>
              <h3 className="text-[14px] font-semibold mb-1.5" style={{ color:'var(--color-text-primary)' }}>{c.title}</h3>
              <p className="text-[12px] leading-relaxed" style={{ color:'var(--color-text-secondary)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA GARAGISTE ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="rounded-2xl px-10 py-12 text-center"
          style={{ background:'#085041' }}>
          <h2 className="text-[26px] font-bold text-white mb-3">Vous êtes garagiste ?</h2>
          <p className="text-[14px] mb-8 max-w-md mx-auto" style={{ color:'#9FE1CB' }}>
            Rejoignez MonGaragiste et gérez vos rendez-vous en ligne. Agenda intelligent,
            rappels automatiques, statistiques — tout en un.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/register/garage"
              className="px-6 py-3 rounded-xl text-[14px] font-semibold"
              style={{ background:'#fff', color:'#085041' }}>
              Inscrire mon garage gratuitement
            </Link>
            <Link href="/login"
              className="px-6 py-3 rounded-xl text-[14px] font-medium text-white"
              style={{ border:'0.5px solid rgba(255,255,255,0.3)' }}>
              Déjà inscrit ? Connexion
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background:'var(--color-background-primary)', borderTop:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background:'#1D9E75' }}/>
            <span className="text-[13px] font-semibold" style={{ color:'var(--color-text-primary)' }}>MonGaragiste</span>
            <span className="text-[12px]" style={{ color:'var(--color-text-tertiary)' }}>— Votre garagiste, à portée de clic.</span>
          </div>
          <div className="flex items-center gap-5">
            {['CGU','Confidentialité','Contact'].map(l => (
              <Link key={l} href="#" className="text-[12px]" style={{ color:'var(--color-text-tertiary)' }}>{l}</Link>
            ))}
          </div>
          <p className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>© 2024 MonGaragiste</p>
        </div>
      </footer>
    </div>
  )
}
