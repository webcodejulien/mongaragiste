'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { IconEye, IconEyeOff, IconCheck } from '@tabler/icons-react'

function ResetForm() {
  const params   = useSearchParams()
  const router   = useRouter()
  const token    = params.get('token') ?? ''

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [error,     setError]     = useState('')
  const [checking,  setChecking]  = useState(true)
  const [invalid,   setInvalid]   = useState(false)

  useEffect(() => {
    if (!token) { setInvalid(true); setChecking(false); return }
    fetch(`/api/auth/reset-password?token=${token}`)
      .then(r => { if (!r.ok) setInvalid(true) })
      .finally(() => setChecking(false))
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 8)  { setError('Le mot de passe doit faire au moins 8 caractères.'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    setLoading(false)
    if (res.ok) { setDone(true); setTimeout(() => router.push('/login'), 3000) }
    else { const d = await res.json(); setError(d.error || 'Lien invalide ou expiré.') }
  }

  if (checking) return <p className="text-center text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Vérification du lien…</p>

  if (invalid) return (
    <div className="text-center rounded-xl p-8" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
      <p className="text-[15px] font-semibold mb-2" style={{ color: '#A32D2D' }}>Lien invalide ou expiré</p>
      <p className="text-[13px] mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        Ce lien de réinitialisation est invalide ou a expiré (valable 1 heure).
      </p>
      <Link href="/forgot-password" className="text-[13px] font-medium" style={{ color: '#1D9E75' }}>
        Demander un nouveau lien
      </Link>
    </div>
  )

  if (done) return (
    <div className="text-center rounded-xl p-8" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#E1F5EE' }}>
        <IconCheck size={24} style={{ color: '#1D9E75' }} />
      </div>
      <h2 className="text-[16px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Mot de passe mis à jour !</h2>
      <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Redirection vers la connexion…</p>
    </div>
  )

  return (
    <div className="rounded-xl p-6" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
      {error && (
        <div className="text-[12px] px-3 py-2 rounded-lg mb-4" style={{ background: '#FCEBEB', color: '#A32D2D' }}>{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Nouveau mot de passe</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères" required
              className="w-full pl-3 pr-9 py-2 text-[13px] rounded-lg focus:outline-none"
              style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)' }} />
            <button type="button" onClick={() => setShowPw(p => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }}>
              {showPw ? <IconEyeOff size={15}/> : <IconEye size={15}/>}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Confirmer le mot de passe</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••" required
            className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
            style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)' }} />
        </div>
        <button type="submit" disabled={loading || !password || !confirm}
          className="w-full py-2.5 rounded-lg text-[13px] font-medium text-white disabled:opacity-50"
          style={{ background: '#1D9E75' }}>
          {loading ? 'Mise à jour…' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-background-secondary)' }}>
      <header className="h-14 flex items-center px-6" style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#1D9E75' }} />
          <span className="text-[14px] font-medium" style={{ color: 'var(--color-text-primary)' }}>MonGaragiste</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[340px]">
          <div className="mb-7">
            <h1 className="text-[22px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>Nouveau mot de passe</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>Choisissez un nouveau mot de passe sécurisé.</p>
          </div>
          <Suspense fallback={<p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Chargement…</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
