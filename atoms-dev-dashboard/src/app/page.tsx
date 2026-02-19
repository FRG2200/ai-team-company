'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Settings, User, Bot, Sparkles, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';

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

const agents = [
  { id: 'takumi', name: 'Takumi', role: 'COO', emoji: '🎯', color: 'bg-blue-500' },
  { id: 'misaki', name: 'Misaki', role: 'PM', emoji: '📋', color: 'bg-emerald-500' },
  { id: 'kenta', name: 'Kenta', role: 'Researcher', emoji: '📊', color: 'bg-indigo-500' },
  { id: 'sho', name: 'Sho', role: 'Architect', emoji: '🏗️', color: 'bg-amber-500' },
  { id: 'ren', name: 'Ren', role: 'Engineer', emoji: '💻', color: 'bg-rose-500' },
  { id: 'satoko', name: 'Satoko', role: 'SEO', emoji: '📈', color: 'bg-purple-500' },
  { id: 'makoto', name: 'Makoto', role: 'Analyst', emoji: '📊', color: 'bg-cyan-500' },
];

export default function ValueTalkStyleDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'ランディングページ作成',
      lastMessage: '🎉 プロジェクト完了しました！',
      timestamp: new Date(),
      unread: 0,
      isActive: true,
    },
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'agent',
      agentId: 'takumi',
      agentName: 'Takumi',
      agentEmoji: '🎯',
      content: 'こんにちは！AI Team CompanyのTakumiです。\n\nお手伝いできることがあれば、何でもお気軽にご相談ください。7人の専門家チームが最適なソリューションを提供します。',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    // ユーザーメッセージ
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // 会話タイトル更新
    setConversations((prev) =
      prev.map((c) =
        c.isActive ? { ...c, lastMessage: input, timestamp: new Date() } : c
      )
    );

    // AI応答シミュレーション
    simulateAIResponse(input);
  };

  const simulateAIResponse = (userInput: string) => {
    const responses = [
      {
        agentId: 'takumi',
        content: `承知しました。「${userInput}」について、チームで検討させていただきます。\n\nこのプロジェクトには以下のメンバーが必要です：\n• Sho（設計）\n• Ren（実装）\n• Satoko（SEO）\n\n準備ができ次第、作業を開始します。`,
        delay: 1000,
      },
      {
        agentId: 'sho',
        content: '設計を開始しました。要件に基づいてワイヤーフレームを作成中です。\n\n【設計方針】\n• レスポンシブ対応\n• モダンなUI/UX\n• 高速読み込み\n\n初稿は30分後にご確認いただけます。',
        delay: 3000,
      },
      {
        agentId: 'ren',
        content: 'コーディングを開始しました。Next.js + Tailwind CSSで構築しています。\n\n【進捗状況】\n✅ プロジェクト初期化\n🔄 コンポーネント作成中\n⏳ スタイリング適用\n\n順調に進んでいます。',
        delay: 6000,
      },
      {
        agentId: 'satoko',
        content: 'SEO最適化を実施しました。\n\n【対策内容】\n✅ メタタグ最適化\n✅ 構造化データ追加\n✅ OGPタグ設定\n✅ 画像圧縮\n\n検索エンジン対策は万全です。',
        delay: 9000,
      },
      {
        agentId: 'takumi',
        content: '🎉 プロジェクトが完了しました！\n\n全ての作業が正常に終了しました。品質検証もクリアしています。\n\nご確認いただき、何か修正が必要な場合はお知らせください。',
        delay: 12000,
        isFinal: true,
      },
    ];

    responses.forEach(({ agentId, content, delay, isFinal }) => {
      setTimeout(() => {
        const agent = agents.find((a) => a.id === agentId);
        const message: Message = {
          id: Date.now().toString() + Math.random(),
          role: 'agent',
          agentId,
          agentName: agent?.name,
          agentEmoji: agent?.emoji,
          content,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, message]);
        
        setConversations((prev) =
          prev.map((c) =
            c.isActive
              ? { ...c, lastMessage: content.substring(0, 50) + '...' }
              : c
          )
        );

        if (isFinal) {
          setIsProcessing(false);
        }
      }, delay);
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-screen flex bg-white">
      {/* 左サイドバー - 会話リスト */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
        {/* ヘッダー */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">AI Team</h1>
                <p className="text-xs text-slate-500">7人のAIエージェント</p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5" />
            新しい依頼
          </button>
        </div>

        {/* 会話リスト */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              進行中の依頼
            </p>
          </div>
          
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-white transition-colors border-l-4 ${
                conv.isActive
                  ? 'bg-white border-blue-500 shadow-sm'
                  : 'border-transparent'
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-slate-600" />
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-medium text-slate-900 truncate">{conv.title}</p>
                  <p className="text-xs text-slate-400">{formatTime(conv.timestamp)}</p>
                </div>
                <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
              </div>
              
              {conv.unread > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* エージェント一覧 */}
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            チームメンバー
          </p>
          <div className="flex gap-2 flex-wrap">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm"
              >
                <span>{agent.emoji}</span>
                <span className="text-sm font-medium text-slate-700">{agent.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* メインチャットエリア */}
      <div className="flex-1 flex flex-col">
        {/* チャットヘッダー */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">ランディングページ作成</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                7人のアクティブ
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-slate-500" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-slate-500" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* アバター */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-slate-800'
                      : message.agentId === 'takumi'
                      ? 'bg-blue-500'
                      : 'bg-slate-200'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-lg">{message.agentEmoji}</span>
                  )}
                </div>

                {/* メッセージ内容 */}
                <div
                  className={`max-w-[70%] ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}
                >
                  {message.role === 'agent' && (
                    <p className="text-xs text-slate-500 mb-1 ml-1">
                      {message.agentName}
                    </p>
                  )}
                  
                  <div
                    className={`inline-block text-left rounded-2xl px-5 py-3 whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-slate-800 text-white rounded-br-md'
                        : message.agentId === 'takumi'
                        ? 'bg-blue-50 border border-blue-100 text-slate-800 rounded-bl-md'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  
                  <p
                    className={`text-xs text-slate-400 mt-1 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* タイピングインジケーター */}
            {isProcessing && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center"
003e
                  <Bot className="w-5 h-5 text-slate-500 animate-pulse" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-md px-5 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 入力エリア */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <button type="button" className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-slate-400" />
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="メッセージを入力..."
                className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
                disabled={isProcessing}
              />
              
              <button type="button" className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <Smile className="w-5 h-5 text-slate-400" />
              </button>
              
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              AI Team Companyの7人のエージェントが協力して対応します
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
