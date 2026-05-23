'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconCheck, IconPlus, IconTrash } from '@tabler/icons-react'

const DAYS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
type Tab = 'info'|'equipe'|'schedule'|'services'|'notifications'

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative flex-shrink-0 rounded-full transition-colors"
      style={{ width:'36px', height:'20px', background: on ? '#1D9E75' : 'var(--color-border-primary)' }}>
      <span className="absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition-transform"
        style={{ transform: on ? 'translateX(18px)' : 'translateX(2px)' }}/>
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium mb-1" style={{ color:'var(--color-text-secondary)' }}>{label}</label>
      {children}
    </div>
  )
}

function Inp({ value, onChange, placeholder, type='text', rows }: { value:string; onChange:(v:string)=>void; placeholder?:string; type?:string; rows?:number }) {
  const cls = "w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
  const sty = { border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-secondary)', color:'var(--color-text-primary)' }
  if (rows) return <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} style={sty}/>
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={cls} style={sty}/>
}

export default function SettingsPage() {
  const [tab, setTab]       = useState<Tab>('info')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [loading, setLoading] = useState(true)

  const [info, setInfo] = useState({ name:'', phone:'', address:'', city:'', zip:'', desc:'' })
  const [mechanicCount, setMechanic] = useState(1)
  const [slotDuration,  setSlot]     = useState(30)
  const [schedules,     setSchedules] = useState(DAYS.map((_,i) => ({ dayOfWeek:i+1, openTime:'08:00', closeTime:'18:00', isClosed:i>=5 })))
  const [services,      setServices]  = useState<any[]>([])
  const [addSvc,        setAddSvc]    = useState(false)
  const [newSvc,        setNewSvc]    = useState({ name:'', duration:'60', price:'' })
  const [notifs,        setNotifs]    = useState({ rdvEmail:true, rdvSMS:false, reminder:true, reminderSMS:false, review:true })

  // Charger les données depuis la DB
  useEffect(() => {
    fetch('/api/garage/me')
      .then(r => r.json())
      .then(g => {
        if (g.error) return
        setInfo({ name:g.name||'', phone:g.phone||'', address:g.address||'', city:g.city||'', zip:g.zipCode||'', desc:g.description||'' })
        setMechanic(g.mechanicCount || 1)
        setSlot(g.slotDuration || 30)
        if (g.schedules?.length) {
          setSchedules(DAYS.map((_,i) => {
            const s = g.schedules.find((x:any) => x.dayOfWeek === i+1)
            return s ? { dayOfWeek:i+1, openTime:s.openTime, closeTime:s.closeTime, isClosed:s.isClosed } : { dayOfWeek:i+1, openTime:'08:00', closeTime:'18:00', isClosed:i>=5 }
          }))
        }
        if (g.services?.length) setServices(g.services)
      })
      .finally(() => setLoading(false))
  }, [])

  function updateSch(i:number, field:string, val:string|boolean) {
    setSchedules(p => p.map((s,j) => j===i ? {...s,[field]:val} : s))
  }

  async function save() {
    setSaving(true)
    await fetch('/api/garage/me', {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        name:info.name, phone:info.phone, address:info.address, city:info.city, zipCode:info.zip, description:info.desc,
        mechanicCount, slotDuration: slotDuration,
        schedules: schedules.map(s => ({ dayOfWeek:s.dayOfWeek, openTime:s.openTime, closeTime:s.closeTime, isClosed:s.isClosed })),
        services: services.map(s => ({ name:s.name, duration:s.duration, price:s.price||null })),
      }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const TABS: {id:Tab;label:string}[] = [
    {id:'info',label:'Informations'},{id:'equipe',label:'Équipe'},{id:'schedule',label:'Horaires'},
    {id:'services',label:'Services & tarifs'},{id:'notifications',label:'Notifications'},
  ]

  if (loading) return (
    <div className="flex flex-col flex-1">
      <TopBar title="Paramètres"/>
      <main className="flex-1 p-5 max-w-2xl">
        <div className="h-8 w-96 animate-pulse rounded mb-5" style={{background:'var(--color-background-tertiary)'}}/>
        <div className="rounded-[10px] h-64 animate-pulse" style={{background:'var(--color-background-tertiary)'}}/>
      </main>
    </div>
  )

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Paramètres"/>
      <main className="flex-1 p-5 max-w-2xl">
        <div className="flex gap-1 p-0.5 rounded-lg mb-5 w-fit" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-3.5 py-1.5 rounded text-[12px] font-medium transition-colors"
              style={{background:tab===t.id?'#1D9E75':'transparent',color:tab===t.id?'#fff':'var(--color-text-secondary)'}}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-[10px] p-5" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>

          {tab==='info' && (
            <div className="space-y-4">
              <h3 className="text-[14px] font-medium" style={{color:'var(--color-text-primary)'}}>Informations du garage</h3>
              <Field label="Nom du garage"><Inp value={info.name} onChange={v=>setInfo(p=>({...p,name:v}))} placeholder="Garage Dubois & Fils"/></Field>
              <Field label="Téléphone"><Inp value={info.phone} onChange={v=>setInfo(p=>({...p,phone:v}))} type="tel" placeholder="+32 2 123 45 67"/></Field>
              <Field label="Adresse"><Inp value={info.address} onChange={v=>setInfo(p=>({...p,address:v}))} placeholder="Rue de la Loi 42"/></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ville"><Inp value={info.city} onChange={v=>setInfo(p=>({...p,city:v}))} placeholder="Bruxelles"/></Field>
                <Field label="Code postal"><Inp value={info.zip} onChange={v=>setInfo(p=>({...p,zip:v}))} placeholder="1000"/></Field>
              </div>
              <Field label="Description"><Inp value={info.desc} onChange={v=>setInfo(p=>({...p,desc:v}))} rows={3} placeholder="Présentez votre garage…"/></Field>
            </div>
          )}

          {tab==='equipe' && (
            <div className="space-y-6">
              <h3 className="text-[14px] font-medium" style={{color:'var(--color-text-primary)'}}>Équipe & capacité</h3>
              <div>
                <p className="text-[13px] font-medium mb-1" style={{color:'var(--color-text-primary)'}}>Nombre de mécaniciens</p>
                <p className="text-[12px] mb-3" style={{color:'var(--color-text-secondary)'}}>Combien de RDV simultanés votre garage peut-il gérer ?</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setMechanic(p=>Math.max(1,p-1))} className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-medium" style={{border:'0.5px solid var(--color-border-secondary)',color:'var(--color-text-primary)'}}>−</button>
                  <div className="flex-1 text-center">
                    <span className="text-4xl font-semibold" style={{color:'#1D9E75'}}>{mechanicCount}</span>
                    <p className="text-[12px] mt-0.5" style={{color:'var(--color-text-secondary)'}}>{mechanicCount===1?'mécanicien':'mécaniciens'}</p>
                  </div>
                  <button onClick={() => setMechanic(p=>Math.min(10,p+1))} className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-medium" style={{border:'0.5px solid var(--color-border-secondary)',color:'var(--color-text-primary)'}}>+</button>
                </div>
                <div className="mt-3 p-3 rounded-lg" style={{background:'var(--color-background-secondary)'}}>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({length:mechanicCount}).map((_,i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg text-[12px] font-medium" style={{background:'#E1F5EE',color:'#085041'}}>Poste {i+1}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-medium mb-1" style={{color:'var(--color-text-primary)'}}>Durée minimale d'un créneau</p>
                <div className="grid grid-cols-4 gap-2">
                  {[15,30,45,60].map(d => (
                    <button key={d} onClick={() => setSlot(d)}
                      className="py-2.5 rounded-lg text-[13px] font-medium border transition-colors"
                      style={{background:slotDuration===d?'#1D9E75':'var(--color-background-primary)',borderColor:slotDuration===d?'#1D9E75':'var(--color-border-secondary)',color:slotDuration===d?'#fff':'var(--color-text-secondary)'}}>
                      {d} min
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-lg p-4" style={{background:'var(--color-primary-light)',border:'0.5px solid #9FE1CB'}}>
                <p className="text-[13px] font-medium" style={{color:'var(--color-primary-dark)'}}>
                  Capacité : <strong>{mechanicCount * Math.floor(600/slotDuration)} RDV / jour</strong>
                </p>
                <p className="text-[12px] mt-0.5" style={{color:'#085041'}}>
                  {mechanicCount} mécanicien{mechanicCount>1?'s':''} × {Math.floor(600/slotDuration)} créneaux de {slotDuration} min
                </p>
              </div>
            </div>
          )}

          {tab==='schedule' && (
            <div>
              <h3 className="text-[14px] font-medium mb-4" style={{color:'var(--color-text-primary)'}}>Horaires d'ouverture</h3>
              <div className="space-y-3">
                {DAYS.map((day,i) => (
                  <div key={day} className="flex items-center gap-3">
                    <input type="checkbox" checked={!schedules[i].isClosed} onChange={e=>updateSch(i,'isClosed',!e.target.checked)} className="rounded" style={{accentColor:'#1D9E75'}}/>
                    <span className="w-24 text-[13px] font-medium" style={{color:'var(--color-text-primary)'}}>{day}</span>
                    {!schedules[i].isClosed ? (
                      <div className="flex items-center gap-2">
                        <input type="time" value={schedules[i].openTime} onChange={e=>updateSch(i,'openTime',e.target.value)} className="px-2 py-1 text-[12px] rounded focus:outline-none" style={{border:'0.5px solid var(--color-border-secondary)',background:'var(--color-background-secondary)'}}/>
                        <span style={{color:'var(--color-text-tertiary)'}}>–</span>
                        <input type="time" value={schedules[i].closeTime} onChange={e=>updateSch(i,'closeTime',e.target.value)} className="px-2 py-1 text-[12px] rounded focus:outline-none" style={{border:'0.5px solid var(--color-border-secondary)',background:'var(--color-background-secondary)'}}/>
                      </div>
                    ) : <span className="text-[12px] italic" style={{color:'var(--color-text-tertiary)'}}>Fermé</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='services' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-medium" style={{color:'var(--color-text-primary)'}}>Services & tarifs</h3>
                <button onClick={() => setAddSvc(true)} className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{background:'var(--color-primary-light)',color:'var(--color-primary-dark)'}}>
                  <IconPlus size={13}/> Ajouter
                </button>
              </div>
              <div className="space-y-2 mb-3">
                <div className="grid text-[11px] font-medium uppercase tracking-wide px-3 py-1.5" style={{gridTemplateColumns:'1fr 80px 80px 32px',color:'var(--color-text-secondary)',background:'var(--color-background-secondary)',borderRadius:'6px'}}>
                  <span>Service</span><span className="text-center">Durée</span><span className="text-center">Prix</span><span/>
                </div>
                {services.length === 0 && <p className="text-[13px] py-4 text-center" style={{color:'var(--color-text-tertiary)'}}>Aucun service configuré</p>}
                {services.map((s:any,i:number) => (
                  <div key={i} className="grid items-center px-3 py-2.5 rounded-lg" style={{gridTemplateColumns:'1fr 80px 80px 32px',border:'0.5px solid var(--color-border-tertiary)'}}>
                    <span className="text-[13px] font-medium" style={{color:'var(--color-text-primary)'}}>{s.name}</span>
                    <span className="text-[12px] text-center" style={{color:'var(--color-text-secondary)'}}>{s.duration} min</span>
                    <span className="text-[12px] text-center" style={{color:'var(--color-text-secondary)'}}>{s.price ? `${s.price} €` : '—'}</span>
                    <button onClick={() => setServices(p=>p.filter((_,j)=>j!==i))} className="p-1 rounded" style={{color:'var(--color-text-tertiary)'}}><IconTrash size={13}/></button>
                  </div>
                ))}
              </div>
              {addSvc && (
                <div className="rounded-lg p-3 space-y-2" style={{background:'var(--color-primary-light)',border:'0.5px solid #9FE1CB'}}>
                  <p className="text-[12px] font-medium" style={{color:'var(--color-primary-dark)'}}>Nouveau service</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input placeholder="Nom" value={newSvc.name} onChange={e=>setNewSvc(p=>({...p,name:e.target.value}))} className="col-span-1 px-2 py-1.5 text-[12px] rounded focus:outline-none" style={{border:'0.5px solid #9FE1CB',background:'#fff'}}/>
                    <input placeholder="Durée (min)" type="number" value={newSvc.duration} onChange={e=>setNewSvc(p=>({...p,duration:e.target.value}))} className="px-2 py-1.5 text-[12px] rounded focus:outline-none" style={{border:'0.5px solid #9FE1CB',background:'#fff'}}/>
                    <input placeholder="Prix (€)" type="number" value={newSvc.price} onChange={e=>setNewSvc(p=>({...p,price:e.target.value}))} className="px-2 py-1.5 text-[12px] rounded focus:outline-none" style={{border:'0.5px solid #9FE1CB',background:'#fff'}}/>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-[12px] font-medium px-3 py-1.5 rounded-lg text-white" style={{background:'#1D9E75'}}
                      onClick={() => { if(!newSvc.name) return; setServices(p=>[...p,{name:newSvc.name,duration:parseInt(newSvc.duration)||60,price:parseFloat(newSvc.price)||null}]); setAddSvc(false); setNewSvc({name:'',duration:'60',price:''}) }}>
                      Ajouter
                    </button>
                    <button className="text-[12px] px-3 py-1.5 rounded-lg" style={{background:'#fff',color:'var(--color-text-secondary)'}} onClick={()=>setAddSvc(false)}>Annuler</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab==='notifications' && (
            <div>
              <h3 className="text-[14px] font-medium mb-4" style={{color:'var(--color-text-primary)'}}>Préférences de notifications</h3>
              <div className="divide-y" style={{borderTop:'0.5px solid var(--color-border-tertiary)',borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                {[
                  {key:'rdvEmail',    label:'Nouveau RDV',       sub:'Par email'},
                  {key:'rdvSMS',      label:'Nouveau RDV',       sub:'Par SMS (Plan Pro)'},
                  {key:'reminder',    label:'Rappel 24h avant',  sub:'Email au client'},
                  {key:'reminderSMS', label:'Rappel 24h avant',  sub:'SMS au client (Plan Pro)'},
                  {key:'review',      label:'Nouvel avis client', sub:'Par email'},
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[13px] font-medium" style={{color:'var(--color-text-primary)'}}>{n.label}</p>
                      <p className="text-[11px]" style={{color:'var(--color-text-secondary)'}}>{n.sub}</p>
                    </div>
                    <Toggle on={notifs[n.key as keyof typeof notifs]} onChange={() => setNotifs(p=>({...p,[n.key]:!p[n.key as keyof typeof p]}))}/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white disabled:opacity-60"
            style={{background:'#1D9E75'}}>
            {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </button>
          {saved && <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{color:'#1D9E75'}}><IconCheck size={13}/> Sauvegardé !</span>}
        </div>
      </main>
    </div>
  )
}
