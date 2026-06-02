import Link from 'next/link'
import type { Metadata } from 'next'
import { LangToggle } from '@/components/LangToggle'

export const metadata: Metadata = {
  title: 'MonGaragiste pour les professionnels — Développez votre activité',
  description: 'Rejoignez MonGaragiste et recevez des réservations en ligne 24h/24. Agenda intelligent, notifications automatiques, avis clients et statistiques.',
}

const FEATURES = [
  {
    icon: '📅',
    title: 'Agenda en ligne',
    desc: 'Gérez vos rendez-vous depuis n\'importe quel appareil. Vos créneaux se mettent à jour en temps réel selon vos horaires et le nombre de mécaniciens disponibles.',
  },
  {
    icon: '🔔',
    title: 'Notifications automatiques',
    desc: 'Chaque nouvelle réservation vous est signalée par email et SMS. Vos clients reçoivent automatiquement une confirmation et un rappel 24h avant.',
  },
  {
    icon: '⭐',
    title: 'Avis clients vérifiés',
    desc: 'Collectez des avis authentiques après chaque rendez-vous. Répondez publiquement et renforcez la confiance de vos nouveaux clients.',
  },
  {
    icon: '📊',
    title: 'Statistiques & revenus',
    desc: 'Suivez votre chiffre d\'affaires, vos services les plus demandés et l\'évolution de votre activité mois par mois.',
  },
  {
    icon: '👥',
    title: 'Gestion des clients',
    desc: 'Accédez à l\'historique complet de chaque client — véhicules, interventions passées, préférences — en un clic.',
  },
  {
    icon: '🔗',
    title: 'Page publique personnalisée',
    desc: 'Votre garage dispose d\'une page dédiée sur MonGaragiste, référencée sur Google. Partagez votre lien de réservation sur tous vos canaux.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Créez votre profil',
    desc: 'Inscrivez-vous en 2 minutes. Renseignez vos services, vos horaires et le nombre de mécaniciens disponibles.',
    icon: '✏️',
  },
  {
    n: '02',
    title: 'Publiez votre page',
    desc: 'Votre garage apparaît immédiatement dans la recherche MonGaragiste et sur Google. Les clients trouvent vos disponibilités en temps réel.',
    icon: '🌐',
  },
  {
    n: '03',
    title: 'Recevez des réservations',
    desc: 'Les clients réservent 24h/24, même quand vous dormez. Confirmez en un clic depuis votre tableau de bord.',
    icon: '✅',
  },
]

const PLANS = [
  {
    name: 'Essential',
    price: '9 €',
    sub: '/ mois HTVA',
    promo: '2 mois offerts à l\'inscription',
    features: [
      'Page garage publique (SEO)',
      'Jusqu\'à 100 RDV / mois',
      'Agenda en ligne',
      'Notifications email client',
      'Avis clients vérifiés',
      'Statistiques de base',
    ],
    cta: 'Commencer — 2 mois offerts',
    href: '/register/garage',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '19 €',
    sub: '/ mois HTVA',
    badge: 'Le plus populaire',
    promo: '2 mois offerts à l\'inscription',
    features: [
      'Tout Essential inclus',
      'RDV illimités',
      'Rappels SMS clients',
      'Statistiques avancées',
      'Export CSV clients & RDV',
      'Support prioritaire',
    ],
    cta: 'Commencer — 2 mois offerts',
    href: '/register/garage',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '29 €',
    sub: '/ mois HTVA',
    promo: '2 mois offerts à l\'inscription',
    features: [
      'Tout Pro inclus',
      'Multi-garages',
      'SMS illimités',
      'API & intégrations',
      'Manager de compte dédié',
      'Formation en ligne incluse',
    ],
    cta: 'Commencer — 2 mois offerts',
    href: '/register/garage',
    highlight: false,
  },
]

const TESTIMONIALS = [
  {
    name: 'Marc D.',
    garage: 'Garage Dubois, Bruxelles',
    text: 'Depuis MonGaragiste, j\'ai réduit les no-shows de 60%. Les rappels automatiques font tout le travail.',
    stars: 5,
  },
  {
    name: 'Sophie V.',
    garage: 'Auto Services Verviers',
    text: 'Je reçois des réservations pendant mes vacances. C\'est exactement ce dont j\'avais besoin pour développer mon activité.',
    stars: 5,
  },
  {
    name: 'Thomas L.',
    garage: 'Garage Leroy, Liège',
    text: 'L\'agenda est super intuitif et mes clients adorent pouvoir réserver en ligne à n\'importe quelle heure.',
    stars: 5,
  },
]

export default function GaragistePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background-secondary)', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav className="sticky top-0 z-30 h-14" style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-5 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#1D9E75' }} />
            <span className="text-[15px] font-bold" style={{ color: 'var(--color-text-primary)' }}>MonGaragiste</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full ml-1" style={{ background: '#E1F5EE', color: '#085041' }}>Pro</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              Se connecter
            </Link>
            <LangToggle />
            <Link href="/register/garage"
              className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
              style={{ background: '#1D9E75' }}>
              Inscription gratuite
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-[12px] font-semibold px-3 py-1 rounded-full mb-5" style={{ background: '#E1F5EE', color: '#085041' }}>
            🚀 Rejoignez 100+ garages belges
          </span>
          <h1 className="text-[42px] lg:text-[52px] font-bold leading-tight mb-5" style={{ color: 'var(--color-text-primary)' }}>
            Faites gagner du temps à vos clients,{' '}
            <span style={{ color: '#1D9E75' }}>travaillez plus sereinement.</span>
          </h1>
          <p className="text-[17px] leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            MonGaragiste vous donne une page publique, un agenda en ligne et des outils de communication pour que vos clients puissent réserver 24h/24 — sans vous déranger.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/register/garage"
              className="px-6 py-3 rounded-lg text-[15px] font-semibold text-white inline-flex items-center gap-2"
              style={{ background: '#1D9E75' }}>
              Commencer gratuitement →
            </Link>
          </div>
          <p className="text-[12px] mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
            ✓ Gratuit pour commencer &nbsp;·&nbsp; ✓ Sans carte bancaire &nbsp;·&nbsp; ✓ En ligne en 2 minutes
          </p>
        </div>

        {/* Mockup dashboard */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)' }}>
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-[11px] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>mongaragiste.app/garage</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[16px] font-bold" style={{ color: 'var(--color-text-primary)' }}>Bonjour, Garage Martin 👋</p>
                <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>Lundi 2 juin 2026</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'RDV aujourd\'hui', val: '8', color: '#1D9E75' },
                { label: 'En attente', val: '3', color: '#EF9F27' },
                { label: 'CA ce mois', val: '2 840 €', color: '#1D9E75' },
                { label: 'Avis clients', val: '4.9 ★', color: '#EF9F27' },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-3" style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                  <p className="text-[10px] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{m.label}</p>
                  <p className="text-[22px] font-bold" style={{ color: m.color }}>{m.val}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 space-y-2" style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>RDV du jour</p>
              {[
                { time: '09:00', client: 'Pierre M.', service: 'Vidange', status: 'Confirmé', color: '#E1F5EE', tc: '#085041' },
                { time: '10:45', client: 'Alice B.', service: 'Freins', status: 'En attente', color: '#FAEEDA', tc: '#633806' },
                { time: '14:00', client: 'Jean D.', service: 'Pneus', status: 'Confirmé', color: '#E1F5EE', tc: '#085041' },
              ].map(r => (
                <div key={r.time} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono w-12" style={{ color: '#1D9E75' }}>{r.time}</span>
                    <div>
                      <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{r.client}</p>
                      <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{r.service}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: r.color, color: r.tc }}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#1D9E75' }}>
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { val: '100+', label: 'Garages inscrits' },
            { val: '2 min', label: 'Pour créer votre profil' },
            { val: '24/7', label: 'Réservations ouvertes' },
            { val: '0 €', label: 'Pour commencer' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[32px] font-bold text-white">{s.val}</p>
              <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça fonctionne */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-14">
          <h2 className="text-[32px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Comment ça fonctionne ?
          </h2>
          <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>
            En 3 étapes simples, votre garage est en ligne et prêt à recevoir des réservations.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="rounded-2xl p-7 relative" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="text-4xl mb-4">{s.icon}</div>
              <span className="absolute top-5 right-5 text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: '#E1F5EE', color: '#1D9E75' }}>
                Étape {s.n}
              </span>
              <h3 className="text-[18px] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{s.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section style={{ background: 'var(--color-background-primary)', borderTop: '0.5px solid var(--color-border-tertiary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>
              Des outils pensés pour les garagistes, pas pour les informaticiens.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-2xl p-6" style={{ border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)' }}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-[16px] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{f.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-14">
          <h2 className="text-[32px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Ce que disent nos garagistes
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="rounded-2xl p-6" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} style={{ color: '#EF9F27', fontSize: 14 }}>★</span>
                ))}
              </div>
              <p className="text-[14px] leading-relaxed mb-4" style={{ color: 'var(--color-text-primary)' }}>
                "{t.text}"
              </p>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{t.name}</p>
                <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>{t.garage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tarifs */}
      <section style={{ background: 'var(--color-background-primary)', borderTop: '0.5px solid var(--color-border-tertiary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Tarifs simples et transparents</h2>
            <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>Commencez gratuitement, évoluez quand vous êtes prêt.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {PLANS.map(plan => (
              <div key={plan.name} className="rounded-2xl p-7 flex flex-col"
                style={{
                  background: plan.highlight ? '#1D9E75' : 'var(--color-background-secondary)',
                  border: plan.highlight ? 'none' : '0.5px solid var(--color-border-tertiary)',
                }}>
                {plan.badge && (
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full self-start mb-3"
                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                    {plan.badge}
                  </span>
                )}
                <p className="text-[16px] font-bold mb-1" style={{ color: plan.highlight ? '#fff' : 'var(--color-text-primary)' }}>
                  {plan.name}
                </p>
                <div className="mb-2">
                  <span className="text-[32px] font-bold" style={{ color: plan.highlight ? '#fff' : 'var(--color-text-primary)' }}>{plan.price}</span>
                  <span className="text-[12px] ml-1" style={{ color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'var(--color-text-tertiary)' }}>{plan.sub}</span>
                </div>
                {'promo' in plan && (plan as any).promo && (
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: plan.highlight ? 'rgba(255,255,255,0.2)' : '#FAEEDA', color: plan.highlight ? '#fff' : '#633806' }}>
                      🎁 {(plan as any).promo}
                    </span>
                  </div>
                )}
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : 'var(--color-text-secondary)' }}>
                      <span style={{ color: plan.highlight ? '#fff' : '#1D9E75', flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-center block"
                  style={{
                    background: plan.highlight ? '#fff' : '#1D9E75',
                    color: plan.highlight ? '#1D9E75' : '#fff',
                  }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h2 className="text-[36px] font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Prêt à développer votre activité ?
        </h2>
        <p className="text-[16px] mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Rejoignez les garages belges qui utilisent déjà MonGaragiste pour recevoir des réservations en ligne.
        </p>
        <Link href="/register/garage"
          className="px-8 py-4 rounded-xl text-[15px] font-bold text-white inline-block"
          style={{ background: '#1D9E75' }}>
          Créer mon profil gratuitement →
        </Link>
        <p className="text-[12px] mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
          Sans engagement · Sans carte bancaire · En ligne en 2 minutes
        </p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
        <div className="max-w-6xl mx-auto px-5 py-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#1D9E75' }} />
            <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>MonGaragiste</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>Trouver un garage</Link>
            <Link href="/login" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>Connexion</Link>
            <Link href="/register/garage" className="text-[12px]" style={{ color: '#1D9E75', fontWeight: 600 }}>S'inscrire</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
