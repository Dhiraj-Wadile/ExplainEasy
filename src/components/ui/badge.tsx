import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'primary' | 'success' | 'warning' | 'info' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        {
          'bg-muted text-muted-foreground': variant === 'default',
          'bg-primary/10 text-primary': variant === 'secondary' || variant === 'primary',
          'bg-emerald-500/10 text-emerald-400': variant === 'success',
          'bg-amber-500/10 text-amber-400': variant === 'warning',
          'bg-blue-500/10 text-blue-400': variant === 'info',
          'border border-border text-muted-foreground bg-transparent': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
