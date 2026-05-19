import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ padding = 'md', children, className = '', ...props }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={`bg-white border border-gray-100 rounded-lg ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
