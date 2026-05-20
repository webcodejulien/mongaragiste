interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-4xl mb-4">{icon}</span>
      <p className="text-[15px] font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{title}</p>
      {description && (
        <p className="text-[13px] max-w-xs leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
