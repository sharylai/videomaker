import React from 'react';
import type { VideoScript, Scene } from '../types';
import { SceneCard } from './SceneCard';
import * as XLSX from 'xlsx';
import { DownloadIcon } from './icons';

interface ScriptDisplayProps {
  script: VideoScript;
  onUpdateScript: (script: VideoScript) => void;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script, onUpdateScript }) => {

  const handleExport = () => {
    const headers = ['場景', '秒數', '口白文字', '畫面說明', '音樂'];
    const data = script.scenes.map(scene => [
      scene.scene,
      scene.seconds,
      scene.voiceover,
      scene.storyboard,
      scene.music,
    ]);

    const worksheetData = [headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Auto-fit columns
    const colWidths = headers.map((header, i) => {
      const maxLength = Math.max(
        header.length, 
        ...data.map(row => String(row[i] || '').length)
      );
      return { wch: maxLength + 5 }; // +5 for padding
    });
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '分鏡腳本');

    // Sanitize the topic for use as a filename
    const safeTopic = script.topic.replace(/[\\?%*:|"<>]/g, '-').slice(0, 50);
    XLSX.writeFile(workbook, `${safeTopic}-分鏡腳本.xlsx`);
  };

  const handleSceneUpdate = (sceneIndex: number, updatedScene: Scene) => {
    const newScenes = [...script.scenes];
    newScenes[sceneIndex] = updatedScene;
    onUpdateScript({ ...script, scenes: newScenes });
  };

  let cumulativeSeconds = 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-800/50 rounded-lg gap-4">
        <h2 className="text-2xl font-bold text-purple-400 text-center sm:text-left">影片類型：{script.videoType}</h2>
        <button
          onClick={handleExport}
          className="flex items-center justify-center px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 w-full sm:w-auto"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          匯出分鏡腳本
        </button>
      </div>
      <div className="space-y-6">
        {script.scenes.map((scene, index) => {
          const startTime = cumulativeSeconds;
          cumulativeSeconds += scene.seconds;
          return (
            <SceneCard 
              key={index} 
              scene={scene} 
              startTime={startTime}
              onUpdateScene={(updatedScene) => handleSceneUpdate(index, updatedScene)}
            />
          );
        })}
      </div>
    </div>
  );
};