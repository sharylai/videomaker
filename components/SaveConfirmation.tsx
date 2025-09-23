import React from 'react';
import { CheckCircleIcon, ArrowRightIcon } from './icons';

interface SaveConfirmationProps {
  onNavigate: () => void;
}

export const SaveConfirmation: React.FC<SaveConfirmationProps> = ({ onNavigate }) => {
  return (
    <div 
      className="bg-green-900/50 border border-green-600 text-green-200 rounded-lg p-4 mb-6 flex items-center justify-between animate-fade-in"
      role="status"
    >
      <div className="flex items-center gap-3">
        <CheckCircleIcon className="w-6 h-6 text-green-400" />
        <p>腳本已成功產生並儲存至「我的腳本」。</p>
      </div>
      <button 
        onClick={onNavigate} 
        className="flex items-center gap-2 text-sm font-semibold text-green-200 hover:text-white bg-green-600/50 hover:bg-green-600 px-4 py-2 rounded-md transition-colors"
      >
        <span>查看我的腳本</span>
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
