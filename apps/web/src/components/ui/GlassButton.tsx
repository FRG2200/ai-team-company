import { cn } from '@/lib/utils'

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function GlassButton({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  ...props
}: GlassButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl backdrop-blur-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white border border-white/30 shadow-[0_4px_12px_-2px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-xl hover:from-blue-500 hover:to-indigo-600',
    secondary: 'bg-white/60 text-slate-700 border border-white/40 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] hover:bg-white/80 hover:shadow-lg',
    ghost: 'bg-transparent text-slate-600 hover:bg-white/30 hover:text-slate-900',
    danger: 'bg-gradient-to-r from-red-500/90 to-rose-600/90 text-white border border-white/30 shadow-[0_4px_12px_-2px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-xl hover:from-red-500 hover:to-rose-600'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
