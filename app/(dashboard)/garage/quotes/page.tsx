'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconPlus, IconMail, IconCheck, IconX, IconTrash, IconEye,
  IconLoader2,
} from '@tabler/icons-react'

type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED'

interface Quote {
  id: string
  quoteNr: string
  clientName: string
  clientEmail: string | null
  total: number
  status: QuoteStatus
  createdAt: string
  validUntil: string | null
}

const STATUS_LABELS: Record<QuoteStatus, string> = {
  DRAFT:     'Brouillon',
  SENT:      'Envoyé',
  ACCEPTED:  'Accepté',
  REJECTED:  'Refusé',
  CONVERTED: 'Converti',
}

const STATUS_STYLES: Record<QuoteStatus, { bg: string; color: string }> = {
  DRAFT:     { bg: '#F3F4F6', color: '#6B7280' },
  SENT:      { bg: '#EFF6FF', color: '#2563EB' },
  ACCEPTED:  { bg: '#F0FDF4', color: '#16A34A' },
  REJECTED:  { bg: '#FEF2F2', color: '#DC2626' },
  CONVERTED: { bg: '#ECFDF5', color: '#065F46' },
}

const FILTER_TABS: { key: QuoteStatus | 'ALL'; label: string }[] = [
  { key: 'ALL',      label: 'Tous' },
  { key: 'DRAFT',    label: 'Brouillon' },
  { key: 'SENT',     label: 'Envoyé' },
  { key: 'ACCEPTED', label: 'Accepté' },
  { key: 'REJECTED', label: 'Refusé' },
  { key: 'CONVERTED', label: 'Converti' },
]

export default function QuotesPage() {
  const [quotes, setQuotes]     = useState<Quote[]>([])
  const [filter, setFilter]     = useState<QuoteStatus | 'ALL'>('ALL')
  const [loading, setLoading]   = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  async function fetchQuotes() {
    setLoading(true)
    const url = filter === 'ALL'
      ? '/api/garage/quotes'
      : `/api/garage/quotes?status=${filter}`
    const res = await fetch(url)
    const data = await res.json()
    setQuotes(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchQuotes() }, [filter])

  async function handleSend(id: string) {
    setActionId(id)
    await fetch(`/api/garage/quotes/${id}/send`, { method: 'POST' })
    await fetchQuotes()
    setActionId(null)
  }

  async function handleStatus(id: string, status: QuoteStatus) {
    setActionId(id)
    await fetch(`/api/garage/quotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchQuotes()
    setActionId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce devis ?')) return
    setActionId(id)
    await fetch(`/api/garage/quotes/${id}`, { method: 'DELETE' })
    await fetchQuotes()
    setActionId(null)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Devis
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            Gérez vos devis clients
          </p>
        </div>
        <Link
          href="/garage/quotes/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white"
          style={{ background: '#1D9E75' }}
        >
          <IconPlus size={15} />
          Nouveau devis
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {FILTER_TABS.map(({ key, label }) => {
          const active = filter === key
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
              style={{
                background: active ? '#1D9E75' : 'var(--color-background-secondary)',
                color: active ? '#fff' : 'var(--color-text-secondary)',
                border: '0.5px solid var(--color-border-tertiary)',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div
        className="rounded-[10px] overflow-hidden"
        style={{ border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <IconLoader2 size={24} className="animate-spin" style={{ color: '#1D9E75' }} />
          </div>
        ) : quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-[14px]" style={{ color: 'var(--color-text-secondary)' }}>
              Aucun devis trouvé
            </p>
            <Link
              href="/garage/quotes/new"
              className="text-[13px] font-medium"
              style={{ color: '#1D9E75' }}
            >
              Créer un premier devis
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)' }}>
                {['N° Devis', 'Client', 'Montant TTC', 'Statut', 'Date', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 14px',
                      textAlign: h === 'Actions' || h === 'Montant TTC' ? 'right' : 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => {
                const style = STATUS_STYLES[quote.status]
                const isLoading = actionId === quote.id
                return (
                  <tr
                    key={quote.id}
                    style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <span className="text-[13px] font-mono font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {quote.quoteNr}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {quote.clientName}
                      </p>
                      {quote.clientEmail && (
                        <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                          {quote.clientEmail}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {quote.total.toFixed(2)} €
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {STATUS_LABELS[quote.status]}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
                        {new Date(quote.createdAt).toLocaleDateString('fr-BE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-1">
                        {/* Voir */}
                        <Link
                          href={`/garage/quotes/${quote.id}`}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--color-text-secondary)' }}
                          title="Voir le devis"
                        >
                          <IconEye size={15} />
                        </Link>

                        {/* Envoyer par email */}
                        {(quote.status === 'DRAFT' || quote.status === 'SENT') && quote.clientEmail && (
                          <button
                            onClick={() => handleSend(quote.id)}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#2563EB' }}
                            title="Envoyer par email"
                          >
                            {isLoading ? <IconLoader2 size={15} className="animate-spin" /> : <IconMail size={15} />}
                          </button>
                        )}

                        {/* Marquer Accepté */}
                        {(quote.status === 'SENT' || quote.status === 'DRAFT') && (
                          <button
                            onClick={() => handleStatus(quote.id, 'ACCEPTED')}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#16A34A' }}
                            title="Marquer comme accepté"
                          >
                            <IconCheck size={15} />
                          </button>
                        )}

                        {/* Marquer Refusé */}
                        {(quote.status === 'SENT' || quote.status === 'DRAFT') && (
                          <button
                            onClick={() => handleStatus(quote.id, 'REJECTED')}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#DC2626' }}
                            title="Marquer comme refusé"
                          >
                            <IconX size={15} />
                          </button>
                        )}

                        {/* Supprimer */}
                        {quote.status === 'DRAFT' && (
                          <button
                            onClick={() => handleDelete(quote.id)}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#9CA3AF' }}
                            title="Supprimer"
                          >
                            <IconTrash size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
