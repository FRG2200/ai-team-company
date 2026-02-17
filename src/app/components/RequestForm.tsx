'use client';

import React, { useState } from 'react';

interface RequestFormProps {
  onSubmit: (request: string) => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const [request, setRequest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (request.trim()) {
      onSubmit(request);
      setRequest('');
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📝</span>
          <div>
            <h3 className="font-bold text-lg">依頼内容入力</h3>
            <p className="text-sm opacity-90">Request Input</p>
          </div>
        </div>
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="p-4">
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="AIチームへの依頼内容を入力してください..."
          className="w-full h-32 p-3 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:outline-none resize-none font-sans text-slate-700"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-slate-500">
            {request.length} 文字
          </p>
          <button
            type="submit"
            disabled={!request.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
};
