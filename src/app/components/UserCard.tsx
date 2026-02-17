'use client';

import React from 'react';

interface UserCardProps {
  currentRequest: string;
}

export const UserCard: React.FC<UserCardProps> = ({ currentRequest }) => {
  return (
    <div className="bg-white rounded-xl border-2 border-blue-300 shadow-lg shadow-blue-100 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👤</span>
            <div>
              <h3 className="font-bold text-lg">あなた</h3>
              <p className="text-sm opacity-90">Client / Requester</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium">依頼中</span>
          </div>
        </div>
        <p className="text-sm mt-2 opacity-80">AIチームへタスクを依頼</p>
      </div>

      {/* 依頼内容表示 */}
      <div className="bg-slate-900 p-4 h-48 overflow-hidden">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-slate-400 ml-2 font-mono">
            client@atoms.dev
          </span>
        </div>
        
        <div className="font-mono text-sm space-y-1 h-32 overflow-y-auto scrollbar-hide">
          {currentRequest ? (
            <div className="text-green-400">
              <span className="text-slate-600">$</span> {currentRequest}
              <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />
            </div>
          ) : (
            <div className="text-slate-500 italic">
              依頼内容を入力してください...
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>依頼者</span>
          <span className="font-mono">ID: client-001</span>
        </div>
      </div>
    </div>
  );
};
