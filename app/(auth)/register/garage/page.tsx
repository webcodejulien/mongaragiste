'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { IconCheck } from '@tabler/icons-react'

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const DEFAULT_SCHEDULES = DAYS.map((_, i) => ({
  dayOfWeek: i + 1, openTime: '08:00', closeTime: '18:00', isClosed: i >= 5,
}))
const ALL_SERVICES = [
  'Vidange','Freins','Pneus','Révision','Climatisation',
  'Diagnostic','Embrayage','Carrosserie','Pare-brise','Batterie',
  'Distribution','Échappement','Suspension','Direction','Électricité',
]

const STEPS = ['Compte','Garage','Équipe','Services','Horaires']

function Step({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex flex-col items-center gap-1">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors"
          style={{
            background: done ? '#1D9E75' : active ? '#085041' : 'var(--color-background-tertiary)',
            color: done || active ? '#fff' : 'var(--color-text-tertiary)',
          }}>
          {done ? <IconCheck size={12}/> : n}
        </div>
        <span className="text-[10px] font-medium hidden sm:block"
          style={{ color: active || done ? '#1D9E75' : 'var(--color-text-tertiary)' }}>
          {label}
        </span>
      </div>
      {n < STEPS.length && (
        <div className="w-8 h-px mb-4" style={{ background: done ? '#1D9E75' : 'var(--color-border-tertiary)' }}/>
      )}
    </div>
  )
}

export default function RegisterGaragePage() {
  const router  = useRouter()
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // Étape 1 — Compte
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')

  // Étape 2 — Infos garage
  const [name, setName]           = useState('')
  const [phone, setPhone]         = useState('')
  const [address, setAddress]     = useState('')
  const [city, setCity]           = useState('')
  const [zipCode, setZipCode]     = useState('')
  const [description, setDesc]    = useState('')

  // Étape 3 — Équipe & capacité
  const [mechanicCount, setMechanicCount] = useState(1)
  const [slotDuration, setSlotDuration]   = useState(30)

  // Étape 4 — Services
  const [services, setServices]   = useState<string[]>([])

  // Étape 5 — Horaires
  const [schedules, setSchedules] = useState(DEFAULT_SCHEDULES)

  function toggleService(s: string) {
    setServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }
  function updateSch(i: number, field: string, val: string | boolean) {
    setSchedules(p => p.map((s, j) => j === i ? { ...s, [field]: val } : s))
  }

  function validate(): string {
    if (step === 1) {
      if (!email || !password) return 'Email et mot de passe requis.'
      if (password.length < 8)  return 'Mot de passe : 8 caractères minimum.'
      if (password !== confirm)  return 'Les mots de passe ne correspondent pas.'
    }
    if (step === 2) {
      if (!name || !phone || !address || !city || !zipCode) return 'Tous les champs obligatoires doivent être remplis.'
    }
    if (step === 4 && services.length === 0) return 'Sélectionnez au moins un service.'
    return ''
  }

  async function next() {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    if (step < 5) { setStep(s => s + 1); return }
    await submit()
  }

  async function submit() {
    setLoading(true)
    try {
      // 1. Créer le compte
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'GARAGE', email, password,
          garage: { name, phone, address, city, zipCode, description, services, schedules, mechanicCount, slotDuration },
        }),
      })

      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }

      // 2. Connexion automatique
      const signInResult = await signIn('credentials', {
        email, password, redirect: false,
      })

      if (signInResult?.ok) {
        router.push('/garage')
      } else {
        // Compte créé mais connexion auto échouée → rediriger vers login
        router.push('/login?registered=garage')
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-background-secondary)' }}>
      <header className="h-14 flex items-center justify-between px-6"
        style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" href="/" />
        </Link>
        <span className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>Étape {step}/{STEPS.length}</span>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-[480px]">
          <p style={{color:'var(--color-text-tertiary)', fontSize:12, marginBottom:16}}>
            ← <a href="/garagiste" style={{color:'#1D9E75'}}>Découvrir comment ça fonctionne</a> avant de vous inscrire
          </p>
          <div className="text-center mb-8">
            <h1 className="text-[22px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>Inscrire mon garage</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>Commencez à recevoir des réservations en ligne</p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center mb-8">
            {STEPS.map((label, i) => (
              <Step key={label} n={i + 1} label={label} active={step === i + 1} done={step > i + 1}/>
            ))}
          </div>

          <div className="rounded-xl p-6" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            {error && (
              <div className="text-[12px] px-3 py-2 rounded-lg mb-4" style={{ background: '#FCEBEB', color: '#A32D2D' }}>{error}</div>
            )}

            {/* ── Étape 1 : Compte ── */}
            {step === 1 && (
              <div className="space-y-3">
                <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Créez votre compte</h2>
                <Field label="Email professionnel">
                  <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="garage@exemple.com" required />
                </Field>
                <Field label="Mot de passe">
                  <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="8 caractères minimum" required />
                </Field>
                <Field label="Confirmer le mot de passe">
                  <Input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" placeholder="••••••••" required />
                </Field>
              </div>
            )}

            {/* ── Étape 2 : Infos garage ── */}
            {step === 2 && (
              <div className="space-y-3">
                <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Informations du garage</h2>
                <Field label="Nom du garage *">
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Garage Dubois & Fils" required />
                </Field>
                <Field label="Téléphone *">
                  <Input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+32 2 123 45 67" required />
                </Field>
                <Field label="Adresse *">
                  <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Rue de la Loi 42" required />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ville *">
                    <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Bruxelles" required />
                  </Field>
                  <Field label="Code postal *">
                    <Input value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="1000" required />
                  </Field>
                </div>
                <Field label="Description (optionnel)">
                  <textarea rows={3} value={description} onChange={e => setDesc(e.target.value)}
                    placeholder="Présentez votre garage en quelques mots…"
                    className="w-full px-3 py-2 text-[13px] rounded-lg resize-none focus:outline-none"
                    style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}/>
                </Field>
              </div>
            )}

            {/* ── Étape 3 : Équipe & capacité ── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-[14px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Équipe & capacité</h2>
                  <p className="text-[12px] mb-5" style={{ color: 'var(--color-text-secondary)' }}>
                    Ces paramètres définissent combien de RDV simultanés votre garage peut accepter.
                  </p>
                </div>

                {/* Nombre de mécaniciens */}
                <div>
                  <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Nombre de mécaniciens</p>
                  <p className="text-[12px] mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    Détermine combien de rendez-vous peuvent se dérouler en parallèle.
                  </p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setMechanicCount(p => Math.max(1, p - 1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-medium transition-colors"
                      style={{ border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-primary)' }}>
                      −
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-3xl font-semibold" style={{ color: '#1D9E75' }}>{mechanicCount}</span>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                        {mechanicCount === 1 ? 'mécanicien' : 'mécaniciens'}
                      </p>
                    </div>
                    <button onClick={() => setMechanicCount(p => Math.min(10, p + 1))}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-medium transition-colors"
                      style={{ border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-primary)' }}>
                      +
                    </button>
                  </div>
                  {/* Visualisation capacité */}
                  <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--color-background-secondary)' }}>
                    <p className="text-[11px] font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Créneaux disponibles à 09h00 :</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {Array.from({ length: mechanicCount }).map((_, i) => (
                        <div key={i} className="px-2.5 py-1 rounded text-[11px] font-medium"
                          style={{ background: '#E1F5EE', color: '#085041' }}>
                          Poste {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Durée de créneau */}
                <div>
                  <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Durée minimale d'un créneau</p>
                  <p className="text-[12px] mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    Granularité de l'agenda (vous pouvez toujours créer des RDV plus longs).
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 45, 60].map(d => (
                      <button key={d} onClick={() => setSlotDuration(d)}
                        className="py-2.5 rounded-lg text-[13px] font-medium border transition-colors"
                        style={{
                          background: slotDuration === d ? '#1D9E75' : 'var(--color-background-primary)',
                          borderColor: slotDuration === d ? '#1D9E75' : 'var(--color-border-secondary)',
                          color: slotDuration === d ? '#fff' : 'var(--color-text-secondary)',
                        }}>
                        {d} min
                      </button>
                    ))}
                  </div>
                </div>

                {/* Résumé capacité */}
                <div className="rounded-lg p-4" style={{ background: 'var(--color-primary-light)', border: '0.5px solid #9FE1CB' }}>
                  <p className="text-[12px] font-medium" style={{ color: 'var(--color-primary-dark)' }}>Capacité estimée</p>
                  <p className="text-[13px] mt-1" style={{ color: '#085041' }}>
                    Avec {mechanicCount} mécanicien{mechanicCount > 1 ? 's' : ''} et des créneaux de {slotDuration} min,
                    votre garage peut accueillir jusqu'à{' '}
                    <strong>{mechanicCount * Math.floor(600 / slotDuration)}</strong> rendez-vous par jour
                    (sur 10h d'ouverture).
                  </p>
                </div>
              </div>
            )}

            {/* ── Étape 4 : Services ── */}
            {step === 4 && (
              <div>
                <h2 className="text-[14px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Services proposés</h2>
                <p className="text-[12px] mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  Sélectionnez tous les services que vous effectuez ({services.length} sélectionné{services.length > 1 ? 's' : ''})
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SERVICES.map(s => (
                    <button key={s} onClick={() => toggleService(s)}
                      className="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors"
                      style={{
                        background: services.includes(s) ? '#1D9E75' : 'var(--color-background-primary)',
                        borderColor: services.includes(s) ? '#1D9E75' : 'var(--color-border-secondary)',
                        color: services.includes(s) ? '#fff' : 'var(--color-text-secondary)',
                      }}>
                      {services.includes(s) && '✓ '}{s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Étape 5 : Horaires ── */}
            {step === 5 && (
              <div>
                <h2 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Horaires d'ouverture</h2>
                <div className="space-y-3">
                  {DAYS.map((day, i) => (
                    <div key={day} className="flex items-center gap-3">
                      <input type="checkbox" id={`d${i}`}
                        checked={!schedules[i].isClosed}
                        onChange={e => updateSch(i, 'isClosed', !e.target.checked)}
                        className="rounded" style={{ accentColor: '#1D9E75' }}/>
                      <label htmlFor={`d${i}`} className="w-24 text-[13px] font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {day}
                      </label>
                      {!schedules[i].isClosed ? (
                        <div className="flex items-center gap-2">
                          <input type="time" value={schedules[i].openTime}
                            onChange={e => updateSch(i, 'openTime', e.target.value)}
                            className="px-2 py-1 text-[12px] rounded focus:outline-none"
                            style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)' }}/>
                          <span style={{ color: 'var(--color-text-tertiary)' }}>–</span>
                          <input type="time" value={schedules[i].closeTime}
                            onChange={e => updateSch(i, 'closeTime', e.target.value)}
                            className="px-2 py-1 text-[12px] rounded focus:outline-none"
                            style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)' }}/>
                        </div>
                      ) : (
                        <span className="text-[12px] italic" style={{ color: 'var(--color-text-tertiary)' }}>Fermé</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Boutons navigation */}
          <div className="flex gap-3 mt-4">
            {step > 1 && (
              <button onClick={() => { setStep(s => s - 1); setError('') }}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}>
                Retour
              </button>
            )}
            <button onClick={next} disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-[13px] font-medium text-white transition-opacity disabled:opacity-60"
              style={{ background: '#1D9E75' }}>
              {loading ? 'Création du compte…' : step === 5 ? 'Créer mon garage' : 'Continuer'}
            </button>
          </div>

          <p className="text-center text-[12px] mt-4" style={{ color: 'var(--color-text-secondary)' }}>
            Déjà inscrit ?{' '}
            <Link href="/login" style={{ color: '#1D9E75', fontWeight: '500' }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
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

function Input({ value, onChange, type = 'text', placeholder, required }: {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <input value={value} onChange={onChange} type={type} placeholder={placeholder} required={required}
      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }}/>
  )
}
