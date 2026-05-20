'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

export default function RegisterClientPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', confirm:'' })
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 8) { setError('Mot de passe : 8 caractères minimum.'); return }
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true); setError('')

    // 1. Créer le compte
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'CLIENT', email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, phone: form.phone }),
    })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error || 'Une erreur est survenue.')
      setLoading(false)
      return
    }

    // 2. Connexion automatique
    const signInResult = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    setLoading(false)

    if (signInResult?.ok) router.push('/')
    else router.push('/login?registered=true')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-background-secondary)' }}>
      <header className="h-14 flex items-center px-6" style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: '#1D9E75' }}/>
          <span className="text-[14px] font-medium" style={{ color: 'var(--color-text-primary)' }}>MonGaragiste</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[360px]">
          <div className="text-center mb-7">
            <h1 className="text-[22px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>Créer un compte</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>Réservez vos RDV en quelques secondes</p>
          </div>

          <div className="rounded-xl p-6" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            {error && (
              <div className="text-[12px] px-3 py-2 rounded-lg mb-4" style={{ background: '#FCEBEB', color: '#A32D2D' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Inp label="Prénom" value={form.firstName} onChange={v => update('firstName', v)} placeholder="Jean" required />
                <Inp label="Nom"    value={form.lastName}  onChange={v => update('lastName', v)}  placeholder="Dupont" required />
              </div>
              <Inp label="Email" type="email" value={form.email} onChange={v => update('email', v)} placeholder="vous@exemple.com" required />
              <Inp label="Téléphone (optionnel)" type="tel" value={form.phone} onChange={v => update('phone', v)} placeholder="+32 470 12 34 56" />

              <div>
                <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Mot de passe</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="8 caractères minimum" required
                    className="w-full pl-3 pr-9 py-2 text-[13px] rounded-lg focus:outline-none"
                    style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)' }}/>
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }}>
                    {showPw ? <IconEyeOff size={15}/> : <IconEye size={15}/>}
                  </button>
                </div>
              </div>
              <Inp label="Confirmer le mot de passe" type="password" value={form.confirm} onChange={v => update('confirm', v)} placeholder="••••••••" required />

              <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                En créant un compte, vous acceptez nos{' '}
                <Link href="/terms" style={{ color: '#1D9E75' }}>CGU</Link>{' '}et notre{' '}
                <Link href="/privacy" style={{ color: '#1D9E75' }}>politique de confidentialité</Link>.
              </p>

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-[13px] font-medium text-white transition-opacity disabled:opacity-60 mt-1"
                style={{ background: '#1D9E75' }}>
                {loading ? 'Création du compte…' : 'Créer mon compte'}
              </button>
            </form>
          </div>

          <p className="text-center text-[12px] mt-4" style={{ color: 'var(--color-text-secondary)' }}>
            Déjà un compte ?{' '}
            <Link href="/login" style={{ color: '#1D9E75', fontWeight: '500' }}>Se connecter</Link>
            {' '}·{' '}
            <Link href="/register/garage" style={{ color: '#1D9E75', fontWeight: '500' }}>Inscrire mon garage</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Inp({ label, value, onChange, type = 'text', placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
        style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}/>
    </div>
  )
}
