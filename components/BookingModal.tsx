'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

interface Service {
  id: string
  name: string
  duration: number
  price?: number
}

interface BookingModalProps {
  garageName: string
  garageSlug: string
  services: Service[]
  onClose: () => void
}

const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']

export function BookingModal({ garageName, garageSlug, services, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSuccess(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Prendre rendez-vous</h2>
            <p className="text-xs text-gray-500 mt-0.5">{garageName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Demande envoyée !</h3>
            <p className="text-sm text-gray-500 mb-6">
              Votre demande de rendez-vous a bien été envoyée. Le garage vous confirmera dans les plus brefs délais.
            </p>
            <Button onClick={onClose} className="w-full">Fermer</Button>
          </div>
        ) : (
          <>
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-5">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                      step === s ? 'bg-primary-400 text-white' : step > s ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step > s ? '✓' : s}
                    </div>
                    {s < 3 && <div className={`flex-1 h-0.5 w-8 ${step > s ? 'bg-primary-300' : 'bg-gray-100'}`} />}
                  </div>
                ))}
                <span className="text-xs text-gray-500 ml-2">
                  {step === 1 ? 'Service' : step === 2 ? 'Créneau' : 'Véhicule'}
                </span>
              </div>

              {step === 1 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Choisissez un service</p>
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`w-full flex items-center justify-between p-3 rounded border text-left transition-colors ${
                        selectedService?.id === s.id
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.duration} min</p>
                      </div>
                      {s.price && (
                        <span className="text-sm font-semibold text-gray-900">{s.price} €</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="mb-4">
                    <Input
                      label="Date souhaitée"
                      type="date"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  {selectedDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Créneau horaire</p>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-2 text-sm rounded border transition-colors ${
                              selectedTime === t
                                ? 'border-primary-400 bg-primary-400 text-white font-medium'
                                : 'border-gray-200 text-gray-700 hover:border-primary-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <Input
                    label="Immatriculation"
                    placeholder="AA-123-BB"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  />
                  <Input
                    label="Modèle du véhicule"
                    placeholder="Ex: Renault Clio 2019"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Informations complémentaires..."
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                    />
                  </div>

                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <p className="font-medium text-gray-900 mb-1">Récapitulatif</p>
                    <p className="text-gray-600">{selectedService?.name} — {selectedDate} à {selectedTime}</p>
                    {selectedService?.price && <p className="text-gray-600">Prix estimé : <span className="font-semibold">{selectedService.price} €</span></p>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Retour
                </Button>
              )}
              {step < 3 ? (
                <Button
                  className="flex-1"
                  disabled={(step === 1 && !selectedService) || (step === 2 && (!selectedDate || !selectedTime))}
                  onClick={() => setStep(step + 1)}
                >
                  Continuer
                </Button>
              ) : (
                <Button className="flex-1" loading={loading} onClick={handleSubmit}>
                  Confirmer la demande
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
