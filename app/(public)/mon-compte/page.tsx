'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { IconCalendar, IconCheck, IconX, IconClock, IconArrowRight, IconLogout, IconUser, IconPencil, IconDeviceFloppy, IconStarFilled, IconStar, IconMessageCircle } from '@tabler/icons-react'
import { useLang } from '@/components/LangToggle'

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => {
        const filled = n <= (hover || value)
        return (
          <button key={n} type="button"
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}>
            {filled
              ? <IconStarFilled size={22} style={{color:'#EF9F27'}}/>
              : <IconStar       size={22} style={{color:'var(--color-border-primary)'}}/>}
          </button>
        )
      })}
    </div>
  )
}

const STATUS: Record<string, {label:string;bg:string;color:string}> = {
  PENDING:     {label:'En attente', bg:'#FAEEDA', color:'#633806'},
  CONFIRMED:   {label:'Confirmé',   bg:'#E1F5EE', color:'#085041'},
  IN_PROGRESS: {label:'En cours',   bg:'#E6F1FB', color:'#185FA5'},
  DONE:        {label:'Terminé',    bg:'var(--color-background-secondary)', color:'var(--color-text-secondary)'},
  CANCELLED:   {label:'Annulé',     bg:'#FCEBEB', color:'#A32D2D'},
}

function fmtDate(d:string) {
  const dt = new Date(d)
  const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  return `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`
}

export default function MonComptePage() {
  const { t } = useLang()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appts,   setAppts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Profil
  const [profile,      setProfile]      = useState<any>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [pFirstName,   setPFirstName]   = useState('')
  const [pLastName,    setPLastName]    = useState('')
  const [pPhone,       setPPhone]       = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved,  setProfileSaved]  = useState(false)

  // Avis
  const [reviewingId,  setReviewingId]  = useState<string | null>(null) // appointmentId
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText,   setReviewText]   = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewedIds,  setReviewedIds]  = useState<Set<string>>(new Set())

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      Promise.all([
        fetch('/api/client/appointments').then(r => r.json()),
        fetch('/api/client/profile').then(r => r.json()),
      ]).then(([a, p]) => {
        setAppts(Array.isArray(a) ? a : [])
        if (p && !p.error) {
          setProfile(p)
          setPFirstName(p.firstName || '')
          setPLastName(p.lastName || '')
          setPPhone(p.phone || '')
        }
      }).finally(() => setLoading(false))
    }
  }, [status])

  async function submitReview(appointmentId: string) {
    setSubmittingReview(true)
    try {
      const res = await fetch('/api/client/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, rating: reviewRating, comment: reviewText }),
      })
      if (res.ok) {
        setReviewedIds(p => new Set(Array.from(p).concat(appointmentId)))
        setReviewingId(null)
        setReviewRating(5)
        setReviewText('')
      }
    } finally {
      setSubmittingReview(false)
    }
  }

  async function saveProfile() {
    setSavingProfile(true)
    try {
      const res = await fetch('/api/client/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: pFirstName, lastName: pLastName, phone: pPhone }),
      })
      if (res.ok) {
        const updated = await res.json()
        setProfile((p: any) => ({ ...p, ...updated }))
        setEditingProfile(false)
        setProfileSaved(true)
        setTimeout(() => setProfileSaved(false), 2000)
      }
    } finally {
      setSavingProfile(false)
    }
  }

  async function cancel(id: string) {
    await fetch(`/api/client/appointments/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({status:'CANCELLED'}),
    })
    setAppts(p => p.map(a => a.id===id ? {...a,status:'CANCELLED'} : a))
  }

  const upcoming = appts.filter(a => new Date(a.date) >= new Date() && a.status !== 'CANCELLED' && a.status !== 'DONE')
  const past      = appts.filter(a => new Date(a.date) < new Date() || a.status === 'DONE' || a.status === 'CANCELLED')
  const user = session?.user as any

  return (
    <div className="min-h-screen" style={{background:'var(--color-background-secondary)'}}>
      <header className="sticky top-0 z-30 h-14" style={{background:'var(--color-background-primary)',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
        <div className="max-w-3xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{background:'#1D9E75'}}/>
            <span className="text-[14px] font-semibold" style={{color:'var(--color-text-primary)'}}>MonGaragiste</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[13px]" style={{color:'var(--color-text-secondary)'}}>{user?.email}</span>
            <button onClick={() => signOut({callbackUrl:'/'})}
              className="flex items-center gap-1.5 text-[12px]" style={{color:'var(--color-text-tertiary)'}}>
              <IconLogout size={13}/> {t.account.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-[22px] font-bold" style={{color:'var(--color-text-primary)'}}>{t.account.title}</h1>
          <p className="text-[13px] mt-1" style={{color:'var(--color-text-secondary)'}}>{t.account.subtitle}</p>
        </div>

        {/* Profil */}
        {profile && (
          <div className="rounded-xl p-5 mb-6" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{background:'var(--color-primary-light)',color:'var(--color-primary-dark)'}}>
                  {(profile.firstName?.charAt(0) ?? '') + (profile.lastName?.charAt(0) ?? '')}
                </div>
                <div>
                  <p className="text-[14px] font-semibold" style={{color:'var(--color-text-primary)'}}>
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-[12px]" style={{color:'var(--color-text-secondary)'}}>{profile.email}</p>
                </div>
              </div>
              <button onClick={() => setEditingProfile(p => !p)}
                className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{border:'0.5px solid var(--color-border-tertiary)',color:'var(--color-text-secondary)'}}>
                <IconPencil size={13}/> {editingProfile ? t.account.cancel2 : t.account.edit}
              </button>
            </div>

            {editingProfile ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium block mb-1" style={{color:'var(--color-text-secondary)'}}>Prénom</label>
                    <input value={pFirstName} onChange={e => setPFirstName(e.target.value)}
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{border:'0.5px solid var(--color-border-secondary)',background:'var(--color-background-secondary)',color:'var(--color-text-primary)'}}/>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium block mb-1" style={{color:'var(--color-text-secondary)'}}>Nom</label>
                    <input value={pLastName} onChange={e => setPLastName(e.target.value)}
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{border:'0.5px solid var(--color-border-secondary)',background:'var(--color-background-secondary)',color:'var(--color-text-primary)'}}/>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-medium block mb-1" style={{color:'var(--color-text-secondary)'}}>Téléphone</label>
                  <input value={pPhone} onChange={e => setPPhone(e.target.value)} type="tel" placeholder="+32 470 12 34 56"
                    className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                    style={{border:'0.5px solid var(--color-border-secondary)',background:'var(--color-background-secondary)',color:'var(--color-text-primary)'}}/>
                </div>
                <button onClick={saveProfile} disabled={savingProfile}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white disabled:opacity-50"
                  style={{background:'#1D9E75'}}>
                  <IconDeviceFloppy size={14}/>
                  {savingProfile ? 'Enregistrement…' : t.account.save}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  {label:'Téléphone', val: profile.phone || '—'},
                  {label:'Email',     val: profile.email},
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[11px]" style={{color:'var(--color-text-tertiary)'}}>{f.label}</p>
                    <p className="text-[13px] font-medium mt-0.5" style={{color:'var(--color-text-primary)'}}>{f.val}</p>
                  </div>
                ))}
              </div>
            )}
            {profileSaved && (
              <p className="text-[12px] mt-3 flex items-center gap-1.5" style={{color:'#1D9E75'}}>
                <IconCheck size={13}/> Profil mis à jour !
              </p>
            )}
          </div>
        )}

        {/* À venir */}
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold mb-3" style={{color:'var(--color-text-primary)'}}>
            {t.account.upcoming} ({upcoming.length})
          </h2>
          {loading ? (
            <div className="rounded-xl h-32 animate-pulse" style={{background:'var(--color-background-primary)'}}/>
          ) : upcoming.length === 0 ? (
            <div className="rounded-xl p-8 text-center" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
              <p className="text-[14px] font-medium mb-2" style={{color:'var(--color-text-primary)'}}>{t.account.noUpcoming}</p>
              <p className="text-[13px] mb-4" style={{color:'var(--color-text-secondary)'}}>{t.account.noUpcomingDesc}</p>
              <Link href="/search" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white" style={{background:'#1D9E75'}}>
                {t.account.findGarage} <IconArrowRight size={14}/>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(a => {
                const s = STATUS[a.status] ?? STATUS.PENDING
                return (
                  <div key={a.id} className="rounded-xl p-4 flex items-center gap-4"
                    style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:'var(--color-primary-light)'}}>🔧</div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold" style={{color:'var(--color-text-primary)'}}>{a.garage?.name}</p>
                      <p className="text-[12px] mt-0.5" style={{color:'var(--color-text-secondary)'}}>{a.service?.name}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px]" style={{color:'var(--color-text-tertiary)'}}>
                        <IconClock size={11}/> {fmtDate(a.date)} à {a.startTime}
                      </div>
                      {a.vehicleModel && <p className="text-[11px] mt-0.5" style={{color:'var(--color-text-tertiary)'}}>{a.vehicleModel} · {a.vehiclePlate}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{background:s.bg,color:s.color}}>{s.label}</span>
                      {['PENDING','CONFIRMED'].includes(a.status) && (
                        <button onClick={() => cancel(a.id)}
                          className="text-[11px] font-medium" style={{color:'#A32D2D'}}>
                          {t.account.cancel}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Historique */}
        {!loading && past.length > 0 && (
          <div>
            <h2 className="text-[15px] font-semibold mb-3" style={{color:'var(--color-text-primary)'}}>
              {t.account.history} ({past.length})
            </h2>
            <div className="rounded-xl overflow-hidden" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
              {past.map((a, i) => {
                const s          = STATUS[a.status] ?? STATUS.DONE
                const canReview  = a.status === 'DONE' && !a.review && !reviewedIds.has(a.id)
                const alreadyDone = a.review || reviewedIds.has(a.id)
                const isReviewing = reviewingId === a.id
                return (
                  <div key={a.id} style={{borderBottom:i<past.length-1?'0.5px solid var(--color-border-tertiary)':'none'}}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1">
                        <p className="text-[13px] font-medium" style={{color:'var(--color-text-primary)'}}>{a.garage?.name} — {a.service?.name}</p>
                        <p className="text-[11px] mt-0.5" style={{color:'var(--color-text-tertiary)'}}>{fmtDate(a.date)} à {a.startTime}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {alreadyDone && (
                          <span className="text-[11px] flex items-center gap-1" style={{color:'#1D9E75'}}>
                            <IconStarFilled size={11}/> {t.account.reviewPublished}
                          </span>
                        )}
                        {canReview && (
                          <button onClick={() => { setReviewingId(a.id); setReviewRating(5); setReviewText('') }}
                            className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                            style={{border:'0.5px solid var(--color-border-tertiary)',color:'var(--color-text-secondary)'}}>
                            <IconMessageCircle size={11}/> {t.account.leaveReview}
                          </button>
                        )}
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{background:s.bg,color:s.color}}>{s.label}</span>
                      </div>
                    </div>

                    {isReviewing && (
                      <div className="px-4 pb-4 pt-1">
                        <div className="rounded-xl p-4 space-y-3" style={{background:'var(--color-background-secondary)'}}>
                          <div>
                            <p className="text-[12px] font-medium mb-2" style={{color:'var(--color-text-primary)'}}>
                              Votre note pour {a.garage?.name}
                            </p>
                            <StarPicker value={reviewRating} onChange={setReviewRating}/>
                          </div>
                          <textarea rows={3} value={reviewText} onChange={e => setReviewText(e.target.value)}
                            placeholder="Décrivez votre expérience (optionnel)…"
                            className="w-full text-[12px] px-3 py-2 rounded-lg resize-none focus:outline-none"
                            style={{border:'0.5px solid var(--color-border-secondary)',background:'var(--color-background-primary)',color:'var(--color-text-primary)'}}/>
                          <div className="flex gap-2">
                            <button onClick={() => submitReview(a.id)} disabled={submittingReview}
                              className="px-4 py-2 rounded-lg text-[12px] font-medium text-white disabled:opacity-50"
                              style={{background:'#1D9E75'}}>
                              {submittingReview ? 'Envoi…' : 'Publier mon avis'}
                            </button>
                            <button onClick={() => setReviewingId(null)}
                              className="px-4 py-2 rounded-lg text-[12px]"
                              style={{background:'var(--color-background-primary)',color:'var(--color-text-secondary)',border:'0.5px solid var(--color-border-tertiary)'}}>
                              {t.account.cancel2}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
