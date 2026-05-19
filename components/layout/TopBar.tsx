'use client'

import { useState } from 'react'
import Link from 'next/link'

const mockNotifications = [
  { id: '1', title: 'Nouveau RDV', message: 'Martin Dupont — Vidange — Demain 09:00', time: 'Il y a 5 min', read: false },
  { id: '2', title: 'Avis client', message: 'Sophie Lambert vous a laissé 5 étoiles', time: 'Il y a 1h', read: false },
  { id: '3', title: 'RDV confirmé', message: 'Jean Moreau — Freins — Lundi 14:00', time: 'Il y a 2h', read: true },
]

interface TopBarProps {
  title: string
  garageName?: string
}

export function TopBar({ title, garageName = 'Garage Dubois' }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = mockNotifications.filter((n) => !n.read).length

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Notifications</span>
                {unread > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{unread} nouvelles</span>
                )}
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-primary-50/30' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 bg-primary-400 rounded-full mt-1 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-xs text-primary-400 hover:text-primary-600 font-medium">
                  Tout marquer comme lu
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <div className="w-7 h-7 bg-primary-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {garageName.charAt(0)}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 leading-tight">{garageName}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
