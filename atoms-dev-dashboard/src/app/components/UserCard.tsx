'use client';

import React from 'react';

interface UserCardProps {
  request: string;
}

export const UserCard: React.FC<UserCardProps> = ({ request }) => {
  return (
    <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl border-2 border-slate-200 p-5 relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50" />
      
      <div className="flex items-start gap-4 relative z-10">
        {/* アバター */}
        <div className="w-14 h-14 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-3xl shadow-inner">
          👤
        </div>
        
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">依頼者</p>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">User</span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2">ユーザー</h3>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">依頼内容：</p>
            <p className="text-slate-800 font-medium text-base leading-relaxed">{request}</p>
          </div>
          
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span>⏱️ 送信済み</span>
            <span>•</span>
            <span>{new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
