export function Skeleton({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: 'var(--color-background-tertiary)', ...style }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-[10px] p-4" style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)' }}>
      <Skeleton style={{ height: '12px', width: '60%', marginBottom: '10px' }} />
      <Skeleton style={{ height: '28px', width: '40%', marginBottom: '8px' }} />
      <Skeleton style={{ height: '10px', width: '50%' }} />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3" style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
      <Skeleton style={{ width: '60px', height: '14px' }} />
      <Skeleton style={{ flex: 1, height: '14px' }} />
      <Skeleton style={{ width: '80px', height: '14px' }} />
      <Skeleton style={{ width: '60px', height: '22px', borderRadius: '999px' }} />
    </div>
  )
}
