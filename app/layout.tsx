import type { Metadata } from 'next'
import './globals.css'
import { SessionWrapper } from '@/components/SessionWrapper'
import { LangProvider } from '@/components/LangToggle'

export const metadata: Metadata = {
  title: {
    default:  'MonGaragiste — Votre garagiste, à portée de clic.',
    template: '%s | MonGaragiste',
  },
  description: 'Trouvez et réservez votre garagiste en ligne. Vidange, freins, pneus, révision — choisissez votre créneau directement.',
  keywords: ['garage', 'garagiste', 'réservation', 'rendez-vous', 'voiture', 'entretien', 'Belgique', 'Bruxelles'],
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://mongaragiste.app'),
  openGraph: {
    siteName: 'MonGaragiste',
    locale:   'fr_BE',
    type:     'website',
  },
  twitter: { card: 'summary' },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
          })()
        `}} />
      </head>
      <body>
        <LangProvider>
          <SessionWrapper>{children}</SessionWrapper>
        </LangProvider>
      </body>
    </html>
  )
}
