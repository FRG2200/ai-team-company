'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Settings, User, Bot, Sparkles, Paperclip,
  Terminal, Activity, Clock, CheckCircle2, Circle,
  Code2, Eye, MessageCircle, Layers, Zap, Globe,
  AlertCircle, RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ActivityItem {
  id: string;
  text: string;
  timestamp: Date;
  color: string;
}

// Constants
const agents = [
  { id: 'takumi', name: 'Takumi', role: 'COO', emoji: '🎯', color: 'from-blue-400 to-blue-600' },
  { id: 'misaki', name: 'Misaki', role: 'PM', emoji: '📋', color: 'from-emerald-400 to-emerald-600' },
  { id: 'sho', name: 'Sho', role: 'Architect', emoji: '🏗️', color: 'from-amber-400 to-amber-600' },
  { id: 'ren', name: 'Ren', role: 'Engineer', emoji: '💻', color: 'from-rose-400 to-rose-600' },
  { id: 'satoko', name: 'Satoko', role: 'SEO', emoji: '📈', color: 'from-purple-400 to-purple-600' },
  { id: 'kenta', name: 'Kenta', role: 'Researcher', emoji: '📊', color: 'from-indigo-400 to-indigo-600' },
  { id: 'makoto', name: 'Makoto', role: 'Analyst', emoji: '📊', color: 'from-cyan-400 to-cyan-600' },
];

// Main Component
export default function ManusStyleDashboard() {
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'preview' | 'logs'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chat submit handler - calls real OpenAI API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Add to activity log
    setActivityLog(prev => [{
      id: Date.now().toString(),
      text: `ユーザーがメッセージを送信`,
      timestamp: new Date(),
      color: 'bg-blue-500'
    }, ...prev.slice(0, 19)]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `エラー: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setActivityLog(prev => [{
        id: Date.now().toString(),
        text: `AI が返答しました`,
        timestamp: new Date(),
        color: 'bg-emerald-500'
      }, ...prev.slice(0, 19)]);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
      setActivityLog(prev => [{
        id: Date.now().toString(),
        text: `エラー: ${err.message}`,
        timestamp: new Date(),
        color: 'bg-red-500'
      }, ...prev.slice(0, 19)]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  const formatRelativeTime = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
    return `${Math.floor(diff / 3600)}時間前`;
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
            <p className="text-[11px] text-slate-500">7人のAIエージェント</p>
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
                title={`${agent.name} (${agent.role})`}
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

        {/* Left Panel - Chat or Logs */}
        <AnimatePresence mode="wait">
          {(activeTab === 'chat' || activeTab === 'logs') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-[380px] flex flex-col bg-white/30 backdrop-blur-xl border-r border-white/40"
            >
              {activeTab === 'chat' ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-800 text-[14px]">AI チームチャット</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <p className="text-[11px] text-slate-500">OpenAI GPT-4 接続中</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                          <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-slate-600 font-medium text-[14px]">AIチームに話しかけてみましょう</p>
                        <p className="text-slate-400 text-[12px] mt-2">プロジェクトの相談、コードの質問など何でもどうぞ</p>
                      </div>
                    )}

                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user'
                            ? 'bg-slate-700'
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                          {message.role === 'assistant' && (
                            <p className="text-[10px] text-slate-500 mb-1 ml-1">AI アシスタント</p>
                          )}
                          <div className={`inline-block text-left rounded-2xl px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
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

                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white/50 rounded-2xl rounded-bl-md px-4 py-3 border border-white/50">
                          <div className="flex gap-1 items-center">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3"
                      >
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[12px] font-medium text-red-700">エラーが発生しました</p>
                          <p className="text-[11px] text-red-600 mt-0.5">{error}</p>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/30">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white/60 backdrop-blur-xl rounded-2xl px-3 py-2 border border-white/50">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-700 placeholder:text-slate-400"
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
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
                      <h2 className="font-semibold text-slate-800 text-[14px]">アクティビティログ</h2>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px]">
                    {activityLog.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <Terminal className="w-10 h-10 text-slate-300 mb-3" />
                        <p className="text-slate-400">ログはまだありません</p>
                        <p className="text-slate-300 text-[10px] mt-1">チャットを開始するとログが表示されます</p>
                      </div>
                    ) : (
                      activityLog.map((log) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2 p-3 bg-white/40 rounded-xl border border-white/30"
                        >
                          <span className={`w-2 h-2 rounded-full ${log.color} mt-1 flex-shrink-0`} />
                          <div>
                            <p className="text-slate-600">{log.text}</p>
                            <p className="text-slate-400 text-[10px] mt-0.5">{formatRelativeTime(log.timestamp)}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeTab === 'code' ? (
            <div className="flex-1 flex items-center justify-center bg-[#1e1e2e]/95">
              <div className="text-center">
                <Code2 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400 text-lg font-medium">コードエディタ</p>
                <p className="text-slate-500 text-sm mt-2">チャットでプロジェクトを開始すると<br />ここにコードが表示されます</p>
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
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[12px] text-slate-500">プレビューはまだありません</span>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-400 text-lg font-medium">プレビュー</p>
                  <p className="text-slate-300 text-sm mt-2">プロジェクトを作成するとここにプレビューが表示されます</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-500">チャットタブを選択してください</p>
                <p className="text-sm mt-1 text-slate-400">AIチームと会話を始めましょう</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Agents & Activity */}
        <div className="w-72 bg-white/30 backdrop-blur-xl border-l border-white/40 flex flex-col">
          {/* Agents */}
          <div className="p-4 border-b border-white/30">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-800 text-[13px]">AIチームメンバー</h3>
            </div>
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/40 border border-white/30"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-sm">{agent.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-[12px]">{agent.name}</p>
                    <p className="text-[10px] text-slate-500">{agent.role}</p>
                  </div>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" title="待機中" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="flex-1 border-t border-white/30 bg-white/20 flex flex-col">
            <div className="p-3 border-b border-white/30">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-800 text-[13px]">アクティビティ</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {activityLog.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Clock className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-slate-400 text-[11px]">アクティビティなし</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activityLog.slice(0, 10).map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 text-[11px]"
                    >
                      <span className={`w-2 h-2 rounded-full ${item.color} mt-1 flex-shrink-0`} />
                      <div>
                        <p className="text-slate-600 leading-relaxed">{item.text}</p>
                        <p className="text-slate-400">{formatRelativeTime(item.timestamp)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
