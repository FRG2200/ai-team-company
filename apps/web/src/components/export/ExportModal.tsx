'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { 
  Download, 
  Cloud, 
  HardDrive, 
  FileArchive, 
  CheckCircle,
  Loader2,
  ExternalLink
} from 'lucide-react'

interface ExportOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  formats: string[]
}

const exportOptions: ExportOption[] = [
  {
    id: 'local',
    name: 'ローカルに保存',
    description: 'デスクトップまたはダウンロードフォルダに保存',
    icon: <HardDrive className="h-5 w-5" />,
    formats: ['ZIP', 'フォルダ']
  },
  {
    id: 'cloud',
    name: 'Google Cloud Storage',
    description: 'クラウドストレージにアップロード',
    icon: <Cloud className="h-5 w-5" />,
    formats: ['ZIP', 'バックアップ']
  }
]

interface ExportModalProps {
  projectName: string
  onClose: () => void
}

export function ExportModal({ projectName, onClose }: ExportModalProps) {
  const [selectedOption, setSelectedOption] = useState('local')
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [exportLocation, setExportLocation] = useState('')

  const handleExport = async () => {
    setIsExporting(true)
    
    // エクスポート処理のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (selectedOption === 'local') {
      // 実際の実装では、ここでファイルダウンロードを実行
      const blob = new Blob(['Project export content'], { type: 'application/zip' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectName.replace(/\s+/g, '_')}_export.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setExportLocation('ダウンロードフォルダ')
    } else {
      setExportLocation('Google Cloud Storage /projects/' + projectName.replace(/\s+/g, '_'))
    }
    
    setIsExporting(false)
    setExportComplete(true)
  }

  if (exportComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <GlassCard className="w-full max-w-md p-6" variant="accent">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">エクスポート完了</h3>
            <p className="text-sm text-slate-500 mb-4">
              {projectName} のエクスポートが完了しました
            </p>
            
            <GlassCard className="p-4 mb-6" variant="default">
              <p className="text-xs text-slate-500 mb-1">保存先</p>
              <p className="text-sm font-medium text-slate-700">{exportLocation}</p>
            </GlassCard>

            <div className="flex gap-3">
              <GlassButton 
                variant="secondary" 
                className="flex-1"
                onClick={onClose}
              >
                閉じる
              </GlassButton>
              <GlassButton 
                variant="primary" 
                className="flex-1"
                onClick={() => {
                  // フォルダを開く（実際の実装では適切なAPIを使用）
                  window.open('#', '_blank')
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                開く
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <GlassCard className="w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">プロジェクトをエクスポート</h3>
            <p className="text-sm text-slate-500">{projectName}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Download className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {exportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full p-4 rounded-xl border transition-all text-left ${
                selectedOption === option.id
                  ? 'bg-blue-50/50 border-blue-300 shadow-sm'
                  : 'bg-white/40 border-white/30 hover:bg-white/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  selectedOption === option.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
                >
                  {option.icon}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{option.name}</h4>
                  <p className="text-sm text-slate-500 mb-2">{option.description}</p>
                  <div className="flex gap-2">
                    {option.formats.map((format) => (
                      <span 
                        key={format}
                        className="px-2 py-0.5 bg-white/60 rounded text-xs text-slate-600"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === option.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}
                >
                  {selectedOption === option.id && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <GlassButton 
            variant="secondary" 
            className="flex-1"
            onClick={onClose}
            disabled={isExporting}
          >
            キャンセル
          </GlassButton>
          
          <GlassButton 
            variant="primary" 
            className="flex-1"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                エクスポート中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </>
            )}
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  )
}
