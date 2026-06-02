'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Skeleton } from '@/components/ui/Skeleton'

interface Profile {
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

export default function ClientProfilePage() {
  const [profile,   setProfile]   = useState<Profile | null>(null)
  const [loading,   setLoading]   = useState(true)

  // Phone form
  const [phone,     setPhone]     = useState('')
  const [savingPhone,setSavingPhone] = useState(false)
  const [phoneMsg,  setPhoneMsg]  = useState<{ ok: boolean; text: string } | null>(null)

  // Password form
  const [oldPwd,    setOldPwd]    = useState('')
  const [newPwd,    setNewPwd]    = useState('')
  const [confirmPwd,setConfirmPwd]= useState('')
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg,    setPwdMsg]    = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    fetch('/api/client/profile')
      .then(r => r.json())
      .then(d => {
        setProfile(d)
        setPhone(d.phone ?? '')
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSavePhone(e: React.FormEvent) {
    e.preventDefault()
    setPhoneMsg(null)
    setSavingPhone(true)
    try {
      const res = await fetch('/api/client/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, phone: data.phone } : prev)
        setPhoneMsg({ ok: true, text: 'Téléphone mis à jour.' })
      } else {
        setPhoneMsg({ ok: false, text: data.error ?? 'Erreur serveur.' })
      }
    } finally {
      setSavingPhone(false)
    }
  }

  async function handleSavePwd(e: React.FormEvent) {
    e.preventDefault()
    setPwdMsg(null)
    if (newPwd !== confirmPwd) {
      setPwdMsg({ ok: false, text: 'Les mots de passe ne correspondent pas.' })
      return
    }
    if (newPwd.length < 8) {
      setPwdMsg({ ok: false, text: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' })
      return
    }
    setSavingPwd(true)
    try {
      const res = await fetch('/api/client/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd }),
      })
      const data = await res.json()
      if (res.ok) {
        setPwdMsg({ ok: true, text: 'Mot de passe modifié avec succès.' })
        setOldPwd('')
        setNewPwd('')
        setConfirmPwd('')
      } else {
        setPwdMsg({ ok: false, text: data.error ?? 'Erreur serveur.' })
      }
    } finally {
      setSavingPwd(false)
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Mon profil" />

      <main className="flex-1 p-5 max-w-xl">

        {/* Infos personnelles */}
        <section className="rounded-[10px] p-5 mb-4"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          <p className="text-[13px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Informations personnelles
          </p>

          {loading ? (
            <div className="space-y-3">
              <Skeleton style={{ height: '14px', width: '60%' }} />
              <Skeleton style={{ height: '14px', width: '50%' }} />
              <Skeleton style={{ height: '14px', width: '70%' }} />
            </div>
          ) : profile ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Field label="Prénom" value={profile.firstName} />
                <Field label="Nom"    value={profile.lastName} />
              </div>
              <Field label="Email" value={profile.email} />
            </div>
          ) : (
            <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              Impossible de charger le profil.
            </p>
          )}
        </section>

        {/* Téléphone */}
        <section className="rounded-[10px] p-5 mb-4"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          <p className="text-[13px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Téléphone
          </p>
          <form onSubmit={handleSavePhone} className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+32 470 00 00 00"
                className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            {phoneMsg && (
              <p className="text-[12px]" style={{ color: phoneMsg.ok ? '#085041' : '#A32D2D' }}>
                {phoneMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={savingPhone}
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-white disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ background: '#1D9E75' }}>
              {savingPhone ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>
        </section>

        {/* Mot de passe */}
        <section className="rounded-[10px] p-5"
          style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
          <p className="text-[13px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Changer de mot de passe
          </p>
          <form onSubmit={handleSavePwd} className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Ancien mot de passe
              </label>
              <input
                type="password"
                value={oldPwd}
                onChange={e => setOldPwd(e.target.value)}
                required
                className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                required
                className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
              />
            </div>
            {pwdMsg && (
              <p className="text-[12px]" style={{ color: pwdMsg.ok ? '#085041' : '#A32D2D' }}>
                {pwdMsg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={savingPwd}
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-white disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ background: '#1D9E75' }}>
              {savingPwd ? 'Modification…' : 'Modifier le mot de passe'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1">
      <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      <p className="text-[13px]" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
    </div>
  )
}
