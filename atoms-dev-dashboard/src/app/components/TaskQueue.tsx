import React from 'react';

export const TaskQueue: React.FC = () => {
  const tasks = [
    { id: 1, name: 'Landing Page Development', status: 'in_progress', priority: 'high' },
    { id: 2, name: 'SEO Optimization', status: 'pending', priority: 'medium' },
    { id: 3, name: 'Analytics Setup', status: 'pending', priority: 'low' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return '🟢';
      case 'pending':
        return '⚪';
      case 'completed':
        return '✅';
      default:
        return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-slate-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-bold text-lg">Task Queue</h3>
              <p className="text-sm opacity-80">Task Management</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{tasks.length}</p>
            <p className="text-xs opacity-70">Tasks</p>
          </div>
        </div>
      </div>

      {/* タスクリスト */}
      <div className="p-4 space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{getStatusIcon(task.status)}</span>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{task.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Status: {task.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>          
          </div>
        ))}

        {/* 追加ボタン */}
        <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium">
          + Add New Task
        </button>
      </div>

      {/* フッター */}
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Managed by Misaki</span>
          <span className="font-mono">ID: queue-001</span>
        </div>
      </div>
    </div>
  );
};
