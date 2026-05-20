'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconMapPin, IconPhone, IconClock, IconStar, IconStarFilled,
  IconCheck, IconX, IconChevronLeft, IconChevronRight, IconCar,
  IconUser, IconArrowLeft,
} from '@tabler/icons-react'

/* ─── Données mock par slug ──────────────────────────────── */
const GARAGES: Record<string, any> = {
  'garage-dubois-fils': {
    name: 'Garage Dubois & Fils',
    slug: 'garage-dubois-fils',
    city: 'Bruxelles', address: 'Rue de la Loi 42', zipCode: '1000',
    phone: '+32 2 123 45 67',
    description: 'Votre garagiste de confiance depuis 1985. Spécialiste toutes marques, nous vous accueillons dans notre atelier moderne pour tous vos besoins d\'entretien et de réparation automobile. Équipe qualifiée, diagnostic électronique, pièces d\'origine.',
    rating: 4.8, reviewCount: 124, mechanicCount: 3,
    services: [
      { id:'1', name:'Vidange',                 duration:30,  price:30  },
      { id:'2', name:'Freins avant',            duration:60,  price:80  },
      { id:'3', name:'Révision complète',       duration:90,  price:150 },
      { id:'4', name:'Pneus (x4)',              duration:60,  price:80  },
      { id:'5', name:'Diagnostic électronique', duration:30,  price:50  },
      { id:'6', name:'Climatisation',           duration:45,  price:65  },
    ],
    schedules: [
      { day:'Lundi',    open:'08:00', close:'18:00', closed:false },
      { day:'Mardi',    open:'08:00', close:'18:00', closed:false },
      { day:'Mercredi', open:'08:00', close:'18:00', closed:false },
      { day:'Jeudi',    open:'08:00', close:'18:00', closed:false },
      { day:'Vendredi', open:'08:00', close:'18:00', closed:false },
      { day:'Samedi',   open:'09:00', close:'13:00', closed:false },
      { day:'Dimanche', open:'',      close:'',      closed:true  },
    ],
    reviews: [
      { author:'Martin D.',  initials:'MD', rating:5, service:'Révision',    date:'12 jan 2024', comment:'Excellent service, travail soigné et prix honnêtes. Je recommande vivement !' },
      { author:'Sophie L.',  initials:'SL', rating:5, service:'Freins',      date:'08 jan 2024', comment:'Très professionnel, délai respecté et explication claire du travail effectué.' },
      { author:'Jean M.',    initials:'JM', rating:4, service:'Vidange',     date:'03 jan 2024', comment:'Bon garage, personnel accueillant. Petit délai d\'attente mais qualité au rendez-vous.' },
      { author:'Marie F.',   initials:'MF', rating:5, service:'Pneus',       date:'28 déc 2023', comment:'Prise en charge rapide, devis transparent. Mon garage de confiance désormais.' },
    ],
  },
}
const DEFAULT_SLUG = 'garage-dubois-fils'

/* ─── Créneaux dispo ─────────────────────────────────────── */
const TIME_SLOTS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30']
// Slots déjà pris (mock)
const TAKEN: Record<string, string[]> = {
  [new Date().toISOString().split('T')[0]]: ['08:00','09:00','14:00'],
}

function getWeekDates(): { iso: string; day: string; date: number; month: string }[] {
  const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return { iso: d.toISOString().split('T')[0], day: days[d.getDay()], date: d.getDate(), month: months[d.getMonth()] }
  })
}

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        i <= n
          ? <IconStarFilled key={i} size={size} style={{ color:'#EF9F27' }}/>
          : <IconStar       key={i} size={size} style={{ color:'var(--color-border-primary)' }}/>
      ))}
    </span>
  )
}

/* ─── Étapes booking ─────────────────────────────────────── */
const BOOKING_STEPS = ['Service','Créneau','Véhicule','Confirmation']

export default function GarageProfilePage({ params }: { params: { slug: string } }) {
  const garage = GARAGES[params.slug] ?? GARAGES[DEFAULT_SLUG]

  /* booking state */
  const [bStep,       setBStep]      = useState(1)
  const [selService,  setSelService] = useState<any>(null)
  const [selDateIdx,  setSelDateIdx] = useState(0)
  const [selTime,     setSelTime]    = useState('')
  const [plate,       setPlate]      = useState('')
  const [vehicle,     setVehicle]    = useState('')
  const [notes,       setNotes]      = useState('')
  const [firstName,   setFirstName]  = useState('')
  const [lastName,    setLastName]   = useState('')
  const [email,       setEmail]      = useState('')
  const [phone,       setPhone]      = useState('')
  const [loading,     setLoading]    = useState(false)
  const [done,        setDone]       = useState(false)

  const weekDates = getWeekDates()
  const selDate   = weekDates[selDateIdx]
  const takenToday = TAKEN[selDate?.iso] ?? []

  function canNext() {
    if (bStep === 1) return !!selService
    if (bStep === 2) return !!selDate && !!selTime
    if (bStep === 3) return !!plate && !!vehicle && !!firstName && !!lastName && !!email
    return false
  }

  async function confirm() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
  }

  function reset() {
    setBStep(1); setSelService(null); setSelTime(''); setPlate(''); setVehicle('')
    setNotes(''); setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setDone(false)
  }

  const avgRating = garage.rating.toFixed(1)

  return (
    <div className="min-h-screen" style={{ background:'var(--color-background-secondary)' }}>

      {/* Header */}
      <header className="sticky top-0 z-30 h-14" style={{ background:'var(--color-background-primary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background:'#1D9E75' }}/>
            <span className="text-[14px] font-semibold" style={{ color:'var(--color-text-primary)' }}>MonGaragiste</span>
          </Link>
          <Link href="/search" className="flex items-center gap-1 text-[12px]" style={{ color:'var(--color-text-secondary)' }}>
            <IconArrowLeft size={13}/> Retour aux résultats
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6" style={{ gridTemplateColumns:'1fr 340px' }}>

          {/* ── COLONNE GAUCHE ── */}
          <div className="space-y-5">

            {/* Carte info principale */}
            <div className="rounded-xl p-6" style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background:'var(--color-primary-light)' }}>🔧</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h1 className="text-[20px] font-bold" style={{ color:'var(--color-text-primary)' }}>{garage.name}</h1>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background:'#E1F5EE', color:'#085041' }}>Actif</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[12px]" style={{ color:'var(--color-text-secondary)' }}>
                    <IconMapPin size={12}/> {garage.address}, {garage.zipCode} {garage.city}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Stars n={Math.round(garage.rating)} size={15}/>
                    <span className="text-[14px] font-bold" style={{ color:'var(--color-text-primary)' }}>{avgRating}</span>
                    <span className="text-[12px]" style={{ color:'var(--color-text-secondary)' }}>({garage.reviewCount} avis)</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background:'var(--color-background-secondary)', color:'var(--color-text-secondary)' }}>
                      {garage.mechanicCount} poste{garage.mechanicCount>1?'s':''}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <a href={`tel:${garage.phone}`} className="flex items-center gap-1.5 text-[13px]" style={{ color:'var(--color-text-secondary)' }}>
                      <IconPhone size={13}/> {garage.phone}
                    </a>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(garage.address+' '+garage.city)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[13px]" style={{ color:'var(--color-text-secondary)' }}>
                      <IconMapPin size={13}/> Voir sur la carte
                    </a>
                  </div>
                </div>
              </div>
              {garage.description && (
                <p className="text-[13px] mt-4 leading-relaxed pt-4"
                  style={{ borderTop:'0.5px solid var(--color-border-tertiary)', color:'var(--color-text-secondary)' }}>
                  {garage.description}
                </p>
              )}
            </div>

            {/* Services */}
            <div className="rounded-xl overflow-hidden" style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
              <div className="px-5 py-3.5" style={{ borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                <h2 className="text-[14px] font-semibold" style={{ color:'var(--color-text-primary)' }}>Services & tarifs</h2>
              </div>
              <div className="grid grid-cols-2 gap-px" style={{ background:'var(--color-border-tertiary)' }}>
                {garage.services.map((s: any) => (
                  <div key={s.id} className="px-5 py-3.5 flex items-center justify-between"
                    style={{ background:'var(--color-background-primary)' }}>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color:'var(--color-text-primary)' }}>{s.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color:'var(--color-text-tertiary)' }}>{s.duration} min</p>
                    </div>
                    <span className="text-[14px] font-semibold" style={{ color:'#1D9E75' }}>{s.price} €</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Avis */}
            <div className="rounded-xl overflow-hidden" style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
              <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                <h2 className="text-[14px] font-semibold" style={{ color:'var(--color-text-primary)' }}>Avis clients</h2>
                <div className="flex items-center gap-2">
                  <Stars n={Math.round(garage.rating)} size={13}/>
                  <span className="text-[13px] font-bold" style={{ color:'var(--color-text-primary)' }}>{avgRating}</span>
                  <span className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>/ 5</span>
                </div>
              </div>
              <div className="divide-y" style={{ borderColor:'var(--color-border-tertiary)' }}>
                {garage.reviews.map((r: any, i: number) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                          style={{ background:'var(--color-primary-light)', color:'var(--color-primary-dark)' }}>
                          {r.initials}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium" style={{ color:'var(--color-text-primary)' }}>{r.author}</p>
                          <p className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>{r.service} · {r.date}</p>
                        </div>
                      </div>
                      <Stars n={r.rating} size={12}/>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color:'var(--color-text-secondary)' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLONNE DROITE : BOOKING ── */}
          <div>
            <div className="rounded-xl overflow-hidden sticky top-20" style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>

              {done ? (
                <div className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background:'#E1F5EE' }}>
                    <IconCheck size={26} style={{ color:'#1D9E75' }}/>
                  </div>
                  <h3 className="text-[16px] font-semibold mb-2" style={{ color:'var(--color-text-primary)' }}>Demande envoyée !</h3>
                  <p className="text-[12px] mb-1 leading-relaxed" style={{ color:'var(--color-text-secondary)' }}>
                    <strong>{selService?.name}</strong> · {selDate?.day} {selDate?.date} {selDate?.month} à {selTime}
                  </p>
                  <p className="text-[12px] mb-5 leading-relaxed" style={{ color:'var(--color-text-secondary)' }}>
                    Le garage vous confirmera par email sous peu.
                  </p>
                  <button onClick={reset} className="text-[13px] font-medium" style={{ color:'#1D9E75' }}>
                    Prendre un autre RDV
                  </button>
                </div>
              ) : (
                <>
                  {/* Step header */}
                  <div className="px-5 py-4" style={{ borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                    <p className="text-[14px] font-semibold" style={{ color:'var(--color-text-primary)' }}>Prendre rendez-vous</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {BOOKING_STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors"
                            style={{
                              background: bStep > i+1 ? '#1D9E75' : bStep === i+1 ? '#085041' : 'var(--color-background-secondary)',
                              color: bStep >= i+1 ? '#fff' : 'var(--color-text-tertiary)',
                            }}>
                            {bStep > i+1 ? '✓' : i+1}
                          </div>
                          {i < BOOKING_STEPS.length-1 && (
                            <div className="w-6 h-px" style={{ background: bStep > i+1 ? '#1D9E75' : 'var(--color-border-tertiary)' }}/>
                          )}
                        </div>
                      ))}
                      <span className="text-[11px] ml-1" style={{ color:'var(--color-text-tertiary)' }}>
                        {BOOKING_STEPS[bStep-1]}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Étape 1 : Service */}
                    {bStep === 1 && (
                      <div className="space-y-2">
                        {garage.services.map((s: any) => (
                          <button key={s.id} onClick={() => setSelService(s)}
                            className="w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors"
                            style={{
                              border: `0.5px solid ${selService?.id===s.id ? '#1D9E75' : 'var(--color-border-secondary)'}`,
                              background: selService?.id===s.id ? '#E1F5EE' : 'var(--color-background-primary)',
                            }}>
                            <div>
                              <p className="text-[13px] font-medium" style={{ color:'var(--color-text-primary)' }}>{s.name}</p>
                              <p className="text-[11px] mt-0.5" style={{ color:'var(--color-text-tertiary)' }}>{s.duration} min</p>
                            </div>
                            <span className="text-[14px] font-semibold" style={{ color:'#1D9E75' }}>{s.price} €</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Étape 2 : Créneau */}
                    {bStep === 2 && (
                      <div>
                        {/* Sélecteur de jours */}
                        <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{ color:'var(--color-text-tertiary)' }}>Date</p>
                        <div className="grid grid-cols-7 gap-1 mb-4">
                          {weekDates.map((d, i) => (
                            <button key={d.iso} onClick={() => { setSelDateIdx(i); setSelTime('') }}
                              className="flex flex-col items-center py-2 rounded-lg transition-colors"
                              style={{
                                background: selDateIdx===i ? '#1D9E75' : 'var(--color-background-secondary)',
                                color: selDateIdx===i ? '#fff' : 'var(--color-text-secondary)',
                              }}>
                              <span className="text-[9px] font-medium">{d.day}</span>
                              <span className="text-[13px] font-bold leading-tight">{d.date}</span>
                            </button>
                          ))}
                        </div>

                        {/* Créneaux horaires */}
                        <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{ color:'var(--color-text-tertiary)' }}>
                          Heure — {garage.mechanicCount} poste{garage.mechanicCount>1?'s':''} disponible{garage.mechanicCount>1?'s':''}
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {TIME_SLOTS.map(t => {
                            const taken = takenToday.includes(t)
                            return (
                              <button key={t} disabled={taken} onClick={() => setSelTime(t)}
                                className="py-2 rounded text-[12px] font-medium transition-colors"
                                style={{
                                  background: taken ? 'var(--color-background-secondary)' : selTime===t ? '#1D9E75' : 'var(--color-background-primary)',
                                  border: `0.5px solid ${taken ? 'var(--color-border-tertiary)' : selTime===t ? '#1D9E75' : 'var(--color-border-secondary)'}`,
                                  color: taken ? 'var(--color-text-tertiary)' : selTime===t ? '#fff' : 'var(--color-text-primary)',
                                  textDecoration: taken ? 'line-through' : 'none',
                                  cursor: taken ? 'not-allowed' : 'pointer',
                                }}>
                                {t}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Étape 3 : Véhicule + contact */}
                    {bStep === 3 && (
                      <div className="space-y-3">
                        <p className="text-[12px] font-medium pb-1" style={{ color:'var(--color-text-secondary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                          Votre véhicule
                        </p>
                        <FI label="Immatriculation *" value={plate} onChange={setPlate} placeholder="1-ABC-123" upper />
                        <FI label="Modèle *" value={vehicle} onChange={setVehicle} placeholder="ex: Renault Clio 2021" />
                        <FI label="Notes (optionnel)" value={notes} onChange={setNotes} placeholder="Informations complémentaires…" />

                        <p className="text-[12px] font-medium pt-1 pb-1" style={{ color:'var(--color-text-secondary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                          Vos coordonnées
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <FI label="Prénom *" value={firstName} onChange={setFirstName} placeholder="Jean" />
                          <FI label="Nom *"    value={lastName}  onChange={setLastName}  placeholder="Dupont" />
                        </div>
                        <FI label="Email *"     type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" />
                        <FI label="Téléphone"  type="tel"   value={phone} onChange={setPhone} placeholder="+32 470 12 34 56" />
                      </div>
                    )}

                    {/* Étape 4 : Récapitulatif */}
                    {bStep === 4 && (
                      <div className="space-y-3">
                        <div className="rounded-lg p-4 space-y-2" style={{ background:'var(--color-background-secondary)' }}>
                          <Row icon={<span>🔧</span>} label={selService?.name} sub={`${selService?.duration} min · ${selService?.price} €`} />
                          <Row icon={<span>📅</span>} label={`${selDate?.day} ${selDate?.date} ${selDate?.month} à ${selTime}`} sub="" />
                          <Row icon={<span>🚗</span>} label={vehicle} sub={plate} />
                          <Row icon={<span>👤</span>} label={`${firstName} ${lastName}`} sub={email} />
                        </div>
                        {notes && (
                          <p className="text-[12px] italic" style={{ color:'var(--color-text-secondary)' }}>« {notes} »</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2 px-5 pb-5">
                    {bStep > 1 && (
                      <button onClick={() => setBStep(s => s-1)}
                        className="flex-1 py-2.5 rounded-lg text-[13px] font-medium"
                        style={{ background:'var(--color-background-secondary)', color:'var(--color-text-secondary)' }}>
                        Retour
                      </button>
                    )}
                    {bStep < 4 ? (
                      <button onClick={() => setBStep(s => s+1)} disabled={!canNext()}
                        className="flex-1 py-2.5 rounded-lg text-[13px] font-medium text-white disabled:opacity-40"
                        style={{ background:'#1D9E75' }}>
                        Continuer
                      </button>
                    ) : (
                      <button onClick={confirm} disabled={loading}
                        className="flex-1 py-2.5 rounded-lg text-[13px] font-medium text-white disabled:opacity-60"
                        style={{ background:'#1D9E75' }}>
                        {loading ? 'Envoi…' : 'Confirmer la demande'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Horaires */}
              <div className="px-5 py-4" style={{ borderTop:'0.5px solid var(--color-border-tertiary)' }}>
                <p className="text-[11px] font-medium mb-2.5 uppercase tracking-wide" style={{ color:'var(--color-text-tertiary)' }}>Horaires</p>
                <div className="space-y-1">
                  {garage.schedules.map((s: any) => (
                    <div key={s.day} className="flex items-center justify-between">
                      <span className="text-[12px]" style={{ color:'var(--color-text-secondary)' }}>{s.day}</span>
                      {s.closed
                        ? <span className="text-[11px] font-medium" style={{ color:'#E24B4A' }}>Fermé</span>
                        : <span className="text-[12px] font-medium" style={{ color:'var(--color-text-primary)' }}>{s.open} – {s.close}</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FI({ label, value, onChange, placeholder, type='text', upper=false }: {
  label:string; value:string; onChange:(v:string)=>void
  placeholder?:string; type?:string; upper?:boolean
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium mb-1" style={{ color:'var(--color-text-secondary)' }}>{label}</label>
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(upper ? e.target.value.toUpperCase() : e.target.value)}
        className="w-full px-3 py-2 text-[12px] rounded-lg focus:outline-none"
        style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)', color:'var(--color-text-primary)' }}/>
    </div>
  )
}

function Row({ icon, label, sub }: { icon:React.ReactNode; label:string; sub:string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-base flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[12px] font-medium" style={{ color:'var(--color-text-primary)' }}>{label}</p>
        {sub && <p className="text-[11px]" style={{ color:'var(--color-text-secondary)' }}>{sub}</p>}
      </div>
    </div>
  )
}
