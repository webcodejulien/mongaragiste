import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — MonGaragiste",
  description: "Conditions générales d'utilisation de la plateforme MonGaragiste.",
}

export default function CGUPage() {
  return (
    <div style={{ background: 'var(--color-background-secondary)', minHeight: '100vh' }}>
      {/* Nav */}
      <header style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1D9E75' }}>M</div>
            <span className="text-[15px] font-bold" style={{ color: 'var(--color-text-primary)' }}>MonGaragiste</span>
          </Link>
          <Link href="/" className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>← Retour</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-[10px] p-8 md:p-12" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          <h1 className="text-[28px] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-[13px] mb-8" style={{ color: 'var(--color-text-tertiary)' }}>Dernière mise à jour : 1er juin 2026</p>

          {[
            {
              title: '1. Présentation',
              content: `MonGaragiste (accessible sur mongaragiste.app) est une plateforme de mise en relation entre des garages automobiles et des particuliers souhaitant réserver des prestations d'entretien ou de réparation. La plateforme est éditée par MonGaragiste SRL, société à responsabilité limitée de droit belge.`
            },
            {
              title: '2. Acceptation des conditions',
              content: `L'utilisation de la plateforme MonGaragiste implique l'acceptation pleine et entière des présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.`
            },
            {
              title: '3. Description du service',
              content: `MonGaragiste propose :\n• Pour les clients : la recherche de garages, la prise de rendez-vous en ligne, la consultation des avis\n• Pour les garagistes : un outil de gestion des rendez-vous, des clients, de l'agenda et de la facturation\n• Les abonnements garagistes sont proposés aux tarifs suivants : Essential (59€ HTVA/mois), Pro (69€ HTVA/mois), Premium (79€ HTVA/mois)`
            },
            {
              title: '4. Inscription et compte utilisateur',
              content: `Pour accéder à certaines fonctionnalités, la création d'un compte est nécessaire. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants. MonGaragiste se réserve le droit de suspendre ou supprimer tout compte en cas d'utilisation frauduleuse.`
            },
            {
              title: '5. Responsabilités',
              content: `MonGaragiste agit en tant qu'intermédiaire technique. La plateforme ne peut être tenue responsable de la qualité des prestations réalisées par les garages, ni des annulations ou modifications de rendez-vous. Les garages sont des prestataires indépendants et restent seuls responsables de leurs services.`
            },
            {
              title: '6. Propriété intellectuelle',
              content: `L'ensemble des éléments de la plateforme MonGaragiste (logo, design, textes, code) sont protégés par le droit d'auteur. Toute reproduction ou utilisation sans autorisation préalable est interdite.`
            },
            {
              title: '7. Modification des CGU',
              content: `MonGaragiste se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés des modifications par email ou par notification sur la plateforme.`
            },
            {
              title: '8. Droit applicable',
              content: `Les présentes conditions sont régies par le droit belge. En cas de litige, les tribunaux de Bruxelles seront seuls compétents.`
            },
            {
              title: '9. Contact',
              content: `Pour toute question relative aux présentes CGU, contactez-nous à : support@mongaragiste.app`
            },
          ].map((section) => (
            <section key={section.title} className="mb-8">
              <h2 className="text-[16px] font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{section.title}</h2>
              <p className="text-[14px] leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-secondary)' }}>{section.content}</p>
            </section>
          ))}
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
          © 2026 MonGaragiste ·{' '}
          <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>{' · '}
          <Link href="/contact" className="hover:underline">Contact</Link>
        </p>
      </footer>
    </div>
  )
}
