import React from 'react';

export const SystemStatus: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-green-700">System Online</span>
      </div>
      
      <div className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          <span className="text-slate-400">CPU:</span>
          <span className="font-mono">24%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-400">MEM:</span>
          <span className="font-mono">3.2GB</span>
        </div>
      </div>
    </div>
  );
};
