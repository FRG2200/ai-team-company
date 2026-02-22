'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-slate-800">
            Bronxville
            <span className="text-blue-600">AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#team" className="text-sm text-slate-600 hover:text-blue-600 transition">チーム</Link>
            <Link href="#features" className="text-sm text-slate-600 hover:text-blue-600 transition">機能</Link>
            <Link href="#pricing" className="text-sm text-slate-600 hover:text-blue-600 transition">料金</Link>
            <Link 
              href="/login" 
              className="text-sm px-5 py-2 text-slate-600 hover:text-blue-600 transition"
            >
              ログイン
            </Link>
            <Link 
              href="/register" 
              className="text-sm px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md shadow-blue-200"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-700 mb-8">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                7人のAIエージェントがあなたをサポート
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-[1.2] tracking-tight">
                アイデアを
                <span className="text-blue-600">最短8時間</span>
                <br />
                プロダクトに
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                調査・設計・開発・SEOまで、
                <br className="hidden md:block" />
                7人のAIエージェントチームが全て自動化します。
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-lg"
                >
                  無料で始める
                </Link>
                <Link
                  href="/demo"
                  className="px-8 py-4 border border-slate-200 text-slate-600 rounded-full font-medium hover:border-blue-300 hover:text-blue-600 transition text-lg"
                >
                  デモを見る
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">8h</div>
                <div className="text-sm text-slate-500 mt-1">開発時間</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">7</div>
                <div className="text-sm text-slate-500 mt-1">AIエージェント</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">1</div>
                <div className="text-sm text-slate-500 mt-1">ツール</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Team Section */}
      <section id="team" className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              専門チーム
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              あなた専属のAIチーム
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              それぞれの専門性を持つ7人のAIエージェントが、
              <br />
              プロジェクトを全面的にサポートします
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-blue-50 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl bg-blue-50 text-blue-500">{agent.fallbackEmoji}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 font-medium mb-1">{agent.name}</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{agent.role}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{agent.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              すべてがワンストップ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              必要なものが、すべて揃っています
            </h2>
            <p className="text-slate-500 text-lg">
              アイデアから収益化まで、開発に必要な機能が完備
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            今すぐ始めましょう
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto leading-relaxed">
            無料で始められ、クレジットカードは不要です。
            <br />
            7人のAIエージェントが、あなたの成功をサポートします。
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition text-lg shadow-lg"
          >
            無料で始める →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Bronxville</span>
              <span className="text-blue-600 font-bold">AI</span>
            </div>
            
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-slate-500 hover:text-blue-600 transition">利用規約</Link>
              <Link href="/privacy" className="text-sm text-slate-500 hover:text-blue-600 transition">プライバシー</Link>
            </div>
            
            <div className="text-sm text-slate-400">
              © 2026 Bronxville AI Workforce
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

const agents = [
  {
    name: '健太',
    role: 'チームリーダー',
    image: '/characters/character_kenta_leader.png',
    fallbackEmoji: '👔',
    description: 'プロジェクト全体を統括し、AIエージェント間の連携をマネジメント。スピーディーな承認フローで開発を加速。',
  },
  {
    name: '美咲',
    role: 'SEO/AIOスペシャリスト',
    image: '/characters/character_misaki_seo.png',
    fallbackEmoji: '🔍',
    description: '検索エンジン最適化とAI最適化のプロ。自然な検索流入を加速させ、コストを抑えて集客を実現。',
  },
  {
    name: 'アイリス',
    role: 'リサーチャー',
    image: '/characters/character_iris_researcher.png',
    fallbackEmoji: '🔬',
    description: '市場調査と競合分析のプロ。ニッチな需要を見つけ出し、機会を最大化します。',
  },
  {
    name: 'エマ',
    role: 'プロダクトマネージャー',
    image: '/characters/character_emma_pm.png',
    fallbackEmoji: '📋',
    description: 'アイデアを明確な仕様書に変換。シンプルで使いやすいプロダクト設計で、開発の方向性を定める。',
  },
  {
    name: 'ボブ',
    role: 'アーキテクト',
    image: '/characters/character_bob_architect.png',
    fallbackEmoji: '🏗️',
    description: 'スケーラブルで信頼性の高いシステム設計を担当。最適な技術選定で堅牢な基盤を構築。',
  },
  {
    name: 'アレックス',
    role: 'エンジニア',
    image: '/characters/character_alex_engineer.png',
    fallbackEmoji: '👨‍💻',
    description: 'フロントエンドからバックエンドまで、本番レベルのフルスタック開発を実装。',
  },
  {
    name: 'デビッド',
    role: 'データアナリスト',
    image: '/characters/character_david_analyst.png',
    fallbackEmoji: '📊',
    description: '膨大なデータを分析し、成長機会を発見。データに基づいた意思決定をサポート。',
  },
]

const features = [
  {
    icon: '⚡',
    title: '最短8時間で開発',
    description: 'アイデアから本番環境まで、驚異的なスピードでプロダクトを構築します。',
  },
  {
    icon: '🎨',
    title: 'ビジュアルエディタ',
    description: 'ドラッグ＆ドロップで直感的にデザインを調整。コーディング不要です。',
  },
  {
    icon: '☁️',
    title: 'ワンクリックデプロイ',
    description: '自動ホスティング・ドメイン設定。技術的な知識は不要です。',
  },
  {
    icon: '🔒',
    title: 'エンタープライズ級セキュリティ',
    description: 'SOC2対応、データ暗号化、完全なプライバシー保護を実現。',
  },
  {
    icon: '🤖',
    title: 'AI自動化',
    description: '調査、設計、開発、SEO、分析まで、AIが全ての工程を自動化します。',
  },
  {
    icon: '📈',
    title: 'グロース支援',
    description: 'データ分析に基づく改善提案と、収益化戦略の自動実行を行います。',
  },
]
