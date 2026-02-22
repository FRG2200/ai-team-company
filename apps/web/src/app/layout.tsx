import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bronxville AI Workforce - AIエージェントでアプリ開発',
  description: 'AIエージェントチームが調査、設計、開発、SEOまで自動化。アイデアから収益化までを最短8時間で実現。',
  keywords: ['AIエージェント', 'アプリ開発', 'ノーコード', '自動化', 'Bronxville'],
  authors: [{ name: 'Bronxville AI Workforce' }],
  openGraph: {
    title: 'Bronxville AI Workforce - AIエージェントでアプリ開発',
    description: 'AIエージェントチームが調査、設計、開発、SEOまで自動化。アイデアから収益化までを最短8時間で実現。',
    url: 'https://bronxville-ai.com',
    siteName: 'Bronxville AI Workforce',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/ogp.png',
        width: 1200,
        height: 630,
        alt: 'Bronxville AI Workforce',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bronxville AI Workforce - AIエージェントでアプリ開発',
    description: 'AIエージェントチームが調査、設計、開発、SEOまで自動化。アイデアから収益化までを最短8時間で実現。',
    images: ['/ogp.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
