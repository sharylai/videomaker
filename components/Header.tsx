
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        AI 影片腳本產生器
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        輸入您的主題，讓 AI 為您打造專業的影片腳本
      </p>
    </header>
  );
};
