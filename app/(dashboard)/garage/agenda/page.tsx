'use client'

import { useState, useMemo, useEffect } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import {
  IconChevronLeft, IconChevronRight, IconPlus, IconX,
  IconPhone, IconCar, IconClock, IconCheck, IconTrash,
  IconCalendar, IconUser,
} from '@tabler/icons-react'

/* ─── Types ─────────────────────────────────────────────── */
type Status = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
interface Appt {
  id: string; clientName: string; clientPhone: string
  service: string; vehicle: string; plate: string
  date: string; startTime: string; endTime: string
  status: Status; notes: string; color: string
}

/* ─── Helpers ────────────────────────────────────────────── */
function todayStr() { return new Date().toISOString().split('T')[0] }

// Convertit un RDV API → format interne Appt
function apiToAppt(a: any): Appt {
  return {
    id:          a.id,
    clientName:  `${a.client?.firstName ?? ''} ${a.client?.lastName ?? ''}`.trim() || 'Client',
    clientPhone: a.client?.phone || '',
    service:     a.service?.name || '',
    vehicle:     a.vehicleModel || '',
    plate:       a.vehiclePlate || '',
    date:        a.date?.split('T')[0] ?? '',
    startTime:   a.startTime,
    endTime:     a.endTime,
    status:      a.status as Status,
    notes:       a.notes || '',
    color:       STATUS_COLOR[a.status as Status] ?? 'teal',
  }
}

const DEFAULT_HOURS = [8,9,10,11,12,13,14,15,16,17]
const SLOT_H = 56 // px par heure

/* ─── Config couleurs ────────────────────────────────────── */
const C: Record<string, { bg: string; border: string; text: string; dotBg: string }> = {
  teal:  { bg:'#E1F5EE', border:'#1D9E75', text:'#085041', dotBg:'#1D9E75' },
  amber: { bg:'#FAEEDA', border:'#EF9F27', text:'#633806', dotBg:'#EF9F27' },
  blue:  { bg:'#E6F1FB', border:'#3B82F6', text:'#185FA5', dotBg:'#3B82F6' },
  done:  { bg:'#F3F4F6', border:'#D1D5DB', text:'#6B6E72', dotBg:'#D1D5DB' },
  red:   { bg:'#FCEBEB', border:'#E24B4A', text:'#A32D2D', dotBg:'#E24B4A' },
}
const STATUS_COLOR: Record<Status, string> = {
  CONFIRMED:'teal', PENDING:'amber', IN_PROGRESS:'blue', DONE:'done', CANCELLED:'red'
}
const STATUS_LABEL: Record<Status, string> = {
  CONFIRMED:'Confirmé', PENDING:'En attente', IN_PROGRESS:'En cours', DONE:'Terminé', CANCELLED:'Annulé'
}

function colorForAppt(a: Appt) { return C[STATUS_COLOR[a.status]] ?? C.teal }

/* ─── Helpers temps ──────────────────────────────────────── */
function toMin(t: string) { const [h,m] = t.split(':').map(Number); return h*60+m }
function fmtTime(t: string) { return t }

/* ─── Helpers semaine ────────────────────────────────────── */
const DAY_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const DAY_FULL = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
const MONTH_FR = ['janv','févr','mars','avr','mai','juin','juil','août','sept','oct','nov','déc']

function getMonday(d: Date): Date {
  const dt = new Date(d)
  const day = dt.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
  dt.setDate(dt.getDate() + diff)
  dt.setHours(0,0,0,0)
  return dt
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}
function isoDate(d: Date): string { return d.toISOString().split('T')[0] }
function sameWeek(a: Appt, monday: Date): boolean {
  const end = addDays(monday, 6)
  const ad = new Date(a.date)
  return ad >= monday && ad <= end
}

/* ─── (clients & services chargés depuis la DB dans le composant) ── */

/* ════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════════════════ */
export default function AgendaPage() {
  const [view, setView]     = useState<'week'|'day'>('week')
  const [monday, setMonday] = useState(() => getMonday(new Date()))
  const [dayIdx, setDayIdx] = useState(0)
  const [appts, setAppts]   = useState<Appt[]>([])
  const [loadingAppts, setLoadingAppts] = useState(true)
  const [garageServices, setGarageServices] = useState<any[]>([])
  const [garageSchedules, setGarageSchedules] = useState<any[]>([])
  const [garageSlotDuration, setGarageSlotDuration] = useState(30)
  const [selected, setSelected] = useState<Appt|null>(null)
  const [adding, setAdding]     = useState(false)
  const [addDate, setAddDate]   = useState('')
  const [addHour, setAddHour]   = useState(9)

  // Nouvelle réservation form
  const [newClient,  setNewClient]  = useState('')
  const [newPhone,   setNewPhone]   = useState('')
  const [newService, setNewService] = useState('')
  const [newVehicle, setNewVehicle] = useState('')
  const [newPlate,   setNewPlate]   = useState('')
  const [newDate,    setNewDate]    = useState('')
  const [newTime,    setNewTime]    = useState('09:00')
  const [newNotes,   setNewNotes]   = useState('')

  // Charger les RDV depuis la DB
  useEffect(() => {
    setLoadingAppts(true)
    fetch('/api/garage/appointments')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setAppts(d.map(apiToAppt)) })
      .finally(() => setLoadingAppts(false))
    // Charger les services + horaires pour le formulaire d'ajout
    fetch('/api/garage/me')
      .then(r => r.json())
      .then(g => {
        if (g.services?.length)   setGarageServices(g.services)
        if (g.schedules?.length)  setGarageSchedules(g.schedules)
        if (g.slotDuration)       setGarageSlotDuration(g.slotDuration)
      })
  }, [])

  const weekDays = useMemo(() =>
    Array.from({length:5}, (_,i) => addDays(monday, i))
  , [monday])

  // Heures affichées selon les horaires du garage (min openTime → max closeTime)
  const HOURS = useMemo(() => {
    if (!garageSchedules.length) return DEFAULT_HOURS
    const opens  = garageSchedules.filter(s => !s.isClosed).map(s => parseInt(s.openTime))
    const closes = garageSchedules.filter(s => !s.isClosed).map(s => parseInt(s.closeTime))
    if (!opens.length) return DEFAULT_HOURS
    const minH = Math.min(...opens)
    const maxH = Math.max(...closes)
    return Array.from({ length: maxH - minH }, (_, i) => minH + i)
  }, [garageSchedules])

  const viewDate = addDays(monday, dayIdx)

  function prevWeek() { setMonday(d => addDays(d, -7)) }
  function nextWeek() { setMonday(d => addDays(d,  7)) }
  function goToday()  { setMonday(getMonday(new Date())); setDayIdx(0) }

  function apptsForDay(date: string) {
    return appts.filter(a => a.date === date).sort((a,b) => toMin(a.startTime) - toMin(b.startTime))
  }

  function openAdd(date: string, hour: number) {
    setAddDate(date); setAddHour(hour)
    setNewDate(date); setNewTime(`${String(hour).padStart(2,'0')}:00`)
    setNewClient(''); setNewPhone(''); setNewService(''); setNewVehicle(''); setNewPlate(''); setNewNotes('')
    setAdding(true)
  }

  async function submitAdd() {
    if (!newClient || !newService) return
    const svc = garageServices.find(s => s.name === newService) || { duration: 60 }
    const dur = svc.duration
    const [h,m] = newTime.split(':').map(Number)
    const endMin = h*60 + m + dur
    const endTime = `${String(Math.floor(endMin/60)).padStart(2,'0')}:${String(endMin%60).padStart(2,'0')}`

    // Optimistic update
    const tempAppt: Appt = {
      id: Date.now().toString(),
      clientName: newClient, clientPhone: newPhone,
      service: newService, vehicle: newVehicle, plate: newPlate,
      date: newDate, startTime: newTime, endTime,
      status: 'CONFIRMED', notes: newNotes, color: 'teal',
    }
    setAppts(p => [...p, tempAppt])
    setAdding(false)

    // Sauvegarder en DB (si on a un vrai serviceId)
    const svcObj = garageServices.find(s => s.name === newService)
    if (svcObj?.id) {
      try {
        const res = await fetch('/api/garage/appointments', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            clientId: null, // sera géré côté serveur si on a un vrai client
            serviceId: svcObj.id,
            date: newDate, startTime: newTime, endTime,
            vehiclePlate: newPlate, vehicleModel: newVehicle, notes: newNotes,
          }),
        })
        if (res.ok) {
          const saved = await res.json()
          setAppts(p => p.map(a => a.id === tempAppt.id ? apiToAppt(saved) : a))
        }
      } catch { /* on garde l'optimistic */ }
    }
  }

  async function updateStatus(id: string, status: Status) {
    setAppts(p => p.map(a => a.id === id ? { ...a, status, color: STATUS_COLOR[status] } : a))
    setSelected(p => p ? { ...p, status, color: STATUS_COLOR[status] } : null)
    await fetch(`/api/garage/appointments/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ status }),
    }).catch(console.error)
  }

  async function deleteAppt(id: string) {
    setAppts(p => p.filter(a => a.id !== id))
    setSelected(null)
    await fetch(`/api/garage/appointments/${id}`, { method: 'DELETE' }).catch(console.error)
  }

  const todayStr2 = isoDate(new Date())
  const weekLabel = `${weekDays[0].getDate()} – ${weekDays[4].getDate()} ${MONTH_FR[weekDays[4].getMonth()]} ${weekDays[4].getFullYear()}`
  const dayLabel  = `${DAY_FULL[viewDate.getDay()]} ${viewDate.getDate()} ${MONTH_FR[viewDate.getMonth()]}`

  /* ─── subtitle TopBar ──────────────────────────────────── */
  const todayAppts = apptsForDay(todayStr2)
  const subtitle = `${todayAppts.length} RDV aujourd'hui · ${appts.filter(a=>a.status==='PENDING').length} en attente`

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar title="Agenda" subtitle={subtitle} />

      <main className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
        {/* ── Barre de contrôle ─────────────────────────── */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Vue semaine/jour */}
            <div className="flex gap-0.5 p-0.5 rounded-lg" style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
              {(['week','day'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className="px-3 py-1.5 rounded text-[12px] font-medium transition-colors"
                  style={{ background: view===v ? '#1D9E75' : 'transparent', color: view===v ? '#fff' : 'var(--color-text-secondary)' }}>
                  {v==='week' ? 'Semaine' : 'Jour'}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <button onClick={prevWeek} className="w-8 h-8 flex items-center justify-center rounded transition-colors"
              style={{ border:'0.5px solid var(--color-border-tertiary)', color:'var(--color-text-secondary)' }}>
              <IconChevronLeft size={15}/>
            </button>
            <span className="text-[13px] font-medium min-w-[160px] text-center" style={{ color:'var(--color-text-primary)' }}>
              {view==='week' ? weekLabel : dayLabel}
            </span>
            <button onClick={nextWeek} className="w-8 h-8 flex items-center justify-center rounded transition-colors"
              style={{ border:'0.5px solid var(--color-border-tertiary)', color:'var(--color-text-secondary)' }}>
              <IconChevronRight size={15}/>
            </button>
            <button onClick={goToday} className="px-2.5 py-1.5 rounded text-[12px] transition-colors"
              style={{ border:'0.5px solid var(--color-border-tertiary)', color:'var(--color-text-secondary)' }}>
              Aujourd'hui
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Légende */}
            <div className="flex items-center gap-3">
              {[['teal','Confirmé'],['amber','En attente'],['blue','En cours'],['done','Terminé']].map(([c,l]) => (
                <div key={c} className="flex items-center gap-1.5 text-[11px]" style={{ color:'var(--color-text-secondary)' }}>
                  <span className="w-2 h-2 rounded-sm" style={{ background: C[c].border }}/>
                  {l}
                </div>
              ))}
            </div>
            <button onClick={() => openAdd(view==='week' ? todayStr2 : isoDate(viewDate), 9)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white"
              style={{ background:'#1D9E75' }}>
              <IconPlus size={13}/> Ajouter un RDV
            </button>
          </div>
        </div>

        {/* ══ VUE SEMAINE ══════════════════════════════════ */}
        {view === 'week' && (
          <div className="flex-1 rounded-[10px] overflow-hidden flex flex-col"
            style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
            {/* En-têtes jours */}
            <div className="grid flex-shrink-0" style={{ gridTemplateColumns:`52px repeat(5,1fr)`, borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
              <div style={{ borderRight:'0.5px solid var(--color-border-tertiary)', background:'var(--color-background-secondary)' }}/>
              {weekDays.map((d, i) => {
                const iso   = isoDate(d)
                const isToday = iso === todayStr2
                const count = apptsForDay(iso).length
                const jsDay  = d.getDay()
                const appDay = jsDay === 0 ? 7 : jsDay
                const sched  = garageSchedules.find((s: any) => s.dayOfWeek === appDay)
                const isClosed = sched ? sched.isClosed : false
                return (
                  <div key={i} className="py-2 px-3 flex items-center justify-between"
                    onClick={() => { setDayIdx(i); setView('day') }}
                    style={{
                      background: isClosed ? 'var(--color-background-secondary)' : isToday ? '#E1F5EE' : 'var(--color-background-secondary)',
                      borderRight: i<4 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                      cursor:'pointer',
                      opacity: isClosed ? 0.5 : 1,
                    }}>
                    <div>
                      <p className="text-[10px] font-medium" style={{ color: isToday?'#1D9E75':'var(--color-text-tertiary)' }}>{DAY_FR[d.getDay()]}</p>
                      <p className="text-[16px] font-semibold leading-tight" style={{ color: isToday?'#1D9E75':'var(--color-text-primary)' }}>{d.getDate()}</p>
                      {isClosed && <p className="text-[9px]" style={{ color:'var(--color-text-tertiary)' }}>Fermé</p>}
                    </div>
                    {count > 0 && (
                      <span className="text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: isToday?'#1D9E75':'var(--color-background-tertiary)', color: isToday?'#fff':'var(--color-text-secondary)' }}>
                        {count}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Grille */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid" style={{ gridTemplateColumns:`52px repeat(5,1fr)` }}>
                {/* Colonne heures + colonnes jours */}
                {HOURS.map(h => (
                  <>
                    {/* Heure */}
                    <div key={`h${h}`} className="py-0 flex items-start justify-end pr-2 pt-1"
                      style={{ height:`${SLOT_H}px`, borderBottom:'0.5px solid var(--color-border-tertiary)', borderRight:'0.5px solid var(--color-border-tertiary)' }}>
                      <span className="text-[10px]" style={{ color:'var(--color-text-tertiary)' }}>{h}:00</span>
                    </div>

                    {/* Cellules jours */}
                    {weekDays.map((d, di) => {
                      const iso   = isoDate(d)
                      const isToday = iso === todayStr2
                      const jsDay2  = d.getDay()
                      const appDay2 = jsDay2 === 0 ? 7 : jsDay2
                      const sched2  = garageSchedules.find((s: any) => s.dayOfWeek === appDay2)
                      const isClosed2 = sched2 ? sched2.isClosed : false
                      const dayAppts = apptsForDay(iso).filter(a => {
                        const s = toMin(a.startTime); const e = toMin(a.endTime)
                        return s >= h*60 && s < (h+1)*60
                      })
                      return (
                        <div key={`${h}-${di}`} className="relative group"
                          style={{
                            height:`${SLOT_H}px`,
                            borderBottom:'0.5px solid var(--color-border-tertiary)',
                            borderRight: di<4 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                            background: isClosed2
                              ? 'repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(0,0,0,0.02) 4px,rgba(0,0,0,0.02) 8px)'
                              : isToday ? '#FAFFF9' : 'transparent',
                          }}
                          onClick={() => openAdd(iso, h)}>
                          {/* Hover indicator */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            style={{ background:'rgba(29,158,117,0.04)' }}>
                            <IconPlus size={12} style={{ color:'#1D9E75' }}/>
                          </div>

                          {/* Appointments */}
                          {dayAppts.map(a => {
                            const col = colorForAppt(a)
                            const startMin = toMin(a.startTime) - h*60
                            const durMin   = toMin(a.endTime) - toMin(a.startTime)
                            const topPct   = (startMin / 60) * 100
                            const hPct     = Math.max((durMin / 60) * 100, 30)
                            return (
                              <div key={a.id}
                                className="absolute left-0.5 right-0.5 rounded px-1.5 py-1 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                                style={{
                                  top:`${topPct}%`, height:`${hPct}%`,
                                  background: col.bg,
                                  borderLeft: `2.5px solid ${col.border}`,
                                  zIndex:2,
                                }}
                                onClick={e => { e.stopPropagation(); setSelected(a) }}>
                                <p className="text-[10px] font-semibold truncate leading-tight" style={{ color:col.text }}>{a.clientName}</p>
                                <p className="text-[9px] truncate leading-tight" style={{ color:col.text, opacity:0.75 }}>{a.service}</p>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ VUE JOUR ═════════════════════════════════════ */}
        {view === 'day' && (
          <div className="flex gap-3 flex-1 min-h-0">
            {/* Sélecteur de jour (mini semaine) */}
            <div className="w-48 flex-shrink-0 flex flex-col gap-1">
              {weekDays.map((d, i) => {
                const iso     = isoDate(d)
                const isToday = iso === todayStr2
                const isActive= i === dayIdx
                const count   = apptsForDay(iso).length
                return (
                  <button key={i} onClick={() => setDayIdx(i)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left"
                    style={{
                      background: isActive ? '#1D9E75' : isToday ? '#E1F5EE' : 'var(--color-background-primary)',
                      border: '0.5px solid ' + (isActive ? '#1D9E75' : 'var(--color-border-tertiary)'),
                      color: isActive ? '#fff' : isToday ? '#085041' : 'var(--color-text-primary)',
                    }}>
                    <div>
                      <p className="text-[11px] font-medium opacity-70">{DAY_FR[d.getDay()]}</p>
                      <p className="text-[14px] font-semibold leading-tight">{d.getDate()}</p>
                    </div>
                    {count > 0 && (
                      <span className="text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: isActive?'rgba(255,255,255,0.3)':isToday?'#1D9E75':'var(--color-background-tertiary)', color: isActive||isToday?'#fff':'var(--color-text-secondary)' }}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Timeline du jour */}
            <div className="flex-1 rounded-[10px] overflow-hidden flex flex-col"
              style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
              <div className="px-4 py-3 flex items-center justify-between flex-shrink-0"
                style={{ borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                <div>
                  <p className="text-[13px] font-medium" style={{ color:'var(--color-text-primary)' }}>{dayLabel}</p>
                  <p className="text-[11px]" style={{ color:'var(--color-text-secondary)' }}>
                    {apptsForDay(isoDate(viewDate)).length} rendez-vous
                  </p>
                </div>
                <button onClick={() => openAdd(isoDate(viewDate), 9)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
                  style={{ background:'var(--color-primary-light)', color:'var(--color-primary-dark)' }}>
                  <IconPlus size={12}/> Ajouter
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {apptsForDay(isoDate(viewDate)).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-2">
                    <IconCalendar size={28} style={{ color:'var(--color-text-tertiary)' }}/>
                    <p className="text-[13px]" style={{ color:'var(--color-text-secondary)' }}>Aucun RDV ce jour</p>
                    <button onClick={() => openAdd(isoDate(viewDate), 9)}
                      className="text-[12px] font-medium mt-1" style={{ color:'#1D9E75' }}>
                      + Ajouter un rendez-vous
                    </button>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor:'var(--color-border-tertiary)' }}>
                    {apptsForDay(isoDate(viewDate)).map(a => {
                      const col = colorForAppt(a)
                      return (
                        <div key={a.id}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50"
                          onClick={() => setSelected(a)}>
                          <div className="flex-shrink-0 text-right w-10">
                            <p className="text-[12px] font-medium" style={{ color:'var(--color-text-primary)' }}>{a.startTime}</p>
                            <p className="text-[10px]" style={{ color:'var(--color-text-tertiary)' }}>{a.endTime}</p>
                          </div>
                          <div className="w-[3px] self-stretch rounded-full flex-shrink-0" style={{ background:col.border }}/>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium truncate" style={{ color:'var(--color-text-primary)' }}>{a.clientName}</p>
                            <p className="text-[11px] truncate" style={{ color:'var(--color-text-secondary)' }}>
                              {a.service} · {a.vehicle}
                            </p>
                            {a.notes && <p className="text-[11px] italic mt-0.5 truncate" style={{ color:'var(--color-text-tertiary)' }}>{a.notes}</p>}
                          </div>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background:col.bg, color:col.text }}>
                            {STATUS_LABEL[a.status]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ══ MODAL DÉTAIL RDV ════════════════════════════════ */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-[16px] font-semibold" style={{ color:'var(--color-text-primary)' }}>{selected.clientName}</h2>
                <p className="text-[12px] mt-0.5" style={{ color:'var(--color-text-secondary)' }}>{selected.service}</p>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ background:colorForAppt(selected).bg, color:colorForAppt(selected).text }}>
                {STATUS_LABEL[selected.status]}
              </span>
            </div>

            <div className="space-y-2.5 mb-5">
              <Row icon={IconClock}  label="Horaire"    value={`${selected.date} · ${selected.startTime} – ${selected.endTime}`} />
              <Row icon={IconPhone}  label="Téléphone"  value={selected.clientPhone} />
              <Row icon={IconCar}    label="Véhicule"   value={`${selected.vehicle} · ${selected.plate}`} />
              {selected.notes && <Row icon={IconUser} label="Notes" value={selected.notes} />}
            </div>

            {/* Changer statut */}
            <div className="mb-5">
              <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{ color:'var(--color-text-tertiary)' }}>Changer le statut</p>
              <div className="flex flex-wrap gap-2">
                {(['CONFIRMED','IN_PROGRESS','DONE','CANCELLED'] as Status[]).map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors"
                    style={{
                      background: selected.status===s ? C[STATUS_COLOR[s]].bg : 'transparent',
                      borderColor: selected.status===s ? C[STATUS_COLOR[s]].border : 'var(--color-border-secondary)',
                      color: selected.status===s ? C[STATUS_COLOR[s]].text : 'var(--color-text-secondary)',
                    }}>
                    {selected.status===s && '✓ '}{STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4" style={{ borderTop:'0.5px solid var(--color-border-tertiary)' }}>
              <button onClick={() => setSelected(null)}
                className="flex-1 py-2 rounded-lg text-[13px] font-medium"
                style={{ background:'var(--color-background-secondary)', color:'var(--color-text-secondary)' }}>
                Fermer
              </button>
              <button onClick={() => deleteAppt(selected.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium"
                style={{ background:'#FCEBEB', color:'#A32D2D' }}>
                <IconTrash size={14}/> Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ MODAL AJOUTER RDV ══════════════════════════════ */}
      {adding && (
        <Modal onClose={() => setAdding(false)} title="Nouveau rendez-vous">
          <div className="space-y-3">
            {/* Client */}
            <div>
              <label className="block text-[12px] font-medium mb-1" style={{ color:'var(--color-text-secondary)' }}>Client</label>
              <input value={newClient} onChange={e => setNewClient(e.target.value)}
                placeholder="Nom du client"
                className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)', color:'var(--color-text-primary)' }}
              />
            </div>
            <FieldAdd label="Téléphone"><input value={newPhone} onChange={e=>setNewPhone(e.target.value)} placeholder="+32 470…" className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none" style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)' }}/></FieldAdd>
            <div>
              <label className="block text-[12px] font-medium mb-1" style={{ color:'var(--color-text-secondary)' }}>Service</label>
              <select value={newService} onChange={e=>setNewService(e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)', color:'var(--color-text-primary)' }}>
                <option value="">Choisir un service…</option>
                {garageServices.map(s=><option key={s.name} value={s.name}>{s.name} ({s.duration} min{s.price ? ` · ${s.price}€` : ''})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FieldAdd label="Date"><input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none" style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)' }}/></FieldAdd>
              <FieldAdd label="Heure"><input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none" style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)' }}/></FieldAdd>
            </div>
            <FieldAdd label="Véhicule"><input value={newVehicle} onChange={e=>setNewVehicle(e.target.value)} placeholder="ex: Renault Clio 2021" className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none" style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)' }}/></FieldAdd>
            <FieldAdd label="Immatriculation"><input value={newPlate} onChange={e=>setNewPlate(e.target.value.toUpperCase())} placeholder="ex: 1-ABC-123" className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none" style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)' }}/></FieldAdd>
            <FieldAdd label="Notes (optionnel)"><textarea rows={2} value={newNotes} onChange={e=>setNewNotes(e.target.value)} placeholder="Informations complémentaires…" className="w-full px-3 py-2 text-[13px] rounded-lg resize-none focus:outline-none" style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)' }}/></FieldAdd>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setAdding(false)}
                className="flex-1 py-2 rounded-lg text-[13px]"
                style={{ background:'var(--color-background-secondary)', color:'var(--color-text-secondary)' }}>
                Annuler
              </button>
              <button onClick={submitAdd} disabled={!newClient || !newService}
                className="flex-1 py-2 rounded-lg text-[13px] font-medium text-white disabled:opacity-50"
                style={{ background:'#1D9E75' }}>
                Créer le RDV
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ─── Sous-composants ────────────────────────────────────── */
function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
      <div className="relative w-full max-w-md rounded-xl shadow-xl overflow-auto max-h-[90vh]"
        style={{ background:'var(--color-background-primary)' }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
          <p className="text-[14px] font-semibold" style={{ color:'var(--color-text-primary)' }}>
            {title || 'Détail du rendez-vous'}
          </p>
          <button onClick={onClose} style={{ color:'var(--color-text-tertiary)' }}><IconX size={18}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function Row({ icon: Icon, label, value }: { icon: typeof IconClock; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color:'var(--color-text-tertiary)' }}/>
      <div>
        <p className="text-[10px] uppercase tracking-wide font-medium" style={{ color:'var(--color-text-tertiary)' }}>{label}</p>
        <p className="text-[13px]" style={{ color:'var(--color-text-primary)' }}>{value}</p>
      </div>
    </div>
  )
}

function FieldAdd({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium mb-1" style={{ color:'var(--color-text-secondary)' }}>{label}</label>
      {children}
    </div>
  )
}
