import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MonGaragiste — Votre garagiste, à portée de clic.',
  description: 'Trouvez et réservez votre garagiste en ligne. Vidange, freins, pneus, révision — choisissez votre créneau directement.',
  keywords: ['garage', 'garagiste', 'réservation', 'rendez-vous', 'voiture', 'entretien'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
