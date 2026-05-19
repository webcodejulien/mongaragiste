import { TopBar } from '@/components/layout/TopBar'
import { AgendaWeek } from '@/components/AgendaWeek'

export default function AgendaPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Agenda" />
      <main className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">Gérez vos créneaux et visualisez votre semaine</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-sm bg-blue-100 border-l-2 border-blue-400 inline-block" /> Confirmé
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-sm bg-primary-100 border-l-2 border-primary-400 inline-block" /> En cours
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-sm bg-amber-50 border-l-2 border-amber-400 inline-block" /> En attente
            </div>
          </div>
        </div>
        <AgendaWeek />
      </main>
    </div>
  )
}
