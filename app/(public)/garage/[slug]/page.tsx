'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  IconMapPin, IconPhone, IconClock, IconStar, IconStarFilled,
  IconCheck, IconArrowLeft, IconCar, IconUser, IconLoader2,
} from '@tabler/icons-react'

const BOOKING_STEPS = ['Service','Créneau','Vos infos','Confirmation']


function Stars({ n, size=14 }: { n:number; size?:number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => i<=n
        ? <IconStarFilled key={i} size={size} style={{color:'#EF9F27'}}/>
        : <IconStar       key={i} size={size} style={{color:'var(--color-border-primary)'}}/>
      )}
    </span>
  )
}

function getWeekDates() {
  const months=['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  const days=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
  return Array.from({length:7},(_,i) => {
    const d=new Date(); d.setDate(d.getDate()+i)
    return {iso:d.toISOString().split('T')[0], day:days[d.getDay()], date:d.getDate(), month:months[d.getMonth()]}
  })
}

export default function GarageProfilePage({ params }: { params: { slug: string } }) {
  const [garage,   setGarage]   = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  // Booking state
  const [bStep,      setBStep]      = useState(1)
  const [selService, setSelService] = useState<any>(null)
  const [selDateIdx, setSelDateIdx] = useState(0)
  const [selTime,    setSelTime]    = useState('')
  const [firstName,  setFirstName]  = useState('')
  const [lastName,   setLastName]   = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [plate,      setPlate]      = useState('')
  const [vehicle,    setVehicle]    = useState('')
  const [notes,      setNotes]      = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [done,         setDone]         = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [slots,        setSlots]        = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const weekDates = getWeekDates()
  const selDate   = weekDates[selDateIdx]

  useEffect(() => {
    fetch(`/api/public/garage/${params.slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setGarage(d); setServices(d.services || []) } })
      .finally(() => setLoading(false))
  }, [params.slug])

  // Charger les créneaux dispo quand on change de date ou de service (à l'étape 2)
  useEffect(() => {
    if (bStep !== 2 || !selService || !selDate) return
    setSlotsLoading(true)
    setSelTime('')
    setSlots([])
    fetch(`/api/public/slots?slug=${params.slug}&date=${selDate.iso}&serviceId=${selService.id}`)
      .then(r => r.json())
      .then(d => setSlots(Array.isArray(d) ? d : []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [bStep, selDateIdx, selService?.id])

  function canNext() {
    if (bStep===1) return !!selService
    if (bStep===2) return !!selTime
    if (bStep===3) return !!firstName && !!lastName && !!email && !!plate && !!vehicle
    return true
  }

  function calcEndTime(start: string, duration: number) {
    const [h,m] = start.split(':').map(Number)
    const end = h*60+m+duration
    return `${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`
  }

  async function confirm() {
    setSubmitting(true)
    setBookingError('')
    try {
      const res = await fetch('/api/public/booking', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          garageSlug:  params.slug,
          serviceId:   selService.id,
          date:        selDate.iso,
          startTime:   selTime,
          endTime:     calcEndTime(selTime, selService.duration),
          vehiclePlate: plate,
          vehicleModel: vehicle,
          notes,
          firstName, lastName, email, phone,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setBookingError(d.error || 'Erreur lors de la réservation.')
      } else {
        setDone(true)
      }
    } catch {
      setBookingError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setBStep(1); setSelService(null); setSelTime(''); setFirstName(''); setLastName('')
    setEmail(''); setPhone(''); setPlate(''); setVehicle(''); setNotes(''); setDone(false); setBookingError('')
  }

  if (!garage) return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{color:'var(--color-text-secondary)'}}>Garage introuvable.</p>
    </div>
  )

  const avg = garage.rating?.toFixed(1) || '—'

  /* Badge "Nouveau" si créé il y a moins de 30 jours */
  const isNew = garage.createdAt
    ? (Date.now() - new Date(garage.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000
    : false

  return (
    <div className="min-h-screen" style={{background:'var(--color-background-secondary)'}}>
      <header className="sticky top-0 z-30 h-14" style={{background:'var(--color-background-primary)',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{background:'#1D9E75'}}/>
            <span className="text-[14px] font-semibold" style={{color:'var(--color-text-primary)'}}>MonGaragiste</span>
          </Link>
          <Link href="/search" className="flex items-center gap-1 text-[12px]" style={{color:'var(--color-text-secondary)'}}>
            <IconArrowLeft size={13}/> Retour
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Gauche */}
          <div className="space-y-5">
            {/* Infos */}
            <div className="rounded-xl p-6" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center text-3xl flex-shrink-0" style={{background:'var(--color-primary-light)'}}>
                  {garage.logoUrl
                    ? <img src={garage.logoUrl} alt={garage.name} className="w-full h-full object-cover"/>
                    : '🔧'
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h1 className="text-[20px] font-bold" style={{color:'var(--color-text-primary)'}}>{garage.name}</h1>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isNew && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{background:'#FFF3E0',color:'#B45309'}}>Nouveau</span>
                      )}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{background:'#E1F5EE',color:'#085041'}}>Actif</span>
                    </div>
                  </div>
                  <p className="text-[12px] mt-1" style={{color:'var(--color-text-secondary)'}}>{garage.address}, {garage.zipCode} {garage.city}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {(garage.reviewCount ?? 0) > 0 ? (
                      <>
                        <Stars n={Math.round(garage.rating||0)} size={14}/>
                        <span className="text-[13px] font-bold" style={{color:'var(--color-text-primary)'}}>{avg}</span>
                        <span className="text-[12px]" style={{color:'var(--color-text-secondary)'}}>({garage.reviewCount} avis)</span>
                      </>
                    ) : (
                      <span className="text-[12px] font-medium" style={{color:'var(--color-text-tertiary)'}}>Nouveau garage</span>
                    )}
                    {garage.mechanicCount != null && garage.mechanicCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full" style={{background:'var(--color-background-secondary)',color:'var(--color-text-secondary)'}}>
                        {garage.mechanicCount} mécanicien{garage.mechanicCount>1?'s':''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <a href={`tel:${garage.phone}`} className="flex items-center gap-1.5 text-[13px]" style={{color:'var(--color-text-secondary)'}}>
                      <IconPhone size={13}/> {garage.phone}
                    </a>
                  </div>
                </div>
              </div>
              {garage.description && (
                <p className="text-[13px] mt-4 pt-4 leading-relaxed" style={{borderTop:'0.5px solid var(--color-border-tertiary)',color:'var(--color-text-secondary)'}}>
                  {garage.description}
                </p>
              )}
            </div>

            {/* Services */}
            <div className="rounded-xl overflow-hidden" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
              <div className="px-5 py-3.5" style={{borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                <h2 className="text-[14px] font-semibold" style={{color:'var(--color-text-primary)'}}>Services & tarifs</h2>
              </div>
              {loading ? (
                <div className="p-4 grid grid-cols-2 gap-2">
                  {[1,2,3,4].map(i => <div key={i} className="h-14 animate-pulse rounded-lg" style={{background:'var(--color-background-secondary)'}}/>)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-px" style={{background:'var(--color-border-tertiary)'}}>
                  {services.map((s:any) => (
                    <div key={s.id} className="px-5 py-3.5 flex items-center justify-between" style={{background:'var(--color-background-primary)'}}>
                      <div>
                        <p className="text-[13px] font-medium" style={{color:'var(--color-text-primary)'}}>{s.name}</p>
                        <p className="text-[11px] mt-0.5" style={{color:'var(--color-text-tertiary)'}}>{s.duration} min</p>
                      </div>
                      {s.price && <span className="text-[14px] font-semibold" style={{color:'#1D9E75'}}>{s.price} €</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avis */}
            {(garage.reviews||[]).length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
                <div className="px-5 py-3.5 flex items-center justify-between" style={{borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                  <h2 className="text-[14px] font-semibold" style={{color:'var(--color-text-primary)'}}>Avis clients</h2>
                  <div className="flex items-center gap-2"><Stars n={Math.round(garage.rating||0)} size={12}/><span className="text-[12px] font-bold" style={{color:'var(--color-text-primary)'}}>{avg}</span></div>
                </div>
                {garage.reviews.map((r:any,i:number) => (
                  <div key={i} className="px-5 py-4" style={{borderBottom:i<garage.reviews.length-1?'0.5px solid var(--color-border-tertiary)':'none'}}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{background:'var(--color-primary-light)',color:'var(--color-primary-dark)'}}>{r.initials}</div>
                        <div>
                          <p className="text-[13px] font-medium" style={{color:'var(--color-text-primary)'}}>{r.author}</p>
                          <p className="text-[11px]" style={{color:'var(--color-text-tertiary)'}}>{r.service} · {r.date}</p>
                        </div>
                      </div>
                      <Stars n={r.rating} size={12}/>
                    </div>
                    {r.comment && (
                      <p className="text-[13px] leading-relaxed" style={{color:'var(--color-text-secondary)'}}>{r.comment}</p>
                    )}
                    {r.garageReply && (
                      <div className="mt-2 pl-3 border-l-2 border-[#1D9E75]">
                        <p className="text-[11px] font-medium mb-0.5" style={{color:'#085041'}}>Réponse du garage</p>
                        <p className="text-[12px] leading-relaxed" style={{color:'var(--color-text-secondary)'}}>{r.garageReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Droite : Booking */}
          <div>
            <div className="rounded-xl overflow-hidden sticky top-20" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
              {done ? (
                <div className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'#E1F5EE'}}>
                    <IconCheck size={26} style={{color:'#1D9E75'}}/>
                  </div>
                  <h3 className="text-[16px] font-semibold mb-2" style={{color:'var(--color-text-primary)'}}>Demande envoyée !</h3>
                  <p className="text-[12px] mb-2 leading-relaxed" style={{color:'var(--color-text-secondary)'}}>
                    <strong>{selService?.name}</strong> · {selDate?.day} {selDate?.date} {selDate?.month} à {selTime}
                  </p>
                  <p className="text-[12px] mb-5" style={{color:'var(--color-text-secondary)'}}>
                    Vous recevrez un email de confirmation dès que le garage aura accepté votre demande.
                  </p>
                  <button onClick={reset} className="text-[13px] font-medium" style={{color:'#1D9E75'}}>
                    Prendre un autre RDV
                  </button>
                </div>
              ) : (
                <>
                  <div className="px-5 py-4" style={{borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                    <p className="text-[14px] font-semibold" style={{color:'var(--color-text-primary)'}}>Prendre rendez-vous</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {BOOKING_STEPS.map((s,i) => (
                        <div key={s} className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors"
                            style={{background:bStep>i+1?'#1D9E75':bStep===i+1?'#085041':'var(--color-background-secondary)',color:bStep>=i+1?'#fff':'var(--color-text-tertiary)'}}>
                            {bStep>i+1?'✓':i+1}
                          </div>
                          {i<BOOKING_STEPS.length-1 && <div className="w-4 h-px" style={{background:bStep>i+1?'#1D9E75':'var(--color-border-tertiary)'}}/>}
                        </div>
                      ))}
                      <span className="text-[11px] ml-1" style={{color:'var(--color-text-tertiary)'}}>{BOOKING_STEPS[bStep-1]}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    {bookingError && (
                      <div className="text-[12px] px-3 py-2 rounded-lg mb-3" style={{background:'#FCEBEB',color:'#A32D2D'}}>{bookingError}</div>
                    )}

                    {bStep===1 && (
                      <div className="space-y-2">
                        {loading ? <div className="h-32 animate-pulse rounded-lg" style={{background:'var(--color-background-secondary)'}}/> :
                        services.map((s:any) => (
                          <button key={s.id} onClick={() => setSelService(s)}
                            className="w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors"
                            style={{border:`0.5px solid ${selService?.id===s.id?'#1D9E75':'var(--color-border-secondary)'}`,background:selService?.id===s.id?'#E1F5EE':'var(--color-background-primary)'}}>
                            <div>
                              <p className="text-[13px] font-medium" style={{color:'var(--color-text-primary)'}}>{s.name}</p>
                              <p className="text-[11px] mt-0.5" style={{color:'var(--color-text-tertiary)'}}>{s.duration} min</p>
                            </div>
                            {s.price && <span className="text-[14px] font-semibold" style={{color:'#1D9E75'}}>{s.price} €</span>}
                          </button>
                        ))}
                      </div>
                    )}

                    {bStep===2 && (
                      <div>
                        <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{color:'var(--color-text-tertiary)'}}>Date</p>
                        <div className="grid grid-cols-7 gap-1 mb-4">
                          {weekDates.map((d,i) => {
                            // Vérifier si le jour est fermé (convention app: 1=lun…7=dim)
                            const jsDay = new Date(d.iso).getDay()
                            const appDay = jsDay === 0 ? 7 : jsDay
                            const schedule = garage?.schedules?.find((s: any) => s.dayOfWeek === appDay)
                            const isClosed = schedule ? schedule.closed : false
                            return (
                              <button key={d.iso}
                                onClick={() => { if (!isClosed) { setSelDateIdx(i); setSelTime('') } }}
                                disabled={isClosed}
                                className="flex flex-col items-center py-2 rounded-lg transition-colors"
                                style={{
                                  background: isClosed ? 'transparent' : selDateIdx===i ? '#1D9E75' : 'var(--color-background-secondary)',
                                  color: isClosed ? 'var(--color-border-primary)' : selDateIdx===i ? '#fff' : 'var(--color-text-secondary)',
                                  cursor: isClosed ? 'not-allowed' : 'pointer',
                                  opacity: isClosed ? 0.4 : 1,
                                }}>
                                <span className="text-[9px] font-medium">{d.day}</span>
                                <span className="text-[13px] font-bold leading-tight">{d.date}</span>
                              </button>
                            )
                          })}
                        </div>
                        <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{color:'var(--color-text-tertiary)'}}>
                          Créneaux disponibles
                        </p>
                        {slotsLoading ? (
                          <div className="flex items-center gap-2 py-4 text-[12px]" style={{color:'var(--color-text-secondary)'}}>
                            <IconLoader2 size={14} className="animate-spin"/> Chargement des créneaux…
                          </div>
                        ) : slots.length === 0 ? (
                          <p className="text-[12px] py-3" style={{color:'var(--color-text-tertiary)'}}>
                            Aucun créneau disponible ce jour. Choisissez une autre date.
                          </p>
                        ) : (
                          <div className="grid grid-cols-3 gap-1.5">
                            {slots.map(t => (
                              <button key={t} onClick={() => setSelTime(t)}
                                className="py-2 rounded text-[12px] font-medium transition-colors"
                                style={{background:selTime===t?'#1D9E75':'var(--color-background-primary)',border:`0.5px solid ${selTime===t?'#1D9E75':'var(--color-border-secondary)'}`,color:selTime===t?'#fff':'var(--color-text-primary)'}}>
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {bStep===3 && (
                      <div className="space-y-3">
                        <p className="text-[12px] font-medium pb-1" style={{color:'var(--color-text-secondary)',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>🚗 Véhicule</p>
                        <FI label="Immatriculation *" value={plate} onChange={setPlate} placeholder="1-ABC-123" upper/>
                        <FI label="Modèle *" value={vehicle} onChange={setVehicle} placeholder="ex: Renault Clio 2021"/>
                        <FI label="Notes (optionnel)" value={notes} onChange={setNotes} placeholder="Infos complémentaires…"/>
                        <p className="text-[12px] font-medium pt-1 pb-1" style={{color:'var(--color-text-secondary)',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>👤 Vos coordonnées</p>
                        <div className="grid grid-cols-2 gap-2">
                          <FI label="Prénom *" value={firstName} onChange={setFirstName} placeholder="Jean"/>
                          <FI label="Nom *" value={lastName} onChange={setLastName} placeholder="Dupont"/>
                        </div>
                        <FI label="Email *" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com"/>
                        <FI label="Téléphone" type="tel" value={phone} onChange={setPhone} placeholder="+32 470 12 34 56"/>
                      </div>
                    )}

                    {bStep===4 && (
                      <div className="space-y-3">
                        <div className="rounded-lg p-4 space-y-2" style={{background:'var(--color-background-secondary)'}}>
                          <Row icon="🔧" label={selService?.name} sub={`${selService?.duration} min · ${selService?.price ? selService.price+'€' : 'Sur devis'}`}/>
                          <Row icon="📅" label={`${selDate?.day} ${selDate?.date} ${selDate?.month} à ${selTime}`} sub=""/>
                          <Row icon="🚗" label={vehicle} sub={plate}/>
                          <Row icon="👤" label={`${firstName} ${lastName}`} sub={email}/>
                        </div>
                        {notes && <p className="text-[12px] italic" style={{color:'var(--color-text-secondary)'}}>« {notes} »</p>}
                        <p className="text-[11px] leading-relaxed" style={{color:'var(--color-text-tertiary)'}}>
                          En confirmant, vous acceptez que le garage vous contacte pour confirmer ce rendez-vous.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 px-4 pb-4">
                    {bStep>1 && (
                      <button onClick={() => setBStep(s=>s-1)}
                        className="flex-1 py-2.5 rounded-lg text-[13px] font-medium"
                        style={{background:'var(--color-background-secondary)',color:'var(--color-text-secondary)'}}>
                        Retour
                      </button>
                    )}
                    {bStep<4 ? (
                      <button onClick={() => setBStep(s=>s+1)} disabled={!canNext()}
                        className="flex-1 py-2.5 rounded-lg text-[13px] font-medium text-white disabled:opacity-40"
                        style={{background:'#1D9E75'}}>
                        Continuer
                      </button>
                    ) : (
                      <button onClick={confirm} disabled={submitting}
                        className="flex-1 py-2.5 rounded-lg text-[13px] font-medium text-white disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{background:'#1D9E75'}}>
                        {submitting && <IconLoader2 size={14} className="animate-spin"/>}
                        {submitting ? 'Envoi…' : 'Confirmer la demande'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Horaires */}
              <div className="px-5 py-4" style={{borderTop:'0.5px solid var(--color-border-tertiary)'}}>
                <p className="text-[11px] font-medium mb-2.5 uppercase tracking-wide" style={{color:'var(--color-text-tertiary)'}}>Horaires</p>
                <div className="space-y-1">
                  {(garage.schedules||[]).map((s:any) => (
                    <div key={s.day} className="flex items-center justify-between">
                      <span className="text-[12px]" style={{color:'var(--color-text-secondary)'}}>{s.day}</span>
                      {s.closed
                        ? <span className="text-[11px] font-medium" style={{color:'#E24B4A'}}>Fermé</span>
                        : <span className="text-[12px] font-medium" style={{color:'var(--color-text-primary)'}}>{s.open} – {s.close}</span>
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

function FI({label,value,onChange,placeholder,type='text',upper=false}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string;type?:string;upper?:boolean}) {
  return (
    <div>
      <label className="block text-[11px] font-medium mb-1" style={{color:'var(--color-text-secondary)'}}>{label}</label>
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(upper?e.target.value.toUpperCase():e.target.value)}
        className="w-full px-3 py-2 text-[12px] rounded-lg focus:outline-none"
        style={{border:'0.5px solid var(--color-border-secondary)',background:'var(--color-background-secondary)',color:'var(--color-text-primary)'}}/>
    </div>
  )
}

function Row({icon,label,sub}:{icon:string;label:string;sub:string}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-base flex-shrink-0">{icon}</span>
      <div><p className="text-[12px] font-medium" style={{color:'var(--color-text-primary)'}}>{label}</p>{sub&&<p className="text-[11px]" style={{color:'var(--color-text-secondary)'}}>{sub}</p>}</div>
    </div>
  )
}
