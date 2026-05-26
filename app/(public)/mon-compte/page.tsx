'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { IconCalendar, IconCheck, IconX, IconClock, IconArrowRight, IconLogout } from '@tabler/icons-react'

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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appts,   setAppts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      fetch('/api/client/appointments')
        .then(r => r.json())
        .then(d => setAppts(Array.isArray(d) ? d : []))
        .finally(() => setLoading(false))
    }
  }, [status])

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
              <IconLogout size={13}/> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold" style={{color:'var(--color-text-primary)'}}>Mon compte</h1>
          <p className="text-[13px] mt-1" style={{color:'var(--color-text-secondary)'}}>Suivez vos rendez-vous</p>
        </div>

        {/* À venir */}
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold mb-3" style={{color:'var(--color-text-primary)'}}>
            Rendez-vous à venir ({upcoming.length})
          </h2>
          {loading ? (
            <div className="rounded-xl h-32 animate-pulse" style={{background:'var(--color-background-primary)'}}/>
          ) : upcoming.length === 0 ? (
            <div className="rounded-xl p-8 text-center" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
              <p className="text-[14px] font-medium mb-2" style={{color:'var(--color-text-primary)'}}>Aucun RDV à venir</p>
              <p className="text-[13px] mb-4" style={{color:'var(--color-text-secondary)'}}>Trouvez un garage près de chez vous et réservez en ligne.</p>
              <Link href="/search" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white" style={{background:'#1D9E75'}}>
                Trouver un garage <IconArrowRight size={14}/>
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
                          Annuler
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
              Historique ({past.length})
            </h2>
            <div className="rounded-xl overflow-hidden" style={{background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-tertiary)'}}>
              {past.map((a,i) => {
                const s = STATUS[a.status] ?? STATUS.DONE
                return (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-3"
                    style={{borderBottom:i<past.length-1?'0.5px solid var(--color-border-tertiary)':'none'}}>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium" style={{color:'var(--color-text-primary)'}}>{a.garage?.name} — {a.service?.name}</p>
                      <p className="text-[11px] mt-0.5" style={{color:'var(--color-text-tertiary)'}}>{fmtDate(a.date)} à {a.startTime}</p>
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{background:s.bg,color:s.color}}>{s.label}</span>
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
