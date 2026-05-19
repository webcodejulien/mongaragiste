import { TopBar } from '@/components/layout/TopBar'
import { IconCrown, IconCheck, IconArrowUp } from '@tabler/icons-react'

const PLANS = [
  {
    name: 'Starter',
    price: 'Gratuit',
    priceDetail: 'pour toujours',
    color: '#6B6E72',
    features: [
      'Profil garage public',
      'Jusqu\'à 50 RDV / mois',
      'Agenda en ligne',
      'Notifications email',
    ],
    cta: 'Plan actuel',
    current: false,
    disabled: true,
  },
  {
    name: 'Pro',
    price: '29 €',
    priceDetail: '/ mois HT',
    color: '#1D9E75',
    badge: 'Populaire',
    features: [
      'Tout Starter inclus',
      'RDV illimités',
      'Rappels SMS clients',
      'Statistiques avancées',
      'Support prioritaire',
    ],
    cta: 'Plan actuel',
    current: true,
    disabled: true,
  },
  {
    name: 'Premium',
    price: '59 €',
    priceDetail: '/ mois HT',
    color: '#854F0B',
    features: [
      'Tout Pro inclus',
      'Multi-garages',
      'API & intégrations',
      'Manager de compte dédié',
      'Facturation automatique',
    ],
    cta: 'Passer Premium',
    current: false,
    disabled: false,
  },
]

const INVOICES = [
  { id: 'INV-2024-005', date: '01 mai 2024',  amount: '29,00 €', status: 'Payée' },
  { id: 'INV-2024-004', date: '01 avr. 2024', amount: '29,00 €', status: 'Payée' },
  { id: 'INV-2024-003', date: '01 mar. 2024', amount: '29,00 €', status: 'Payée' },
  { id: 'INV-2024-002', date: '01 fév. 2024', amount: '29,00 €', status: 'Payée' },
  { id: 'INV-2024-001', date: '01 jan. 2024', amount: '29,00 €', status: 'Payée' },
]

export default function BillingPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Facturation" subtitle="Plan Pro · Renouvellement le 1er juin 2024" />
      <main className="flex-1 p-5 space-y-5">

        {/* Plans */}
        <div>
          <h2 className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Choisir un plan</h2>
          <div className="grid grid-cols-3 gap-3">
            {PLANS.map(plan => (
              <div key={plan.name} className="rounded-[10px] p-5 flex flex-col"
                style={{
                  background: 'var(--color-background-primary)',
                  border: plan.current ? `1.5px solid ${plan.color}` : '0.5px solid var(--color-border-tertiary)',
                }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[14px] font-semibold" style={{ color: plan.color }}>{plan.name}</p>
                  {plan.badge && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: plan.color }}>
                      {plan.badge}
                    </span>
                  )}
                  {plan.current && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: '#E1F5EE', color: '#085041' }}>
                      Actuel
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{plan.price}</span>
                  <span className="text-[12px] ml-1" style={{ color: 'var(--color-text-secondary)' }}>{plan.priceDetail}</span>
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                      <IconCheck size={13} className="mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={plan.disabled}
                  className="w-full py-2 rounded-lg text-[13px] font-medium transition-colors"
                  style={{
                    background: plan.current ? '#E1F5EE' : plan.disabled ? 'var(--color-background-secondary)' : plan.color,
                    color: plan.current ? '#085041' : plan.disabled ? 'var(--color-text-tertiary)' : '#fff',
                    cursor: plan.disabled ? 'default' : 'pointer',
                  }}>
                  {plan.current ? <span className="flex items-center justify-center gap-1.5"><IconCrown size={13} /> Plan actuel</span> : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Factures */}
        <div>
          <h2 className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Historique de facturation</h2>
          <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <div className="grid text-[11px] font-medium uppercase tracking-wide px-4 py-2.5"
              style={{ gridTemplateColumns: '1fr 160px 120px 80px', color: 'var(--color-text-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)' }}>
              <span>Facture</span><span>Date</span><span>Montant</span><span>Statut</span>
            </div>
            {INVOICES.map((inv, i) => (
              <div key={inv.id} className="grid items-center px-4 py-3"
                style={{ gridTemplateColumns: '1fr 160px 120px 80px', borderBottom: i < INVOICES.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
                <span className="text-[13px] font-medium" style={{ color: '#1D9E75' }}>{inv.id}</span>
                <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>{inv.date}</span>
                <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{inv.amount}</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: '#E1F5EE', color: '#085041' }}>{inv.status}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
