import { cn } from '@/lib/utils'

type PriorityType = 'high' | 'medium' | 'low' | 'urgent'

interface PriorityBadgeProps {
  priority: PriorityType | string
  className?: string
  showLabel?: boolean
}

const priorityConfig: Record<string, { color: string; label: string }> = {
  'urgent': { color: 'bg-red-500', label: '緊急' },
  'high': { color: 'bg-orange-500', label: '高' },
  'medium': { color: 'bg-yellow-500', label: '中' },
  'low': { color: 'bg-green-500', label: '低' },
}

export function PriorityBadge({ priority, className, showLabel = true }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || { color: 'bg-gray-400', label: priority }
  
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('h-2 w-2 rounded-full', config.color)} />
      {showLabel && (
        <span className="text-xs text-slate-600 font-medium">{config.label}</span>
      )}
    </span>
  )
}
