
import React from 'react';
import { FilmIcon, MicIcon, CameraIcon } from './icons';

export const Welcome: React.FC = () => {
  return (
    <div className="text-center p-10 bg-gray-800/40 border border-gray-700 rounded-2xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">歡迎使用 AI 影片腳本產生器</h2>
      <p className="text-gray-400 max-w-2xl mx-auto mb-8">
        無論是廣告、教學影片還是社交媒體短片，只需提供一個主題，我們強大的 AI 就能為您生成包含分鏡、口白和生成提示詞的完整腳本。
      </p>
      <div className="flex justify-center space-x-8 text-purple-400">
        <div className="flex flex-col items-center">
          <FilmIcon className="w-10 h-10 mb-2" />
          <span className="text-sm text-gray-300">分鏡腳本</span>
        </div>
        <div className="flex flex-col items-center">
          <MicIcon className="w-10 h-10 mb-2" />
          <span className="text-sm text-gray-300">口白文字</span>
        </div>
        <div className="flex flex-col items-center">
          <CameraIcon className="w-10 h-10 mb-2" />
          <span className="text-sm text-gray-300">生成提示詞</span>
        </div>
      </div>
    </div>
  );
};
