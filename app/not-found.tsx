import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--color-background-secondary)' }}>
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔧</div>
        <h1 className="text-[48px] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>404</h1>
        <p className="text-[18px] font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Page introuvable
        </p>
        <p className="text-[14px] mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          On dirait que cette page est partie en révision. Revenez sur la route principale.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/"
            className="px-5 py-2.5 rounded-lg text-[13px] font-medium text-white"
            style={{ background: '#1D9E75' }}>
            Accueil
          </Link>
          <Link href="/search"
            className="px-5 py-2.5 rounded-lg text-[13px] font-medium"
            style={{ border: '0.5px solid var(--color-border-tertiary)', color: 'var(--color-text-secondary)', background: 'var(--color-background-primary)' }}>
            Trouver un garage
          </Link>
        </div>
      </div>
    </div>
  )
}
