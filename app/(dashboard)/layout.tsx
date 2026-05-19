import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-secondary)' }}>
      <Sidebar />
      <div className="flex-1 ml-[200px] flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
