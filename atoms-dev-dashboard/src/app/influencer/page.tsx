'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Video, Play, Clock, CheckCircle2, AlertCircle, 
  Loader2, ChevronLeft, Wand2, Zap, Star, Settings2
} from 'lucide-react';
import Link from 'next/link';

type Engine = 'seedance' | 'sora' | 'veo';
type VideoStatus = 'idle' | 'generating' | 'polling' | 'completed' | 'failed';

interface GeneratedVideo {
  taskId: string;
  engine: Engine;
  status: VideoStatus;
  videoUrl?: string;
  prompt: string;
  createdAt: Date;
  progress?: number;
}

const ENGINE_INFO = {
  seedance: {
    name: 'Seedance 1.5 Pro',
    provider: 'BytePlus',
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-300',
    icon: '⚡',
    description: '高速・高品質な動画生成。音声付き対応。',
    features: ['720p / 1080p', '10秒動画', '音声付き', '高速生成'],
  },
  sora: {
    name: 'Sora 2',
    provider: 'OpenAI',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    badge: 'bg-green-500/20 text-green-300',
    icon: '🎬',
    description: 'OpenAI の最先端動画生成モデル。',
    features: ['1280x720', '8秒動画', '高品質', 'Sora 2 Pro対応'],
  },
  veo: {
    name: 'Veo 3.1',
    provider: 'Google',
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300',
    icon: '🌟',
    description: 'Google の最新動画生成モデル。映画品質。',
    features: ['720p / 4K', '8秒動画', '映画品質', '音声付き'],
  },
};

const PRESET_PROMPTS = [
  {
    label: 'ファッション系インフルエンサー',
    prompt: 'A stylish young Japanese woman influencer in her 20s, wearing trendy streetwear in Harajuku Tokyo, confidently walking and smiling at camera, golden hour lighting, cinematic style, 4K quality',
  },
  {
    label: 'フィットネス系インフルエンサー',
    prompt: 'A fit and energetic fitness influencer doing a workout in a modern gym, motivational expression, dynamic camera movement, bright lighting, professional video quality',
  },
  {
    label: 'ビューティー系インフルエンサー',
    prompt: 'A beautiful makeup artist influencer demonstrating a skincare routine, close-up shots, soft natural lighting, elegant and professional studio setting, high-end beauty brand aesthetic',
  },
  {
    label: 'テック系インフルエンサー',
    prompt: 'A young tech entrepreneur presenting the latest AI gadgets in a sleek modern office, enthusiastic and knowledgeable expression, futuristic background with holographic displays',
  },
  {
    label: 'フード系インフルエンサー',
    prompt: 'A cheerful food influencer tasting delicious Japanese ramen in a cozy Tokyo restaurant, authentic reactions, warm ambient lighting, cinematic food photography style',
  },
];

export default function InfluencerPage() {
  const [selectedEngine, setSelectedEngine] = useState<Engine>('seedance');
  const [prompt, setPrompt] = useState('');
  const [quality, setQuality] = useState<'standard' | 'pro'>('standard');
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setIsGenerating(true);

    const newVideo: GeneratedVideo = {
      taskId: '',
      engine: selectedEngine,
      status: 'generating',
      prompt: prompt.trim(),
      createdAt: new Date(),
      progress: 0,
    };

    try {
      const endpoint = `/api/video/${selectedEngine}`;
      const body: Record<string, unknown> = { prompt: prompt.trim() };
      if (selectedEngine === 'sora') body.quality = quality;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成に失敗しました');

      newVideo.taskId = data.taskId;
      newVideo.status = 'polling';
      setVideos(prev => [newVideo, ...prev]);

      // Start polling
      pollStatus(data.taskId, selectedEngine);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '生成に失敗しました';
      setError(msg);
      setIsGenerating(false);
      return;
    }

    setIsGenerating(false);
  };

  const pollStatus = async (taskId: string, engine: Engine) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setVideos(prev => prev.map(v =>
          v.taskId === taskId ? { ...v, status: 'failed' } : v
        ));
        return;
      }

      try {
        const res = await fetch(`/api/video/status?taskId=${taskId}&engine=${engine}`);
        const data = await res.json();

        if (data.status === 'completed') {
          setVideos(prev => prev.map(v =>
            v.taskId === taskId
              ? { ...v, status: 'completed', videoUrl: data.videoUrl, progress: 100 }
              : v
          ));
        } else if (data.status === 'failed') {
          setVideos(prev => prev.map(v =>
            v.taskId === taskId ? { ...v, status: 'failed' } : v
          ));
        } else {
          setVideos(prev => prev.map(v =>
            v.taskId === taskId
              ? { ...v, progress: data.progress || attempts * 2 }
              : v
          ));
          attempts++;
          setTimeout(poll, 5000);
        }
      } catch {
        attempts++;
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">ダッシュボード</span>
          </Link>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">AI インフルエンサー</h1>
              <p className="text-xs text-slate-400">動画生成スタジオ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Engine Selection */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            動画生成エンジン
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(ENGINE_INFO) as Engine[]).map(engine => {
              const info = ENGINE_INFO[engine];
              const isSelected = selectedEngine === engine;
              return (
                <motion.button
                  key={engine}
                  onClick={() => setSelectedEngine(engine)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? `${info.bg} ${info.border} border`
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  {isSelected && (
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${info.color} opacity-5`} />
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{info.icon}</span>
                    {isSelected && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${info.badge} font-medium`}>
                        選択中
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-white text-sm">{info.name}</div>
                  <div className="text-xs text-slate-400 mb-2">{info.provider}</div>
                  <p className="text-xs text-slate-500 mb-3">{info.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {info.features.map(f => (
                      <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
                        {f}
                      </span>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">プロンプト</h2>
          </div>

          {/* Preset Prompts */}
          <div>
            <p className="text-xs text-slate-400 mb-2">プリセット</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROMPTS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => setPrompt(preset.prompt)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="インフルエンサーの動画プロンプトを入力...&#10;例: A stylish Japanese fashion influencer walking in Shibuya, cinematic style..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 resize-none"
          />

          {/* Sora quality option */}
          {selectedEngine === 'sora' && (
            <div className="flex items-center gap-3">
              <Settings2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">品質:</span>
              <div className="flex gap-2">
                {(['standard', 'pro'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                      quality === q
                        ? 'bg-green-500/20 border-green-500/40 text-green-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {q === 'standard' ? 'Sora 2 (標準)' : 'Sora 2 Pro (高品質)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <motion.button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              !prompt.trim() || isGenerating
                ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                : `bg-gradient-to-r ${ENGINE_INFO[selectedEngine].color} text-white shadow-lg hover:shadow-xl`
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                生成リクエスト送信中...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                {ENGINE_INFO[selectedEngine].name} で動画生成
              </>
            )}
          </motion.button>
        </div>

        {/* Generated Videos */}
        {videos.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              生成履歴 ({videos.length})
            </h2>
            <div className="space-y-4">
              <AnimatePresence>
                {videos.map((video, idx) => {
                  const info = ENGINE_INFO[video.engine];
                  return (
                    <motion.div
                      key={video.taskId || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white/5 border rounded-2xl p-5 ${info.border}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center text-sm`}>
                            {info.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{info.name}</div>
                            <div className="text-xs text-slate-500">
                              {video.createdAt.toLocaleTimeString('ja-JP')}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={video.status} />
                      </div>

                      <p className="text-xs text-slate-400 mb-4 line-clamp-2">{video.prompt}</p>

                      {/* Progress bar */}
                      {(video.status === 'generating' || video.status === 'polling') && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span className="flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              生成中...
                            </span>
                            <span>{video.progress ?? 0}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${info.color} rounded-full`}
                              initial={{ width: '5%' }}
                              animate={{ width: `${Math.max(5, video.progress ?? 0)}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            動画生成には数分かかる場合があります
                          </p>
                        </div>
                      )}

                      {/* Video player */}
                      {video.status === 'completed' && video.videoUrl && (
                        <div className="rounded-xl overflow-hidden bg-black aspect-video">
                          <video
                            src={video.videoUrl}
                            controls
                            className="w-full h-full"
                            poster=""
                          />
                        </div>
                      )}

                      {video.status === 'completed' && !video.videoUrl && (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>生成完了！動画URLを取得中...</span>
                        </div>
                      )}

                      {video.status === 'failed' && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>生成に失敗しました</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty state */}
        {videos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">動画を生成しよう</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              プリセットを選ぶか、プロンプトを入力して AI インフルエンサー動画を生成してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: VideoStatus }) {
  const config = {
    idle: { label: '待機中', color: 'bg-slate-500/20 text-slate-400', icon: <Clock className="w-3 h-3" /> },
    generating: { label: 'リクエスト送信中', color: 'bg-yellow-500/20 text-yellow-400', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    polling: { label: '生成中', color: 'bg-blue-500/20 text-blue-400', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    completed: { label: '完了', color: 'bg-green-500/20 text-green-400', icon: <CheckCircle2 className="w-3 h-3" /> },
    failed: { label: '失敗', color: 'bg-red-500/20 text-red-400', icon: <AlertCircle className="w-3 h-3" /> },
  };
  const c = config[status];
  return (
    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${c.color}`}>
      {c.icon}
      {c.label}
    </span>
  );
}
