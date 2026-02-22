'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { ExportModal } from '@/components/export/ExportModal'
import { 
  Download, 
  Cloud, 
  HardDrive, 
  Calendar,
  Clock,
  FileCode,
  Folder,
  MoreHorizontal,
  ExternalLink,
  Trash2
} from 'lucide-react'

// モックデータ - 完了プロジェクト
const completedProjects = [
  {
    id: '1',
    name: 'ECサイト開発',
    description: 'Next.jsによるフルスタックECサイト',
    completedAt: '2024-02-15',
    size: '45.2 MB',
    files: 127,
    location: 'local',
    path: '~/Projects/exports/ec-site-20240215.zip'
  },
  {
    id: '2',
    name: 'ポートフォリオサイト',
    description: '個人用ポートフォリオ',
    completedAt: '2024-02-10',
    size: '12.8 MB',
    files: 34,
    location: 'cloud',
    path: 'gs://ai-team-exports/portfolio-20240210.zip'
  },
  {
    id: '3',
    name: 'SNSアプリ',
    description: 'リアルタイムチャット機能付きSNS',
    completedAt: '2024-02-05',
    size: '89.4 MB',
    files: 256,
    location: 'local',
    path: '~/Projects/exports/sns-app-20240205.zip'
  },
  {
    id: '4',
    name: '管理ダッシュボード',
    description: 'データ可視化ダッシュボード',
    completedAt: '2024-01-28',
    size: '23.1 MB',
    files: 67,
    location: 'cloud',
    path: 'gs://ai-team-exports/dashboard-20240128.zip'
  },
]

export default function ExportPage() {
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState('新規プロジェクト')

  const handleExport = (projectName: string) => {
    setSelectedProject(projectName)
    setShowExportModal(true)
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-1">制作物保存</h1>
          <p className="text-slate-500">完了したプロジェクトをエクスポート・管理</p>
        </div>
        <GlassButton 
          variant="primary"
          onClick={() => handleExport('新規プロジェクト')}
        >
          <Download className="h-4 w-4 mr-2" />
          新規エクスポート
        </GlassButton>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-6" variant="accent">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <HardDrive className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">ローカル保存</h3>
              <p className="text-sm text-slate-500 mb-3">
                デスクトップやダウンロードフォルダにZIPファイルとして保存
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>対応形式: ZIP</span>
                <span>最大: 500MB</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6" variant="accent">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">Google Cloud Storage</h3>
              <p className="text-sm text-slate-500 mb-3">
                クラウドストレージにアップロードしてどこからでもアクセス
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>自動バックアップ</span>
                <span className="text-emerald-500">● 接続済み</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Completed Projects */}
      <h2 className="text-lg font-semibold text-slate-800 mb-4">完了プロジェクト一覧</h2>

      <div className="space-y-4">
        {completedProjects.map((project) => (
          <GlassCard key={project.id} className="group" variant="default">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    project.location === 'local' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}
                  >
                    {project.location === 'local' ? <HardDrive className="h-6 w-6" /> : <Cloud className="h-6 w-6" />}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{project.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">{project.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {project.completedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileCode className="h-3.5 w-3.5" />
                        {project.files} ファイル
                      </span>
                      <span className="flex items-center gap-1">
                        <Folder className="h-3.5 w-3.5" />
                        {project.size}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <GlassButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleExport(project.name)}
                  >
                    <Download className="h-4 w-4" />
                  </GlassButton>
                  
                  <GlassButton variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </GlassButton>
                  
                  <GlassButton variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </GlassButton>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {showExportModal && (
        <ExportModal 
          projectName={selectedProject}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </DashboardLayout>
  )
}
