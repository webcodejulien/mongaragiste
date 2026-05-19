interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  const variants = {
    success: 'bg-primary-50 text-primary-800',
    warning: 'bg-amber-50 text-amber-800',
    danger:  'bg-red-50 text-red-700',
    info:    'bg-blue-50 text-blue-700',
    neutral: 'bg-gray-100 text-gray-600',
  }

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function statusToBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    PENDING:     { label: 'En attente',   variant: 'warning' },
    CONFIRMED:   { label: 'Confirmé',     variant: 'info' },
    IN_PROGRESS: { label: 'En cours',     variant: 'info' },
    DONE:        { label: 'Terminé',      variant: 'success' },
    CANCELLED:   { label: 'Annulé',       variant: 'danger' },
    ACTIVE:      { label: 'Actif',        variant: 'success' },
    SUSPENDED:   { label: 'Suspendu',     variant: 'danger' },
  }
  return map[status] ?? { label: status, variant: 'neutral' as const }
}
