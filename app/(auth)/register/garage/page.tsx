'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const DEFAULT_SCHEDULE = DAYS.map((_, i) => ({
  dayOfWeek: i + 1,
  openTime: '08:00',
  closeTime: '18:00',
  isClosed: i >= 5,
}))

const ALL_SERVICES = [
  'Vidange', 'Freins', 'Pneus', 'Révision', 'Climatisation',
  'Diagnostic', 'Embrayage', 'Carrosserie', 'Pare-brise', 'Batterie',
  'Distribution', 'Échappement', 'Suspension', 'Direction', 'Électricité',
]

interface StepProps {
  active: boolean
  completed: boolean
  label: string
  number: number
}

function StepIndicator({ active, completed, label, number }: StepProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
        completed ? 'bg-primary-400 text-white' :
        active ? 'bg-primary-800 text-white' :
        'bg-gray-200 text-gray-500'
      }`}>
        {completed ? '✓' : number}
      </div>
      <span className={`text-xs ${active || completed ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}

export default function RegisterGaragePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1 — Account
  const [account, setAccount] = useState({ email: '', password: '', confirmPassword: '' })

  // Step 2 — Garage info
  const [info, setInfo] = useState({
    name: '', phone: '', address: '', city: '', zipCode: '', description: '',
  })

  // Step 3 — Services
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Step 4 — Schedules
  const [schedules, setSchedules] = useState(DEFAULT_SCHEDULE)

  function updateAccount(field: string, value: string) {
    setAccount((p) => ({ ...p, [field]: value }))
  }
  function updateInfo(field: string, value: string) {
    setInfo((p) => ({ ...p, [field]: value }))
  }
  function toggleService(s: string) {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }
  function updateSchedule(idx: number, field: string, value: string | boolean) {
    setSchedules((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  function validateStep1() {
    if (!account.email || !account.password) return 'Email et mot de passe requis.'
    if (account.password.length < 8) return 'Le mot de passe doit faire au moins 8 caractères.'
    if (account.password !== account.confirmPassword) return 'Les mots de passe ne correspondent pas.'
    return ''
  }

  function validateStep2() {
    if (!info.name || !info.phone || !info.address || !info.city || !info.zipCode) {
      return 'Tous les champs obligatoires doivent être remplis.'
    }
    return ''
  }

  function validateStep3() {
    if (selectedServices.length === 0) return 'Sélectionnez au moins un service.'
    return ''
  }

  async function next() {
    let err = ''
    if (step === 1) err = validateStep1()
    if (step === 2) err = validateStep2()
    if (step === 3) err = validateStep3()
    if (err) { setError(err); return }
    setError('')
    if (step < 4) { setStep(step + 1); return }
    await handleSubmit()
  }

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'GARAGE',
        email: account.email,
        password: account.password,
        garage: { ...info, services: selectedServices, schedules },
      }),
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Une erreur est survenue.')
    } else {
      router.push('/login?registered=garage')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-400 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">MonGaragiste</span>
          </Link>
          <p className="text-xs text-gray-500">Inscription garagiste — Étape {step}/4</p>
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Inscrire mon garage</h1>
            <p className="text-sm text-gray-500 mt-1">Commencez à recevoir des réservations en ligne</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {['Compte', 'Garage', 'Services', 'Horaires'].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <StepIndicator
                  number={i + 1}
                  label={label}
                  active={step === i + 1}
                  completed={step > i + 1}
                />
                {i < 3 && <div className={`w-8 h-0.5 mb-4 ${step > i + 1 ? 'bg-primary-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-6">
            {error && (
              <div className="bg-red-50 border border-red-100 rounded p-3 text-sm text-red-600 mb-4">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 mb-1">Créez votre compte</h2>
                <Input
                  label="Adresse email professionnelle"
                  type="email"
                  placeholder="garage@exemple.com"
                  value={account.email}
                  onChange={(e) => updateAccount('email', e.target.value)}
                  required
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={account.password}
                  onChange={(e) => updateAccount('password', e.target.value)}
                  required
                />
                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={account.confirmPassword}
                  onChange={(e) => updateAccount('confirmPassword', e.target.value)}
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 mb-1">Informations du garage</h2>
                <Input
                  label="Nom du garage *"
                  placeholder="Garage Dubois & Fils"
                  value={info.name}
                  onChange={(e) => updateInfo('name', e.target.value)}
                  required
                />
                <Input
                  label="Téléphone *"
                  type="tel"
                  placeholder="+32 2 123 45 67"
                  value={info.phone}
                  onChange={(e) => updateInfo('phone', e.target.value)}
                  required
                />
                <Input
                  label="Adresse *"
                  placeholder="Rue de la Loi 42"
                  value={info.address}
                  onChange={(e) => updateInfo('address', e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Ville *"
                    placeholder="Bruxelles"
                    value={info.city}
                    onChange={(e) => updateInfo('city', e.target.value)}
                    required
                  />
                  <Input
                    label="Code postal *"
                    placeholder="1000"
                    value={info.zipCode}
                    onChange={(e) => updateInfo('zipCode', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
                  <textarea
                    rows={3}
                    value={info.description}
                    onChange={(e) => updateInfo('description', e.target.value)}
                    placeholder="Présentez votre garage en quelques mots..."
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">Services proposés</h2>
                <p className="text-sm text-gray-500 mb-4">Sélectionnez tous les services que vous effectuez</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SERVICES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleService(s)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        selectedServices.includes(s)
                          ? 'bg-primary-400 text-white border-primary-400'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {selectedServices.length > 0 && (
                  <p className="text-xs text-primary-600 mt-3 font-medium">{selectedServices.length} service(s) sélectionné(s)</p>
                )}
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">Horaires d'ouverture</h2>
                <p className="text-sm text-gray-500 mb-4">Définissez vos heures d'ouverture habituelles</p>
                <div className="space-y-2">
                  {DAYS.map((day, i) => (
                    <div key={day} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`closed-${i}`}
                        checked={!schedules[i].isClosed}
                        onChange={(e) => updateSchedule(i, 'isClosed', !e.target.checked)}
                        className="rounded border-gray-300 text-primary-400 focus:ring-primary-400"
                      />
                      <label htmlFor={`closed-${i}`} className="w-20 text-sm text-gray-700 font-medium">{day}</label>
                      {!schedules[i].isClosed ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={schedules[i].openTime}
                            onChange={(e) => updateSchedule(i, 'openTime', e.target.value)}
                            className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                          />
                          <span className="text-xs text-gray-400">–</span>
                          <input
                            type="time"
                            value={schedules[i].closeTime}
                            onChange={(e) => updateSchedule(i, 'closeTime', e.target.value)}
                            className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Fermé</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => { setStep(step - 1); setError('') }} className="flex-1">
                Retour
              </Button>
            )}
            <Button
              onClick={next}
              loading={loading && step === 4}
              className="flex-1"
              size="lg"
            >
              {step === 4 ? 'Créer mon garage' : 'Continuer'}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Déjà inscrit ?{' '}
            <Link href="/login" className="text-primary-400 hover:text-primary-600 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
