'use client'

import { Bell, Search, User, LogOut } from 'lucide-react'
import { GlassButton } from '@/components/ui/GlassButton'
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  return (
    <header className="fixed top-0 right-0 left-64 h-16 glass-header z-40">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left - Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="タスク、プロジェクト、エージェントを検索..."
              className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white/70 transition-all"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          <GlassButton variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
          </GlassButton>
          
          <div className="h-6 w-px bg-slate-200" />
          
          <GlassButton variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </GlassButton>
          
          <GlassButton variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </GlassButton>
        </div>
      </div>
    </header>
  )
}
