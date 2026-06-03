'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/Logo'
import { IconMail, IconClock, IconMessageCircle } from '@tabler/icons-react'
import { useLang } from '@/components/LangToggle'
import { LangToggle } from '@/components/LangToggle'

const CONTENT = {
  fr: {
    title: 'Nous contacter',
    subtitle: 'Une question, un problème ou une suggestion ? On vous répond rapidement.',
    back: '← Retour',
    formTitle: 'Envoyer un message',
    labelName: 'Nom *',
    labelEmail: 'Email *',
    labelSubject: 'Sujet *',
    labelMessage: 'Message *',
    placeholderName: 'Jean Dupont',
    placeholderEmail: 'jean@exemple.com',
    placeholderSubject: 'Choisir un sujet...',
    placeholderMessage: 'Décrivez votre demande...',
    subjects: [
      { value: 'rdv', label: 'Problème avec un rendez-vous' },
      { value: 'compte', label: 'Problème de compte' },
      { value: 'abonnement', label: "Question sur l'abonnement (garagiste)" },
      { value: 'technique', label: 'Problème technique' },
      { value: 'autre', label: 'Autre' },
    ],
    buttonSend: 'Envoyer le message',
    buttonSending: 'Envoi...',
    successTitle: 'Message envoyé !',
    successBody: 'Nous vous répondrons dans les 24h ouvrables.',
    successReset: 'Envoyer un autre message',
    cardEmailTitle: 'Email',
    cardResponseTitle: 'Délai de réponse',
    cardResponseBody: 'Sous 24h ouvrables',
    cardResponseHours: 'Lun – Ven, 9h – 18h',
    cardGaragisteTitle: 'Vous êtes garagiste ?',
    cardGaragisteBody: 'Pour toute question sur votre abonnement ou pour changer de plan.',
    footerCgu: 'CGU',
    footerConfidentialite: 'Confidentialité',
  },
  nl: {
    title: 'Contacteer ons',
    subtitle: 'Een vraag, een probleem of een suggestie? Wij antwoorden snel.',
    back: '← Terug',
    formTitle: 'Bericht verzenden',
    labelName: 'Naam *',
    labelEmail: 'E-mail *',
    labelSubject: 'Onderwerp *',
    labelMessage: 'Bericht *',
    placeholderName: 'Jan Janssen',
    placeholderEmail: 'jan@voorbeeld.com',
    placeholderSubject: 'Kies een onderwerp...',
    placeholderMessage: 'Beschrijf uw vraag...',
    subjects: [
      { value: 'rdv', label: 'Probleem met een afspraak' },
      { value: 'compte', label: 'Accountprobleem' },
      { value: 'abonnement', label: 'Vraag over abonnement (garagehouder)' },
      { value: 'technique', label: 'Technisch probleem' },
      { value: 'autre', label: 'Anders' },
    ],
    buttonSend: 'Bericht verzenden',
    buttonSending: 'Verzenden...',
    successTitle: 'Bericht verzonden!',
    successBody: 'Wij antwoorden binnen de 24 werkuren.',
    successReset: 'Nog een bericht sturen',
    cardEmailTitle: 'E-mail',
    cardResponseTitle: 'Reactietijd',
    cardResponseBody: 'Binnen 24 werkuren',
    cardResponseHours: 'Ma – Vr, 9u – 18u',
    cardGaragisteTitle: 'Bent u een garagehouder?',
    cardGaragisteBody: 'Voor vragen over uw abonnement of om van plan te wisselen.',
    footerCgu: 'AGV',
    footerConfidentialite: 'Privacybeleid',
  },
}

export default function ContactPage() {
  const { lang } = useLang()
  const T = CONTENT[lang]

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
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/" className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>{T.back}</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{T.title}</h1>
          <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>
            {T.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Infos contact */}
          <div className="flex flex-col gap-4">
            <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: '#E1F5EE' }}>
                <IconMail size={18} color="#1D9E75" />
              </div>
              <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{T.cardEmailTitle}</p>
              <a href="mailto:support@mongaragiste.app" className="text-[13px]" style={{ color: '#1D9E75' }}>
                support@mongaragiste.app
              </a>
            </div>

            <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: '#E6F1FB' }}>
                <IconClock size={18} color="#185FA5" />
              </div>
              <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{T.cardResponseTitle}</p>
              <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>{T.cardResponseBody}</p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{T.cardResponseHours}</p>
            </div>

            <div className="rounded-[10px] p-5" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: '#FFF8EF' }}>
                <IconMessageCircle size={18} color="#B45309" />
              </div>
              <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{T.cardGaragisteTitle}</p>
              <p className="text-[13px] mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                {T.cardGaragisteBody}
              </p>
              <a href="mailto:support@mongaragiste.app" className="text-[13px] font-medium" style={{ color: '#1D9E75' }}>
                support@mongaragiste.app
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
                <h2 className="text-[18px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{T.successTitle}</h2>
                <p className="text-[14px]" style={{ color: 'var(--color-text-secondary)' }}>
                  {T.successBody}
                </p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="mt-6 text-[13px]" style={{ color: '#1D9E75' }}>
                  {T.successReset}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="text-[17px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{T.formTitle}</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{T.labelName}</label>
                    <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder={T.placeholderName}
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{T.labelEmail}</label>
                    <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder={T.placeholderEmail}
                      className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                      style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }} />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{T.labelSubject}</label>
                  <select required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none"
                    style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: form.subject ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                    <option value="">{T.placeholderSubject}</option>
                    {T.subjects.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>{T.labelMessage}</label>
                  <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={5} placeholder={T.placeholderMessage}
                    className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none resize-none"
                    style={{ border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)' }} />
                </div>

                <button type="submit" disabled={loading}
                  className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-white transition-opacity"
                  style={{ background: '#1D9E75', opacity: loading ? 0.7 : 1 }}>
                  {loading ? T.buttonSending : T.buttonSend}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
          © 2026 MonGaragiste ·{' '}
          <Link href="/cgu" className="hover:underline">{T.footerCgu}</Link>{' · '}
          <Link href="/confidentialite" className="hover:underline">{T.footerConfidentialite}</Link>
        </p>
      </footer>
    </div>
  )
}
