'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { IconStarFilled, IconStar, IconArrowLeft, IconCheck } from '@tabler/icons-react'

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map(n => {
        const filled = n <= (hover || value)
        return (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            className="transition-transform hover:scale-110"
          >
            {filled
              ? <IconStarFilled size={32} style={{ color: '#EF9F27' }} />
              : <IconStar       size={32} style={{ color: 'var(--color-border-primary)' }} />
            }
          </button>
        )
      })}
    </div>
  )
}

const LABELS: Record<number, string> = {
  1: 'Très mauvais',
  2: 'Mauvais',
  3: 'Moyen',
  4: 'Bien',
  5: 'Excellent',
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession()
  const searchParams     = useSearchParams()
  const appointmentId    = searchParams.get('appointment')

  const [garage,     setGarage]     = useState<any>(null)
  const [loading,    setLoading]    = useState(true)
  const [rating,     setRating]     = useState(5)
  const [comment,    setComment]    = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)
  const [error,      setError]      = useState('')

  useEffect(() => {
    fetch(`/api/public/garage/${params.slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setGarage(d) })
      .finally(() => setLoading(false))
  }, [params.slug])

  async function submit() {
    if (!appointmentId) {
      setError('Lien d\'avis invalide. Utilisez le lien reçu par email.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/public/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          garageSlug:    params.slug,
          rating,
          comment:       comment.trim() || undefined,
          appointmentId,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la publication de l\'avis.')
      } else {
        setDone(true)
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background-secondary)' }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#1D9E75', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background-secondary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 h-14" style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-xl mx-auto px-4 h-full flex items-center justify-between">
          <Logo size="sm" />
          <Link href={`/garage/${params.slug}`} className="flex items-center gap-1 text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
            <IconArrowLeft size={13} /> Retour au garage
          </Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10">
        {done ? (
          /* Succès */
          <div className="rounded-[10px] p-8 text-center" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#E1F5EE' }}>
              <IconCheck size={28} style={{ color: '#1D9E75' }} />
            </div>
            <h1 className="text-[20px] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Merci pour votre avis !</h1>
            <p className="text-[13px] mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Votre avis a été publié et aide d'autres conducteurs à trouver un bon garage.
            </p>
            <Link
              href={`/garage/${params.slug}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] text-[13px] font-medium text-white"
              style={{ background: '#1D9E75' }}
            >
              Voir la page du garage
            </Link>
          </div>
        ) : (
          /* Formulaire */
          <div className="rounded-[10px] overflow-hidden" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            {/* En-tête garage */}
            <div className="px-6 py-5" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--color-primary-light)' }}>
                  {garage?.logoUrl
                    ? <img src={garage.logoUrl} alt={garage.name} className="w-full h-full object-cover rounded-xl" />
                    : '🔧'
                  }
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Laisser un avis pour</p>
                  <h1 className="text-[18px] font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                    {garage?.name ?? params.slug}
                  </h1>
                  {garage?.city && (
                    <p className="text-[12px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                      {garage.address}, {garage.city}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="px-6 py-6 space-y-6">
              {/* Note */}
              <div>
                <label className="block text-[13px] font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Votre note *
                </label>
                <StarPicker value={rating} onChange={setRating} />
                {rating > 0 && (
                  <p className="text-[12px] mt-2 font-medium" style={{ color: '#EF9F27' }}>
                    {LABELS[rating]}
                  </p>
                )}
              </div>

              {/* Commentaire */}
              <div>
                <label className="block text-[13px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Votre commentaire <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>(optionnel)</span>
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value.slice(0, 500))}
                  placeholder="Décrivez votre expérience : accueil, qualité du service, délais…"
                  className="w-full text-[13px] px-3 py-2.5 rounded-[10px] resize-none focus:outline-none focus:ring-1"
                  style={{
                    border: '0.5px solid var(--color-border-secondary)',
                    background: 'var(--color-background-secondary)',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <p className="text-[11px] mt-1 text-right" style={{ color: 'var(--color-text-tertiary)' }}>
                  {comment.length}/500
                </p>
              </div>

              {/* Erreur */}
              {error && (
                <div className="rounded-[10px] px-4 py-3 text-[13px]" style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                  {error}
                </div>
              )}

              {/* Note si pas connecté */}
              {!session && (
                <div className="rounded-[10px] px-4 py-3 text-[12px]" style={{ background: '#FFF8E1', color: '#633806', border: '0.5px solid #F9E0A2' }}>
                  Vous n'êtes pas connecté. Votre avis sera lié à ce rendez-vous via le lien email.
                </div>
              )}

              {/* Submit */}
              <button
                onClick={submit}
                disabled={submitting || rating === 0}
                className="w-full py-3 rounded-[10px] text-[14px] font-semibold text-white disabled:opacity-50 transition-opacity"
                style={{ background: '#1D9E75' }}
              >
                {submitting ? 'Publication en cours…' : 'Publier mon avis'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
