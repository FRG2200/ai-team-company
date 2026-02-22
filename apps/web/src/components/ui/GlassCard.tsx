import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'accent'
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  onClick
}: GlassCardProps) {
  const baseStyles = 'backdrop-blur-xl border rounded-2xl overflow-hidden'
  
  const variants = {
    default: 'bg-white/70 border-white/40',
    dark: 'bg-slate-900/40 border-white/10',
    accent: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-300/30'
  }
  
  const shadows = {
    default: 'shadow-[0_4px_24px_-1px_rgba(0,0,0,0.08),0_2px_8px_-1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]',
    dark: 'shadow-[0_8px_32px_-4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]',
    accent: 'shadow-[0_8px_32px_-4px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]'
  }
  
  const hoverStyles = hover ? 'transition-all duration-300 hover:scale-[1.01] hover:shadow-lg' : ''
  const cursorStyles = onClick ? 'cursor-pointer' : ''
  
  return (
    <div 
      className={cn(baseStyles, variants[variant], shadows[variant], hoverStyles, cursorStyles, className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
