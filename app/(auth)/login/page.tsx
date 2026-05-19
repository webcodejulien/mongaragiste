'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { Suspense } from 'react'

function LoginForm() {
  const router      = useRouter()
  const params      = useSearchParams()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [error, setError]       = useState(
    params.get('error') === 'OAuthAccountNotLinked'
      ? 'Ce compte Google est déjà lié à un autre utilisateur.'
      : params.get('error')
      ? 'Une erreur est survenue lors de la connexion.'
      : ''
  )
  const [googleUnavailable, setGoogleUnavailable] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) setError('Email ou mot de passe incorrect.')
    else router.push('/garage')
  }

  async function handleGoogle() {
    setGLoading(true)
    try {
      await signIn('google', { callbackUrl: '/garage' })
    } catch {
      setGoogleUnavailable(true)
      setGLoading(false)
    }
  }

  return (
    <div className="rounded-xl p-6" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
      {/* Bouton Google */}
      <button
        onClick={handleGoogle}
        disabled={gLoading}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors mb-5 disabled:opacity-50"
        style={{ border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-primary)', background: 'var(--color-background-primary)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {gLoading ? 'Connexion…' : 'Continuer avec Google'}
      </button>

      {googleUnavailable && (
        <div className="text-[11px] px-3 py-2 rounded-lg mb-4 text-center"
          style={{ background: '#FAEEDA', color: '#633806' }}>
          Google OAuth n'est pas encore configuré.{' '}
          <Link href="/register/client" style={{ fontWeight: '600', textDecoration: 'underline' }}>
            Créez un compte email
          </Link>{' '}à la place.
        </div>
      )}

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ background: 'var(--color-border-tertiary)' }} />
        <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>ou par email</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-border-tertiary)' }} />
      </div>

      {error && (
        <div className="text-[12px] px-3 py-2 rounded-lg mb-4" style={{ background: '#FCEBEB', color: '#A32D2D' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="vous@exemple.com" required autoComplete="email"
            className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-1"
            style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>Mot de passe</label>
            <Link href="/forgot-password" className="text-[11px] transition-colors" style={{ color: '#1D9E75' }}>
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required autoComplete="current-password"
              className="w-full pl-3 pr-9 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-1"
              style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-tertiary)' }}>
              {showPw ? <IconEyeOff size={15}/> : <IconEye size={15}/>}
            </button>
          </div>
        </div>

        <button
          type="submit" disabled={loading || !email || !password}
          className="w-full py-2.5 rounded-lg text-[13px] font-medium text-white transition-opacity disabled:opacity-50"
          style={{ background: '#1D9E75' }}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
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
          <div className="text-center mb-7">
            <h1 className="text-[22px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>Connexion</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Accédez à votre espace MonGaragiste
            </p>
          </div>

          <Suspense fallback={<div className="rounded-xl p-6" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>Chargement…</div>}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-[12px] mt-4" style={{ color: 'var(--color-text-secondary)' }}>
            Pas encore de compte ?{' '}
            <Link href="/register/client" style={{ color: '#1D9E75', fontWeight: '500' }}>Créer un compte</Link>
            {' '}·{' '}
            <Link href="/register/garage" style={{ color: '#1D9E75', fontWeight: '500' }}>Inscrire mon garage</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
