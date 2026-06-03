'use client'

import Link from 'next/link'
import { useLang } from '@/components/LangToggle'
import { LangToggle } from '@/components/LangToggle'
import { Logo } from '@/components/Logo'

const CONTENT = {
  fr: {
    title: "Conditions Générales d'Utilisation",
    subtitle: 'Dernière mise à jour : 1er juin 2026',
    back: '← Retour',
    footerCgu: 'CGU',
    footerConfidentialite: 'Confidentialité',
    footerContact: 'Contact',
    sections: [
      {
        title: '1. Présentation',
        content: `MonGaragiste (accessible sur mongaragiste.app) est une plateforme de mise en relation entre des garages automobiles et des particuliers souhaitant réserver des prestations d'entretien ou de réparation. La plateforme est éditée par MonGaragiste SRL, société à responsabilité limitée de droit belge.`,
      },
      {
        title: '2. Acceptation des conditions',
        content: `L'utilisation de la plateforme MonGaragiste implique l'acceptation pleine et entière des présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.`,
      },
      {
        title: '3. Description du service',
        content: `MonGaragiste propose :\n• Pour les clients : la recherche de garages, la prise de rendez-vous en ligne, la consultation des avis\n• Pour les garagistes : un outil de gestion des rendez-vous, des clients, de l'agenda et de la facturation\n• Les abonnements garagistes sont proposés aux tarifs suivants : Essential (59€ HTVA/mois), Pro (69€ HTVA/mois), Premium (79€ HTVA/mois)`,
      },
      {
        title: '4. Inscription et compte utilisateur',
        content: `Pour accéder à certaines fonctionnalités, la création d'un compte est nécessaire. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants. MonGaragiste se réserve le droit de suspendre ou supprimer tout compte en cas d'utilisation frauduleuse.`,
      },
      {
        title: '5. Responsabilités',
        content: `MonGaragiste agit en tant qu'intermédiaire technique. La plateforme ne peut être tenue responsable de la qualité des prestations réalisées par les garages, ni des annulations ou modifications de rendez-vous. Les garages sont des prestataires indépendants et restent seuls responsables de leurs services.`,
      },
      {
        title: '6. Propriété intellectuelle',
        content: `L'ensemble des éléments de la plateforme MonGaragiste (logo, design, textes, code) sont protégés par le droit d'auteur. Toute reproduction ou utilisation sans autorisation préalable est interdite.`,
      },
      {
        title: '7. Modification des CGU',
        content: `MonGaragiste se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés des modifications par email ou par notification sur la plateforme.`,
      },
      {
        title: '8. Droit applicable',
        content: `Les présentes conditions sont régies par le droit belge. En cas de litige, les tribunaux de Bruxelles seront seuls compétents.`,
      },
      {
        title: '9. Contact',
        content: `Pour toute question relative aux présentes CGU, contactez-nous à : support@mongaragiste.app`,
      },
    ],
  },
  nl: {
    title: 'Algemene Gebruiksvoorwaarden',
    subtitle: 'Laatste update: 1 juni 2026',
    back: '← Terug',
    footerCgu: 'AGV',
    footerConfidentialite: 'Privacybeleid',
    footerContact: 'Contact',
    sections: [
      {
        title: '1. Voorstelling',
        content: `MonGaragiste (toegankelijk op mongaragiste.app) is een platform dat autogarages en particulieren die een onderhouds- of reparatieafspraak willen maken, met elkaar in contact brengt. Het platform wordt uitgegeven door MonGaragiste SRL, een vennootschap met beperkte aansprakelijkheid naar Belgisch recht.`,
      },
      {
        title: '2. Aanvaarding van de voorwaarden',
        content: `Het gebruik van het MonGaragiste-platform houdt de volledige en onvoorwaardelijke aanvaarding van deze algemene gebruiksvoorwaarden in. Als u deze voorwaarden niet aanvaardt, gelieve onze dienst dan niet te gebruiken.`,
      },
      {
        title: '3. Beschrijving van de dienst',
        content: `MonGaragiste biedt aan:\n• Voor klanten: het zoeken naar garages, het online maken van afspraken, het raadplegen van beoordelingen\n• Voor garagehouders: een tool voor het beheer van afspraken, klanten, agenda en facturatie\n• Abonnementen voor garagehouders worden aangeboden aan de volgende tarieven: Essential (59€ excl. btw/maand), Pro (69€ excl. btw/maand), Premium (79€ excl. btw/maand)`,
      },
      {
        title: '4. Inschrijving en gebruikersaccount',
        content: `Voor toegang tot bepaalde functies is het aanmaken van een account vereist. De gebruiker verbindt zich ertoe nauwkeurige informatie te verstrekken en de vertrouwelijkheid van zijn inloggegevens te bewaren. MonGaragiste behoudt zich het recht voor elk account bij frauduleus gebruik op te schorten of te verwijderen.`,
      },
      {
        title: '5. Verantwoordelijkheden',
        content: `MonGaragiste treedt op als technische tussenpersoon. Het platform kan niet verantwoordelijk worden gesteld voor de kwaliteit van de door de garages uitgevoerde prestaties, noch voor annuleringen of wijzigingen van afspraken. De garages zijn onafhankelijke dienstverleners en blijven als enige verantwoordelijk voor hun diensten.`,
      },
      {
        title: '6. Intellectuele eigendom',
        content: `Alle elementen van het MonGaragiste-platform (logo, design, teksten, code) zijn beschermd door het auteursrecht. Elke reproductie of gebruik zonder voorafgaande toestemming is verboden.`,
      },
      {
        title: '7. Wijziging van de AGV',
        content: `MonGaragiste behoudt zich het recht voor deze voorwaarden op elk moment te wijzigen. Gebruikers worden van wijzigingen op de hoogte gesteld via e-mail of via een melding op het platform.`,
      },
      {
        title: '8. Toepasselijk recht',
        content: `Deze voorwaarden worden beheerst door het Belgisch recht. In geval van geschil zijn uitsluitend de rechtbanken van Brussel bevoegd.`,
      },
      {
        title: '9. Contact',
        content: `Voor alle vragen over deze AGV kunt u contact met ons opnemen via: support@mongaragiste.app`,
      },
    ],
  },
}

export default function CGUPage() {
  const { lang } = useLang()
  const T = CONTENT[lang]

  return (
    <div style={{ background: 'var(--color-background-secondary)', minHeight: '100vh' }}>
      {/* Nav */}
      <header style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/" className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>{T.back}</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-[10px] p-8 md:p-12" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          <h1 className="text-[28px] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            {T.title}
          </h1>
          <p className="text-[13px] mb-8" style={{ color: 'var(--color-text-tertiary)' }}>{T.subtitle}</p>

          {T.sections.map((section) => (
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
          <Link href="/confidentialite" className="hover:underline">{T.footerConfidentialite}</Link>{' · '}
          <Link href="/contact" className="hover:underline">{T.footerContact}</Link>
        </p>
      </footer>
    </div>
  )
}
