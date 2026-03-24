import React from 'react';
import { CheckCircle, Sparkles, Sun, Moon } from './Icons';

export const Toast = ({ message, type = 'info' }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in-up">
      <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
        type === 'success'
          ? 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-500/30 text-green-800 dark:text-green-300'
          : 'bg-purple-50 dark:bg-purple-900/40 border-purple-200 dark:border-purple-500/30 text-purple-800 dark:text-purple-300'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export const ThemeToggle = ({ isDark, setIsDark }) => (
  <button 
    onClick={() => setIsDark(!isDark)} 
    className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-yellow-400 hover:bg-black/10 dark:hover:bg-white/20 transition-colors border border-black/10 dark:border-white/20"
  >
    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);
