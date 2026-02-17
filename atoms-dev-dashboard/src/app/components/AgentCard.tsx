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
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isActive, logs }) => {
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

  return (
    <div 
      className={`bg-white rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        isActive 
          ? 'border-blue-400 shadow-lg shadow-blue-100' 
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* ヘッダー */}
      <div className={`${agent.color} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{agent.emoji}</span>
            <div>
              <h3 className="font-bold text-lg">{agent.name}</h3>
              <p className="text-sm opacity-90">{agent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>
        <p className="text-sm mt-2 opacity-80">{agent.description}</p>
      </div>

      {/* ターミナル風ログ */}
      <div className="bg-slate-900 p-4 h-48 overflow-hidden">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-slate-400 ml-2 font-mono">
            {agent.name.toLowerCase()}@atoms.dev
          </span>
        </div>
        
        <div className="font-mono text-sm space-y-1 h-32 overflow-y-auto scrollbar-hide">
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
