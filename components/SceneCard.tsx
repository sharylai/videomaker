import React, { useState, useEffect } from 'react';
import type { Scene } from '../types';
import { ClipboardIcon, CheckIcon, PencilIcon, XMarkIcon } from './icons';

interface SceneCardProps {
  scene: Scene;
  startTime: number;
  onUpdateScene: (updatedScene: Scene) => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const EditableField: React.FC<{
  label: string;
  value: string;
  isEditing: boolean;
  name: keyof Scene;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, value, isEditing, name, onChange }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-semibold text-purple-300 tracking-wider uppercase">{label}</h4>
    {isEditing ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={5}
        className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md resize-y focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-gray-300 leading-relaxed"
      />
    ) : (
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{value}</p>
    )}
  </div>
);

const PromptField: React.FC<{ 
    label: string; 
    text: string; 
    labelChinese: string; 
    isEditing: boolean;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, text, labelChinese, isEditing, onChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copied) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-purple-300 tracking-wider uppercase">{label} <span className="text-gray-400 font-normal">({labelChinese})</span></h4>
      <div className="mt-2 relative bg-gray-900 rounded-md p-3 border border-gray-700">
        {isEditing ? (
          <textarea
            value={text}
            onChange={onChange}
            rows={4}
            className="w-full bg-transparent border-none resize-y focus:outline-none text-gray-300 font-mono text-sm"
          />
        ) : (
          <>
            <p className="text-gray-300 font-mono text-sm break-words pr-16">{text}</p>
            <button
              onClick={handleCopy}
              disabled={copied}
              className={`absolute top-1/2 -translate-y-1/2 right-2 rounded-md transition-all duration-300 ease-in-out
                ${copied
                  ? 'bg-green-600 text-white px-3 py-1 text-xs font-semibold'
                  : 'p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700'
                }`}
              aria-label={`Copy ${label}`}
            >
              {copied ? '已複製！' : <ClipboardIcon className="w-4 h-4" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const SceneCard: React.FC<SceneCardProps> = ({ scene, startTime, onUpdateScene }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScene, setEditedScene] = useState<Scene>(scene);

  useEffect(() => {
    if (!isEditing) {
      setEditedScene(scene);
    }
  }, [scene, isEditing]);

  const handleSave = () => {
    onUpdateScene(editedScene);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScene(scene);
    setIsEditing(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedScene(prev => ({...prev, [name]: value}));
  };
  
  const handlePromptChange = (name: 'imagePrompt' | 'characterPrompt' | 'veoPrompt', value: string) => {
    setEditedScene(prev => ({...prev, [name]: value}));
  };

  const endTime = startTime + scene.seconds;
  const timeDisplay = `${formatTime(startTime)} ~ ${formatTime(endTime)}`;

  const buttonClasses = "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-purple-500/10 hover:border-purple-800">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-pink-400 pt-1">場景 {scene.scene}</h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isEditing ? (
              <>
                <button onClick={handleSave} className={`${buttonClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`}>
                  <CheckIcon className="w-4 h-4" />
                  儲存
                </button>
                <button onClick={handleCancel} className={`${buttonClasses} bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500`}>
                  <XMarkIcon className="w-4 h-4" />
                  取消
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className={`${buttonClasses} bg-gray-700/80 text-gray-300 hover:bg-purple-600 hover:text-white focus:ring-purple-500`}>
                <PencilIcon className="w-4 h-4" />
                編輯
              </button>
            )}
            <span className="text-sm font-mono text-gray-400 bg-gray-900 px-3 py-1.5 rounded-md ml-2">{timeDisplay}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField label="分鏡腳本" name="storyboard" value={editedScene.storyboard} isEditing={isEditing} onChange={handleInputChange} />
          <EditableField label="口白文字腳本" name="voiceover" value={editedScene.voiceover} isEditing={isEditing} onChange={handleInputChange} />
        </div>

        <div className="mt-4">
           <EditableField label="音樂 / 音效" name="music" value={editedScene.music} isEditing={isEditing} onChange={handleInputChange} />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
          <PromptField label="Image Prompt" labelChinese="圖片生成提示詞" text={editedScene.imagePrompt} isEditing={isEditing} onChange={(e) => handlePromptChange('imagePrompt', e.target.value)} />
          <PromptField label="Character Prompt" labelChinese="人物生成提示詞" text={editedScene.characterPrompt} isEditing={isEditing} onChange={(e) => handlePromptChange('characterPrompt', e.target.value)} />
          <PromptField label="Veo Prompt" labelChinese="Veo 影片生成提示詞" text={editedScene.veoPrompt} isEditing={isEditing} onChange={(e) => handlePromptChange('veoPrompt', e.target.value)} />
        </div>
      </div>
    </div>
  );
};