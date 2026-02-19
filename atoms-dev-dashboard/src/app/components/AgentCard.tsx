'use client';

import React, { useEffect, useRef } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  roleJa: string;
  emoji: string;
  color: string;
  description: string;
}

interface AgentCardProps {
  agent: Agent;
  isActive: boolean;
  logs: string[];
  size?: 'normal' | 'large';
}

export const AgentCard: React.FC<AgentCardProps> = ({ 
  agent, 
  isActive, 
  logs,
  size = 'normal' 
}) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const getStatusColor = () => {
    if (isActive) return 'bg-green-500 animate-pulse';
    return 'bg-slate-300';
  };

  const getStatusText = () => {
    if (isActive) return 'Active';
    return 'Standby';
  };

  const isLarge = size === 'large';

  return (
    <div 
      className={`bg-white rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        isActive 
          ? 'border-blue-400 shadow-lg shadow-blue-100' 
          : 'border-slate-200 hover:border-slate-300'
      } ${isLarge ? 'transform scale-105' : ''}`}
    >
      {/* ヘッダー */}
      <div className={`${agent.color} text-white ${isLarge ? 'p-6' : 'p-4'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={isLarge ? 'text-4xl' : 'text-3xl'}>{agent.emoji}</span>
            <div>
              <h3 className={`font-bold ${isLarge ? 'text-xl' : 'text-lg'}`}>{agent.name}</h3>
              <p className="text-sm opacity-90">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`${isLarge ? 'w-4 h-4' : 'w-3 h-3'} rounded-full ${getStatusColor()}`} />
            <span className={`font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>{getStatusText()}</span>
          </div>
        </div>
        <p className={`mt-2 opacity-80 ${isLarge ? 'text-base' : 'text-sm'}`}>{agent.description}</p>
      </div>

      {/* ターミナル風ログ */}
      <div className={`bg-slate-900 p-4 ${isLarge ? 'h-56' : 'h-48'} overflow-hidden`}>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-slate-400 ml-2 font-mono">
            {agent.name.toLowerCase()}@ai-team-company
          </span>
        </div>
        
        <div className={`font-mono text-sm space-y-1 ${isLarge ? 'h-40' : 'h-32'} overflow-y-auto scrollbar-hide`}>
          {logs.map((log, index) => (
            <div 
              key={index} 
              className={`${
                index === logs.length - 1 
                  ? 'text-green-400' 
                  : 'text-slate-400'
              }`}
            >
              <span className="text-slate-600">{index + 1}</span> {log}
              {index === logs.length - 1 && isActive && (
                <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />
              )}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* フッター */}
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{agent.roleJa}</span>
          <span className="font-mono">ID: {agent.id}</span>
        </div>
      </div>
    </div>
  );
};
