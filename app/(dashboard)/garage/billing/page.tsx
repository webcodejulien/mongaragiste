'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconCrown, IconCheck, IconArrowUp } from '@tabler/icons-react'

const PLANS = [
  {
    key: 'STARTER',
    name: 'Essential',
    price: '9 €',
    priceDetail: '/ mois HTVA',
    color: '#6B6E72',
    features: [
      'Page garage publique (SEO)',
      "Jusqu'à 100 RDV / mois",
      'Agenda en ligne',
      'Notifications email client',
      'Avis clients vérifiés',
    ],
  },
  {
    key: 'PRO',
    name: 'Pro',
    price: '19 €',
    priceDetail: '/ mois HTVA',
    color: '#1D9E75',
    badge: 'Populaire',
    features: [
      'Tout Essential inclus',
      'RDV illimités',
      'Rappels SMS clients',
      'Statistiques avancées',
      'Export CSV',
      'Support prioritaire',
    ],
  },
  {
    key: 'PREMIUM',
    name: 'Premium',
    price: '29 €',
    priceDetail: '/ mois HTVA',
    color: '#854F0B',
    features: [
      'Tout Pro inclus',
      'Multi-garages',
      'SMS illimités',
      'API & intégrations',
      'Manager de compte dédié',
    ],
  },
]

export default function BillingPage() {
  const [plan,    setPlan]    = useState<string>('STARTER')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/garage/me')
      .then(r => r.json())
      .then(d => { if (d?.plan) setPlan(d.plan) })
      .finally(() => setLoading(false))
  }, [])

  const currentPlan = PLANS.find(p => p.key === plan) ?? PLANS[0]

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Facturation"
        subtitle={loading ? undefined : `Plan ${currentPlan.name} · Renouvellement automatique`}
      />
      <main className="flex-1 p-5 space-y-5 max-w-4xl">

        {/* Bannière plan actuel */}
        <div className="rounded-[10px] p-4 flex items-center gap-4"
          style={{ background: `${currentPlan.color}15`, border: `0.5px solid ${currentPlan.color}40` }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: currentPlan.color }}>
            <IconCrown size={18} color="#fff"/>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Vous êtes sur le plan <span style={{ color: currentPlan.color }}>{currentPlan.name}</span>
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {plan === 'STARTER'
                ? 'Passez au plan Pro (19 €/mois) pour les RDV illimités, les rappels SMS et les stats avancées.'
                : 'Merci de faire confiance à MonGaragiste pour votre activité.'}
            </p>
          </div>
          {plan === 'STARTER' && (
            <button className="px-4 py-2 rounded-lg text-[13px] font-medium text-white flex items-center gap-1.5 flex-shrink-0"
              style={{ background: '#1D9E75' }}>
              <IconArrowUp size={14}/> Passer Pro
            </button>
          )}
        </div>

        {/* Grille plans */}
        <div>
          <h2 className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Comparer les plans</h2>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {PLANS.map(p => {
              const isCurrent = p.key === plan
              return (
                <div key={p.key} className="rounded-[10px] p-5 flex flex-col"
                  style={{
                    background: 'var(--color-background-primary)',
                    border: isCurrent ? `1.5px solid ${p.color}` : '0.5px solid var(--color-border-tertiary)',
                  }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[14px] font-semibold" style={{ color: p.color }}>{p.name}</p>
                    {p.badge && !isCurrent && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: p.color }}>
                        {p.badge}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: '#E1F5EE', color: '#085041' }}>
                        Actuel
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{p.price}</span>
                    <span className="text-[12px] ml-1" style={{ color: 'var(--color-text-secondary)' }}>{p.priceDetail}</span>
                  </div>
                  <ul className="space-y-2 flex-1 mb-5">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                        <IconCheck size={13} className="mt-0.5 flex-shrink-0" style={{ color: p.color }}/>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled={isCurrent || p.key === 'STARTER'}
                    className="w-full py-2 rounded-lg text-[13px] font-medium transition-colors"
                    style={{
                      background: isCurrent
                        ? '#E1F5EE'
                        : p.key === 'STARTER'
                          ? 'var(--color-background-secondary)'
                          : p.color,
                      color: isCurrent
                        ? '#085041'
                        : p.key === 'STARTER'
                          ? 'var(--color-text-tertiary)'
                          : '#fff',
                      cursor: isCurrent || p.key === 'STARTER' ? 'default' : 'pointer',
                    }}>
                    {isCurrent
                      ? <span className="flex items-center justify-center gap-1.5"><IconCrown size={13}/> Plan actuel</span>
                      : p.key === 'STARTER' ? 'Plan de départ' : `Passer ${p.name}`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Factures — placeholder pour plan payant */}
        {plan !== 'STARTER' && (
          <div>
            <h2 className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Historique de facturation
            </h2>
            <div className="rounded-[10px] p-10 text-center"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
                Vos factures apparaîtront ici dès que la facturation sera activée.
              </p>
            </div>
          </div>
        )}

        {plan === 'STARTER' && (
          <div className="rounded-[10px] p-5" style={{ background: '#FAEEDA', border: '0.5px solid #EF9F27' }}>
            <p className="text-[13px] font-medium mb-1" style={{ color: '#633806' }}>🎁 2 mois offerts sur tous les plans</p>
            <p className="text-[12px]" style={{ color: '#854F0B' }}>
              Profitez de 2 mois offerts lors de votre passage au plan Essential, Pro ou Premium. Contactez-nous à <strong>hello@mongaragiste.app</strong> pour en bénéficier.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
