'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Settings, User, Bot, Sparkles, Terminal,
  Clock, CheckCircle2, Circle, Loader2, AlertCircle,
  MessageCircle, ChevronDown, ChevronUp, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  agentId?: string;
  content: string;
  timestamp: Date;
}

type AgentStatus = 'idle' | 'thinking' | 'working' | 'done' | 'error';

interface AgentState {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  bgColor: string;
  status: AgentStatus;
  currentTask: string;
  log: string[];
  expanded: boolean;
}

// ─── Agent Definitions ────────────────────────────────────────────────────────
const AGENT_DEFS = [
  { id: 'takumi', name: 'Takumi', role: 'COO / プロジェクト管理', emoji: '🎯', color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-500/10 border-blue-300/30' },
  { id: 'sho',    name: 'Sho',    role: 'アーキテクト',           emoji: '🏗️', color: 'from-amber-400 to-amber-600', bgColor: 'bg-amber-500/10 border-amber-300/30' },
  { id: 'ren',    name: 'Ren',    role: 'フロントエンドエンジニア', emoji: '💻', color: 'from-rose-400 to-rose-600',   bgColor: 'bg-rose-500/10 border-rose-300/30' },
  { id: 'kenta',  name: 'Kenta',  role: 'リサーチャー',           emoji: '📊', color: 'from-indigo-400 to-indigo-600', bgColor: 'bg-indigo-500/10 border-indigo-300/30' },
  { id: 'satoko', name: 'Satoko', role: 'SEO スペシャリスト',      emoji: '📈', color: 'from-purple-400 to-purple-600', bgColor: 'bg-purple-500/10 border-purple-300/30' },
  { id: 'misaki', name: 'Misaki', role: 'プロジェクトマネージャー', emoji: '📋', color: 'from-emerald-400 to-emerald-600', bgColor: 'bg-emerald-500/10 border-emerald-300/30' },
  { id: 'makoto', name: 'Makoto', role: 'データアナリスト',        emoji: '🔍', color: 'from-cyan-400 to-cyan-600',   bgColor: 'bg-cyan-500/10 border-cyan-300/30' },
];

const initAgents = (): AgentState[] =>
  AGENT_DEFS.map(d => ({ ...d, status: 'idle', currentTask: '待機中', log: [], expanded: false }));

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AgentStatus }) {
  const map = {
    idle:     { label: '待機中',   cls: 'bg-slate-200 text-slate-500' },
    thinking: { label: '思考中...', cls: 'bg-blue-100 text-blue-600 animate-pulse' },
    working:  { label: '作業中',   cls: 'bg-amber-100 text-amber-700 animate-pulse' },
    done:     { label: '完了',     cls: 'bg-emerald-100 text-emerald-700' },
    error:    { label: 'エラー',   cls: 'bg-red-100 text-red-600' },
  };
  const { label, cls } = map[status];
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

// ─── Agent Window ─────────────────────────────────────────────────────────────
function AgentWindow({ agent, onToggle }: { agent: AgentState; onToggle: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border backdrop-blur-sm overflow-hidden ${agent.bgColor}`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-white/20 transition-colors"
      >
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <span className="text-sm">{agent.emoji}</span>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-slate-800">{agent.name}</span>
            <StatusBadge status={agent.status} />
          </div>
          <p className="text-[10px] text-slate-500 truncate">{agent.role}</p>
        </div>
        {/* Status indicator dot */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
          agent.status === 'idle'     ? 'bg-slate-300' :
          agent.status === 'thinking' ? 'bg-blue-400 animate-pulse' :
          agent.status === 'working'  ? 'bg-amber-400 animate-pulse' :
          agent.status === 'done'     ? 'bg-emerald-400' :
          'bg-red-400'
        }`} />
        {agent.expanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
      </button>

      {/* Current task bar */}
      {agent.status !== 'idle' && (
        <div className="px-3 py-1.5 bg-white/30 border-t border-white/20">
          <div className="flex items-center gap-1.5">
            {(agent.status === 'thinking' || agent.status === 'working') && (
              <Loader2 className="w-3 h-3 text-blue-500 animate-spin flex-shrink-0" />
            )}
            {agent.status === 'done' && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
            {agent.status === 'error' && <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
            <p className="text-[11px] text-slate-700 font-medium truncate">{agent.currentTask}</p>
          </div>
        </div>
      )}

      {/* Expanded log */}
      <AnimatePresence>
        {agent.expanded && agent.log.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2 space-y-1 max-h-32 overflow-y-auto border-t border-white/20 bg-white/20">
              {agent.log.map((entry, i) => (
                <p key={i} className="text-[10px] text-slate-600 leading-relaxed">
                  <span className="text-slate-400 mr-1">›</span>{entry}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agents, setAgents] = useState<AgentState[]>(initAgents());
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper: update a single agent
  const updateAgent = (id: string, patch: Partial<AgentState>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  };

  const appendLog = (id: string, entry: string) => {
    setAgents(prev => prev.map(a =>
      a.id === id ? { ...a, log: [...a.log.slice(-19), entry] } : a
    ));
  };

  // Helper: add a chat message from an agent
  const addAgentMessage = (agentId: string, content: string) => {
    const def = AGENT_DEFS.find(d => d.id === agentId)!;
    setMessages(prev => [...prev, {
      id: `${agentId}-${Date.now()}`,
      role: 'assistant',
      agentId,
      content,
      timestamp: new Date(),
    }]);
  };

  // Orchestrate multi-agent workflow
  const runWorkflow = async (userInput: string) => {
    setIsProcessing(true);
    setError(null);

    // Reset all agents
    setAgents(initAgents());

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    try {
      // ── Step 1: Takumi analyses the request ──────────────────────────────
      updateAgent('takumi', { status: 'thinking', currentTask: 'リクエストを分析中...', expanded: true });
      appendLog('takumi', `ユーザーリクエスト受信: "${userInput}"`);
      await delay(1200);

      const takumiRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `あなたはAIチームのCOO「Takumi」です。ユーザーのリクエストを受け取り、チームへの指示を日本語で簡潔に出してください。2〜3文で。`,
          messages: [{ role: 'user', content: userInput }],
        }),
      });
      const takumiData = await takumiRes.json();
      const takumiMsg = takumiData.content || 'チームに作業を割り振ります。';

      updateAgent('takumi', { status: 'done', currentTask: '指示出し完了' });
      appendLog('takumi', takumiMsg);
      addAgentMessage('takumi', takumiMsg);
      await delay(500);

      // ── Step 2: Kenta researches ─────────────────────────────────────────
      updateAgent('kenta', { status: 'thinking', currentTask: '情報収集・リサーチ中...', expanded: true });
      appendLog('kenta', 'トレンドと競合情報を調査中...');
      await delay(1500);

      const kentaRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `あなたはリサーチャー「Kenta」です。ユーザーのリクエストに関連する重要な調査結果・インサイトを日本語で2〜3文にまとめてください。`,
          messages: [{ role: 'user', content: userInput }],
        }),
      });
      const kentaData = await kentaRes.json();
      const kentaMsg = kentaData.content || 'リサーチ結果をまとめました。';

      updateAgent('kenta', { status: 'done', currentTask: 'リサーチ完了' });
      appendLog('kenta', kentaMsg);
      addAgentMessage('kenta', kentaMsg);
      await delay(400);

      // ── Step 3: Sho designs architecture ────────────────────────────────
      updateAgent('sho', { status: 'working', currentTask: 'アーキテクチャ設計中...', expanded: true });
      appendLog('sho', 'システム構成・技術スタックを検討中...');
      await delay(1800);

      const shoRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `あなたはアーキテクト「Sho」です。ユーザーのリクエストに対して最適な設計・技術構成を日本語で2〜3文で提案してください。`,
          messages: [{ role: 'user', content: userInput }],
        }),
      });
      const shoData = await shoRes.json();
      const shoMsg = shoData.content || '設計方針を決定しました。';

      updateAgent('sho', { status: 'done', currentTask: '設計完了' });
      appendLog('sho', shoMsg);
      addAgentMessage('sho', shoMsg);
      await delay(400);

      // ── Step 4: Ren implements ───────────────────────────────────────────
      updateAgent('ren', { status: 'working', currentTask: '実装・コーディング中...', expanded: true });
      appendLog('ren', 'コンポーネント作成中...');
      await delay(2000);
      appendLog('ren', 'スタイリング適用中...');
      await delay(1000);

      const renRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `あなたはフロントエンドエンジニア「Ren」です。ユーザーのリクエストに対して実装内容・進捗を日本語で2〜3文で報告してください。`,
          messages: [{ role: 'user', content: userInput }],
        }),
      });
      const renData = await renRes.json();
      const renMsg = renData.content || '実装が完了しました。';

      updateAgent('ren', { status: 'done', currentTask: '実装完了' });
      appendLog('ren', renMsg);
      addAgentMessage('ren', renMsg);
      await delay(400);

      // ── Step 5: Satoko optimizes SEO ─────────────────────────────────────
      updateAgent('satoko', { status: 'working', currentTask: 'SEO最適化中...', expanded: true });
      appendLog('satoko', 'メタタグ・構造化データを分析中...');
      await delay(1200);

      const satokoRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `あなたはSEOスペシャリスト「Satoko」です。ユーザーのリクエストに関するSEO戦略・最適化ポイントを日本語で2〜3文で提案してください。`,
          messages: [{ role: 'user', content: userInput }],
        }),
      });
      const satokoData = await satokoRes.json();
      const satokoMsg = satokoData.content || 'SEO最適化を完了しました。';

      updateAgent('satoko', { status: 'done', currentTask: 'SEO最適化完了' });
      appendLog('satoko', satokoMsg);
      addAgentMessage('satoko', satokoMsg);
      await delay(400);

      // ── Step 6: Makoto analyses data ─────────────────────────────────────
      updateAgent('makoto', { status: 'working', currentTask: 'データ分析中...', expanded: true });
      appendLog('makoto', 'KPI・メトリクスを算出中...');
      await delay(1000);

      const makotoRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `あなたはデータアナリスト「Makoto」です。ユーザーのリクエストに関する数値的な分析・予測を日本語で2〜3文で提示してください。`,
          messages: [{ role: 'user', content: userInput }],
        }),
      });
      const makotoData = await makotoRes.json();
      const makotoMsg = makotoData.content || '分析結果をまとめました。';

      updateAgent('makoto', { status: 'done', currentTask: 'データ分析完了' });
      appendLog('makoto', makotoMsg);
      addAgentMessage('makoto', makotoMsg);
      await delay(400);

      // ── Step 7: Misaki QA & final summary ───────────────────────────────
      updateAgent('misaki', { status: 'working', currentTask: '品質チェック・最終まとめ中...', expanded: true });
      appendLog('misaki', '全エージェントの成果物をレビュー中...');
      await delay(1500);

      const misakiRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: `あなたはプロジェクトマネージャー「Misaki」です。チーム全体の作業が完了しました。ユーザーへの最終的なまとめと次のアクションを日本語で3〜4文で伝えてください。`,
          messages: [{ role: 'user', content: userInput }],
        }),
      });
      const misakiData = await misakiRes.json();
      const misakiMsg = misakiData.content || '全作業が完了しました！';

      updateAgent('misaki', { status: 'done', currentTask: '品質チェック完了' });
      appendLog('misaki', misakiMsg);
      addAgentMessage('misaki', `✅ ${misakiMsg}`);

    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
      setAgents(prev => prev.map(a =>
        a.status === 'thinking' || a.status === 'working'
          ? { ...a, status: 'error', currentTask: 'エラーが発生しました' }
          : a
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }]);
    await runWorkflow(text);
  };

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, expanded: !a.expanded } : a));
  };

  const formatTime = (d: Date) => d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

  const activeCount = agents.filter(a => a.status === 'thinking' || a.status === 'working').length;
  const doneCount   = agents.filter(a => a.status === 'done').length;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative h-14 flex items-center justify-between px-5 bg-white/5 backdrop-blur-2xl border-b border-white/10 z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-[14px]">AI Team Workspace</h1>
            <p className="text-[11px] text-slate-400">7人のAIエージェントが並列稼働</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[12px] text-slate-300">
              {isProcessing
                ? `${activeCount}人が作業中`
                : doneCount > 0
                ? `${doneCount}/7 完了`
                : '待機中'}
            </span>
            {isProcessing && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
          </div>

          <Link
            href="/influencer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-[12px] font-semibold rounded-xl shadow-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI 動画生成
          </Link>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main layout: chat left | agent windows right */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left: Chat Panel ──────────────────────────────────────────────── */}
        <div className="flex flex-col w-[420px] flex-shrink-0 border-r border-white/10">
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-[13px] font-semibold text-white">チームチャット</span>
              {isProcessing && (
                <span className="text-[10px] text-blue-400 animate-pulse ml-auto">エージェント稼働中...</span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <p className="text-slate-300 font-medium">AIチームに依頼してみましょう</p>
                <p className="text-slate-500 text-[12px] mt-2 leading-relaxed">
                  「ランディングページを作って」<br />
                  「競合分析をして」など何でもOK
                </p>
              </div>
            )}

            {messages.map((msg) => {
              const def = AGENT_DEFS.find(d => d.id === msg.agentId);
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-slate-600'
                      : def
                      ? `bg-gradient-to-br ${def.color}`
                      : 'bg-slate-600'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="w-3.5 h-3.5 text-white" />
                      : <span className="text-sm">{def?.emoji || '🤖'}</span>
                    }
                  </div>
                  <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    {msg.role === 'assistant' && def && (
                      <span className="text-[10px] text-slate-400 mb-1 ml-1">{def.name} · {def.role}</span>
                    )}
                    <div className={`rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white/10 text-slate-200 rounded-bl-sm border border-white/10'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">{formatTime(msg.timestamp)}</span>
                  </div>
                </motion.div>
              );
            })}

            {isProcessing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center">
                  <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                </div>
                <div className="bg-white/10 rounded-2xl rounded-bl-sm px-3 py-2 border border-white/10">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-red-300">{error}</p>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2.5 border border-white/15">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="AIチームに依頼する..."
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-slate-200 placeholder:text-slate-500"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-30 rounded-xl transition-all hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
            <p className="text-[10px] text-slate-600 text-center mt-2">送信すると7人のエージェントが並列で作業を開始します</p>
          </div>
        </div>

        {/* ── Right: Agent Windows ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">エージェント作業ウィンドウ</span>
            {isProcessing && (
              <span className="ml-auto text-[11px] text-blue-400 animate-pulse">{activeCount}人が稼働中</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            {agents.map(agent => (
              <AgentWindow
                key={agent.id}
                agent={agent}
                onToggle={() => toggleAgent(agent.id)}
              />
            ))}
          </div>

          {/* Overall progress bar */}
          {(isProcessing || doneCount > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-slate-400 font-medium">全体進捗</span>
                <span className="text-[12px] text-slate-300">{doneCount} / 7 完了</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  animate={{ width: `${(doneCount / 7) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!isProcessing && doneCount === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-3 border border-white/10">
                <Activity className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-slate-500 text-[13px]">左のチャットで依頼すると</p>
              <p className="text-slate-600 text-[12px] mt-1">各エージェントの作業がここに表示されます</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
