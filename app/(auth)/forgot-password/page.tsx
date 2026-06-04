'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { IconArrowLeft, IconMail } from '@tabler/icons-react'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setLoading(false)

    if (res.ok) {
      setSent(true)
    } else {
      const d = await res.json()
      setError(d.error || 'Une erreur est survenue.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-background-secondary)' }}>
      <header className="h-14 flex items-center px-6" style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" href="/" />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[340px]">
          <Link href="/login" className="flex items-center gap-1.5 text-[12px] mb-6 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}>
            <IconArrowLeft size={13} /> Retour à la connexion
          </Link>

          {!sent ? (
            <>
              <div className="mb-7">
                <h1 className="text-[22px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Mot de passe oublié
                </h1>
                <p className="text-[13px] mt-1.5 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <div className="rounded-xl p-6" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                {error && (
                  <div className="text-[12px] px-3 py-2 rounded-lg mb-4" style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Adresse email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      required
                      autoFocus
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-1"
                      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full py-2.5 rounded-lg text-[13px] font-medium text-white transition-opacity disabled:opacity-50"
                    style={{ background: '#1D9E75' }}
                  >
                    {loading ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#E1F5EE' }}>
                <IconMail size={24} style={{ color: '#1D9E75' }} />
              </div>
              <h2 className="text-[16px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Email envoyé !
              </h2>
              <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien de réinitialisation dans les prochaines minutes.
              </p>
              <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                Vérifiez aussi vos spams.
              </p>
              <Link href="/login"
                className="inline-block mt-6 text-[13px] font-medium"
                style={{ color: '#1D9E75' }}>
                Retour à la connexion
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
