import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trouver un garage — Recherche',
  description: 'Comparez les garages près de chez vous, consultez les avis et réservez votre créneau en quelques clics. Vidange, freins, pneus, révision.',
  openGraph: {
    title:       'Trouver un garage | MonGaragiste',
    description: 'Comparez les garages et réservez en ligne.',
    type:        'website',
  },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
