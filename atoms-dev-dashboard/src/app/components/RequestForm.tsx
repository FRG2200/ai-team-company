'use client';

import React, { useState } from 'react';

interface RequestFormProps {
  onSubmit: (request: string) => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const [requestText, setRequestText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestText.trim()) {
      onSubmit(requestText);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-lg">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-2xl">📝</span>
        <span>依頼内容入力フォーム</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="request" 
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            タスク内容
          </label>
          <textarea
            id="request"
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder="タスクを入力してください...（例：ランディングページを作成して）"
            className="w-full h-28 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-700 text-base placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!requestText.trim()}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span className="text-xl">🚀</span>
            <span>送信</span>
          </button>
        </div>
      </form>
    </div>
  );
};
