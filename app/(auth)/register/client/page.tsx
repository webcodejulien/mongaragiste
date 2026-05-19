'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function RegisterClientPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'CLIENT' }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Une erreur est survenue.')
    } else {
      router.push('/login?registered=true')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-400 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">MonGaragiste</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Créer un compte client</h1>
            <p className="text-sm text-gray-500 mt-1">Réservez vos rendez-vous en ligne facilement</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-6">
            {error && (
              <div className="bg-red-50 border border-red-100 rounded p-3 text-sm text-red-600 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Prénom"
                  placeholder="Jean"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  required
                />
                <Input
                  label="Nom"
                  placeholder="Dupont"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  required
                />
              </div>
              <Input
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
              <Input
                label="Téléphone (optionnel)"
                type="tel"
                placeholder="+32 470 12 34 56"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
              <Input
                label="Mot de passe"
                type="password"
                placeholder="Minimum 8 caractères"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                required
                minLength={8}
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                required
              />

              <p className="text-xs text-gray-500">
                En créant un compte, vous acceptez nos{' '}
                <Link href="/terms" className="text-primary-400 hover:underline">conditions d'utilisation</Link>
                {' '}et notre{' '}
                <Link href="/privacy" className="text-primary-400 hover:underline">politique de confidentialité</Link>.
              </p>

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Créer mon compte
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary-400 hover:text-primary-600 font-medium">
              Se connecter
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Vous êtes garagiste ?{' '}
            <Link href="/register/garage" className="text-primary-400 hover:text-primary-600 font-medium">
              Inscrire mon garage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
