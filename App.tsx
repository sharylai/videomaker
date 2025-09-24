import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ScriptDisplay } from './components/ScriptDisplay';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateScript } from './services/geminiService';
import type { VideoScript } from './types';
import { Welcome } from './components/Welcome';
import { Navigation } from './components/Navigation';
import { MyScripts } from './components/MyScripts';
import { Toast } from './components/Toast';
import { SaveConfirmation } from './components/SaveConfirmation';

type Page = 'home' | 'myScripts';
const SCRIPT_STORAGE_KEY = 'my-video-scripts';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [duration, setDuration] = useState<string>('60秒');
  const [style, setStyle] = useState<string>('專業');
  const [script, setScript] = useState<VideoScript | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<Page>('home');
  const [savedScripts, setSavedScripts] = useState<VideoScript[]>([]);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);

  // Load scripts from localStorage on mount
  useEffect(() => {
    try {
      const storedScripts = localStorage.getItem(SCRIPT_STORAGE_KEY);
      if (storedScripts) {
        setSavedScripts(JSON.parse(storedScripts));
      }
    } catch (e) {
      console.error("Failed to parse scripts from localStorage", e);
      setSavedScripts([]);
    }
  }, []);

  const handleGenerateScript = useCallback(async () => {
    if (!topic.trim()) {
      setError('請輸入影片主題！');
      return;
    }
    setIsLoading(true);
    setError(null);
    setScript(null);
    setShowSaveSuccess(false);
    try {
      const result = await generateScript(topic, duration, style);
      const newScript: VideoScript = {
        // The result from generateScript doesn't have id, topic, createdAt, or style
        ...result,
        id: Date.now().toString(),
        topic: topic,
        createdAt: new Date().toISOString(),
        style: style,
      };
      setScript(newScript);
      setShowSaveSuccess(true);
      
      // Save to state and localStorage
      const updatedScripts = [newScript, ...savedScripts];
      setSavedScripts(updatedScripts);
      localStorage.setItem(SCRIPT_STORAGE_KEY, JSON.stringify(updatedScripts));
      
      // Show confirmation toast
      setToastMessage('腳本已成功儲存！');

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '生成腳本時發生未知錯誤。');
    } finally {
      setIsLoading(false);
    }
  }, [topic, duration, style, savedScripts]);

  const handleUpdateScript = (updatedScript: VideoScript) => {
    setScript(updatedScript); // Update the currently displayed script

    // Find and update the script in the saved list
    const updatedSavedScripts = savedScripts.map(s => 
      s.id === updatedScript.id ? updatedScript : s
    );
    setSavedScripts(updatedSavedScripts);
    localStorage.setItem(SCRIPT_STORAGE_KEY, JSON.stringify(updatedSavedScripts));
    
    // Show confirmation toast
    setToastMessage('腳本已成功更新！');
  };

  const handleSelectScript = (selectedScript: VideoScript) => {
    setScript(selectedScript);
    setPage('home');
    setError(null);
    setShowSaveSuccess(false);
    window.scrollTo(0, 0);
  };

  const handleTopicChange = (newTopic: string) => {
    setTopic(newTopic);
    if (showSaveSuccess) {
      setShowSaveSuccess(false);
    }
  };

  const renderHomePage = () => (
    <>
      <InputForm
        topic={topic}
        setTopic={handleTopicChange}
        duration={duration}
        setDuration={setDuration}
        style={style}
        setStyle={setStyle}
        onSubmit={handleGenerateScript}
        isLoading={isLoading}
      />
      {error && <ErrorDisplay message={error} />}
      <div className="mt-8">
        {isLoading && <Loader />}
        {!isLoading && !error && script && (
          <>
            {showSaveSuccess && <SaveConfirmation onNavigate={() => setPage('myScripts')} />}
            <ScriptDisplay script={script} onUpdateScript={handleUpdateScript} />
          </>
        )}
        {!isLoading && !error && !script && <Welcome />}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navigation currentPage={page} setPage={setPage} />
      <div className="flex-1 ml-24"> {/* Add margin-left to account for nav bar width */}
        <div className="container mx-auto px-4 py-8">
          <Header />
          <main>
            {page === 'home' && renderHomePage()}
            {page === 'myScripts' && <MyScripts scripts={savedScripts} onSelectScript={handleSelectScript} />}
          </main>
        </div>
      </div>
      {/* Render Toast when there is a message */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default App;
