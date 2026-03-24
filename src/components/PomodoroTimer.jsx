import React, { useState, useEffect } from 'react';
import { ClockIcon, XCircle } from './Icons';
import { addHarmonyPoints } from '../utils/ai';

export const PomodoroTimer = ({ user, showToast }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (isWork) {
        if (user) addHarmonyPoints(user.uid, 20, showToast);
        setIsWork(false);
        setTimeLeft(5 * 60);
        if (showToast) showToast("Focus complete! Time for a break.", 'success');
      } else {
        setIsWork(true);
        setTimeLeft(25 * 60);
        if (showToast) showToast("Break over! Ready to focus?", 'info');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWork, user, showToast]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isWork ? 25 * 60 : 5 * 60);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-2 px-4 shadow-sm">
      <ClockIcon className={`w-5 h-5 ${isWork ? 'text-purple-500' : 'text-green-500'}`} />
      <span className="font-mono font-bold text-gray-800 dark:text-white text-lg w-16 text-center">
        {mins}:{secs}
      </span>
      <button
        onClick={toggleTimer}
        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
          isActive
            ? 'bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30'
            : 'bg-purple-500/20 text-purple-700 dark:text-purple-300 hover:bg-purple-500/30'
        }`}
      >
        {isActive ? 'PAUSE' : 'START'}
      </button>
      <button
        onClick={resetTimer}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};
