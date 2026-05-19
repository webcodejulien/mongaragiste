'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconCheck, IconPlus, IconTrash } from '@tabler/icons-react'

const DAYS   = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
const ALL_SVC = ['Vidange','Freins','Pneus','Révision','Climatisation','Diagnostic','Embrayage','Carrosserie','Pare-brise','Batterie','Distribution','Échappement','Suspension','Direction','Électricité']

const INIT_SCHEDULES = [
  { day:0, open:'08:00', close:'18:00', closed:false },
  { day:1, open:'08:00', close:'18:00', closed:false },
  { day:2, open:'08:00', close:'18:00', closed:false },
  { day:3, open:'08:00', close:'18:00', closed:false },
  { day:4, open:'08:00', close:'18:00', closed:false },
  { day:5, open:'09:00', close:'13:00', closed:false },
  { day:6, open:'',      close:'',      closed:true  },
]

const INIT_SERVICES = [
  { id:'1', name:'Vidange',               duration:30, price:30  },
  { id:'2', name:'Freins avant',          duration:60, price:80  },
  { id:'3', name:'Révision complète',     duration:90, price:150 },
  { id:'4', name:'Pneus (x4)',            duration:60, price:80  },
  { id:'5', name:'Diagnostic électronique',duration:30,price:50  },
]

type Tab = 'info'|'schedule'|'services'|'notifications'

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className="relative flex-shrink-0 transition-colors rounded-full"
      style={{ width:'36px', height:'20px', background: on ? '#1D9E75' : 'var(--color-border-primary)' }}>
      <span className="absolute top-[2px] w-4 h-4 bg-white rounded-full shadow transition-transform"
        style={{ transform: on ? 'translateX(18px)' : 'translateX(2px)' }} />
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</label>
      {children}
    </div>
  )
}

function InputField({ value, onChange, placeholder, type='text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type}
      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-1"
      style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-primary)' }} />
  )
}

export default function SettingsPage() {
  const [tab, setTab]           = useState<Tab>('info')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [schedules, setSchedules] = useState(INIT_SCHEDULES)
  const [services, setServices] = useState(INIT_SERVICES)
  const [addSvc, setAddSvc]     = useState(false)
  const [newSvc, setNewSvc]     = useState({ name:'', duration:'60', price:'' })
  const [info, setInfo]         = useState({ name:'Garage Dubois & Fils', phone:'+32 2 123 45 67', address:'Rue de la Loi 42', city:'Bruxelles', zip:'1000', desc:'Votre garagiste de confiance depuis 1985.' })
  const [notifs, setNotifs]     = useState({ rdvEmail:true, rdvSMS:false, reminder:true, reminderSMS:false, review:true })

  function updateSch(i: number, field: string, val: string|boolean) {
    setSchedules(p => p.map((s,j) => j===i ? {...s, [field]:val} : s))
  }

  async function save() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const TABS: { id: Tab; label: string }[] = [
    { id:'info',          label:'Informations'     },
    { id:'schedule',      label:'Horaires'         },
    { id:'services',      label:'Services & tarifs'},
    { id:'notifications', label:'Notifications'    },
  ]

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Paramètres" />
      <main className="flex-1 p-5 max-w-2xl">
        {/* Tabs */}
        <div className="flex gap-1 p-0.5 rounded-lg mb-5 w-fit" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-3.5 py-1.5 rounded text-[12px] font-medium transition-colors"
              style={{ background: tab === t.id ? '#1D9E75' : 'transparent', color: tab === t.id ? '#fff' : 'var(--color-text-secondary)' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>

          {tab === 'info' && (
            <div className="space-y-4">
              <h3 className="text-[14px] font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Informations du garage</h3>
              <Field label="Nom du garage"><InputField value={info.name} onChange={v => setInfo(p=>({...p,name:v}))} /></Field>
              <Field label="Téléphone"><InputField value={info.phone} onChange={v => setInfo(p=>({...p,phone:v}))} /></Field>
              <Field label="Adresse"><InputField value={info.address} onChange={v => setInfo(p=>({...p,address:v}))} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ville"><InputField value={info.city} onChange={v => setInfo(p=>({...p,city:v}))} /></Field>
                <Field label="Code postal"><InputField value={info.zip} onChange={v => setInfo(p=>({...p,zip:v}))} /></Field>
              </div>
              <Field label="Description">
                <textarea rows={3} value={info.desc} onChange={e => setInfo(p=>({...p,desc:e.target.value}))}
                  className="w-full px-3 py-2 text-[13px] rounded-lg resize-none focus:outline-none"
                  style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-primary)' }} />
              </Field>
            </div>
          )}

          {tab === 'schedule' && (
            <div>
              <h3 className="text-[14px] font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Horaires d'ouverture</h3>
              <div className="space-y-3">
                {DAYS.map((day, i) => (
                  <div key={day} className="flex items-center gap-3">
                    <input type="checkbox" checked={!schedules[i].closed} onChange={e => updateSch(i,'closed',!e.target.checked)}
                      className="rounded" style={{ accentColor: '#1D9E75' }} />
                    <span className="w-24 text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{day}</span>
                    {!schedules[i].closed ? (
                      <div className="flex items-center gap-2">
                        <input type="time" value={schedules[i].open} onChange={e => updateSch(i,'open',e.target.value)}
                          className="px-2 py-1 text-[12px] rounded focus:outline-none"
                          style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)' }} />
                        <span style={{ color: 'var(--color-text-tertiary)' }}>–</span>
                        <input type="time" value={schedules[i].close} onChange={e => updateSch(i,'close',e.target.value)}
                          className="px-2 py-1 text-[12px] rounded focus:outline-none"
                          style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)' }} />
                      </div>
                    ) : (
                      <span className="text-[12px] italic" style={{ color: 'var(--color-text-tertiary)' }}>Fermé</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'services' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-medium" style={{ color: 'var(--color-text-primary)' }}>Services & tarifs</h3>
                <button onClick={() => setAddSvc(true)}
                  className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                  <IconPlus size={13} /> Ajouter
                </button>
              </div>
              <div className="space-y-2 mb-3">
                <div className="grid text-[11px] font-medium uppercase tracking-wide px-3 py-1.5"
                  style={{ gridTemplateColumns: '1fr 80px 80px 32px', color: 'var(--color-text-secondary)', background: 'var(--color-background-secondary)', borderRadius: '6px' }}>
                  <span>Service</span><span className="text-center">Durée</span><span className="text-center">Prix</span><span />
                </div>
                {services.map(s => (
                  <div key={s.id} className="grid items-center px-3 py-2.5 rounded-lg"
                    style={{ gridTemplateColumns: '1fr 80px 80px 32px', border: '0.5px solid var(--color-border-tertiary)' }}>
                    <span className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{s.name}</span>
                    <span className="text-[12px] text-center" style={{ color: 'var(--color-text-secondary)' }}>{s.duration} min</span>
                    <span className="text-[12px] text-center" style={{ color: 'var(--color-text-secondary)' }}>{s.price} €</span>
                    <button onClick={() => setServices(p => p.filter(x => x.id !== s.id))}
                      className="p-1 rounded transition-colors" style={{ color: 'var(--color-text-tertiary)' }}>
                      <IconTrash size={13} />
                    </button>
                  </div>
                ))}
              </div>
              {addSvc && (
                <div className="rounded-lg p-3 space-y-2" style={{ background: 'var(--color-primary-light)', border: '0.5px solid #9FE1CB' }}>
                  <p className="text-[12px] font-medium" style={{ color: 'var(--color-primary-dark)' }}>Nouveau service</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input placeholder="Nom" value={newSvc.name} onChange={e => setNewSvc(p=>({...p,name:e.target.value}))}
                      className="col-span-1 px-2 py-1.5 text-[12px] rounded focus:outline-none"
                      style={{ border: '0.5px solid #9FE1CB', background: '#fff' }} />
                    <input placeholder="Durée (min)" type="number" value={newSvc.duration} onChange={e => setNewSvc(p=>({...p,duration:e.target.value}))}
                      className="px-2 py-1.5 text-[12px] rounded focus:outline-none"
                      style={{ border: '0.5px solid #9FE1CB', background: '#fff' }} />
                    <input placeholder="Prix (€)" type="number" value={newSvc.price} onChange={e => setNewSvc(p=>({...p,price:e.target.value}))}
                      className="px-2 py-1.5 text-[12px] rounded focus:outline-none"
                      style={{ border: '0.5px solid #9FE1CB', background: '#fff' }} />
                  </div>
                  <div className="flex gap-2">
                    <button className="text-[12px] font-medium px-3 py-1.5 rounded-lg text-white" style={{ background: '#1D9E75' }}
                      onClick={() => { if(!newSvc.name) return; setServices(p=>[...p,{id:Date.now().toString(),name:newSvc.name,duration:parseInt(newSvc.duration)||60,price:parseFloat(newSvc.price)||0}]); setAddSvc(false); setNewSvc({name:'',duration:'60',price:''}) }}>
                      Ajouter
                    </button>
                    <button className="text-[12px] px-3 py-1.5 rounded-lg" style={{ background: '#fff', color: 'var(--color-text-secondary)' }} onClick={() => setAddSvc(false)}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h3 className="text-[14px] font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Préférences de notifications</h3>
              <div className="space-y-0 divide-y" style={{ borderTop: '0.5px solid var(--color-border-tertiary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                {[
                  { key:'rdvEmail',     label:'Nouveau RDV',              sub:'Par email' },
                  { key:'rdvSMS',       label:'Nouveau RDV',              sub:'Par SMS (Plan Pro)' },
                  { key:'reminder',     label:'Rappel 24h avant',         sub:'Email au client' },
                  { key:'reminderSMS',  label:'Rappel 24h avant',         sub:'SMS au client (Plan Pro)' },
                  { key:'review',       label:'Nouvel avis client',       sub:'Par email' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{n.label}</p>
                      <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{n.sub}</p>
                    </div>
                    <Toggle on={notifs[n.key as keyof typeof notifs]} onChange={() => setNotifs(p=>({...p,[n.key]:!p[n.key as keyof typeof notifs]}))} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-opacity disabled:opacity-60"
            style={{ background: '#1D9E75' }}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {saved && <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#1D9E75' }}><IconCheck size={13} /> Modifications enregistrées</span>}
        </div>
      </main>
    </div>
  )
}
