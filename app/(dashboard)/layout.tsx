import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background-secondary)' }}>
      <Sidebar />
      {/* lg: décalé par la sidebar fixe, mobile: padding-top pour la barre mobile */}
      <div className="flex-1 lg:ml-[200px] pt-14 lg:pt-0 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
