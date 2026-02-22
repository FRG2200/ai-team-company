import { cn } from '@/lib/utils'

type StatusType = 'pending' | 'in-progress' | 'completed' | 'blocked' | 'review' | 'cancelled'

interface StatusBadgeProps {
  status: StatusType | string
  className?: string
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  'pending': { 
    bg: 'bg-amber-400/20', 
    text: 'text-amber-700',
    label: '待機中'
  },
  'in-progress': { 
    bg: 'bg-blue-400/20', 
    text: 'text-blue-700',
    label: '進行中'
  },
  'completed': { 
    bg: 'bg-emerald-400/20', 
    text: 'text-emerald-700',
    label: '完了'
  },
  'blocked': { 
    bg: 'bg-red-400/20', 
    text: 'text-red-700',
    label: 'ブロック'
  },
  'review': { 
    bg: 'bg-purple-400/20', 
    text: 'text-purple-700',
    label: 'レビュー'
  },
  'cancelled': { 
    bg: 'bg-gray-400/20', 
    text: 'text-gray-700',
    label: 'キャンセル'
  },
  // English fallbacks
  'waiting': { bg: 'bg-amber-400/20', text: 'text-amber-700', label: '待機中' },
  'active': { bg: 'bg-blue-400/20', text: 'text-blue-700', label: '進行中' },
  'done': { bg: 'bg-emerald-400/20', text: 'text-emerald-700', label: '完了' },
}

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || { 
    bg: 'bg-slate-400/20', 
    text: 'text-slate-700',
    label: status
  }
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  }
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium backdrop-blur-sm',
      'border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
      config.bg,
      config.text,
      sizeClasses[size],
      className
    )}>
      <span className={cn(
        'mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse',
        status === 'in-progress' || status === 'active' ? 'bg-current' : 'hidden'
      )} />
      {config.label}
    </span>
  )
}
