'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { 
  Plus, 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { api } from '@/lib/api'

interface Project {
  id: string
  name: string
  description: string
  status: string
  createdAt: string
  progress: number
}

// モックプロジェクトデータ
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'ECサイト開発',
    description: 'Next.jsによるフルスタックECサイト構築',
    status: 'development',
    createdAt: '2024-02-20',
    progress: 65
  },
  {
    id: '2',
    name: 'SNSアプリ',
    description: 'リアルタイムチャット機能付きSNS',
    status: 'planning',
    createdAt: '2024-02-18',
    progress: 20
  },
  {
    id: '3',
    name: '管理ダッシュボード',
    description: 'データ可視化ダッシュボード',
    status: 'deployed',
    createdAt: '2024-02-10',
    progress: 100
  },
]

const recentActivity = [
  { id: 1, action: '新規プロジェクト作成', target: 'ECサイト開発', time: '2時間前', type: 'create' },
  { id: 2, action: 'タスク完了', target: 'UIコンポーネント選定', time: '4時間前', type: 'complete' },
  { id: 3, action: 'デプロイ完了', target: '管理ダッシュボード', time: '1日前', type: 'deploy' },
  { id: 4, action: 'エージェント割り当て', target: 'Takumi', time: '1日前', type: 'assign' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [loading, setLoading] = useState(false)

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'development').length,
    completed: projects.filter(p => p.status === 'deployed').length,
    progress: Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <GlassCard className="mb-8 p-8" variant="accent">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-amber-600">AIエージェントが稼働中</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">おかえりなさい</h1>
            <p className="text-slate-600 max-w-xl">
              7人のAIエージェントがあなたのプロジェクトをサポートしています。
              新しいアイデアをプロジェクトとして追加して、開発を始めましょう。
            </p>
          </div>
          
          <GlassButton variant="primary" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            新規プロジェクト
          </GlassButton>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-5" variant="default">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">全プロジェクト</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" variant="default">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">進行中</p>
              <p className="text-2xl font-bold text-amber-600">{stats.active}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" variant="default">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">完了</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" variant="default">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">平均進捗</p>
              <p className="text-2xl font-bold text-violet-600">{stats.progress}%</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">最近のプロジェクト</h2>
            <Link 
              href="/projects" 
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              すべて表示
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <GlassCard key={project.id} className="group cursor-pointer" variant="default">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-500">{project.description}</p>
                    </div>
                    <StatusBadge 
                      status={
                        project.status === 'deployed' ? 'completed' :
                        project.status === 'development' ? 'in-progress' : 'pending'
                      } 
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">進捗</span>
                        <span className="text-xs font-medium text-slate-700">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <span className="text-xs text-slate-400">
                      {new Date(project.createdAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">最近のアクティビティ</h2>
          
          <GlassCard className="p-5">
            <div className="space-y-5">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-5 border-b border-white/20 last:border-0 last:pb-0"
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'create' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'complete' ? 'bg-emerald-100 text-emerald-600' :
                    activity.type === 'deploy' ? 'bg-violet-100 text-violet-600' :
                    'bg-amber-100 text-amber-600'
                  }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-slate-800">
                      <span className="font-medium">{activity.action}</span>
                    </p>
                    <p className="text-xs text-slate-500">{activity.target}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="mt-4 p-5" variant="accent">
            <h3 className="font-semibold text-slate-800 mb-3">クイックアクセス</h3>
            
            <div className="space-y-2">
              <Link href="/tasks">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-slate-700">タスク管理</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 ml-auto" />
                </div>
              </Link>
              
              <Link href="/agents">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <span className="text-sm text-slate-700">エージェント状況</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 ml-auto" />
                </div>
              </Link>
              
              <Link href="/export">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <FolderKanban className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-slate-700">制作物保存</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 ml-auto" />
                </div>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  )
}
