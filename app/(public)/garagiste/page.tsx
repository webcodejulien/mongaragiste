import Link from 'next/link'
import type { Metadata } from 'next'
import { LangToggle } from '@/components/LangToggle'

export const metadata: Metadata = {
  title: 'MonGaragiste Pro — Gérez votre garage, recevez des RDV en ligne',
  description: 'Agenda en ligne, notifications automatiques, QR code, facturation et statistiques pour garagistes belges. Commencez dès aujourd\'hui.',
}

const PAINS = [
  { icon: '📞', text: 'Téléphone qui sonne pendant les réparations' },
  { icon: '📝', text: 'Agenda papier perdu ou illisible' },
  { icon: '❌', text: 'Clients qui ne se présentent pas (no-show)' },
  { icon: '🕐', text: 'Fermeture = plus de prises de RDV' },
  { icon: '🧾', text: 'Factures rédigées à la main' },
  { icon: '😤', text: 'Historique client introuvable' },
]

const FEATURES = [
  {
    icon: '📅',
    title: 'Agenda intelligent',
    desc: 'Visualisez votre journée d\'un coup d\'œil. Confirmez, déplacez ou annulez un RDV en un clic. Vos créneaux s\'adaptent automatiquement à votre équipe et vos horaires.',
  },
  {
    icon: '🔔',
    title: 'Zéro no-show',
    desc: 'Rappel automatique par email et SMS 24h avant chaque RDV. Vos clients se souviennent, vous perdez moins de temps.',
  },
  {
    icon: '📲',
    title: 'QR Code imprimable',
    desc: 'Affichez votre QR code sur votre vitrine ou comptoir. Les clients scannent et réservent directement — même quand vous êtes sous une voiture.',
  },
  {
    icon: '🧾',
    title: 'Factures en 1 clic',
    desc: 'Générez une facture professionnelle avec votre N° TVA, IBAN et toutes les coordonnées client. Prête à imprimer ou envoyer en PDF.',
  },
  {
    icon: '📊',
    title: 'Pilotez votre activité',
    desc: 'CA mensuel, taux de remplissage, services les plus demandés, clients fidèles. Toutes vos données en un tableau de bord.',
  },
  {
    icon: '⭐',
    title: 'Réputation en ligne',
    desc: 'Collectez des avis vérifiés après chaque passage. Répondez publiquement. Votre note s\'affiche sur votre page et dans les recherches.',
  },
]

const STEPS = [
  {
    n: '01',
    icon: '✏️',
    title: 'Créez votre profil',
    desc: 'Inscrivez-vous en 2 minutes. Renseignez vos services, horaires, nombre de mécaniciens. Votre page est immédiatement en ligne.',
  },
  {
    n: '02',
    icon: '📲',
    title: 'Partagez votre lien',
    desc: 'Imprimez votre QR code, partagez votre lien sur WhatsApp, Facebook ou par SMS. Vos clients trouvent vos créneaux disponibles en temps réel.',
  },
  {
    n: '03',
    icon: '🔧',
    title: 'Travaillez, on gère le reste',
    desc: 'Confirmations, rappels, historique clients, factures — tout est automatisé. Vous vous concentrez sur la mécanique.',
  },
]

const PLANS = [
  {
    name: 'Essential',
    price: '59 €',
    sub: '/ mois HTVA',
    features: [
      'Page garage publique + QR code',
      "Jusqu'à 100 RDV / mois",
      'Agenda en ligne',
      'Notifications email client',
      'Avis clients vérifiés',
      'Facturation PDF',
      'Statistiques de base',
    ],
    cta: 'Commencer',
    href: '/register/garage',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '69 €',
    sub: '/ mois HTVA',
    badge: 'Le plus populaire',
    features: [
      'Tout Essential inclus',
      'RDV illimités',
      'Rappels SMS clients',
      'Statistiques avancées',
      'Export CSV clients & RDV',
      'Support prioritaire',
    ],
    cta: 'Commencer',
    href: '/register/garage',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '79 €',
    sub: '/ mois HTVA',
    features: [
      'Tout Pro inclus',
      'Multi-garages',
      'SMS illimités',
      'Manager de compte dédié',
      'Formation en ligne incluse',
    ],
    cta: 'Commencer',
    href: '/register/garage',
    highlight: false,
  },
]

const TESTIMONIALS = [
  {
    name: 'Marc D.',
    garage: 'Garage Dubois, Bruxelles',
    text: 'Depuis MonGaragiste, j\'ai réduit les no-shows de 60%. Les rappels automatiques font tout le travail à ma place.',
    stars: 5,
  },
  {
    name: 'Sophie V.',
    garage: 'Auto Services Verviers',
    text: 'Je reçois des réservations même le week-end. Le QR code sur ma vitrine ramène des nouveaux clients chaque semaine.',
    stars: 5,
  },
  {
    name: 'Thomas L.',
    garage: 'Garage Leroy, Liège',
    text: 'Plus de papier, plus de post-its. Tout est dans le tableau de bord. J\'ai gagné au moins 1h par jour.',
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
              Inscrire mon garage
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-[12px] font-semibold px-3 py-1 rounded-full mb-5" style={{ background: '#E1F5EE', color: '#085041' }}>
            🔧 Conçu pour les garagistes belges
          </span>
          <h1 className="text-[42px] lg:text-[50px] font-bold leading-tight mb-5" style={{ color: 'var(--color-text-primary)' }}>
            Arrêtez de perdre du temps.<br />
            <span style={{ color: '#1D9E75' }}>Vos clients réservent,<br />vous travaillez.</span>
          </h1>
          <p className="text-[17px] leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            MonGaragiste s'occupe de votre agenda, vos rappels, vos factures et votre réputation en ligne. Vous vous concentrez sur ce que vous faites de mieux : la mécanique.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/register/garage"
              className="px-6 py-3 rounded-lg text-[15px] font-semibold text-white inline-flex items-center gap-2"
              style={{ background: '#1D9E75' }}>
              Inscrire mon garage →
            </Link>
            <Link href="/login"
              className="px-6 py-3 rounded-lg text-[15px] font-medium"
              style={{ color: 'var(--color-text-secondary)', border: '0.5px solid var(--color-border-secondary)' }}>
              Se connecter
            </Link>
          </div>
          <p className="text-[12px] mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
            ✓ En ligne en 2 minutes &nbsp;·&nbsp; ✓ Sans formation technique &nbsp;·&nbsp; ✓ Support belge
          </p>
        </div>

        {/* Mockup dashboard */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)' }}>
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-[11px] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>Tableau de bord — Garage Martin</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold" style={{ color: 'var(--color-text-primary)' }}>Bonjour Marc 👋</p>
                <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>Lundi 2 juin · 8 RDV aujourd'hui</p>
              </div>
              <span className="text-[11px] px-2 py-1 rounded-full font-medium" style={{ background: '#FAEEDA', color: '#633806' }}>3 en attente</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'CA ce mois', val: '3 280 €', color: '#1D9E75' },
                { label: 'Taux remplissage', val: '87%', color: '#185FA5' },
                { label: 'Note clients', val: '4.9 ★', color: '#EF9F27' },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-3" style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                  <p className="text-[9px] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{m.label}</p>
                  <p className="text-[16px] font-bold" style={{ color: m.color }}>{m.val}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 space-y-2" style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>Programme du jour</p>
              {[
                { time: '09:00', client: 'Pierre M.', service: 'Vidange + filtres', status: '✅ Confirmé' },
                { time: '10:45', client: 'Alice B.', service: 'Freins AV', status: '⏳ En attente' },
                { time: '14:00', client: 'Jean D.', service: 'Pneus hiver', status: '✅ Confirmé' },
              ].map(r => (
                <div key={r.time} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono w-12 font-bold" style={{ color: '#1D9E75' }}>{r.time}</span>
                    <div>
                      <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{r.client}</p>
                      <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{r.service}</p>
                    </div>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Les galères qu'on règle */}
      <section style={{ background: 'var(--color-background-primary)', borderTop: '0.5px solid var(--color-border-tertiary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="text-center mb-10">
            <h2 className="text-[28px] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Ça vous parle ?
            </h2>
            <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>
              MonGaragiste règle ces problèmes dès le premier jour.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {PAINS.map(p => (
              <div key={p.text} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <span className="text-xl flex-shrink-0">{p.icon}</span>
                <p className="text-[12px] leading-snug" style={{ color: 'var(--color-text-secondary)' }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#1D9E75' }}>
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { val: '1h+', label: 'Gagnée par jour en moyenne' },
            { val: '-60%', label: 'De no-shows grâce aux rappels' },
            { val: '24/7', label: 'Réservations ouvertes' },
            { val: '2 min', label: 'Pour créer votre profil' },
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
            Opérationnel en 3 étapes
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {STEPS.map(s => (
            <div key={s.n} className="rounded-2xl p-7 relative" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="text-4xl mb-4">{s.icon}</div>
              <span className="absolute top-5 right-5 text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: '#E1F5EE', color: '#1D9E75' }}>
                {s.n}
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
              Tout ce dont vous avez besoin, rien de plus
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
            Ce que disent les garagistes
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
            <h2 className="text-[32px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Tarifs clairs, sans surprise</h2>
            <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>Un abonnement mensuel, sans engagement, résiliable à tout moment.</p>
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
          Votre garage mérite mieux qu'un agenda papier.
        </h2>
        <p className="text-[16px] mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Rejoignez les garages belges qui ont modernisé leur prise de rendez-vous et récupèrent des heures chaque semaine.
        </p>
        <Link href="/register/garage"
          className="px-8 py-4 rounded-xl text-[15px] font-bold text-white inline-block"
          style={{ background: '#1D9E75' }}>
          Inscrire mon garage →
        </Link>
        <p className="text-[12px] mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
          Sans engagement · Résiliable à tout moment · Support belge inclus
        </p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
        <div className="max-w-6xl mx-auto px-5 py-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#1D9E75' }} />
            <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>MonGaragiste</span>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <Link href="/" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>Trouver un garage</Link>
            <Link href="/cgu" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>CGU</Link>
            <Link href="/confidentialite" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>Confidentialité</Link>
            <Link href="/contact" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>Contact</Link>
            <Link href="/register/garage" className="text-[12px]" style={{ color: '#1D9E75', fontWeight: 600 }}>S'inscrire</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
