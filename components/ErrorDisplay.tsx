
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="mt-6 p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg text-center animate-fade-in">
      <p><strong>錯誤：</strong> {message}</p>
    </div>
  );
};
