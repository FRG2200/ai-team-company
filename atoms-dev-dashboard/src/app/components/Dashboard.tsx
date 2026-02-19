'use client';

import React, { useState, useEffect } from 'react';
import { RequestForm } from './RequestForm';
import { UserCard } from './UserCard';
import { AgentCard } from './AgentCard';
import { SystemStatus } from './SystemStatus';

// 7人のエージェント定義
const agents = [
  {
    id: 'takumi',
    name: 'Takumi',
    role: 'COO',
    roleJa: 'Chief Operating Officer',
    emoji: '🎯',
    color: 'bg-blue-600',
    description: 'Decision Maker',
  },
  {
    id: 'misaki',
    name: 'Misaki',
    role: 'PM',
    roleJa: 'Project Manager',
    emoji: '📋',
    color: 'bg-emerald-500',
    description: 'Task Management',
  },
  {
    id: 'kenta',
    name: 'Kenta',
    role: 'Researcher',
    roleJa: 'Researcher',
    emoji: '📊',
    color: 'bg-indigo-500',
    description: 'Data Analysis',
  },
  {
    id: 'sho',
    name: 'Sho',
    role: 'Architect',
    roleJa: 'System Architect',
    emoji: '🏗️',
    color: 'bg-amber-500',
    description: 'System Design',
  },
  {
    id: 'ren',
    name: 'Ren',
    role: 'Engineer',
    roleJa: 'Engineer',
    emoji: '💻',
    color: 'bg-rose-500',
    description: 'Implementation',
  },
  {
    id: 'satoko',
    name: 'Satoko',
    role: 'SEO',
    roleJa: 'SEO & Marketing',
    emoji: '📈',
    color: 'bg-purple-500',
    description: 'Content Strategy',
  },
  {
    id: 'makoto',
    name: 'Makoto',
    role: 'Analyst',
    roleJa: 'Analyst & CS',
    emoji: '📊',
    color: 'bg-cyan-500',
    description: 'Data & Support',
  },
];

// モックログデータ
const generateMockLogs = (agentId: string) => {
  const logs: Record<string, string[]> = {
    takumi: [
      '> Analyzing request...',
      '> Routing to Sho for architecture design',
      '> Monitoring progress...',
    ],
    misaki: ['> Standby mode', '> Waiting for task assignment'],
    kenta: ['> Standby mode', '> Ready for research tasks'],
    sho: ['> Standby mode', '> Waiting for requirements'],
    ren: ['> Standby mode', '> Development environment ready'],
    satoko: ['> Standby mode', '> SEO tools initialized'],
    makoto: ['> Standby mode', '> Analytics dashboard ready'],
  };
  return logs[agentId] || ['> Standby'];
};

export const Dashboard: React.FC = () => {
  const [submittedRequest, setSubmittedRequest] = useState('');
  const [activeAgent, setActiveAgent] = useState('takumi');
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const initialLogs: Record<string, string[]> = {};
    agents.forEach((agent) => {
      initialLogs[agent.id] = generateMockLogs(agent.id);
    });
    setLogs(initialLogs);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // シミュレーション：タスク進行
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => {
        const random = Math.random();
        if (random > 0.7) {
          const randomAgent = agents[Math.floor(Math.random() * agents.length)];
          return randomAgent.id;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitRequest = (request: string) => {
    setSubmittedRequest(request);
  };

  const takumi = agents.find(a => a.id === 'takumi')!;
  const otherAgents = agents.filter(a => a.id !== 'takumi');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🐾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Ai team company</h1>
                <p className="text-sm text-slate-500">7 AI Agents Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <SystemStatus />
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  {currentTime.toLocaleTimeString('ja-JP')}
                </p>
                <p className="text-xs text-slate-400">
                  {currentTime.toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* 1. 依頼内容入力フォーム */}
        <RequestForm onSubmit={handleSubmitRequest} />

        {/* 2. ユーザーカード（依頼者）- 送信後に表示 */}
        {submittedRequest && (
          <>
            <UserCard request={submittedRequest} />
            
            {/* 矢印 */}
            <div className="flex justify-center">
              <div className="text-3xl text-slate-400 animate-bounce">↓</div>
            </div>
          </>
        )}

        {/* 3. Takumi (COO) - 判断者 */}
        <div className="relative">
          {submittedRequest && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold z-10 shadow-md">
              ↓ 最初の判断者
            </div>
          )}
          <AgentCard
            agent={takumi}
            isActive={activeAgent === 'takumi'}
            logs={logs['takumi'] || ['> Standby']}
            size="large"
          />
        </div>

        {/* 矢印 */}
        {submittedRequest && (
          <div className="flex justify-center">
            <div className="text-3xl text-slate-400 animate-bounce">↓</div>
          </div>
        )}

        {/* 4. 残りの6人 - 実行チーム */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>👥</span>
            <span>実行チーム</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isActive={activeAgent === agent.id}
                logs={logs[agent.id] || ['> Standby']}
              />
            ))}
          </div>
        </div>

        {/* ワークフロー図 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Workflow</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full font-medium">👤 User</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-bold shadow-sm">🎯 Takumi</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full">📋 Misaki</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full">📊 Kenta</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full">🏗️ Sho</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full">💻 Ren</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full">📈 Satoko</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full">📊 Makoto</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-medium">✅ Delivery</span>
          </div>
        </div>
      </main>
    </div>
  );
};
