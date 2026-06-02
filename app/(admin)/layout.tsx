import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-secondary)' }}>
      <header style={{ background: 'var(--color-background-primary)', borderBottom: '0.5px solid var(--color-border-tertiary)', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Admin MonGaragiste</span>
        <a href="/api/auth/signout" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Déconnexion</a>
      </header>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>{children}</main>
    </div>
  )
}
