'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconMail, IconChevronDown, IconChevronUp, IconBrandTelegram } from '@tabler/icons-react'

const FAQS = [
  {
    q: 'Comment ajouter un mécanicien ?',
    a: "Dans Paramètres → Équipe, modifiez le nombre de mécaniciens disponibles. Chaque mécanicien représente un poste de travail pouvant recevoir un RDV simultané.",
  },
  {
    q: 'Comment partager ma page de réservation ?',
    a: "Votre lien public est disponible en bas de la sidebar (« Page publique »). Il s'agit de mongaragiste.app/garage/[votre-slug]. Partagez-le sur votre site web, Google Business ou réseaux sociaux.",
  },
  {
    q: 'Comment modifier mes horaires ?',
    a: "Dans Paramètres → onglet Horaires. Vous pouvez définir vos heures d'ouverture pour chaque jour et marquer certains jours comme fermés.",
  },
  {
    q: "Un client ne reçoit pas ses emails de confirmation ?",
    a: "Vérifiez que son adresse email est correcte dans la fiche du rendez-vous. Les emails sont envoyés depuis support@mongaragiste.app — demandez au client de vérifier ses spams.",
  },
  {
    q: 'Comment annuler un rendez-vous ?',
    a: "Dans Rendez-vous, cliquez sur le bouton ✗ (rouge) à droite du RDV concerné. Le client reçoit automatiquement un email d'annulation.",
  },
  {
    q: 'Comment exporter mes données ?',
    a: "Dans Rendez-vous, utilisez le bouton « Export CSV » en haut à droite pour télécharger la liste de vos rendez-vous au format tableur.",
  },
  {
    q: 'Comment activer les rappels SMS ?',
    a: "Les rappels SMS sont disponibles à partir du plan Pro. Activez-les dans Paramètres → Notifications une fois votre plan mis à jour.",
  },
  {
    q: 'Comment répondre à un avis client ?',
    a: "Dans la page Avis clients, cliquez sur « Répondre » sous l'avis souhaité. Votre réponse sera visible publiquement sur votre profil.",
  },
]

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="cursor-pointer"
      style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between px-4 py-3.5 select-none transition-colors hover:bg-gray-50">
        <span className="text-[13px] font-medium pr-4" style={{ color: 'var(--color-text-primary)' }}>
          {q}
        </span>
        {open
          ? <IconChevronUp size={15} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
          : <IconChevronDown size={15} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
        }
      </div>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {a}
          </p>
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Aide & Support" />
      <main className="flex-1 p-5 max-w-3xl">

        {/* Canaux de contact */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <a
            href="mailto:support@mongaragiste.app"
            className="rounded-[10px] p-4 flex items-start gap-3 transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#E6F1FB' }}>
              <IconMail size={18} style={{ color: '#185FA5' }} />
            </div>
            <div>
              <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Email support
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                support@mongaragiste.app
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                Réponse sous 24h ouvrables
              </p>
            </div>
          </a>

          <div className="rounded-[10px] p-4 flex items-start gap-3"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#E1F5EE' }}>
              <IconBrandTelegram size={18} style={{ color: '#1D9E75' }} />
            </div>
            <div>
              <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Chat en direct
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                Lun–Ven, 9h–18h
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                Disponible sur le plan Pro
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
          Questions fréquentes
        </h2>
        <div className="rounded-[10px] overflow-hidden"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={i === FAQS.length - 1 ? { borderBottom: 'none' } : {}}>
              <Accordion q={faq.q} a={faq.a} />
            </div>
          ))}
        </div>

        {/* Bandeau contact */}
        <div className="mt-4 rounded-[10px] p-4 flex items-center gap-3"
          style={{ background: 'var(--color-primary-light)', border: '0.5px solid #9FE1CB' }}>
          <div>
            <p className="text-[13px] font-medium" style={{ color: 'var(--color-primary-dark)' }}>
              Vous ne trouvez pas votre réponse ?
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: '#085041' }}>
              Contactez-nous à{' '}
              <a href="mailto:support@mongaragiste.app" className="font-semibold underline">
                support@mongaragiste.app
              </a>{' '}
              — réponse sous 24h ouvrables.
            </p>
          </div>
        </div>

      </main>
    </div>
  )
}
