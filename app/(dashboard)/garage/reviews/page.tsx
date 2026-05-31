'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconStarFilled, IconStar, IconMessageCircle } from '@tabler/icons-react'

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i =>
        i <= n
          ? <IconStarFilled key={i} size={size} style={{ color: '#EF9F27' }} />
          : <IconStar       key={i} size={size} style={{ color: 'var(--color-border-primary)' }} />
      )}
    </span>
  )
}

export default function ReviewsPage() {
  const [reviews,    setReviews]    = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState(0)
  const [replyingTo,  setReplyingTo]  = useState<string | null>(null)
  const [replyText,   setReplyText]   = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  useEffect(() => {
    fetch('/api/garage/reviews')
      .then(r => r.json())
      .then(d => setReviews(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter)

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const DIST = [5,4,3,2,1].map(n => ({ stars: n, count: reviews.filter(r => r.rating === n).length }))

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('fr-BE', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function initials(first: string, last: string) {
    return `${first?.charAt(0) ?? ''}${last?.charAt(0) ?? ''}`.toUpperCase()
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Avis clients"
        subtitle={avg ? `${reviews.length} avis · Note moyenne ${avg}/5` : undefined}
      />
      <main className="flex-1 p-5">
        {loading ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: '260px 1fr' }}>
            <div className="rounded-[10px] h-64 animate-pulse" style={{ background: 'var(--color-background-primary)' }} />
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="rounded-[10px] h-24 animate-pulse" style={{ background: 'var(--color-background-primary)' }} />)}
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-[10px]" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <EmptyState
              icon="⭐"
              title="Aucun avis pour l'instant"
              description="Vos clients pourront laisser un avis après leur rendez-vous. Ils apparaîtront ici."
            />
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: '260px 1fr' }}>
            {/* Résumé */}
            <div className="flex flex-col gap-3">
              <div className="rounded-[10px] p-5"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="text-center mb-4">
                  <p className="text-5xl font-medium" style={{ color: 'var(--color-text-primary)' }}>{avg}</p>
                  <Stars n={Math.round(Number(avg))} size={18} />
                  <p className="text-[12px] mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {reviews.length} avis vérifiés
                  </p>
                </div>
                <div className="space-y-2">
                  {DIST.map(({ stars, count }) => (
                    <button key={stars} onClick={() => setFilter(filter === stars ? 0 : stars)}
                      className="w-full flex items-center gap-2 transition-opacity"
                      style={{ opacity: filter !== 0 && filter !== stars ? 0.4 : 1 }}>
                      <span className="text-[12px] w-4 text-right" style={{ color: 'var(--color-text-secondary)' }}>{stars}</span>
                      <IconStarFilled size={11} style={{ color: '#EF9F27' }} />
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--color-background-secondary)' }}>
                        <div className="h-full rounded-full" style={{ width: `${reviews.length ? (count/reviews.length)*100 : 0}%`, background: '#1D9E75' }} />
                      </div>
                      <span className="text-[11px] w-4" style={{ color: 'var(--color-text-secondary)' }}>{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[10px] p-4"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <p className="text-[12px] font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Filtrer</p>
                {[0,5,4,3,2,1].map(n => (
                  <button key={n} onClick={() => setFilter(n)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-colors"
                    style={{
                      background: filter === n ? 'var(--color-primary-light)' : 'transparent',
                      color: filter === n ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                      fontWeight: filter === n ? '500' : '400',
                    }}>
                    {n === 0 ? 'Tous les avis' : <><Stars n={n} size={11} /> {n} étoile{n > 1 ? 's' : ''}</>}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste */}
            <div className="flex flex-col gap-3">
              {filtered.length === 0 ? (
                <div className="rounded-[10px] p-10 text-center" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                  <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Aucun avis pour cette note.</p>
                </div>
              ) : filtered.map(r => (
                <div key={r.id} className="rounded-[10px] p-4"
                  style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0"
                        style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                        {initials(r.client?.firstName ?? '', r.client?.lastName ?? '')}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          {r.client?.firstName} {r.client?.lastName}
                        </p>
                        <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                          {fmtDate(r.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Stars n={r.rating} />
                  </div>

                  {r.comment && (
                    <p className="text-[13px] mt-3 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                      {r.comment}
                    </p>
                  )}

                  {/* Réponse existante */}
                  {r.garageReply && (
                    <div className="mt-3 pl-3 border-l-2" style={{ borderColor: '#1D9E75' }}>
                      <p className="text-[11px] font-medium mb-1" style={{ color: '#085041' }}>
                        Votre réponse · {fmtDate(r.repliedAt)}
                      </p>
                      <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {r.garageReply}
                      </p>
                    </div>
                  )}

                  {/* Formulaire de réponse */}
                  {!r.garageReply && (
                    replyingTo === r.id ? (
                      <div className="mt-3">
                        <textarea rows={2} value={replyText} onChange={e => setReplyText(e.target.value)}
                          placeholder="Répondre à cet avis…"
                          className="w-full text-[12px] px-3 py-2 rounded-lg resize-none focus:outline-none"
                          style={{ border: '0.5px solid var(--color-border-primary)', background: 'var(--color-background-secondary)' }} />
                        <div className="flex gap-2 mt-2">
                          <button
                            disabled={replyLoading || !replyText.trim()}
                            className="text-[12px] font-medium px-3 py-1.5 rounded-lg text-white disabled:opacity-50"
                            style={{ background: '#1D9E75' }}
                            onClick={async () => {
                              if (!replyText.trim()) return
                              setReplyLoading(true)
                              try {
                                const res = await fetch(`/api/garage/reviews/${r.id}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ reply: replyText }),
                                })
                                if (res.ok) {
                                  const updated = await res.json()
                                  setReviews(p => p.map(x => x.id === r.id ? { ...x, garageReply: updated.garageReply, repliedAt: updated.repliedAt } : x))
                                  setReplyingTo(null)
                                  setReplyText('')
                                }
                              } finally {
                                setReplyLoading(false)
                              }
                            }}>
                            {replyLoading ? 'Publication…' : 'Publier'}
                          </button>
                          <button className="text-[12px] px-3 py-1.5 rounded-lg"
                            style={{ background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}
                            onClick={() => { setReplyingTo(null); setReplyText('') }}>
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => { setReplyingTo(r.id); setReplyText('') }}
                        className="flex items-center gap-1.5 mt-3 text-[12px] font-medium transition-colors"
                        style={{ color: '#1D9E75' }}>
                        <IconMessageCircle size={13} /> Répondre
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
