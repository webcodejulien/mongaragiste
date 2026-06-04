import Link from 'next/link'

type LogoVariant = 'default' | 'white' | 'dark'
type LogoSize   = 'xs' | 'sm' | 'md' | 'lg'

const SIZES: Record<LogoSize, { icon: number; mon: string; garagiste: string; gap: string }> = {
  xs: { icon: 20, mon: 'text-[12px]', garagiste: 'text-[12px]', gap: 'gap-1' },
  sm: { icon: 26, mon: 'text-[15px]', garagiste: 'text-[15px]', gap: 'gap-1.5' },
  md: { icon: 32, mon: 'text-[19px]', garagiste: 'text-[19px]', gap: 'gap-2' },
  lg: { icon: 42, mon: 'text-[24px]', garagiste: 'text-[24px]', gap: 'gap-2.5' },
}

/* Icône carré arrondi — utilisée uniquement pour favicon/app icon */
export function LogoIcon({ size = 32, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="44" height="44" rx="10" fill={dark ? '#111827' : '#1D9E75'} />
      <polygon points="8,34 8,10 22,23 36,10 36,34 32,34 32,15 22,27 12,15 12,34" fill={dark ? '#1D9E75' : 'white'} />
    </svg>
  )
}

interface LogoProps {
  size?:     LogoSize
  variant?:  LogoVariant
  href?:     string
  iconOnly?: boolean
  className?: string
}

export function Logo({
  size     = 'sm',
  variant  = 'default',
  href     = '/',
  iconOnly = false,
  className,
}: LogoProps) {
  const { mon, garagiste, gap } = SIZES[size]

  // Couleurs selon le variant
  const monColor       = variant === 'white' ? '#fff'     : '#1D9E75'
  const garagisteColor = variant === 'white' ? '#fff'     : variant === 'dark' ? '#fff' : '#1a1a2e'

  const content = (
    <div className={`flex items-center ${gap} ${className ?? ''}`} style={{ userSelect: 'none' }}>
      {!iconOnly && (
        <span className={`${mon} leading-none tracking-tight`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <span style={{ fontWeight: 300, color: monColor }}>Mon</span>
          <span style={{ fontWeight: 700, color: garagisteColor }}>Garagiste</span>
        </span>
      )}
      {iconOnly && <LogoIcon size={SIZES[size].icon} dark={variant === 'dark'} />}
    </div>
  )

  if (!href) return content
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      {content}
    </Link>
  )
}
