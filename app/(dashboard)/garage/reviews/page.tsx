'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconStar, IconStarFilled, IconMessageCircle, IconFilter } from '@tabler/icons-react'

const reviews = [
  { id: '1', author: 'Sophie Petit',   initials: 'SP', rating: 5, service: 'Révision complète',  date: 'il y a 3h',    comment: 'Très professionnel, travail rapide et soigné. Je recommande sans hésiter !', replied: false },
  { id: '2', author: 'Marc Dupont',    initials: 'MD', rating: 5, service: 'Vidange',             date: 'il y a 1 jour', comment: 'Accueil super, prix honnêtes, rien à redire. Mon garage de confiance désormais.', replied: true, reply: 'Merci Marc, à très bientôt !' },
  { id: '3', author: 'Karl Schmitt',   initials: 'KS', rating: 4, service: 'Climatisation',       date: 'il y a 2 jours',comment: 'Bon garage, délai un peu long mais qualité au rendez-vous.', replied: false },
  { id: '4', author: 'Alice Bernard',  initials: 'AB', rating: 5, service: 'Freins avant',        date: 'il y a 3 jours',comment: 'Parfait du début à la fin. Prise en charge rapide, explication claire du devis.', replied: false },
  { id: '5', author: 'Jean Moreau',    initials: 'JM', rating: 4, service: 'Vidange',             date: 'il y a 5 jours',comment: 'Bonne prestation, personnel sympathique. Légèrement en retard sur le délai annoncé.', replied: true, reply: 'Merci Jean, nous prenons note du délai !' },
  { id: '6', author: 'Luc Fontaine',   initials: 'LF', rating: 5, service: 'Pneus',              date: 'il y a 1 sem.', comment: 'Efficace et rapide, je suis venu sans rendez-vous et j\'ai été pris en charge immédiatement.', replied: false },
  { id: '7', author: 'Emma Renard',    initials: 'ER', rating: 3, service: 'Diagnostic',          date: 'il y a 2 sem.', comment: 'Diagnostic correct mais communication un peu difficile sur les réparations à prévoir.', replied: false },
  { id: '8', author: 'Pierre Collin',  initials: 'PC', rating: 5, service: 'Distribution',        date: 'il y a 3 sem.', comment: 'Travail sérieux sur une intervention complexe. Explications claires et devis respecté.', replied: false },
]

const AVG = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
const DIST = [5,4,3,2,1].map(n => ({ stars: n, count: reviews.filter(r => r.rating === n).length }))

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        i <= n
          ? <IconStarFilled key={i} size={size} style={{ color: '#EF9F27' }} />
          : <IconStar       key={i} size={size} style={{ color: 'var(--color-border-primary)' }} />
      ))}
    </span>
  )
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState(0)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter)

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Avis clients" subtitle={`${reviews.length} avis · Note moyenne ${AVG}/5`} />
      <main className="flex-1 p-5">
        <div className="grid gap-4" style={{ gridTemplateColumns: '260px 1fr' }}>

          {/* Résumé */}
          <div className="flex flex-col gap-3">
            <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="text-center mb-4">
                <p className="text-5xl font-medium" style={{ color: 'var(--color-text-primary)' }}>{AVG}</p>
                <Stars n={Math.round(Number(AVG))} size={18} />
                <p className="text-[12px] mt-2" style={{ color: 'var(--color-text-secondary)' }}>{reviews.length} avis vérifiés</p>
              </div>
              <div className="space-y-2">
                {DIST.map(({ stars, count }) => (
                  <button key={stars} onClick={() => setFilter(filter === stars ? 0 : stars)}
                    className="w-full flex items-center gap-2 transition-opacity"
                    style={{ opacity: filter !== 0 && filter !== stars ? 0.4 : 1 }}>
                    <span className="text-[12px] w-4 text-right" style={{ color: 'var(--color-text-secondary)' }}>{stars}</span>
                    <IconStarFilled size={11} style={{ color: '#EF9F27' }} />
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--color-background-secondary)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(count / reviews.length) * 100}%`, background: '#1D9E75' }} />
                    </div>
                    <span className="text-[11px] w-4" style={{ color: 'var(--color-text-secondary)' }}>{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[10px] p-4" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <p className="text-[12px] font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Filtrer</p>
              {[0,5,4,3,2,1].map(n => (
                <button key={n} onClick={() => setFilter(n)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-colors"
                  style={{
                    background: filter === n ? 'var(--color-primary-light)' : 'transparent',
                    color: filter === n ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                    fontWeight: filter === n ? '500' : '400',
                  }}>
                  {n === 0 ? 'Tous les avis' : <><Stars n={n} size={11} /> {n} étoiles</>}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          <div className="flex flex-col gap-3">
            {filtered.length === 0 && (
              <div className="rounded-[10px] p-10 text-center text-[13px]"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}>
                Aucun avis pour cette note.
              </div>
            )}
            {filtered.map(r => (
              <div key={r.id} className="rounded-[10px] p-4"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0"
                      style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                      {r.initials}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{r.author}</p>
                      <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{r.service} · {r.date}</p>
                    </div>
                  </div>
                  <Stars n={r.rating} />
                </div>

                <p className="text-[13px] mt-3 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>{r.comment}</p>

                {r.replied && r.reply && (
                  <div className="mt-3 rounded-lg p-3" style={{ background: 'var(--color-primary-light)' }}>
                    <p className="text-[11px] font-medium mb-1" style={{ color: 'var(--color-primary-dark)' }}>Votre réponse</p>
                    <p className="text-[12px]" style={{ color: 'var(--color-primary-dark)' }}>{r.reply}</p>
                  </div>
                )}

                {!r.replied && (
                  replyingTo === r.id ? (
                    <div className="mt-3">
                      <textarea rows={2} value={replyText} onChange={e => setReplyText(e.target.value)}
                        placeholder="Répondre à cet avis..."
                        className="w-full text-[12px] px-3 py-2 rounded-lg resize-none focus:outline-none focus:ring-1"
                        style={{ border: '0.5px solid var(--color-border-primary)', background: 'var(--color-background-secondary)', focusRingColor: '#1D9E75' } as React.CSSProperties} />
                      <div className="flex gap-2 mt-2">
                        <button className="text-[12px] font-medium px-3 py-1.5 rounded-lg text-white"
                          style={{ background: '#1D9E75' }}
                          onClick={() => { setReplyingTo(null); setReplyText('') }}>
                          Publier
                        </button>
                        <button className="text-[12px] px-3 py-1.5 rounded-lg"
                          style={{ background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}
                          onClick={() => { setReplyingTo(null); setReplyText('') }}>
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setReplyingTo(r.id)}
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
      </main>
    </div>
  )
}
