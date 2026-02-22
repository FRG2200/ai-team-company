'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  MoreHorizontal,
  Search,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react'

// モックデータ
const mockTasks = [
  {
    id: '1',
    title: 'Next.jsプロジェクトの初期設定',
    description: 'プロジェクト構造の設計と依存関係のインストール',
    status: 'completed',
    priority: 'high',
    assignee: 'Takumi',
    dueDate: '2024-02-20',
    project: 'ECサイト開発',
    tags: ['setup', 'frontend']
  },
  {
    id: '2',
    title: 'UIコンポーネントライブラリの選定',
    description: 'Shadcn UIとTailwind CSSの導入検討',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Misaki',
    dueDate: '2024-02-22',
    project: 'ECサイト開発',
    tags: ['ui', 'design']
  },
  {
    id: '3',
    title: 'データベーススキーマ設計',
    description: 'Prismaスキーマの定義とマイグレーション',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'Kenta',
    dueDate: '2024-02-23',
    project: 'ECサイト開発',
    tags: ['database', 'backend']
  },
  {
    id: '4',
    title: '認証機能の実装',
    description: 'NextAuth.jsを使用した認証フロー構築',
    status: 'pending',
    priority: 'medium',
    assignee: 'Sho',
    dueDate: '2024-02-25',
    project: 'ECサイト開発',
    tags: ['auth', 'security']
  },
  {
    id: '5',
    title: '商品一覧ページの作成',
    description: '検索・フィルタリング機能付きの商品一覧',
    status: 'pending',
    priority: 'medium',
    assignee: 'Ren',
    dueDate: '2024-02-26',
    project: 'ECサイト開発',
    tags: ['frontend', 'feature']
  },
  {
    id: '6',
    title: 'APIエンドポイントの設計',
    description: 'RESTful API設計とドキュメント作成',
    status: 'review',
    priority: 'high',
    assignee: 'Satoko',
    dueDate: '2024-02-24',
    project: 'API開発',
    tags: ['api', 'documentation']
  },
  {
    id: '7',
    title: 'テスト環境の構築',
    description: 'JestとPlaywrightの設定',
    status: 'blocked',
    priority: 'low',
    assignee: 'Makoto',
    dueDate: '2024-02-28',
    project: 'インフラ',
    tags: ['testing', 'devops']
  },
]

const agents = ['すべて', 'Takumi', 'Misaki', 'Kenta', 'Sho', 'Ren', 'Satoko', 'Makoto']
const statuses = ['すべて', '進行中', '完了', '待機中', 'レビュー', 'ブロック']
const priorities = ['すべて', '緊急', '高', '中', '低']

export default function TasksPage() {
  const [filterStatus, setFilterStatus] = useState('すべて')
  const [filterAgent, setFilterAgent] = useState('すべて')
  const [filterPriority, setFilterPriority] = useState('すべて')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = mockTasks.filter(task => {
    const matchesStatus = filterStatus === 'すべて' || 
      (filterStatus === '進行中' && task.status === 'in-progress') ||
      (filterStatus === '完了' && task.status === 'completed') ||
      (filterStatus === '待機中' && task.status === 'pending') ||
      (filterStatus === 'レビュー' && task.status === 'review') ||
      (filterStatus === 'ブロック' && task.status === 'blocked')
    
    const matchesAgent = filterAgent === 'すべて' || task.assignee === filterAgent
    
    const matchesPriority = filterPriority === 'すべて' ||
      (filterPriority === '緊急' && task.priority === 'urgent') ||
      (filterPriority === '高' && task.priority === 'high') ||
      (filterPriority === '中' && task.priority === 'medium') ||
      (filterPriority === '低' && task.priority === 'low')
    
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesAgent && matchesPriority && matchesSearch
  })

  const stats = {
    total: mockTasks.length,
    inProgress: mockTasks.filter(t => t.status === 'in-progress').length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    pending: mockTasks.filter(t => t.status === 'pending').length,
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-1">タスク管理</h1>
          <p className="text-slate-500">プロジェクト全体のタスクを管理・追跡</p>
        </div>
        <GlassButton variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          新規タスク
        </GlassButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: '全タスク', value: stats.total, color: 'blue' },
          { label: '進行中', value: stats.inProgress, color: 'amber' },
          { label: '完了', value: stats.completed, color: 'emerald' },
          { label: '待機中', value: stats.pending, color: 'slate' },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-5" variant="default">
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 mb-6" variant="default">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600 font-medium">フィルター:</span>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white/50 border border-white/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="px-3 py-1.5 bg-white/50 border border-white/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {agents.map(a => <option key={a} value={a}>{a === 'すべて' ? '担当者: ' + a : a}</option>)}
          </select>
          
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 bg-white/50 border border-white/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {priorities.map(p => <option key={p} value={p}>{p === 'すべて' ? '優先度: ' + p : p}</option>)}
          </select>

          <div className="flex-1" />
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="タスクを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-white/50 border border-white/40 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          
          <GlassButton variant="ghost" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            並び替え
          </GlassButton>
        </div>
      </GlassCard>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task) => (
          <GlassCard 
            key={task.id} 
            className="group cursor-pointer"
            variant={task.status === 'completed' ? 'accent' : 'default'}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={task.status as any} />
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded">
                  <MoreHorizontal className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{task.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{task.description}</p>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4">
                <PriorityBadge priority={task.priority} />
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {task.dueDate}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/30">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    {task.assignee[0]}
                  </div>
                  <span className="text-sm text-slate-600">{task.assignee}</span>
                </div>
                <span className="text-xs px-2 py-1 bg-white/40 rounded-md text-slate-500">
                  {task.project}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <GlassCard className="p-12 text-center" variant="accent">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">タスクが見つかりません</h3>
          <p className="text-slate-500">フィルター条件を変更してください</p>
        </GlassCard>
      )}
    </DashboardLayout>
  )
}
