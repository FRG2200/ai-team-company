'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    { title: 'Investment Portfolio Monitor', gradient: 'from-blue-500 to-purple-600' },
    { title: 'AI-Powered Manga App', gradient: 'from-pink-500 to-rose-600' },
    { title: 'Fitness App', gradient: 'from-green-500 to-teal-600' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-6">
          {/* App Showcase Slider */}
          <div className="relative h-80 mb-12 rounded-2xl overflow-hidden shadow-2xl">
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSlide === index ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} flex items-center justify-center`}
              >
                <div className="text-white text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl">
                    📱
                  </div>
                  <h3 className="text-2xl font-bold">{slide.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="flex justify-center gap-8 mb-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">100K+</span> GitHub Stars
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">1,000,000+</span> Builders
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">#1</span> on ProductHunt
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Bronxville AI Workforce
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A full AI team that helps you launch faster at a lower cost.
              You decide, and your agents handle research, planning, building, testing, and growth.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
              >
                Start Building Free
              </Link>
              <Link
                href="/demo"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Online business, now easier than ever
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            From the first idea to revenue and growth, we handle everything for you.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Old Way */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="text-gray-400 font-semibold mb-4">Old Way</div>
              <div className="text-4xl font-bold text-gray-400 mb-2">240+</div>
              <div className="text-gray-500 mb-6">hours</div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-2xl">15+</span>
                <span>tools needed</span>
              </div>
            </div>

            {/* New Way */}
            <div className="bg-primary-600 p-8 rounded-2xl shadow-lg text-white">
              <div className="font-semibold mb-4 text-primary-100">Our Way</div>
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-primary-100 mb-6">hours</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">1</span>
                <span>tool only</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Your AI Team to build faster
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A full AI team that helps you launch faster at a lower cost.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={agent.emoji}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/characters/placeholder.png'
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-primary-600 font-semibold mb-1">{agent.name}</div>
                    <h3 className="font-bold text-lg mb-2">{agent.role}</h3>
                    <p className="text-gray-600 text-sm">{agent.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything you need to build, launch and grow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <button className="text-primary-600 text-sm font-semibold hover:underline">
                  Try Now →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to build your next app?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join 1,000,000+ builders who are already creating with AI agents.
            Start for free, no credit card required.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </main>
  )
}

const agents = [
  {
    name: '健太',
    role: 'チームリーダー',
    emoji: '/characters/leader.png',
    description: 'プロジェクト全体を統括し、AIエージェント間の連携をマネジメント。スピーディーな承認フローで開発を加速。',
  },
  {
    name: '美咲',
    role: 'SEO/AIOスペシャリスト',
    emoji: '/characters/seo.png',
    description: '検索エンジン最適化とAI最適化のプロ。自然な検索流入を加速させ、コストを抑えて集客を実現。',
  },
  {
    name: '翔',
    role: 'プロダクトマネージャー',
    emoji: '/characters/pm.png',
    description: 'アイデアを明確な仕様書に変換。シンプルで使いやすいプロダクト設計で、開発の方向性を定める。',
  },
  {
    name: '蓮',
    role: 'アーキテクト',
    emoji: '/characters/architect.png',
    description: 'スケーラブルで信頼性の高いシステム設計を担当。最適な技術選定で堅牢な基盤を構築。',
  },
  {
    name: '拓海',
    role: 'エンジニア',
    emoji: '/characters/engineer.png',
    description: 'フロントエンドからバックエンドまで、本番レベルのフルスタック開発を実装。',
  },
  {
    name: '智子',
    role: 'データアナリスト',
    emoji: '/characters/analyst.png',
    description: '膨大なデータを分析し、成長機会を発見。データに基づいた意思決定をサポート。',
  },
]

const features = [
  {
    icon: '🎨',
    title: 'Visual Editor',
    description: 'Bring your exact design to life. A visual editor to adjust layouts and components quickly.',
  },
  {
    icon: '☁️',
    title: 'Out-of-the-box Backend',
    description: 'Full-stack backend including user login, database, integrations, and scalable hosting.',
  },
  {
    icon: '⚡',
    title: 'Race Mode',
    description: 'Run your prompt across multiple models to instantly get the best version.',
  },
  {
    icon: '🤖',
    title: 'Instant AI Integrations',
    description: 'Add powerful AI to your products with models like Gemini and GPT - no API keys needed.',
  },
  {
    icon: '📈',
    title: 'SEO Agent',
    description: 'Automatically make your site search-engine-friendly, so Google can rank your pages.',
  },
  {
    icon: '🔬',
    title: 'Deep Research',
    description: 'Analyze massive data to spot growth opportunities and surface clear insights.',
  },
]
