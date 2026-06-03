'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { IconPrinter, IconArrowLeft, IconDownload } from '@tabler/icons-react'
import { Logo } from '@/components/Logo'

export default function InvoicePage() {
  const params   = useParams()
  const [data,    setData]    = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/garage/appointments/${params.id}/invoice`)
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [params.id])

  function handlePrint() {
    window.print()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor:'#1D9E75', borderTopColor:'transparent' }}/>
    </div>
  )

  if (!data || data.error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Facture introuvable.</p>
    </div>
  )

  const { invoiceNr, date, garage, client, service, vehicle, startTime, notes } = data

  return (
    <>
      {/* Barre d'actions — masquée à l'impression */}
      <div className="no-print sticky top-0 z-10 h-14 flex items-center justify-between px-6"
        style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <Link href={`/garage/appointments`} className="flex items-center gap-2 text-[13px]"
          style={{ color: 'var(--color-text-secondary)' }}>
          <IconArrowLeft size={15}/> Retour aux RDV
        </Link>
        <div className="flex gap-2">
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white"
            style={{ background: '#1D9E75' }}>
            <IconPrinter size={15}/> Imprimer / Télécharger PDF
          </button>
        </div>
      </div>

      {/* Styles impression */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .invoice-page { box-shadow: none !important; margin: 0 !important; padding: 32px !important; }
        }
        @page { size: A4; margin: 20mm; }
      `}</style>

      {/* Facture */}
      <div className="max-w-3xl mx-auto py-10 px-6 no-print-wrapper">
        <div ref={printRef} className="invoice-page bg-white rounded-xl p-10 shadow-sm"
          style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#111', lineHeight: 1.5 }}>

          {/* En-tête */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <div className="mb-3">
                <Logo size="md" />
              </div>
              <p className="text-[16px] font-bold text-gray-900">{garage.name}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{garage.address}</p>
              <p className="text-[13px] text-gray-500">{garage.zipCode} {garage.city}</p>
              <p className="text-[13px] text-gray-500">{garage.phone}</p>
              {garage.vatNumber && <p className="text-[13px] text-gray-500">TVA: {garage.vatNumber}</p>}
            </div>
            <div className="text-right">
              <p className="text-[28px] font-bold text-gray-900">FACTURE</p>
              <p className="text-[14px] font-semibold mt-1" style={{ color: '#1D9E75' }}>N° {invoiceNr}</p>
              <p className="text-[13px] text-gray-500 mt-1">Date : {date}</p>
            </div>
          </div>

          {/* Ligne séparatrice */}
          <div className="h-px bg-gray-200 mb-8"/>

          {/* Client + Véhicule */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Facturé à</p>
              <p className="text-[14px] font-semibold text-gray-900">{client.name}</p>
              {client.email && <p className="text-[13px] text-gray-500">{client.email}</p>}
              {client.phone && <p className="text-[13px] text-gray-500">{client.phone}</p>}
            </div>
            {(vehicle.model || vehicle.plate) && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Véhicule</p>
                {vehicle.model && <p className="text-[14px] font-semibold text-gray-900">{vehicle.model}</p>}
                {vehicle.plate && (
                  <p className="text-[13px] font-mono mt-1 px-2 py-0.5 rounded inline-block"
                    style={{ background: '#F3F4F6', color: '#374151' }}>
                    {vehicle.plate}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Tableau prestations */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Prestation', 'Date', 'Durée', 'Prix HT', 'TVA 21%', 'Total TTC'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Prestation' ? 'left' : 'right', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 500, color: '#111' }}>
                  {service.name}
                  {notes && <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{notes}</p>}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 13, color: '#374151' }}>
                  {date} · {startTime}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 13, color: '#374151' }}>
                  {service.duration > 0 ? `${service.duration} min` : '—'}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 13, color: '#374151' }}>
                  {service.price > 0 ? `${service.htva.toFixed(2)} €` : '—'}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 13, color: '#374151' }}>
                  {service.price > 0 ? `${service.tva.toFixed(2)} €` : '—'}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#111' }}>
                  {service.price > 0 ? `${service.ttc.toFixed(2)} €` : 'Sur devis'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totaux */}
          {service.price > 0 && (
            <div className="flex justify-end mb-10">
              <div style={{ minWidth: 240 }}>
                <div className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Sous-total HT</span>
                  <span style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{service.htva.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>TVA 21%</span>
                  <span style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>{service.tva.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between py-2.5 mt-1 rounded-lg px-3"
                  style={{ background: '#F0FDF4' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#065F46' }}>Total TTC</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#065F46' }}>{service.ttc.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          )}

          {/* IBAN */}
          {garage.iban && (
            <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '14px 16px', marginBottom: 32 }}>
              <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Coordonnées bancaires</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#111', fontFamily: 'monospace' }}>{garage.iban}</p>
            </div>
          )}

          {/* Pied de facture */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#9CA3AF' }}>
              {garage.name} · {garage.address}, {garage.zipCode} {garage.city}
              {garage.vatNumber ? ` · TVA: ${garage.vatNumber}` : ''}
            </p>
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              Facture générée via MonGaragiste · mongaragiste.app
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
