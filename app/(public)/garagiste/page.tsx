'use client'

import Link from 'next/link'
import { LangToggle, useLang } from '@/components/LangToggle'

const CONTENT = {
  fr: {
    badge: '🔧 Conçu pour les garagistes belges',
    heroTitle1: 'Votre garage, disponible',
    heroTitle2: '24h/24 — même quand',
    heroTitle3: 'vous êtes sous une voiture.',
    heroSub: "MonGaragiste gère votre agenda, vos rappels, vos factures et votre réputation en ligne. Vous pouvez vous consacrer à ce que vous faites de mieux : la mécanique.",
    ctaPrimary: 'Inscrire mon garage →',
    ctaSecondary: 'Se connecter',
    heroBullets: '✓ En ligne en 2 minutes  ·  ✓ Sans formation technique  ·  ✓ Support belge',

    dashboardTitle: 'Tableau de bord — Garage Martin',
    dashboardGreeting: 'Bonjour Marc 👋',
    dashboardDate: "Lundi 2 juin · 8 RDV aujourd'hui",
    dashboardPending: '3 en attente',
    dashboardStats: [
      { label: 'CA ce mois', val: '3 280 €', color: '#1D9E75' },
      { label: 'Taux remplissage', val: '87%', color: '#185FA5' },
      { label: 'Note clients', val: '4.9 ★', color: '#EF9F27' },
    ],
    dashboardScheduleLabel: 'Programme du jour',
    dashboardAppointments: [
      { time: '09:00', client: 'Pierre M.', service: 'Vidange + filtres', status: '✅ Confirmé' },
      { time: '10:45', client: 'Alice B.', service: 'Freins AV', status: '⏳ En attente' },
      { time: '14:00', client: 'Jean D.', service: 'Pneus hiver', status: '✅ Confirmé' },
    ],

    painsTitle: 'Ça vous parle ?',
    painsSub: 'MonGaragiste règle ces problèmes dès le premier jour.',
    pains: [
      { icon: '📞', text: 'Téléphone qui sonne pendant les réparations' },
      { icon: '📝', text: 'Agenda papier perdu ou illisible' },
      { icon: '❌', text: 'Clients qui ne se présentent pas (no-show)' },
      { icon: '🕐', text: 'Fermeture = plus de prises de RDV' },
      { icon: '🧾', text: 'Factures rédigées à la main' },
      { icon: '😤', text: 'Historique client introuvable' },
    ],

    stats: [
      { val: '1h+', label: 'Gagnée par jour en moyenne' },
      { val: '-60%', label: 'De no-shows grâce aux rappels' },
      { val: '24/7', label: 'Réservations ouvertes' },
      { val: '2 min', label: 'Pour créer votre profil' },
    ],

    stepsTitle: 'Opérationnel en 3 étapes',
    steps: [
      {
        n: '01',
        icon: '✏️',
        title: 'Créez votre profil',
        desc: "Inscrivez-vous en 2 minutes. Renseignez vos services, horaires, nombre de mécaniciens. Votre page est immédiatement en ligne.",
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
        title: 'Consacrez-vous à votre métier',
        desc: "Confirmations, rappels, historique clients, factures — tout est automatisé. Vous restez pleinement disponible pour votre activité.",
      },
    ],

    featuresTitle: 'Tout ce dont vous avez besoin, rien de plus',
    featuresSub: 'Des outils pensés pour les garagistes, pas pour les informaticiens.',
    features: [
      {
        icon: '📅',
        title: 'Agenda intelligent',
        desc: "Visualisez votre journée d'un coup d'œil. Confirmez, déplacez ou annulez un RDV en un clic. Vos créneaux s'adaptent automatiquement à votre équipe et vos horaires.",
      },
      {
        icon: '🔔',
        title: 'Zéro no-show',
        desc: 'Rappel automatique par email et SMS 24h avant chaque RDV. Vos clients se souviennent, vous perdez moins de temps.',
      },
      {
        icon: '📲',
        title: 'QR Code imprimable',
        desc: "Affichez votre QR code sur votre vitrine ou comptoir. Les clients scannent et réservent directement — même quand vous êtes sous une voiture.",
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
        desc: "Collectez des avis vérifiés après chaque passage. Répondez publiquement. Votre note s'affiche sur votre page et dans les recherches.",
      },
    ],

    testimonialsTitle: 'Ce que disent les garagistes',
    testimonials: [
      {
        name: 'Marc D.',
        garage: 'Garage Dubois, Bruxelles',
        text: "Depuis MonGaragiste, j'ai réduit les no-shows de 60%. Les rappels automatiques font tout le travail à ma place.",
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
        text: "Plus de papier, plus de post-its. Tout est dans le tableau de bord. J'ai gagné au moins 1h par jour.",
        stars: 5,
      },
    ],

    plansTitle: 'Tarifs clairs, sans surprise',
    plansSub: 'Un abonnement mensuel, sans engagement, résiliable à tout moment.',
    planSub: '/ mois HTVA',
    planBadge: 'Le plus populaire',
    planCta: 'Commencer',
    planFeatures: [
      [
        'Page garage publique + QR code',
        "Jusqu'à 100 RDV / mois",
        'Agenda en ligne',
        'Notifications email client',
        'Avis clients vérifiés',
        'Facturation PDF',
        'Statistiques de base',
      ],
      [
        'Tout Essential inclus',
        'RDV illimités',
        'Rappels SMS clients',
        'Statistiques avancées',
        'Export CSV clients & RDV',
        'Support prioritaire',
      ],
      [
        'Tout Pro inclus',
        'Multi-garages',
        'SMS illimités',
        'Manager de compte dédié',
        'Formation en ligne incluse',
      ],
    ],

    ctaFinalTitle: 'Simplifiez la gestion de votre garage dès aujourd'''hui.',
    ctaFinalSub: "Des centaines de garagistes belges font confiance à MonGaragiste pour gérer leurs rendez-vous en toute simplicité.",
    ctaFinalBtn: 'Inscrire mon garage →',
    ctaFinalNote: 'Sans engagement · Résiliable à tout moment · Support belge inclus',

    navLogin: 'Se connecter',
    navRegister: 'Inscrire mon garage',
    footerFind: 'Trouver un garage',
    footerCgu: 'CGU',
    footerPrivacy: 'Confidentialité',
    footerContact: 'Contact',
    footerRegister: "S'inscrire",
  },
  nl: {
    badge: '🔧 Ontworpen voor Belgische garagehouders',
    heroTitle1: 'Uw garage, beschikbaar',
    heroTitle2: '24u/24 — ook wanneer',
    heroTitle3: 'u onder een wagen ligt.',
    heroSub: 'MonGaragiste beheert uw agenda, herinneringen, facturen en online reputatie. U kunt zich volledig wijden aan uw vak: mechanica.',
    ctaPrimary: 'Mijn garage inschrijven →',
    ctaSecondary: 'Inloggen',
    heroBullets: '✓ Online in 2 minuten  ·  ✓ Geen technische opleiding  ·  ✓ Belgische support',

    dashboardTitle: 'Dashboard — Garage Martin',
    dashboardGreeting: 'Hallo Marc 👋',
    dashboardDate: 'Maandag 2 juni · 8 afspraken vandaag',
    dashboardPending: '3 in behandeling',
    dashboardStats: [
      { label: 'Omzet deze maand', val: '3 280 €', color: '#1D9E75' },
      { label: 'Bezettingsgraad', val: '87%', color: '#185FA5' },
      { label: 'Klantbeoordeling', val: '4.9 ★', color: '#EF9F27' },
    ],
    dashboardScheduleLabel: 'Programma van vandaag',
    dashboardAppointments: [
      { time: '09:00', client: 'Pierre M.', service: 'Olieverversing + filters', status: '✅ Bevestigd' },
      { time: '10:45', client: 'Alice B.', service: 'Remmen VW', status: '⏳ In behandeling' },
      { time: '14:00', client: 'Jean D.', service: 'Winterbanden', status: '✅ Bevestigd' },
    ],

    painsTitle: 'Herkenbaar?',
    painsSub: 'MonGaragiste lost deze problemen op vanaf dag één.',
    pains: [
      { icon: '📞', text: 'Telefoon die rinkelt tijdens reparaties' },
      { icon: '📝', text: 'Papieren agenda kwijt of onleesbaar' },
      { icon: '❌', text: 'Klanten die niet komen opdagen' },
      { icon: '🕐', text: 'Sluiting = geen reservaties meer' },
      { icon: '🧾', text: 'Handgeschreven facturen' },
      { icon: '😤', text: 'Klantgeschiedenis niet te vinden' },
    ],

    stats: [
      { val: '1u+', label: 'Gewonnen per dag gemiddeld' },
      { val: '-60%', label: 'Minder no-shows dankzij herinneringen' },
      { val: '24/7', label: 'Reservaties open' },
      { val: '2 min', label: 'Om uw profiel te maken' },
    ],

    stepsTitle: 'Operationeel in 3 stappen',
    steps: [
      {
        n: '01',
        icon: '✏️',
        title: 'Maak uw profiel aan',
        desc: 'Schrijf u in in 2 minuten. Voer uw diensten, openingsuren en aantal monteurs in. Uw pagina is onmiddellijk online.',
      },
      {
        n: '02',
        icon: '📲',
        title: 'Deel uw link',
        desc: 'Druk uw QR-code af, deel uw link via WhatsApp, Facebook of sms. Uw klanten vinden uw beschikbare tijdsloten in real-time.',
      },
      {
        n: '03',
        icon: '🔧',
        title: 'Werk, wij regelen de rest',
        desc: 'Bevestigingen, herinneringen, klantgeschiedenis, facturen — alles is geautomatiseerd. U concentreert zich op de mechanica.',
      },
    ],

    featuresTitle: 'Alles wat u nodig heeft, niets meer',
    featuresSub: 'Tools ontworpen voor garagehouders, niet voor informatici.',
    features: [
      {
        icon: '📅',
        title: 'Slimme agenda',
        desc: 'Bekijk uw dag in één oogopslag. Bevestig, verplaats of annuleer een afspraak met één klik. Uw tijdsloten passen zich automatisch aan uw team en openingsuren aan.',
      },
      {
        icon: '🔔',
        title: 'Nul no-shows',
        desc: 'Automatische herinnering per e-mail en sms 24u voor elke afspraak. Uw klanten onthouden het, u verliest minder tijd.',
      },
      {
        icon: '📲',
        title: 'Afdrukbare QR-code',
        desc: 'Toon uw QR-code op uw etalage of toonbank. Klanten scannen en reserveren direct — ook als u onder een auto ligt.',
      },
      {
        icon: '🧾',
        title: 'Factuur in 1 klik',
        desc: 'Genereer een professionele factuur met uw BTW-nr., IBAN en alle klantgegevens. Klaar om af te drukken of als pdf te verzenden.',
      },
      {
        icon: '📊',
        title: 'Beheer uw activiteit',
        desc: 'Maandelijkse omzet, bezettingsgraad, meest gevraagde diensten, vaste klanten. Al uw gegevens in één dashboard.',
      },
      {
        icon: '⭐',
        title: 'Online reputatie',
        desc: 'Verzamel geverifieerde beoordelingen na elk bezoek. Antwoord publiek. Uw score verschijnt op uw pagina en in zoekopdrachten.',
      },
    ],

    testimonialsTitle: 'Wat garagehouders zeggen',
    testimonials: [
      {
        name: 'Marc D.',
        garage: 'Garage Dubois, Brussel',
        text: 'Sinds MonGaragiste heb ik no-shows met 60% verminderd. De automatische herinneringen doen al het werk voor mij.',
        stars: 5,
      },
      {
        name: 'Sophie V.',
        garage: 'Auto Services Verviers',
        text: 'Ik ontvang reservaties zelfs in het weekend. De QR-code op mijn etalage brengt elke week nieuwe klanten.',
        stars: 5,
      },
      {
        name: 'Thomas L.',
        garage: 'Garage Leroy, Luik',
        text: 'Geen papier meer, geen post-its meer. Alles staat in het dashboard. Ik win minstens 1 uur per dag.',
        stars: 5,
      },
    ],

    plansTitle: 'Duidelijke prijzen, geen verrassingen',
    plansSub: 'Een maandelijks abonnement, zonder verbintenis, op elk moment opzegbaar.',
    planSub: '/ maand excl. btw',
    planBadge: 'Meest populair',
    planCta: 'Beginnen',
    planFeatures: [
      [
        'Publieke garagepagina + QR-code',
        'Tot 100 afspraken / maand',
        'Online agenda',
        'E-mailmeldingen voor klanten',
        'Geverifieerde klantbeoordelingen',
        'PDF-facturering',
        'Basisstatistieken',
      ],
      [
        'Alles van Essential inbegrepen',
        'Onbeperkte afspraken',
        'Sms-herinneringen voor klanten',
        'Geavanceerde statistieken',
        'CSV-export klanten & afspraken',
        'Prioritaire ondersteuning',
      ],
      [
        'Alles van Pro inbegrepen',
        'Meerdere garages',
        'Onbeperkte sms',
        'Toegewijde accountmanager',
        'Online opleiding inbegrepen',
      ],
    ],

    ctaFinalTitle: 'Uw garage verdient beter dan een papieren agenda.',
    ctaFinalSub: 'Sluit u aan bij de Belgische garages die hun afsprakenbeheer hebben gemoderniseerd.',
    ctaFinalBtn: 'Mijn garage inschrijven →',
    ctaFinalNote: 'Zonder verbintenis · Op elk moment opzegbaar · Belgische support inbegrepen',

    navLogin: 'Inloggen',
    navRegister: 'Mijn garage inschrijven',
    footerFind: 'Garage vinden',
    footerCgu: 'Gebruiksvoorwaarden',
    footerPrivacy: 'Privacy',
    footerContact: 'Contact',
    footerRegister: 'Inschrijven',
  },
} as const

const PLANS_META = [
  { name: 'Essential', price: '59 €', highlight: false, badge: false },
  { name: 'Pro', price: '69 €', highlight: true, badge: true },
  { name: 'Premium', price: '79 €', highlight: false, badge: false },
]

export default function GaragistePage() {
  const { lang } = useLang()
  const T = CONTENT[lang]

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
              {T.navLogin}
            </Link>
            <LangToggle />
            <Link href="/register/garage"
              className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
              style={{ background: '#1D9E75' }}>
              {T.navRegister}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-[12px] font-semibold px-3 py-1 rounded-full mb-5" style={{ background: '#E1F5EE', color: '#085041' }}>
            {T.badge}
          </span>
          <h1 className="text-[42px] lg:text-[50px] font-bold leading-tight mb-5" style={{ color: 'var(--color-text-primary)' }}>
            {T.heroTitle1}<br />
            <span style={{ color: '#1D9E75' }}>{T.heroTitle2}<br />{T.heroTitle3}</span>
          </h1>
          <p className="text-[17px] leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            {T.heroSub}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/register/garage"
              className="px-6 py-3 rounded-lg text-[15px] font-semibold text-white inline-flex items-center gap-2"
              style={{ background: '#1D9E75' }}>
              {T.ctaPrimary}
            </Link>
            <Link href="/login"
              className="px-6 py-3 rounded-lg text-[15px] font-medium"
              style={{ color: 'var(--color-text-secondary)', border: '0.5px solid var(--color-border-secondary)' }}>
              {T.ctaSecondary}
            </Link>
          </div>
          <p className="text-[12px] mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
            {T.heroBullets}
          </p>
        </div>

        {/* Mockup dashboard */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)' }}>
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-[11px] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>{T.dashboardTitle}</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold" style={{ color: 'var(--color-text-primary)' }}>{T.dashboardGreeting}</p>
                <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>{T.dashboardDate}</p>
              </div>
              <span className="text-[11px] px-2 py-1 rounded-full font-medium" style={{ background: '#FAEEDA', color: '#633806' }}>{T.dashboardPending}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {T.dashboardStats.map(m => (
                <div key={m.label} className="rounded-xl p-3" style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                  <p className="text-[9px] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{m.label}</p>
                  <p className="text-[16px] font-bold" style={{ color: m.color }}>{m.val}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 space-y-2" style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>{T.dashboardScheduleLabel}</p>
              {T.dashboardAppointments.map(r => (
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
              {T.painsTitle}
            </h2>
            <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>
              {T.painsSub}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {T.pains.map(p => (
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
          {T.stats.map(s => (
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
            {T.stepsTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {T.steps.map(s => (
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
              {T.featuresTitle}
            </h2>
            <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>
              {T.featuresSub}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {T.features.map(f => (
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
            {T.testimonialsTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {T.testimonials.map(t => (
            <div key={t.name} className="rounded-2xl p-6" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} style={{ color: '#EF9F27', fontSize: 14 }}>★</span>
                ))}
              </div>
              <p className="text-[14px] leading-relaxed mb-4" style={{ color: 'var(--color-text-primary)' }}>
                &ldquo;{t.text}&rdquo;
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
            <h2 className="text-[32px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{T.plansTitle}</h2>
            <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>{T.plansSub}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {PLANS_META.map((plan, idx) => (
              <div key={plan.name} className="rounded-2xl p-7 flex flex-col"
                style={{
                  background: plan.highlight ? '#1D9E75' : 'var(--color-background-secondary)',
                  border: plan.highlight ? 'none' : '0.5px solid var(--color-border-tertiary)',
                }}>
                {plan.badge && (
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full self-start mb-3"
                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                    {T.planBadge}
                  </span>
                )}
                <p className="text-[16px] font-bold mb-1" style={{ color: plan.highlight ? '#fff' : 'var(--color-text-primary)' }}>
                  {plan.name}
                </p>
                <div className="mb-2">
                  <span className="text-[32px] font-bold" style={{ color: plan.highlight ? '#fff' : 'var(--color-text-primary)' }}>{plan.price}</span>
                  <span className="text-[12px] ml-1" style={{ color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'var(--color-text-tertiary)' }}>{T.planSub}</span>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {T.planFeatures[idx].map(f => (
                    <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : 'var(--color-text-secondary)' }}>
                      <span style={{ color: plan.highlight ? '#fff' : '#1D9E75', flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register/garage"
                  className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-center block"
                  style={{
                    background: plan.highlight ? '#fff' : '#1D9E75',
                    color: plan.highlight ? '#1D9E75' : '#fff',
                  }}>
                  {T.planCta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h2 className="text-[36px] font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          {T.ctaFinalTitle}
        </h2>
        <p className="text-[16px] mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          {T.ctaFinalSub}
        </p>
        <Link href="/register/garage"
          className="px-8 py-4 rounded-xl text-[15px] font-bold text-white inline-block"
          style={{ background: '#1D9E75' }}>
          {T.ctaFinalBtn}
        </Link>
        <p className="text-[12px] mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
          {T.ctaFinalNote}
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
            <Link href="/" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>{T.footerFind}</Link>
            <Link href="/cgu" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>{T.footerCgu}</Link>
            <Link href="/confidentialite" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>{T.footerPrivacy}</Link>
            <Link href="/contact" className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>{T.footerContact}</Link>
            <Link href="/register/garage" className="text-[12px]" style={{ color: '#1D9E75', fontWeight: 600 }}>{T.footerRegister}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
