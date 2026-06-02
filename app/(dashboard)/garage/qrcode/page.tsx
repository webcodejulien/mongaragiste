'use client'

import { useEffect, useState, useRef } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { IconDownload, IconPrinter, IconShare, IconCopy, IconCheck } from '@tabler/icons-react'

export default function QRCodePage() {
  const [garage, setGarage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/garage/me')
      .then(r => r.json())
      .then(d => setGarage(d))
      .finally(() => setLoading(false))
  }, [])

  const publicUrl = garage ? `https://mongaragiste.app/garage/${garage.slug}` : ''
  const qrUrl = garage
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(publicUrl)}&color=1D9E75&bgcolor=ffffff&margin=20`
    : ''

  function copyLink() {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrint() {
    window.print()
  }

  if (loading) return (
    <div className="flex flex-col flex-1">
      <TopBar title="QR Code & Lien public" />
      <main className="flex-1 p-5 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#1D9E75', borderTopColor: 'transparent' }} />
      </main>
    </div>
  )

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="QR Code & Lien public" subtitle="Partagez votre page de réservation" />

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-card { box-shadow: none !important; border: none !important; }
        }
        @page { size: A5; margin: 15mm; }
      `}</style>

      <main className="flex-1 p-5">
        <div className="max-w-3xl mx-auto">

          {/* Actions bar */}
          <div className="no-print flex items-center gap-3 mb-6 flex-wrap">
            <button onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}>
              {copied ? <IconCheck size={14} color="#1D9E75" /> : <IconCopy size={14} />}
              {copied ? 'Copié !' : 'Copier le lien'}
            </button>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium"
              style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)' }}>
              <IconShare size={14} /> Voir ma page
            </a>
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white ml-auto"
              style={{ background: '#1D9E75' }}>
              <IconPrinter size={14} /> Imprimer le QR Code
            </button>
          </div>

          {/* Printable card */}
          <div ref={printRef} className="print-card rounded-[10px] overflow-hidden"
            style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>

            {/* Header vert */}
            <div className="p-6 text-white text-center" style={{ background: '#1D9E75' }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <span className="text-[11px] font-bold" style={{ color: '#1D9E75' }}>M</span>
                </div>
                <span className="text-[15px] font-bold">MonGaragiste</span>
              </div>
              <p className="text-[12px] opacity-80">Réservez votre rendez-vous en ligne</p>
            </div>

            {/* Corps */}
            <div className="p-8 flex flex-col items-center text-center">
              <h2 className="text-[22px] font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                {garage?.name}
              </h2>
              <p className="text-[13px] mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {garage?.address}, {garage?.zipCode} {garage?.city}
              </p>

              {/* QR Code */}
              <div className="p-4 rounded-2xl mb-6" style={{ background: '#fff', border: '2px solid #E1F5EE' }}>
                {qrUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrUrl} alt="QR Code réservation" width={200} height={200}
                    style={{ display: 'block' }} />
                )}
              </div>

              <p className="text-[15px] font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                📱 Scannez pour réserver
              </p>
              <p className="text-[12px] mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Prenez rendez-vous en ligne en quelques secondes,<br />
                7j/7 et 24h/24
              </p>

              {/* Lien texte */}
              <div className="px-4 py-2 rounded-lg text-[12px] font-mono break-all"
                style={{ background: '#E1F5EE', color: '#085041' }}>
                {publicUrl}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 text-center" style={{ borderTop: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-secondary)' }}>
              <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                Réservation en ligne via MonGaragiste · mongaragiste.app
              </p>
            </div>
          </div>

          {/* Conseils d'utilisation */}
          <div className="no-print mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🖨️', title: 'Imprimez', desc: "Format A5 — idéal pour l'accueil ou la façade de votre garage." },
              { icon: '📱', title: 'Partagez', desc: 'Envoyez le lien par WhatsApp, SMS ou email à vos clients.' },
              { icon: '🌐', title: 'Publiez', desc: 'Ajoutez le lien sur votre page Facebook ou site internet.' },
            ].map(tip => (
              <div key={tip.title} className="rounded-[10px] p-4"
                style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
                <p className="text-xl mb-2">{tip.icon}</p>
                <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{tip.title}</p>
                <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
