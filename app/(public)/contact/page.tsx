'use client'

import Link from 'next/link'
import { useState } from 'react'
import { IconMail, IconClock, IconMessageCircle } from '@tabler/icons-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simule l'envoi — remplacer par un appel API si besoin
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ background: 'var(--color-background-secondary)', minHeight: '100vh' }}>
      {/* Nav */}
      <header style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1D9E75' }}>M</div>
            <span className="text-[15px] font-bold" style={{ color: 'var(--color-text-primary)' }}>MonGaragiste</span>
          </Link>
          <Link href="/" className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>← Retour</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Nous contacter</h1>
          <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>
            Une question, un problème ou une suggestion ? On vous répond rapidement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Infos contact */}
          <div className="flex flex-col gap-4">
            <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: '#E1F5EE' }}>
                <IconMail size={18} color="#1D9E75" />
              </div>
              <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Email</p>
              <a href="mailto:support@mongaragiste.app" className="text-[13px]" style={{ color: '#1D9E75' }}>
                support@mongaragiste.app
              </a>
            </div>

            <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: '#E6F1FB' }}>
                <IconClock size={18} color="#185FA5" />
              </div>
              <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Délai de réponse</p>
              <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Sous 24h ouvrables</p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Lun – Ven, 9h – 18h</p>
            </div>

            <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: '#FFF8EF' }}>
                <IconMessageCircle size={18} color="#B45309" />
              </div>
              <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Vous êtes garagiste ?</p>
              <p className="text-[13px] mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Pour toute question sur votre abonnement ou pour changer de plan.
              </p>
              <a href="mailto:pro@mongaragiste.app" className="text-[13px] font-medium" style={{ color: '#1D9E75' }}>
                pro@mongaragiste.app
              </a>
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:col-span-2 rounded-[10px] p-8" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: '#E1F5EE' }}>
                  <span className="text-2xl">✅</span>
                </div>
                <h2 className="text-[18px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Message envoyé !</h2>
                <p className="text-[14px]" style={{ color: 'var(--color-text-secondary)' }}>
                  Nous vous répondrons dans les 24h ouvrables.
                </p>
                <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }) }}
                  className="mt-6 text-[13px]" style={{ color: '#1D9E75' }}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="text-[17px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Envoyer un message</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Nom *</label>
                    <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Jean Dupont"
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="jean@exemple.com"
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }} />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Sujet *</label>
                  <select required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                    style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: form.subject ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                    <option value="">Choisir un sujet...</option>
                    <option value="rdv">Problème avec un rendez-vous</option>
                    <option value="compte">Problème de compte</option>
                    <option value="abonnement">Question sur l'abonnement (garagiste)</option>
                    <option value="technique">Problème technique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Message *</label>
                  <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={5} placeholder="Décrivez votre demande..."
                    className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none resize-none"
                    style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }} />
                </div>

                <button type="submit" disabled={loading}
                  className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-white transition-opacity"
                  style={{ background: '#1D9E75', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Envoi...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
          © 2026 MonGaragiste ·{' '}
          <Link href="/cgu" className="hover:underline">CGU</Link>{' · '}
          <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
        </p>
      </footer>
    </div>
  )
}
