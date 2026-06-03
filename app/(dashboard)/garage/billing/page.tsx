'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconCheck, IconCrown, IconMail } from '@tabler/icons-react'
import Link from 'next/link'

// Map des plans DB → labels UI
const PLAN_LABELS: Record<string, string> = {
  STARTER:  'Essential',
  PRO:      'Pro',
  PREMIUM:  'Premium',
}

const PLANS = [
  {
    key: 'STARTER',
    name: 'Essential',
    price: '59',
    features: [
      { label: 'Agenda en ligne',         included: true },
      { label: 'RDV en ligne',            included: true },
      { label: '1 mécanicien',            included: true },
      { label: 'Statistiques de base',    included: true },
      { label: 'Rappels SMS',             included: false },
      { label: 'Multi-garage',            included: false },
    ],
  },
  {
    key: 'PRO',
    name: 'Pro',
    price: '69',
    badge: 'Populaire',
    features: [
      { label: 'Agenda en ligne',         included: true },
      { label: 'RDV en ligne',            included: true },
      { label: "Jusqu'à 3 mécaniciens",   included: true },
      { label: 'Statistiques avancées',   included: true },
      { label: 'Rappels SMS',             included: true },
      { label: 'Multi-garage',            included: false },
    ],
  },
  {
    key: 'PREMIUM',
    name: 'Premium',
    price: '79',
    features: [
      { label: 'Agenda en ligne',         included: true },
      { label: 'RDV en ligne',            included: true },
      { label: 'Mécaniciens illimités',   included: true },
      { label: 'Statistiques complètes',  included: true },
      { label: 'Rappels SMS+',            included: true },
      { label: 'Multi-garage',            included: true },
    ],
  },
]

const PLAN_COLORS: Record<string, string> = {
  STARTER: '#6B6E72',
  PRO:     '#1D9E75',
  PREMIUM: '#854F0B',
}

export default function BillingPage() {
  const [plan, setPlan]       = useState<string | null>(null)
  const [garage, setGarage]   = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/garage/me')
      .then(r => r.json())
      .then(g => {
        if (!g.error) {
          setGarage(g)
          setPlan(g.plan ?? 'STARTER')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const currentLabel = plan ? (PLAN_LABELS[plan] ?? 'Essential') : 'Essential'

  // Date de renouvellement : 1er du mois prochain
  const now = new Date()
  const renewal = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const renewalStr = renewal.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })

  const mailtoBody = encodeURIComponent(
    `Bonjour,\n\nJe souhaite changer mon abonnement MonGaragiste.\n\nGarage : ${garage?.name ?? ''}\nPlan actuel : ${currentLabel}\nNouveau plan souhaité : \n\nCordialement`
  )
  const mailto = `mailto:support@mongaragiste.app?subject=Changement%20de%20plan&body=${mailtoBody}`

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Facturation"
        subtitle={!loading ? `Plan ${currentLabel} · Renouvellement le ${renewalStr}` : undefined}
      />
      <main className="flex-1 p-5 space-y-5 max-w-4xl">

        {/* Plan actuel */}
        {!loading && (
          <div className="rounded-[10px] p-4 flex items-start justify-between gap-4"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#E1F5EE' }}>
                <IconCrown size={18} style={{ color: '#1D9E75' }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Votre abonnement
                </p>
                <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                  Plan {currentLabel} · {PLANS.find(p => p.key === plan)?.price ?? '59'}€ HTVA/mois
                </p>
                <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                  Renouvellement le {renewalStr}
                </p>
              </div>
            </div>
            <a href={mailto}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium flex-shrink-0 transition-opacity hover:opacity-80"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
              <IconMail size={13} />
              Changer de plan
            </a>
          </div>
        )}

        {/* Plans disponibles */}
        <div>
          <h2 className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Plans disponibles
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {PLANS.map(p => {
              const isCurrent = p.key === (plan ?? 'STARTER')
              const color = PLAN_COLORS[p.key]
              return (
                <div key={p.key} className="rounded-[10px] p-5 flex flex-col"
                  style={{
                    background: 'var(--color-background-primary)',
                    border: isCurrent ? `1.5px solid ${color}` : '0.5px solid var(--color-border-tertiary)',
                  }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[14px] font-semibold" style={{ color }}>{p.name}</p>
                    {p.badge && !isCurrent && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
                        style={{ background: color }}>
                        {p.badge}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: '#E1F5EE', color: '#085041' }}>
                        Actuel
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {p.price}€
                    </span>
                    <span className="text-[12px] ml-1" style={{ color: 'var(--color-text-secondary)' }}>
                      HTVA/mois
                    </span>
                  </div>
                  <ul className="space-y-2 flex-1 mb-5">
                    {p.features.map(f => (
                      <li key={f.label} className="flex items-start gap-2 text-[12px]"
                        style={{ color: f.included ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)' }}>
                        <IconCheck size={13} className="mt-0.5 flex-shrink-0"
                          style={{ color: f.included ? color : 'var(--color-border-secondary)' }} />
                        <span style={{ textDecoration: f.included ? 'none' : 'line-through' }}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="w-full py-2 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5"
                      style={{ background: '#E1F5EE', color: '#085041' }}>
                      <IconCrown size={13} /> Plan actuel
                    </div>
                  ) : (
                    <a href={mailto}
                      className="w-full py-2 rounded-lg text-[13px] font-medium text-center text-white transition-opacity hover:opacity-90 block"
                      style={{ background: color }}>
                      Passer {p.name}
                    </a>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-[11px] mt-3 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
            Pour changer de plan, contactez-nous à{' '}
            <a href={mailto} className="underline" style={{ color: '#1D9E75' }}>
              support@mongaragiste.app
            </a>
          </p>
        </div>

        {/* Historique des paiements */}
        <div>
          <h2 className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Historique des paiements
          </h2>
          <div className="rounded-[10px] overflow-hidden"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <div className="grid text-[11px] font-medium uppercase tracking-wide px-4 py-2.5"
              style={{
                gridTemplateColumns: '1fr 160px 120px 100px',
                color: 'var(--color-text-secondary)',
                borderBottom: '0.5px solid var(--color-border-tertiary)',
                background: 'var(--color-background-secondary)',
              }}>
              <span>Facture</span>
              <span>Date</span>
              <span>Montant</span>
              <span>Statut</span>
            </div>
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>
                Les paiements apparaîtront ici
              </p>
            </div>
          </div>
        </div>

        {/* Infos de facturation */}
        <div>
          <h2 className="text-[14px] font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Informations de facturation
          </h2>
          <div className="rounded-[10px] p-5 space-y-3"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-48 animate-pulse rounded" style={{ background: 'var(--color-background-tertiary)' }} />
                <div className="h-4 w-64 animate-pulse rounded" style={{ background: 'var(--color-background-tertiary)' }} />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between py-2"
                  style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                  <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Numéro TVA
                  </span>
                  {garage?.vatNumber ? (
                    <span className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>
                      {garage.vatNumber}
                    </span>
                  ) : (
                    <Link href="/garage/settings"
                      className="text-[12px] font-medium"
                      style={{ color: '#1D9E75' }}>
                      Renseigner dans Paramètres →
                    </Link>
                  )}
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    IBAN
                  </span>
                  {garage?.iban ? (
                    <span className="text-[13px] font-mono" style={{ color: 'var(--color-text-primary)' }}>
                      {garage.iban}
                    </span>
                  ) : (
                    <Link href="/garage/settings"
                      className="text-[12px] font-medium"
                      style={{ color: '#1D9E75' }}>
                      Renseigner dans Paramètres →
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
