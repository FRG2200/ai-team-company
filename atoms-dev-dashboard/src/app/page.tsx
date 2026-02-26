'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Plus, MessageSquare, Settings, User, Bot, Sparkles, MoreVertical, 
  Phone, Video, Paperclip, Smile, Search, Folder, FileCode, FileText, 
  ChevronRight, ChevronDown, Globe, Terminal, Activity, Clock, 
  Play, Pause, RotateCw, CheckCircle2, Circle, AlertCircle,
  Layout, Code2, Eye, MessageCircle, Cpu, Layers, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Types
interface Message {
  id: string;
  role: 'user' | 'agent';
  agentId?: string;
  agentName?: string;
  agentEmoji?: string;
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  isActive: boolean;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  status?: 'idle' | 'editing' | 'completed' | 'error' | 'pending';
  lastModified?: Date;
}

interface Task {
  id: string;
  agentId: string;
  agentName: string;
  agentEmoji: string;
  title: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  startedAt?: Date;
  completedAt?: Date;
}

interface ChatLog {
  id: string;
  agentId: string;
  agentName: string;
  type: 'instruction' | 'response' | 'action';
  content: string;
  timestamp: Date;
}

// Constants
const agents = [
  { id: 'takumi', name: 'Takumi', role: 'COO', emoji: '🎯', color: 'from-blue-400 to-blue-600', ring: 'ring-blue-400/30', bg: 'bg-blue-500/10' },
  { id: 'misaki', name: 'Misaki', role: 'PM', emoji: '📋', color: 'from-emerald-400 to-emerald-600', ring: 'ring-emerald-400/30', bg: 'bg-emerald-500/10' },
  { id: 'kenta', name: 'Kenta', role: 'Researcher', emoji: '📊', color: 'from-indigo-400 to-indigo-600', ring: 'ring-indigo-400/30', bg: 'bg-indigo-500/10' },
  { id: 'sho', name: 'Sho', role: 'Architect', emoji: '🏗️', color: 'from-amber-400 to-amber-600', ring: 'ring-amber-400/30', bg: 'bg-amber-500/10' },
  { id: 'ren', name: 'Ren', role: 'Engineer', emoji: '💻', color: 'from-rose-400 to-rose-600', ring: 'ring-rose-400/30', bg: 'bg-rose-500/10' },
  { id: 'satoko', name: 'Satoko', role: 'SEO', emoji: '📈', color: 'from-purple-400 to-purple-600', ring: 'ring-purple-400/30', bg: 'bg-purple-500/10' },
  { id: 'makoto', name: 'Makoto', role: 'Analyst', emoji: '📊', color: 'from-cyan-400 to-cyan-600', ring: 'ring-cyan-400/30', bg: 'bg-cyan-500/10' },
];

const initialFiles: FileNode[] = [
  {
    id: 'root',
    name: 'landing-page-project',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        isOpen: true,
        children: [
          { id: 'page', name: 'page.tsx', type: 'file', language: 'tsx', status: 'editing', content: samplePageCode() },
          { id: 'layout', name: 'layout.tsx', type: 'file', language: 'tsx', status: 'completed', content: sampleLayoutCode() },
          { id: 'globals', name: 'globals.css', type: 'file', language: 'css', status: 'completed', content: sampleCssCode() },
        ]
      },
      { id: 'components', name: 'components', type: 'folder', isOpen: false, children: [
        { id: 'hero', name: 'Hero.tsx', type: 'file', language: 'tsx', status: 'editing' },
        { id: 'features', name: 'Features.tsx', type: 'file', language: 'tsx', status: 'pending' },
        { id: 'cta', name: 'CTA.tsx', type: 'file', language: 'tsx', status: 'pending' },
      ]},
      { id: 'public', name: 'public', type: 'folder', isOpen: false, children: [
        { id: 'images', name: 'images', type: 'folder', children: [] },
      ]},
      { id: 'package', name: 'package.json', type: 'file', language: 'json', status: 'completed' },
      { id: 'next', name: 'next.config.js', type: 'file', language: 'javascript', status: 'completed' },
      { id: 'tailwind', name: 'tailwind.config.ts', type: 'file', language: 'typescript', status: 'completed' },
      { id: 'tsconfig', name: 'tsconfig.json', type: 'file', language: 'json', status: 'completed' },
      { id: 'readme', name: 'README.md', type: 'file', language: 'markdown', status: 'completed' },
    ]
  }
];

const initialTasks: Task[] = [
  { id: '1', agentId: 'takumi', agentName: 'Takumi', agentEmoji: '🎯', title: 'プロジェクト要件分析', progress: 100, status: 'completed', startedAt: new Date(Date.now() - 3600000), completedAt: new Date(Date.now() - 3000000) },
  { id: '2', agentId: 'sho', agentName: 'Sho', agentEmoji: '🏗️', title: 'アーキテクチャ設計', progress: 85, status: 'in_progress', startedAt: new Date(Date.now() - 3000000) },
  { id: '3', agentId: 'ren', agentName: 'Ren', agentEmoji: '💻', title: 'フロントエンド実装', progress: 60, status: 'in_progress', startedAt: new Date(Date.now() - 2400000) },
  { id: '4', agentId: 'satoko', agentName: 'Satoko', agentEmoji: '📈', title: 'SEO最適化', progress: 30, status: 'in_progress', startedAt: new Date(Date.now() - 1800000) },
  { id: '5', agentId: 'misaki', agentName: 'Misaki', agentEmoji: '📋', title: '品質チェック', progress: 0, status: 'pending' },
];

// Sample code content
function samplePageCode() {
  return `export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            AI Team Company
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            7人の専門家AIエージェントが協力して、
            あなたのプロジェクトを完璧に仕上げます。
          </p>
          <button className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors">
            今すぐ始める
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
          {/* Feature cards will be rendered here */}
        </div>
      </section>
    </main>
  );
}`;
}

function sampleLayoutCode() {
  return `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Team Company - 次世代AI開発チーム',
  description: '7人の専門家AIエージェントが協力して、あなたのプロジェクトを完璧に仕上げます。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`;
}

function sampleCssCode() {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 239, 246, 255;
  --background-end-rgb: 243, 232, 255;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl;
  }
}`;
}

// Syntax highlighting helper
function highlightCode(code: string, language?: string) {
  if (!code) return '';
  // Simple syntax highlighting with regex
  return code
    .replace(/(\/\/.*$)/gm, '<span class="text-slate-400">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-400">$1</span>')
    .replace(/\b(import|export|const|let|var|function|return|if|else|for|while|class|interface|type|from|default|async|await|try|catch)\b/g, '<span class="text-purple-400 font-semibold">$1</span>')
    .replace(/\b(string|number|boolean|any|void|null|undefined|React|ReactNode)\b/g, '<span class="text-cyan-400">$1</span>')
    .replace(/\b(true|false)\b/g, '<span class="text-orange-400">$1</span>')
    .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="text-emerald-400">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
    .replace(/(&lt;[\w]+|&lt;\/[\w]+&gt;|&lt;\/[\w]+)/g, '<span class="text-blue-400">$1</span>')
    .replace(/\b(className|onClick|onChange|placeholder|disabled|type|href|src|alt|key|ref)\b/g, '<span class="text-amber-400">$1</span>');
}

// Main Component
export default function ManusStyleDashboard() {
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'preview' | 'logs'>('chat');
  const [files, setFiles] = useState<FileNode[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'ランディングページ作成', lastMessage: '🎉 プロジェクト完了しました！', timestamp: new Date(), unread: 0, isActive: true },
  ]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'agent', agentId: 'takumi', agentName: 'Takumi', agentEmoji: '🎯', content: 'こんにちは！AI Team CompanyのTakumiです。\n\nお手伝いできることがあれば、何でもお気軽にご相談ください。7人の専門家チームが最適なソリューションを提供します。', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // File tree toggle
  const toggleFolder = (nodeId: string, nodes: FileNode[]): FileNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, isOpen: !node.isOpen };
      }
      if (node.children) {
        return { ...node, children: toggleFolder(nodeId, node.children) };
      }
      return node;
    });
  };

  const handleToggleFolder = (nodeId: string) => {
    setFiles(prev => toggleFolder(nodeId, prev));
  };

  // Simulate file changes
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles(prevFiles => {
        const updateRandomFile = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.type === 'file' && node.status === 'editing' && Math.random() > 0.7) {
              return { ...node, lastModified: new Date() };
            }
            if (node.children) {
              return { ...node, children: updateRandomFile(node.children) };
            }
            return node;
          });
        };
        return updateRandomFile(prevFiles);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Task progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.status === 'in_progress' && task.progress < 100) {
          const increment = Math.random() * 3;
          const newProgress = Math.min(task.progress + increment, 100);
          return {
            ...task,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'in_progress',
            completedAt: newProgress >= 100 ? new Date() : task.completedAt
          };
        }
        return task;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Chat handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Add chat log
    setChatLogs(prev => [...prev, {
      id: Date.now().toString(),
      agentId: 'user',
      agentName: 'User',
      type: 'instruction',
      content: input,
      timestamp: new Date()
    }]);

    simulateAIResponse(input);
  };

  const simulateAIResponse = (userInput: string) => {
    const responses = [
      { agentId: 'takumi', content: `承知しました。「${userInput}」について、チームで検討させていただきます。\n\nこのプロジェクトには以下のメンバーが必要です：\n• Sho（設計）\n• Ren（実装）\n• Satoko（SEO）\n\n準備ができ次第、作業を開始します。`, delay: 1000 },
      { agentId: 'sho', content: '設計を開始しました。要件に基づいてワイヤーフレームを作成中です。\n\n【設計方針】\n• レスポンシブ対応\n• モダンなUI/UX\n• 高速読み込み\n\n初稿は30分後にご確認いただけます。', delay: 3000 },
      { agentId: 'ren', content: 'コーディングを開始しました。Next.js + Tailwind CSSで構築しています。\n\n【進捗状況】\n✅ プロジェクト初期化\n🔄 コンポーネント作成中\n⏳ スタイリング適用\n\n順調に進んでいます。', delay: 6000 },
      { agentId: 'satoko', content: 'SEO最適化を実施しました。\n\n【対策内容】\n✅ メタタグ最適化\n✅ 構造化データ追加\n✅ OGPタグ設定\n✅ 画像圧縮\n\n検索エンジン対策は万全です。', delay: 9000 },
      { agentId: 'takumi', content: '🎉 プロジェクトが完了しました！\n\n全ての作業が正常に終了しました。品質検証もクリアしています。\n\nご確認いただき、何か修正が必要な場合はお知らせください。', delay: 12000, isFinal: true },
    ];

    responses.forEach(({ agentId, content, delay, isFinal }) => {
      setTimeout(() => {
        const agent = agents.find(a => a.id === agentId);
        const message: Message = {
          id: Date.now().toString() + Math.random(),
          role: 'agent',
          agentId,
          agentName: agent?.name,
          agentEmoji: agent?.emoji,
          content,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, message]);
        setChatLogs(prev => [...prev, {
          id: Date.now().toString(),
          agentId,
          agentName: agent?.name || '',
          type: 'response',
          content,
          timestamp: new Date()
        }]);

        if (isFinal) setIsProcessing(false);
      }, delay);
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  // Render file tree
  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group ${
            selectedFile?.id === node.id 
              ? 'bg-white/80 shadow-md' 
              : 'hover:bg-white/40'
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={() => node.type === 'folder' ? handleToggleFolder(node.id) : setSelectedFile(node)}
        >
          {node.type === 'folder' ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
              <Folder className={`w-4 h-4 ${node.isOpen ? 'text-blue-400' : 'text-slate-400'}`} />
            </>
          ) : (
            <>
              <span className="w-4" />
              {node.language === 'tsx' || node.language === 'ts' ? (
                <FileCode className="w-4 h-4 text-blue-400" />
              ) : node.language === 'css' ? (
                <FileCode className="w-4 h-4 text-cyan-400" />
              ) : (
                <FileText className="w-4 h-4 text-slate-400" />
              )}
            </>
          )}
          <span className={`text-[13px] truncate ${
            selectedFile?.id === node.id ? 'font-medium text-slate-800' : 'text-slate-600'
          }`}>
            {node.name}
          </span>
          {node.status === 'editing' && (
            <span className="ml-auto w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          )}
          {node.status === 'completed' && (
            <CheckCircle2 className="ml-auto w-3.5 h-3.5 text-emerald-400" />
          )}
        </motion.button>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-100/30 via-purple-50/30 to-pink-100/30">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-300/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative h-14 flex items-center justify-between px-4 bg-white/40 backdrop-blur-2xl border-b border-white/30 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-800 text-[14px]">AI Team Workspace</h1>
            <p className="text-[11px] text-slate-500">MANUS風開発環境</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-white/30 backdrop-blur-xl rounded-xl p-1 border border-white/40">
          {[
            { id: 'chat', icon: MessageCircle, label: 'チャット' },
            { id: 'code', icon: Code2, label: 'コード' },
            { id: 'preview', icon: Eye, label: 'プレビュー' },
            { id: 'logs', icon: Terminal, label: 'ログ' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white/80 text-slate-800 shadow-md'
                  : 'text-slate-500 hover:bg-white/40'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {agents.slice(0, 4).map(agent => (
              <div
                key={agent.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ring-2 ring-white bg-gradient-to-br ${agent.color}`}
              >
                {agent.emoji}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur flex items-center justify-center text-[11px] font-medium text-slate-600 ring-2 ring-white">
              +3
            </div>
          </div>
          <Link
            href="/influencer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-[12px] font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI インフルエンサー
          </Link>
          <button className="p-2 hover:bg-white/50 rounded-xl transition-all">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - Chat */}
        <AnimatePresence mode="wait">
          {(activeTab === 'chat' || activeTab === 'logs') && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-[350px] flex flex-col bg-white/30 backdrop-blur-xl border-r border-white/40"
            >
              {activeTab === 'chat' ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-800 text-[14px]">ランディングページ作成</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <p className="text-[11px] text-slate-500">7人のアクティブ</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user'
                            ? 'bg-slate-700'
                            : `bg-gradient-to-br ${getAgentGradient(message.agentId)}`
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-sm">{message.agentEmoji}</span>
                          )}
                        </div>
                        <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                          {message.role === 'agent' && (
                            <p className="text-[10px] text-slate-500 mb-1 ml-1">{message.agentName}</p>
                          )}
                          <div className={`inline-block text-left rounded-2xl px-3 py-2.5 text-[13px] leading-relaxed ${
                            message.role === 'user'
                              ? 'bg-slate-800 text-white rounded-br-md'
                              : 'bg-white/70 backdrop-blur text-slate-800 rounded-bl-md border border-white/50'
                          }`}>
                            {message.content}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{formatTime(message.timestamp)}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isProcessing && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-xl flex items-center justify-center">
                          <Bot className="w-4 h-4 text-slate-500 animate-pulse" />
                        </div>
                        <div className="bg-white/50 rounded-2xl rounded-bl-md px-3 py-2">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/30">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white/60 backdrop-blur-xl rounded-2xl px-3 py-2 border border-white/50">
                      <button type="button" className="p-1.5 hover:bg-white/50 rounded-lg">
                        <Paperclip className="w-4 h-4 text-slate-400" />
                      </button>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-700 placeholder:text-slate-400"
                        disabled={isProcessing}
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isProcessing}
                        className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-40 rounded-xl transition-all hover:scale-105 active:scale-95"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <>
                  {/* Logs Header */}
                  <div className="p-4 border-b border-white/30">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-slate-600" />
                      <h2 className="font-semibold text-slate-800 text-[14px]">詳細ログ</h2>
                    </div>
                  </div>
                  {/* Logs */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px]">
                    {chatLogs.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">ログはまだありません</p>
                    ) : (
                      chatLogs.map((log, index) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`p-3 rounded-xl border ${
                            log.type === 'instruction'
                              ? 'bg-blue-500/10 border-blue-200/30'
                              : log.type === 'action'
                              ? 'bg-amber-500/10 border-amber-200/30'
                              : 'bg-white/40 border-white/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-slate-400">{formatTime(log.timestamp)}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              log.type === 'instruction'
                                ? 'bg-blue-500/20 text-blue-600'
                                : log.type === 'action'
                                ? 'bg-amber-500/20 text-amber-600'
                                : 'bg-emerald-500/20 text-emerald-600'
                            }`}>
                              {log.type === 'instruction' ? '指示' : log.type === 'action' ? 'アクション' : '返答'}
                            </span>
                            <span className="font-semibold text-slate-700">{log.agentName}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{log.content}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Panel - Code & Files */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeTab === 'code' ? (
            <div className="flex-1 flex">
              {/* File Explorer */}
              <div className="w-56 bg-white/20 backdrop-blur-xl border-r border-white/30 overflow-y-auto">
                <div className="p-3 border-b border-white/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">ファイル</span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-white/50 rounded-lg">
                        <Plus className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button className="p-1 hover:bg-white/50 rounded-lg">
                        <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  {renderFileTree(files)}
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 flex flex-col bg-[#1e1e2e]/95">
                {/* Tabs */}
                <div className="flex items-center bg-[#181825] border-b border-white/5">
                  {selectedFile ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] border-t-2 border-blue-500">
                      <FileCode className="w-4 h-4 text-blue-400" />
                      <span className="text-[13px] text-slate-200">{selectedFile.name}</span>
                      {selectedFile.status === 'editing' && (
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-[13px] text-slate-500">ファイルを選択してください</div>
                  )}
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-auto font-mono text-[13px] leading-6">
                  {selectedFile?.content ? (
                    <div className="flex">
                      {/* Line Numbers */}
                      <div className="w-12 py-4 text-right pr-4 text-slate-600 select-none bg-[#181825]/50">
                        {selectedFile.content.split('\n').map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      {/* Code */}
                      <div className="flex-1 py-4 pr-4 text-slate-300">
                        <pre dangerouslySetInnerHTML={{ 
                          __html: highlightCode(selectedFile.content, selectedFile.language) 
                        }} />
                      </div>
                    </div>
                  ) : selectedFile ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      <div className="text-center">
                        <FileCode className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <p>このファイルは編集中です</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      <div className="text-center">
                        <Folder className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <p>ファイルを選択してコードを表示</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Bar */}
                <div className="h-6 flex items-center justify-between px-3 bg-blue-600 text-white text-[11px]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      main
                    </span>
                    <span>0 errors, 0 warnings</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Ln {selectedFile?.content?.split('\n').length || 1}, Col 1</span>
                    <span>UTF-8</span>
                    <span>{selectedFile?.language?.toUpperCase() || 'TXT'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'preview' ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Browser Chrome */}
              <div className="h-10 flex items-center gap-3 px-4 bg-slate-100 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[12px] text-slate-600">localhost:3000</span>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-slate-200 rounded-lg">
                    <RotateCw className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
              {/* Preview Content */}
              <div className="flex-1 overflow-auto bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="min-h-full">
                  {/* Hero Section */}
                  <section className="py-16 px-8 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto"
                    >
                      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        AI Team Company
                      </h1>
                      <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
                        7人の専門家AIエージェントが協力して、あなたのプロジェクトを完璧に仕上げます。
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25"
                      >
                        今すぐ始める
                      </motion.button>
                    </motion.div>
                  </section>

                  {/* Features */}
                  <section className="py-12 px-8">
                    <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
                      {[
                        { icon: Zap, title: '高速開発', desc: 'AIエージェントによる並行開発' },
                        { icon: Layers, title: '品質保証', desc: '専門家による多角的レビュー' },
                        { icon: Globe, title: 'SEO最適化', desc: '検索エンジン対策万全' },
                      ].map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                          <p className="text-slate-500 text-sm">{feature.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Team */}
                  <section className="py-12 px-8">
                    <div className="max-w-4xl mx-auto text-center">
                      <h2 className="text-2xl font-bold text-slate-800 mb-8">チームメンバー</h2>
                      <div className="flex justify-center gap-4 flex-wrap">
                        {agents.map((agent, i) => (
                          <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg w-28"
                          >
                            <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl mb-2`}>
                              {agent.emoji}
                            </div>
                            <p className="font-medium text-slate-800 text-sm">{agent.name}</p>
                            <p className="text-[11px] text-slate-500">{agent.role}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Layout className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">タブを選択してください</p>
                <p className="text-sm mt-1">コード、プレビュー、またはログを表示</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Tasks & Activity */}
        <div className="w-72 bg-white/30 backdrop-blur-xl border-l border-white/40 flex flex-col">
          {/* Tasks */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-white/30">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-800 text-[13px]">タスク進捗</h3>
              </div>
              <p className="text-[11px] text-slate-500">{tasks.filter(t => t.status === 'completed').length}/{tasks.length} 完了</p>
            </div>

            <div className="p-4 space-y-4">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/50"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getAgentGradient(task.agentId)} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">{task.agentEmoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-[12px] truncate">{task.title}</p>
                      <p className="text-[10px] text-slate-500">{task.agentName}</p>
                    </div>
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : task.status === 'in_progress' ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>{Math.round(task.progress)}%</span>
                      <span>
                        {task.status === 'completed' ? '完了' : 
                         task.status === 'in_progress' ? '進行中' : 
                         task.status === 'error' ? 'エラー' : '待機中'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          task.status === 'completed' ? 'bg-emerald-500' :
                          task.status === 'error' ? 'bg-red-500' :
                          'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="h-48 border-t border-white/30 bg-white/20">
            <div className="p-3 border-b border-white/30">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-800 text-[13px]">アクティビティ</h3>
              </div>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-45px)]">
              {[
                { time: '2分前', text: 'Renが page.tsx を編集中', color: 'bg-rose-500' },
                { time: '5分前', text: 'Shoがコンポーネント設計を完了', color: 'bg-amber-500' },
                { time: '8分前', text: 'Satokoがメタタグを最適化', color: 'bg-purple-500' },
                { time: '12分前', text: 'Takumiがプロジェクトを開始', color: 'bg-blue-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className={`w-2 h-2 rounded-full ${item.color} mt-1 flex-shrink-0`} />
                  <div>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                    <p className="text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function
function getAgentGradient(agentId?: string) {
  const agent = agents.find(a => a.id === agentId);
  return agent?.color || 'from-slate-400 to-slate-600';
}

function GitBranch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}
