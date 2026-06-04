'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { IconSearch, IconMail, IconPhone, IconChevronRight, IconDownload, IconMessageCircle, IconX } from '@tabler/icons-react'
import Link from 'next/link'

type MessageTarget = {
  clientId: string
  name: string
  email: string | null
  phone: string | null
}

function MessageModal({ target, onClose }: { target: MessageTarget; onClose: () => void }) {
  const [channel,  setChannel]  = useState<'email' | 'sms'>('email')
  const [subject,  setSubject]  = useState('')
  const [message,  setMessage]  = useState('')
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [error,    setError]    = useState('')

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/garage/message', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ clientId: target.clientId, channel, subject, message }),
      })
      if (res.ok) {
        setSent(true)
        setTimeout(onClose, 1500)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Erreur lors de l\'envoi.')
      }
    } catch {
      setError('Erreur réseau.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-[12px] p-6"
        style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Envoyer un message
          </h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-tertiary)' }}>
            <IconX size={18}/>
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: '#E1F5EE' }}>
              <IconMail size={22} style={{ color: '#085041' }}/>
            </div>
            <p className="text-[14px] font-medium" style={{ color: 'var(--color-text-primary)' }}>Message envoyé !</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* Destinataire */}
            <div className="rounded-lg px-3 py-2.5"
              style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <p className="text-[10px] font-medium uppercase tracking-wide mb-1"
                style={{ color: 'var(--color-text-tertiary)' }}>Destinataire</p>
              <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>{target.name}</p>
              <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                {target.email} {target.phone ? `· ${target.phone}` : ''}
              </p>
            </div>

            {/* Canal */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide mb-2"
                style={{ color: 'var(--color-text-secondary)' }}>Canal</p>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="email" checked={channel === 'email'}
                    onChange={() => setChannel('email')}
                    className="accent-[#1D9E75]"/>
                  <span className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>Email</span>
                  {!target.email && <span className="text-[11px]" style={{ color: '#A32D2D' }}>(indisponible)</span>}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="sms" checked={channel === 'sms'}
                    onChange={() => setChannel('sms')}
                    className="accent-[#1D9E75]"/>
                  <span className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>SMS</span>
                  {!target.phone && <span className="text-[11px]" style={{ color: '#A32D2D' }}>(indisponible)</span>}
                </label>
              </div>
            </div>

            {/* Sujet (email seulement) */}
            {channel === 'email' && (
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wide mb-1 block"
                  style={{ color: 'var(--color-text-secondary)' }}>Sujet</label>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Sujet du message…"
                  className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                  style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
                />
              </div>
            )}

            {/* Message */}
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wide mb-1 block"
                style={{ color: 'var(--color-text-secondary)' }}>Message *</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Votre message…"
                required
                className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none resize-none"
                style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>

            {error && (
              <p className="text-[12px]" style={{ color: '#A32D2D' }}>{error}</p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={onClose}
                className="px-4 py-2 rounded text-[13px]"
                style={{ border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}>
                Annuler
              </button>
              <button type="submit" disabled={sending || !message.trim()}
                className="px-4 py-2 rounded text-[13px] font-medium text-white disabled:opacity-50"
                style={{ background: '#1D9E75' }}>
                {sending ? 'Envoi…' : 'Envoyer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

const STATUS: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:     { label:'En attente', bg:'#FAEEDA', color:'#633806' },
  CONFIRMED:   { label:'Confirmé',   bg:'#E1F5EE', color:'#085041' },
  IN_PROGRESS: { label:'En cours',   bg:'#E6F1FB', color:'#185FA5' },
  DONE:        { label:'Terminé',    bg:'var(--color-background-secondary)', color:'var(--color-text-secondary)' },
  CANCELLED:   { label:'Annulé',     bg:'#FCEBEB', color:'#A32D2D' },
}

function fmtDate(d: string) {
  const dt = new Date(d)
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
  return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`
}

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [selected, setSelected] = useState<string|null>(null)
  const [msgTarget, setMsgTarget] = useState<MessageTarget | null>(null)

  useEffect(() => {
    fetch('/api/garage/clients')
      .then(r => r.json())
      .then(d => setClients(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
      || (c.email ?? '').toLowerCase().includes(q)
      || (c.phone ?? '').includes(q)
  })

  const sel = clients.find(c => c.id === selected)

  return (
    <div className="flex flex-col flex-1">
      {msgTarget && (
        <MessageModal target={msgTarget} onClose={() => setMsgTarget(null)}/>
      )}
      <TopBar title="Clients" subtitle={!loading ? `${clients.length} client${clients.length !== 1 ? 's' : ''}` : undefined}/>

      <main className="flex-1 p-5">
        <div className="flex gap-5">
          {/* Liste */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div className="relative w-64">
                <IconSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--color-text-tertiary)' }}/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client…"
                  className="w-full pl-8 pr-3 py-2 text-[13px] rounded-lg focus:outline-none"
                  style={{ border:'0.5px solid var(--color-border-secondary)', background:'var(--color-background-primary)', color:'var(--color-text-primary)' }}/>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[11px]" style={{ color:'var(--color-text-tertiary)' }}>{filtered.length} résultat(s)</p>
                <a href="/api/garage/export?type=clients"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium"
                  style={{ border:'0.5px solid var(--color-border-tertiary)', color:'var(--color-text-secondary)', background:'var(--color-background-primary)' }}>
                  <IconDownload size={13}/> Export CSV
                </a>
              </div>
            </div>

            <div className="rounded-[10px] overflow-hidden"
              style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
              <div className="grid text-[11px] font-medium uppercase tracking-wide px-4 py-2.5"
                style={{ gridTemplateColumns:'1fr 130px 60px 40px', color:'var(--color-text-secondary)', background:'var(--color-background-secondary)', borderBottom:'0.5px solid var(--color-border-tertiary)' }}>
                <span>Client</span><span>Dernier RDV</span><span className="text-center">RDV</span><span/>
              </div>

              {loading ? (
                Array.from({length:5}).map((_,i) => <SkeletonRow key={i}/>)
              ) : filtered.length === 0 && clients.length === 0 ? (
                <EmptyState
                  icon="👥"
                  title="Aucun client pour l'instant"
                  description="Vos clients apparaîtront ici dès qu'ils auront pris leur premier rendez-vous."
                  action={
                    <Link href="/" className="text-[13px] font-medium" style={{ color:'#1D9E75' }}>
                      Voir ma page publique
                    </Link>
                  }
                />
              ) : filtered.length === 0 ? (
                <EmptyState icon="🔍" title="Aucun client trouvé" description="Essayez de modifier votre recherche."/>
              ) : (
                filtered.map((c, i) => (
                  <div key={c.id} onClick={() => setSelected(selected===c.id ? null : c.id)}
                    className="grid items-center px-4 py-2.5 cursor-pointer transition-colors"
                    style={{ gridTemplateColumns:'1fr 130px 60px 40px', borderBottom: i<filtered.length-1 ? '0.5px solid var(--color-border-tertiary)' : 'none', background: selected===c.id ? 'var(--color-primary-light)' : 'transparent' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0"
                        style={{ background:'var(--color-primary-light)', color:'var(--color-primary-dark)' }}>
                        {initials(c.firstName, c.lastName)}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium" style={{ color:'var(--color-text-primary)' }}>{c.firstName} {c.lastName}</p>
                        <p className="text-[11px]" style={{ color:'var(--color-text-secondary)' }}>{c.phone || c.email}</p>
                      </div>
                    </div>
                    <p className="text-[12px]" style={{ color:'var(--color-text-secondary)' }}>{fmtDate(c.lastVisit)}</p>
                    <p className="text-[13px] font-semibold text-center" style={{ color:'var(--color-text-primary)' }}>{c.totalRdv}</p>
                    <IconChevronRight size={14} style={{ color:'var(--color-text-tertiary)' }}/>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panneau détail */}
          {sel && (
            <div className="w-72 flex-shrink-0">
              <div className="rounded-[10px] p-5 sticky top-20"
                style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold"
                    style={{ background:'var(--color-primary-light)', color:'var(--color-primary-dark)' }}>
                    {initials(sel.firstName, sel.lastName)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color:'var(--color-text-primary)' }}>{sel.firstName} {sel.lastName}</p>
                    <p className="text-[11px]" style={{ color:'var(--color-text-secondary)' }}>{sel.totalRdv} rendez-vous</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[12px]" style={{ color:'var(--color-text-secondary)' }}>
                    <IconMail size={12} style={{ color:'var(--color-text-tertiary)' }}/> {sel.email}
                  </div>
                  {sel.phone && (
                    <div className="flex items-center gap-2 text-[12px]" style={{ color:'var(--color-text-secondary)' }}>
                      <IconPhone size={12} style={{ color:'var(--color-text-tertiary)' }}/> {sel.phone}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setMsgTarget({ clientId: sel.id, name: `${sel.firstName} ${sel.lastName}`, email: sel.email, phone: sel.phone ?? null })}
                  className="flex items-center gap-1.5 w-full justify-center px-3 py-2 rounded-lg text-[13px] font-medium mb-4 transition-colors"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', border: '0.5px solid #1D9E75' }}>
                  <IconMessageCircle size={14}/> Envoyer un message
                </button>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide mb-2" style={{ color:'var(--color-text-tertiary)' }}>Historique</p>
                  <div className="space-y-2">
                    {sel.appointments.map((a: any, i: number) => {
                      const s = STATUS[a.status] ?? STATUS.DONE
                      return (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium truncate" style={{ color:'var(--color-text-primary)' }}>{a.service}</p>
                            <p className="text-[10px]" style={{ color:'var(--color-text-tertiary)' }}>{fmtDate(a.date)}</p>
                          </div>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background:s.bg, color:s.color }}>{s.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
