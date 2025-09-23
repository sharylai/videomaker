import React from 'react';
import type { VideoScript } from '../types';
import { DocumentTextIcon } from './icons';

interface MyScriptsProps {
  scripts: VideoScript[];
  onSelectScript: (script: VideoScript) => void;
}

export const MyScripts: React.FC<MyScriptsProps> = ({ scripts, onSelectScript }) => {
  if (scripts.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-800/40 border border-gray-700 rounded-2xl animate-fade-in">
        <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-200">還沒有任何腳本</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          回到首頁，產生你的第一個 AI 影片腳本吧！它會自動儲存在這裡。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
       <h2 className="text-3xl font-bold text-center mb-6 text-gray-200">我的腳本</h2>
      {scripts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((script) => (
        <div
          key={script.id}
          onClick={() => onSelectScript(script)}
          className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-gray-700/80 hover:border-purple-600"
        >
          <h3 className="font-bold text-lg text-purple-400 truncate">{script.topic}</h3>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
            <div className="flex items-center gap-4">
                <span>類型: {script.videoType}</span>
                {script.style && <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs">風格: {script.style}</span>}
            </div>
            <span>{new Date(script.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};