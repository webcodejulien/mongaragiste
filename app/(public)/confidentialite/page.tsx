import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — MonGaragiste',
  description: 'Politique de confidentialité et traitement des données personnelles de MonGaragiste.',
}

export default function ConfidentialitePage() {
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
            Politique de confidentialité
          </h1>
          <p className="text-[13px] mb-8" style={{ color: 'var(--color-text-tertiary)' }}>Dernière mise à jour : 1er juin 2026 · Conforme au RGPD</p>

          {[
            {
              title: '1. Responsable du traitement',
              content: `MonGaragiste SRL est responsable du traitement de vos données personnelles. Contact DPO : privacy@mongaragiste.app`
            },
            {
              title: '2. Données collectées',
              content: `Nous collectons les données suivantes :\n• Données d'identification : nom, prénom, adresse email, numéro de téléphone\n• Données de véhicule : marque, modèle, plaque d'immatriculation\n• Données de rendez-vous : date, heure, service demandé, notes\n• Données de navigation : adresse IP, cookies techniques\n• Pour les garagistes : données d'entreprise, numéro de TVA, IBAN`
            },
            {
              title: '3. Finalités du traitement',
              content: `Vos données sont utilisées pour :\n• Gérer votre compte et vos rendez-vous\n• Envoyer des confirmations et rappels par email/SMS\n• Permettre aux garages de vous contacter\n• Améliorer notre service\n• Respecter nos obligations légales`
            },
            {
              title: '4. Base légale',
              content: `Le traitement de vos données repose sur :\n• L'exécution du contrat (gestion des rendez-vous)\n• Votre consentement (communications marketing)\n• L'intérêt légitime (amélioration du service, sécurité)\n• L'obligation légale (facturation, comptabilité)`
            },
            {
              title: '5. Durée de conservation',
              content: `• Données de compte : durée de vie du compte + 3 ans\n• Données de rendez-vous : 5 ans (obligations comptables)\n• Données de navigation : 13 mois maximum\n• Après ces délais, vos données sont supprimées ou anonymisées.`
            },
            {
              title: '6. Partage des données',
              content: `Vos données ne sont jamais vendues. Elles peuvent être partagées avec :\n• Les garages partenaires (pour la gestion de vos rendez-vous)\n• Nos prestataires techniques (Vercel, Neon, Brevo) dans le cadre de nos services\n• Les autorités compétentes si requis par la loi`
            },
            {
              title: '7. Vos droits (RGPD)',
              content: `Conformément au RGPD, vous disposez des droits suivants :\n• Droit d'accès à vos données\n• Droit de rectification\n• Droit à l'effacement (« droit à l'oubli »)\n• Droit à la portabilité\n• Droit d'opposition\n• Droit à la limitation du traitement\n\nPour exercer ces droits : privacy@mongaragiste.app`
            },
            {
              title: '8. Cookies',
              content: `Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du service (session, authentification). Aucun cookie publicitaire ou de tracking n'est utilisé.`
            },
            {
              title: '9. Sécurité',
              content: `Vos données sont protégées par des mesures techniques appropriées : chiffrement HTTPS, accès restreint aux bases de données, authentification sécurisée.`
            },
            {
              title: '10. Réclamations',
              content: `Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de l'Autorité de protection des données belge (APD) : www.autoriteprotectiondonnees.be`
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
          <Link href="/cgu" className="hover:underline">CGU</Link>{' · '}
          <Link href="/contact" className="hover:underline">Contact</Link>
        </p>
      </footer>
    </div>
  )
}
