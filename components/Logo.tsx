import Link from 'next/link'
import Image from 'next/image'

type LogoVariant = 'default' | 'white' | 'dark'
type LogoSize   = 'xs' | 'sm' | 'md' | 'lg'

const SIZES: Record<LogoSize, { icon: number; text: string; gap: string }> = {
  xs: { icon: 22, text: 'text-[13px]', gap: 'gap-1.5' },
  sm: { icon: 28, text: 'text-[15px]', gap: 'gap-2'   },
  md: { icon: 34, text: 'text-[18px]', gap: 'gap-2.5' },
  lg: { icon: 44, text: 'text-[22px]', gap: 'gap-3'   },
}

interface LogoProps {
  size?:     LogoSize
  variant?:  LogoVariant
  href?:     string
  iconOnly?: boolean
  className?: string
}

function LogoMark({ size, variant }: { size: number; variant: LogoVariant }) {
  const isDark = variant === 'dark'
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 44 44" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect width="44" height="44" rx="10" fill={isDark ? '#111827' : '#1D9E75'} />
      <polygon
        points="8,34 8,10 22,23 36,10 36,34 32,34 32,15 22,27 12,15 12,34"
        fill={isDark ? '#1D9E75' : 'white'}
      />
      <rect x="8" y="36" width="28" height="2.5" rx="1.25"
        fill={isDark ? 'rgba(29,158,117,0.4)' : 'rgba(255,255,255,0.3)'} />
    </svg>
  )
}

export function Logo({
  size     = 'sm',
  variant  = 'default',
  href     = '/',
  iconOnly = false,
  className,
}: LogoProps) {
  const { icon, text, gap } = SIZES[size]
  const textColor = variant === 'white' ? '#fff' : 'var(--color-text-primary)'

  const content = (
    <div className={`flex items-center ${gap} ${className ?? ''}`}>
      <LogoMark size={icon} variant={variant} />
      {!iconOnly && (
        <span className={`${text} leading-none select-none`} style={{ color: textColor }}>
          <span style={{ fontWeight: 300 }}>Mon</span>
          <span style={{ fontWeight: 700 }}>Garagiste</span>
        </span>
      )}
    </div>
  )

  if (!href) return content
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      {content}
    </Link>
  )
}
