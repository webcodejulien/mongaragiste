'use client'

import { useEffect, useState } from 'react'

type GarageStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED'

interface GarageRow {
  id: string
  name: string
  city: string
  plan: string
  status: GarageStatus
  rating: number
  reviewCount: number
  totalAppointments: number
  appointmentsThisMonth: number
  ownerEmail: string
  createdAt: string
  slug: string
}

interface Stats {
  activeGarages: number
  appointmentsThisMonth: number
  totalClients: number
  totalReviews: number
}

const STATUS_LABELS: Record<GarageStatus, string> = {
  ACTIVE: 'Actif',
  PENDING: 'En attente',
  SUSPENDED: 'Suspendu',
}

const STATUS_COLORS: Record<GarageStatus, { bg: string; color: string }> = {
  ACTIVE: { bg: '#dcfce7', color: '#166534' },
  PENDING: { bg: '#fef9c3', color: '#854d0e' },
  SUSPENDED: { bg: '#fee2e2', color: '#991b1b' },
}

const PLAN_LABELS: Record<string, string> = {
  STARTER: 'Starter',
  PRO: 'Pro',
  PREMIUM: 'Premium',
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [garages, setGarages] = useState<GarageRow[]>([])
  const [filter, setFilter] = useState<GarageStatus | 'ALL'>('ALL')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/garages').then((r) => r.json()),
    ]).then(([s, g]) => {
      setStats(s)
      setGarages(g)
      setLoading(false)
    })
  }, [])

  async function updateStatus(id: string, status: GarageStatus) {
    setActionLoading(id + status)
    const res = await fetch(`/api/admin/garages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setGarages((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status } : g))
      )
    }
    setActionLoading(null)
  }

  const filtered = filter === 'ALL' ? garages : garages.filter((g) => g.status === filter)

  const kpis = [
    { label: 'Garages actifs', value: stats?.activeGarages ?? '—' },
    { label: 'RDV ce mois', value: stats?.appointmentsThisMonth ?? '—' },
    { label: 'Clients inscrits', value: stats?.totalClients ?? '—' },
    { label: 'Total avis', value: stats?.totalReviews ?? '—' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--color-text-primary)' }}>
        Tableau de bord
      </h1>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 10,
              padding: '20px 24px',
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {loading ? '…' : kpi.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tableau des garages */}
      <div
        style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {/* Header tableau */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '0.5px solid var(--color-border-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 15 }}>
            Garages ({filtered.length})
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: '0.5px solid var(--color-border-tertiary)',
                  background: filter === s ? 'var(--color-text-primary)' : 'transparent',
                  color: filter === s ? 'var(--color-background-primary)' : 'var(--color-text-secondary)',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: filter === s ? 600 : 400,
                }}
              >
                {s === 'ALL' ? 'Tous' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-background-secondary)' }}>
                {['Nom', 'Ville', 'Plan', 'Statut', 'RDV total', 'Note', 'Date création', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                      borderBottom: '0.5px solid var(--color-border-tertiary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    Chargement…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    Aucun garage
                  </td>
                </tr>
              ) : (
                filtered.map((g, i) => (
                  <tr
                    key={g.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      <div>{g.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                        {g.ownerEmail}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{g.city}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'var(--color-background-secondary)',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {PLAN_LABELS[g.plan] ?? g.plan}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 500,
                          background: STATUS_COLORS[g.status].bg,
                          color: STATUS_COLORS[g.status].color,
                        }}
                      >
                        {STATUS_LABELS[g.status]}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                      {g.totalAppointments}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>
                      {g.rating > 0 ? `${g.rating.toFixed(1)} (${g.reviewCount})` : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(g.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                        {g.status !== 'ACTIVE' && (
                          <button
                            disabled={actionLoading !== null}
                            onClick={() => updateStatus(g.id, 'ACTIVE')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 6,
                              border: '0.5px solid #16a34a',
                              background: 'transparent',
                              color: '#16a34a',
                              fontSize: 12,
                              cursor: 'pointer',
                              opacity: actionLoading ? 0.6 : 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Activer
                          </button>
                        )}
                        {g.status !== 'SUSPENDED' && (
                          <button
                            disabled={actionLoading !== null}
                            onClick={() => updateStatus(g.id, 'SUSPENDED')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 6,
                              border: '0.5px solid #dc2626',
                              background: 'transparent',
                              color: '#dc2626',
                              fontSize: 12,
                              cursor: 'pointer',
                              opacity: actionLoading ? 0.6 : 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Suspendre
                          </button>
                        )}
                        <a
                          href={`/garage/${g.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: '0.5px solid var(--color-border-tertiary)',
                            background: 'transparent',
                            color: 'var(--color-text-secondary)',
                            fontSize: 12,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Voir la page
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
