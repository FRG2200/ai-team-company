'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  FileCode,
  Search,
  Palette,
  Globe,
  Terminal,
  BarChart3,
  MoreHorizontal
} from 'lucide-react'

// 7人のAIエージェント定義
const agents = [
  {
    id: 'takumi',
    name: 'Takumi',
    role: 'リードエンジニア',
    avatar: 'T',
    color: 'from-blue-500 to-indigo-600',
    icon: Terminal,
    skills: ['アーキテクチャ設計', 'コードレビュー', 'バグ修正'],
    status: 'active',
    currentTask: 'Next.js 15アップグレード対応',
    progress: 78,
    tasksCompleted: 142,
    tasksToday: 5,
    lastActive: '今'
  },
  {
    id: 'misaki',
    name: 'Misaki',
    role: 'UI/UXデザイナー',
    avatar: 'M',
    color: 'from-pink-500 to-rose-600',
    icon: Palette,
    skills: ['UI設計', 'プロトタイピング', 'デザインシステム'],
    status: 'active',
    currentTask: 'ダッシュボードのガラスモーフィズムデザイン',
    progress: 65,
    tasksCompleted: 89,
    tasksToday: 3,
    lastActive: '今'
  },
  {
    id: 'kenta',
    name: 'Kenta',
    role: 'バックエンドエンジニア',
    avatar: 'K',
    color: 'from-emerald-500 to-teal-600',
    icon: FileCode,
    skills: ['API設計', 'データベース', 'インフラ'],
    status: 'active',
    currentTask: 'Prismaスキーマ最適化',
    progress: 45,
    tasksCompleted: 156,
    tasksToday: 4,
    lastActive: '2分前'
  },
  {
    id: 'sho',
    name: 'Sho',
    role: 'フロントエンドエンジニア',
    avatar: 'S',
    color: 'from-violet-500 to-purple-600',
    icon: Zap,
    skills: ['React', 'TypeScript', 'パフォーマンス最適化'],
    status: 'idle',
    currentTask: '待機中',
    progress: 0,
    tasksCompleted: 124,
    tasksToday: 2,
    lastActive: '15分前'
  },
  {
    id: 'ren',
    name: 'Ren',
    role: 'DevOpsエンジニア',
    avatar: 'R',
    color: 'from-amber-500 to-orange-600',
    icon: Globe,
    skills: ['CI/CD', 'Docker', 'AWS'],
    status: 'active',
    currentTask: 'Vercelデプロイパイプライン構築',
    progress: 92,
    tasksCompleted: 67,
    tasksToday: 6,
    lastActive: '今'
  },
  {
    id: 'satoko',
    name: 'Satoko',
    role: 'QAエンジニア',
    avatar: 'S',
    color: 'from-cyan-500 to-blue-600',
    icon: Search,
    skills: ['テスト設計', 'E2Eテスト', '品質管理'],
    status: 'active',
    currentTask: 'Playwrightテストケース作成',
    progress: 34,
    tasksCompleted: 203,
    tasksToday: 7,
    lastActive: '5分前'
  },
  {
    id: 'makoto',
    name: 'Makoto',
    role: 'プロジェクトマネージャー',
    avatar: 'M',
    color: 'from-slate-500 to-gray-600',
    icon: BarChart3,
    skills: ['進捗管理', 'タスク調整', 'レポーティング'],
    status: 'active',
    currentTask: 'スプリント計画の見直し',
    progress: 56,
    tasksCompleted: 78,
    tasksToday: 4,
    lastActive: '今'
  },
]

// 作業履歴
const activityHistory = [
  { id: 1, agent: 'Takumi', action: 'プルリクエストをマージ', target: 'feature/auth-login', time: '2分前', type: 'success' },
  { id: 2, agent: 'Misaki', action: 'デザインを更新', target: 'Dashboard UI', time: '5分前', type: 'update' },
  { id: 3, agent: 'Kenta', action: 'APIエンドポイントを作成', target: '/api/users', time: '8分前', type: 'success' },
  { id: 4, agent: 'Ren', action: 'デプロイを完了', target: 'Production', time: '12分前', type: 'success' },
  { id: 5, agent: 'Satoko', action: 'バグを検出', target: 'Login Form', time: '15分前', type: 'warning' },
  { id: 6, agent: 'Takumi', action: 'コードレビュー', target: 'PR #234', time: '20分前', type: 'info' },
  { id: 7, agent: 'Makoto', action: 'タスクを割り当て', target: 'Misaki', time: '25分前', type: 'info' },
]

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const [isSimulating, setIsSimulating] = useState(true)

  const activeAgents = agents.filter(a => a.status === 'active').length
  const totalProgress = Math.round(agents.reduce((acc, a) => acc + a.progress, 0) / agents.length)
  const totalTasksToday = agents.reduce((acc, a) => acc + a.tasksToday, 0)

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-1">エージェント作業状況</h1>
          <p className="text-slate-500">7人のAIエージェントのリアルタイム作業状況</p>
        </div>
        <div className="flex items-center gap-3">
          <GlassButton 
            variant={isSimulating ? 'primary' : 'secondary'}
            onClick={() => setIsSimulating(!isSimulating)}
          >
            {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isSimulating ? '一時停止' : '再開'}
          </GlassButton>
          <GlassButton variant="secondary">
            <RotateCcw className="h-4 w-4 mr-2" />
            リセット
          </GlassButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-5" variant="default">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">稼働中</p>
              <p className="text-2xl font-bold text-emerald-600">{activeAgents}/7</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" variant="default">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">総合進捗</p>
              <p className="text-2xl font-bold text-blue-600">{totalProgress}%</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" variant="default">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">今日完了</p>
              <p className="text-2xl font-bold text-violet-600">{totalTasksToday}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" variant="default">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">稼働時間</p>
              <p className="text-2xl font-bold text-amber-600">6h 42m</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">エージェント一覧</h2>
          
          {agents.map((agent) => {
            const Icon = agent.icon
            return (
              <GlassCard
                key={agent.id}
                className={`cursor-pointer transition-all ${selectedAgent.id === agent.id ? 'ring-2 ring-blue-500/30' : ''}`}
                variant={agent.status === 'active' ? 'default' : 'accent'}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {agent.avatar}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-800">{agent.name}</h3>
                          <p className="text-sm text-slate-500">{agent.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={agent.status === 'active' ? 'in-progress' : 'pending'} />
                          <button className="p-1 hover:bg-white/50 rounded">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </button>
                        </div>
                      </div>

                      {/* Current Task */}
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{agent.currentTask}</span>
                      </div>

                      {/* Progress */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${agent.color} transition-all duration-1000`}
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600 w-10 text-right">{agent.progress}%</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/30">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-xs text-slate-500">{agent.tasksCompleted} 完了</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-xs text-slate-500">本日 {agent.tasksToday}件</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-violet-500" />
                          <span className="text-xs text-slate-500">{agent.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {/* Right Panel - Details & History */}
        <div className="space-y-6">
          {/* Selected Agent Details */}
          <GlassCard variant="accent">
            <div className="p-5">
              <h3 className="font-semibold text-slate-800 mb-4">{selectedAgent.name}の詳細</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">専門スキル</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2.5 py-1 bg-white/60 rounded-lg text-xs text-slate-600 border border-white/40"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">現在の作業</p>
                  <p className="text-sm text-slate-700">{selectedAgent.currentTask}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">進捗状況</p>
                  <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${selectedAgent.color} rounded-full`}
                      style={{ width: `${selectedAgent.progress}%` }}
                    />
                  </div>
                  <p className="text-right text-sm text-slate-600 mt-1">{selectedAgent.progress}%</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/30">
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{selectedAgent.tasksCompleted}</p>
                    <p className="text-xs text-slate-500">総完了タスク</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{selectedAgent.tasksToday}</p>
                    <p className="text-xs text-slate-500">今日のタスク</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Activity History */}
          <GlassCard>
            <div className="p-5">
              <h3 className="font-semibold text-slate-800 mb-4">作業履歴</h3>
              
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {activityHistory.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-white/20 last:border-0">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'success' ? 'bg-emerald-100' :
                      activity.type === 'warning' ? 'bg-amber-100' :
                      activity.type === 'update' ? 'bg-blue-100' :
                      'bg-slate-100'
                    }`}>
                      {activity.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      {activity.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-600" />}
                      {activity.type === 'update' && <Zap className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'info' && <MessageSquare className="h-4 w-4 text-slate-600" />}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-slate-800">
                        <span className="font-medium">{activity.agent}</span>
                        {' '}{activity.action}
                      </p>
                      <p className="text-xs text-slate-500">{activity.target}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  )
}
