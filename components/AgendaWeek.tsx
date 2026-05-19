'use client'

import { useState } from 'react'
import { Badge, statusToBadge } from './ui/Badge'

interface Appointment {
  id: string
  clientName: string
  service: string
  date: string
  startTime: string
  endTime: string
  status: string
  vehicleModel?: string
}

interface AgendaWeekProps {
  appointments?: Appointment[]
}

const HOURS = Array.from({ length: 10 }, (_, i) => i + 8) // 08:00 to 17:00

function getWeekDays(baseDate: Date): Date[] {
  const day = baseDate.getDay()
  const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(baseDate.setDate(diff))
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const mockAppts: Appointment[] = [
  { id: '1', clientName: 'Martin Dupont', service: 'Vidange', date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '10:00', status: 'CONFIRMED', vehicleModel: 'Renault Clio' },
  { id: '2', clientName: 'Sophie Lambert', service: 'Freins', date: new Date().toISOString().split('T')[0], startTime: '11:00', endTime: '12:30', status: 'PENDING', vehicleModel: 'Peugeot 308' },
  { id: '3', clientName: 'Jean Moreau', service: 'Révision', date: new Date().toISOString().split('T')[0], startTime: '14:00', endTime: '15:30', status: 'IN_PROGRESS', vehicleModel: 'Citroën C3' },
]

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function AgendaWeek({ appointments = mockAppts }: AgendaWeekProps) {
  const [current, setCurrent] = useState(new Date())
  const days = getWeekDays(new Date(current))

  const today = new Date().toISOString().split('T')[0]

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']
  const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc']

  function prevWeek() {
    const d = new Date(current)
    d.setDate(d.getDate() - 7)
    setCurrent(d)
  }
  function nextWeek() {
    const d = new Date(current)
    d.setDate(d.getDate() + 7)
    setCurrent(d)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-900">
            {days[0].getDate()} – {days[4].getDate()} {months[days[4].getMonth()]} {days[4].getFullYear()}
          </span>
          <button onClick={nextWeek} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => setCurrent(new Date())}
          className="text-xs text-primary-400 hover:text-primary-600 font-medium"
        >
          Aujourd'hui
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[48px_repeat(5,1fr)] border-b border-gray-100">
            <div />
            {days.map((d, i) => {
              const iso = d.toISOString().split('T')[0]
              const isToday = iso === today
              return (
                <div key={i} className={`py-2 text-center border-l border-gray-100 ${isToday ? 'bg-primary-50' : ''}`}>
                  <p className="text-xs text-gray-500">{dayNames[i]}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${isToday ? 'text-primary-600' : 'text-gray-800'}`}>{d.getDate()}</p>
                </div>
              )
            })}
          </div>

          <div className="relative">
            {HOURS.map((h) => (
              <div key={h} className="grid grid-cols-[48px_repeat(5,1fr)] border-b border-gray-50">
                <div className="py-2 pr-2 text-right">
                  <span className="text-xs text-gray-400">{h}:00</span>
                </div>
                {days.map((d, di) => {
                  const iso = d.toISOString().split('T')[0]
                  const isToday = iso === today
                  const appts = appointments.filter((a) => {
                    const [ah] = a.startTime.split(':').map(Number)
                    return a.date === iso && ah === h
                  })
                  return (
                    <div key={di} className={`relative min-h-[48px] border-l border-gray-100 p-0.5 ${isToday ? 'bg-primary-50/30' : ''}`}>
                      {appts.map((a) => {
                        const startMin = timeToMinutes(a.startTime) - h * 60
                        const durationMin = timeToMinutes(a.endTime) - timeToMinutes(a.startTime)
                        const badge = statusToBadge(a.status)
                        return (
                          <div
                            key={a.id}
                            className={`absolute left-0.5 right-0.5 rounded px-1.5 py-1 text-xs overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${
                              a.status === 'CONFIRMED' ? 'bg-blue-100 border-l-2 border-blue-400' :
                              a.status === 'IN_PROGRESS' ? 'bg-primary-100 border-l-2 border-primary-400' :
                              a.status === 'PENDING' ? 'bg-amber-50 border-l-2 border-amber-400' :
                              'bg-gray-100 border-l-2 border-gray-300'
                            }`}
                            style={{
                              top: `${(startMin / 60) * 48}px`,
                              height: `${(durationMin / 60) * 48 - 2}px`,
                            }}
                          >
                            <p className="font-medium truncate">{a.clientName}</p>
                            <p className="text-gray-500 truncate">{a.service}</p>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
