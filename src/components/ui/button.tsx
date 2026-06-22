import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
          {
            'bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20':
              variant === 'primary',
            'bg-accent text-accent-foreground hover:bg-accent/80': variant === 'secondary',
            'hover:bg-white/5 text-muted-foreground hover:text-foreground': variant === 'ghost',
            'border border-border bg-transparent hover:bg-white/5 hover:border-muted-foreground/30':
              variant === 'outline',
            'h-9 px-4 text-sm gap-1.5': size === 'sm',
            'h-10 px-5 text-sm gap-2': size === 'md',
            'h-12 px-7 text-base gap-2.5': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
export { Button }
