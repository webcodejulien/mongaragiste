import { TopBar } from '@/components/layout/TopBar'
import { IconBook, IconMessageCircle, IconMail, IconChevronDown } from '@tabler/icons-react'

const FAQS = [
  { q: 'Comment confirmer un rendez-vous ?', a: 'Dans la page Rendez-vous, cliquez sur "Confirmer" à côté du RDV en attente. Le client reçoit automatiquement un email et/ou SMS de confirmation.' },
  { q: 'Comment bloquer un créneau dans l\'agenda ?', a: 'Dans la page Agenda, cliquez sur un créneau vide et sélectionnez "Bloquer ce créneau". Il ne sera plus disponible pour les réservations en ligne.' },
  { q: 'Comment modifier mes horaires d\'ouverture ?', a: 'Allez dans Paramètres → onglet Horaires. Vous pouvez définir vos heures par jour et fermer certains jours.' },
  { q: 'Comment répondre à un avis client ?', a: 'Dans la page Avis clients, cliquez sur "Répondre" sous l\'avis souhaité. Votre réponse sera visible publiquement sur votre profil.' },
  { q: 'Comment ajouter ou modifier mes services ?', a: 'Dans Paramètres → Services & tarifs, vous pouvez ajouter, modifier la durée, le prix ou supprimer vos services.' },
  { q: 'Comment activer les rappels SMS ?', a: 'Les rappels SMS sont disponibles à partir du plan Pro. Allez dans Paramètres → Notifications pour les activer.' },
  { q: 'Comment exporter mes données ?', a: 'L\'export des données (clients, RDV) est disponible dans Paramètres → Compte. Un fichier CSV vous sera envoyé par email.' },
]

export default function HelpPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Aide & Support" />
      <main className="flex-1 p-5 max-w-3xl">
        {/* Raccourcis */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: IconBook,          label: 'Documentation',       sub: 'Guides et tutoriels',     color: '#1D9E75', bg: '#E1F5EE' },
            { icon: IconMessageCircle, label: 'Chat en direct',       sub: 'Lun–Ven, 9h–18h',         color: '#185FA5', bg: '#E6F1FB' },
            { icon: IconMail,          label: 'Email support',        sub: 'support@mongaragiste.app', color: '#854F0B', bg: '#FAEEDA' },
          ].map(c => {
            const Icon = c.icon
            return (
              <div key={c.label} className="rounded-[10px] p-4 flex items-start gap-3 cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                  <Icon size={18} style={{ color: c.color }} />
                </div>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{c.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{c.sub}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <h2 className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Questions fréquentes</h2>
        <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          {FAQS.map((faq, i) => (
            <details key={i} className="group" style={{ borderBottom: i < FAQS.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
              <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none select-none transition-colors hover:bg-gray-50">
                <span className="text-[13px] font-medium pr-4" style={{ color: 'var(--color-text-primary)' }}>{faq.q}</span>
                <IconChevronDown size={15} className="flex-shrink-0 transition-transform group-open:rotate-180" style={{ color: 'var(--color-text-secondary)' }} />
              </summary>
              <p className="px-4 pb-4 text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-4 rounded-[10px] p-4 flex items-center gap-3"
          style={{ background: 'var(--color-primary-light)', border: '0.5px solid #9FE1CB' }}>
          <div>
            <p className="text-[13px] font-medium" style={{ color: 'var(--color-primary-dark)' }}>Vous ne trouvez pas votre réponse ?</p>
            <p className="text-[12px] mt-0.5" style={{ color: '#085041' }}>
              Contactez-nous à <strong>support@mongaragiste.app</strong> — réponse sous 24h.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
