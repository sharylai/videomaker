import React from 'react';
import { HomeIcon, DocumentTextIcon } from './icons';

type Page = 'home' | 'myScripts';

interface NavigationProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, setPage }) => {
  const navItemClasses = "flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-colors duration-200 cursor-pointer w-20";
  const activeClasses = "bg-purple-600/20 text-purple-300";
  const inactiveClasses = "text-gray-400 hover:bg-gray-800 hover:text-white";

  return (
    <nav className="fixed top-0 left-0 h-screen w-24 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-8 z-50">
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => setPage('home')}
          className={`${navItemClasses} ${currentPage === 'home' ? activeClasses : inactiveClasses}`}
          aria-label="首頁"
        >
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs font-medium">首頁</span>
        </button>
        <button
          onClick={() => setPage('myScripts')}
          className={`${navItemClasses} ${currentPage === 'myScripts' ? activeClasses : inactiveClasses}`}
          aria-label="我的腳本"
        >
          <DocumentTextIcon className="w-6 h-6" />
          <span className="text-xs font-medium">我的腳本</span>
        </button>
      </div>
    </nav>
  );
};