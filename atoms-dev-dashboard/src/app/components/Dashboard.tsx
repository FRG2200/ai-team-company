import React, { useState, useEffect } from 'react';
import { AgentCard } from './AgentCard';
import { TaskQueue } from './TaskQueue';
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
  const [activeAgent, setActiveAgent] = useState('takumi');
  const [currentTask, setCurrentTask] = useState('Landing Page Development');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const initialLogs: Record<string, string[]> = {};
    agents.forEach((agent) => {
      initialLogs[agent.id] = generateMockLogs(agent.id);
    });
    setLogs(initialLogs);

    // 時計更新
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // シミュレーション：タスク進行
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 2;
      });

      // ランダムにエージェントの状態を更新
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🐾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">atoms.dev</h1>
                <p className="text-sm text-slate-500">AI Team Dashboard</p>
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
      <main className="max-w-[1920px] mx-auto p-6">
        {/* タスク概要 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Current Task</h2>
              <p className="text-2xl font-bold text-slate-800 mt-1">{currentTask}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">Progress</p>
              <p className="text-3xl font-bold text-blue-600">{Math.round(progress)}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* エージェントグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isActive={activeAgent === agent.id}
              logs={logs[agent.id] || ['> Standby']}
            />
          ))}
          
          {/* タスクキュー */}
          <TaskQueue />
        </div>

        {/* フロー図 */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Workflow</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Request</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Takumi (Judge)</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Kenta (Research)</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Sho (Design)</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Ren (Build)</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Satoko (SEO)</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">Makoto (Review)</span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Delivery</span>
          </div>
        </div>
      </main>
    </div>
  );
};
