import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon } from './icons';

interface InputFormProps {
  topic: string;
  setTopic: (topic: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  style: string;
  setStyle: (style: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const templates = [
  { name: '短影音', prompt: '為 [請填寫主題] 製作一支30秒的短影音，風格需快節奏、引人注目。' },
  { name: '活動記錄', prompt: '為 [請填寫活動名稱] 製作一支精彩的活動回顧影片，捕捉活動亮點與氣氛。' },
  { name: '公司形象', prompt: '製作一支60秒的公司形象影片，介紹 [請填寫公司名稱] 的核心價值與願景。' },
  { name: '產品開箱', prompt: '為新產品 [請填寫產品名稱] 製作一支詳細的開箱評測影片，展示其特色與使用方式。' },
  { name: '作業流程', prompt: '製作一支教學影片，詳細解說 [請填寫作業流程名稱] 的每一個步驟。' },
  { name: '操作手冊', prompt: '將 [請填寫產品/軟體名稱] 的操作手冊影片化，讓使用者能快速上手。' },
  { name: '街頭調查', prompt: '針對 [請填寫調查主題] 進行街頭訪問，剪輯成一支有趣的調查報告影片。' },
  { name: '教學影片', prompt: '製作一支關於 [請填寫教學主題] 的教學影片，內容需深入淺出、易於理解。' },
  { name: '衛教影片', prompt: '製作一支關於 [請填寫衛教主題] 的衛教影片，內容須符合台灣醫藥衛生法規，避免誇大不實或宣稱療效。' },
  { name: '廣告短片', prompt: '為 [請填寫產品/服務] 設計一則15秒的創意廣告短片。' },
  { name: '幕後花絮', prompt: '拍攝 [請填寫專案/活動名稱] 的幕後花絮，展現團隊合作與有趣時刻。' },
];

const durations = ['30秒', '60秒', '90秒', '3分鐘', '5分鐘'];
const styles = ['專業', '幽默', '懸疑', '感性', '活潑'];

export const InputForm: React.FC<InputFormProps> = ({ topic, setTopic, duration, setDuration, style, setStyle, onSubmit, isLoading }) => {
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const durationRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (durationRef.current && !durationRef.current.contains(event.target as Node)) {
        setIsDurationOpen(false);
      }
      if (templateRef.current && !templateRef.current.contains(event.target as Node)) {
        setIsTemplateOpen(false);
      }
      if (styleRef.current && !styleRef.current.contains(event.target as Node)) {
        setIsStyleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 space-y-5">
      <div className="flex flex-wrap items-start gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">腳本模版</h3>
          <div className="relative inline-block text-left" ref={templateRef}>
            <div>
              <button
                type="button"
                onClick={() => setIsTemplateOpen(!isTemplateOpen)}
                disabled={isLoading}
                className="inline-flex items-center justify-between w-64 rounded-lg border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-haspopup="listbox"
                aria-expanded={isTemplateOpen}
              >
                <span>選擇一個模版...</span>
                <svg className={`-mr-1 ml-2 h-5 w-5 transform transition-transform ${isTemplateOpen ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {isTemplateOpen && (
              <div className="origin-top-left absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
                <ul className="py-1 max-h-60 overflow-y-auto" role="listbox" aria-labelledby="options-menu">
                  {templates.map((template) => (
                    <li
                      key={template.name}
                      onClick={() => {
                        setTopic(template.prompt);
                        setIsTemplateOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-600 hover:text-white cursor-pointer transition-colors duration-150"
                      role="option"
                    >
                      {template.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">影片長度</h3>
          <div className="relative inline-block text-left" ref={durationRef}>
            <div>
              <button
                type="button"
                onClick={() => setIsDurationOpen(!isDurationOpen)}
                disabled={isLoading}
                className="inline-flex items-center justify-between w-40 rounded-lg border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-haspopup="listbox"
                aria-expanded={isDurationOpen}
              >
                <span>{duration}</span>
                <svg className={`-mr-1 ml-2 h-5 w-5 transform transition-transform ${isDurationOpen ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {isDurationOpen && (
              <div className="origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <ul className="py-1" role="listbox" aria-labelledby="options-menu">
                  {durations.map((d) => (
                    <li
                      key={d}
                      onClick={() => {
                        setDuration(d);
                        setIsDurationOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                        duration === d ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      role="option"
                      aria-selected={duration === d}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">影片風格</h3>
          <div className="relative inline-block text-left" ref={styleRef}>
            <div>
              <button
                type="button"
                onClick={() => setIsStyleOpen(!isStyleOpen)}
                disabled={isLoading}
                className="inline-flex items-center justify-between w-40 rounded-lg border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-haspopup="listbox"
                aria-expanded={isStyleOpen}
              >
                <span>{style}</span>
                <svg className={`-mr-1 ml-2 h-5 w-5 transform transition-transform ${isStyleOpen ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {isStyleOpen && (
              <div className="origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <ul className="py-1" role="listbox" aria-labelledby="options-menu">
                  {styles.map((s) => (
                    <li
                      key={s}
                      onClick={() => {
                        setStyle(s);
                        setIsStyleOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                        style === s ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      role="option"
                      aria-selected={style === s}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="relative">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="或直接輸入您的主題，例如：一款全新手沖咖啡壺的30秒廣告..."
          className="w-full h-28 p-4 bg-gray-900 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-lg placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading || !topic.trim()}
          className="absolute bottom-4 right-4 flex items-center justify-center px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
        >
          {isLoading ? (
            '生成中...'
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              生成腳本
            </>
          )}
        </button>
      </div>
    </div>
  );
};