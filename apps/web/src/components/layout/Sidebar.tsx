'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Settings, 
  FolderKanban,
  Sparkles,
  Download
} from 'lucide-react'

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
  { name: 'タスク管理', href: '/tasks', icon: CheckSquare },
  { name: 'エージェント', href: '/agents', icon: Users },
  { name: 'プロジェクト', href: '/projects', icon: FolderKanban },
  { name: '制作物保存', href: '/export', icon: Download },
  { name: '設定', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-sidebar z-50">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-white/20">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">atoms.dev</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-blue-500/10 text-blue-700 border border-blue-200/50 shadow-sm' 
                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive ? 'text-blue-600' : 'text-slate-400')} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/20">
          <div className="glass-card p-4">
            <p className="text-xs text-slate-500 mb-2">AIエージェント稼働中</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500'].map((color, i) => (
                  <div 
                    key={i}
                    className={cn('h-6 w-6 rounded-full border-2 border-white', color)}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-600 font-medium">+3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
