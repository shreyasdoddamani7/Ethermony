import React, { useState, useEffect } from 'react';
import { signOut } from '../config/firebase';
import { StudyChatFeature } from './features/StudyChatFeature';
import { StudyRoomsFeature } from './features/StudyRoomsFeature';
import { LeaderboardFeature } from './features/LeaderboardFeature';
import { PomodoroTimer } from './PomodoroTimer';
import { ThemeToggle, Toast } from './UI';
import { EthermonyLogo } from './EthermonyLogo';
import { Brain, Users, Trophy, LogOut, UserIcon } from './Icons';

export const Workspace = ({ user }) => {
  const [activeTab, setActiveTab] = useState('study');
  const [isDark, setIsDark] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);

  const showToast = (msg, type) => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {}
  };

  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-[#030712] flex overflow-hidden absolute inset-0 z-[150] transition-colors duration-300">
      {toastMsg && <Toast message={toastMsg.msg} type={toastMsg.type} />}

      {/* Sidebar */}
      <div className="w-20 md:w-72 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] flex flex-col z-20 shadow-xl dark:shadow-none transition-colors duration-300">
        <div className="h-24 flex items-center justify-center md:justify-start md:px-8 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <EthermonyLogo className="w-10 h-10 rounded-xl shadow-md" fallbackSize="w-6 h-6" />
            <span className="text-xl font-black tracking-widest text-gray-900 dark:text-white hidden md:block">
              ETHERMONY
            </span>
          </div>
        </div>

        <div className="flex-grow py-8 flex flex-col gap-3 px-4">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
              activeTab === 'study'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-600/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-transparent'
            }`}
          >
            <Brain className="w-6 h-6" />
            <span className="hidden md:block text-base font-bold">Study Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
              activeTab === 'rooms'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-600/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-transparent'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="hidden md:block text-base font-bold">Collab Rooms</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-600/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-transparent'
            }`}
          >
            <Trophy className="w-6 h-6" />
            <span className="hidden md:block text-base font-bold">Leaderboard</span>
          </button>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center md:justify-start gap-4 w-full px-4 py-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors font-bold"
          >
            <LogOut className="w-6 h-6" />
            <span className="hidden md:block text-base">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-grow flex flex-col relative z-10">
        <header className="h-24 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6 md:px-10 bg-white/50 dark:bg-transparent backdrop-blur-md relative z-10">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {activeTab === 'study' && "AI Study Engine"}
            {activeTab === 'rooms' && "Collaborative Network"}
            {activeTab === 'leaderboard' && "Global Rankings"}
          </h1>

          <div className="flex items-center gap-6">
            <PomodoroTimer user={user} showToast={showToast} />
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

            <div className="flex items-center gap-4 border-l border-gray-300 dark:border-white/10 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {user?.displayName || "Student User"}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-mono font-bold mt-0.5 tracking-wider">
                  HARMONY SYSTEM
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 border-2 border-white dark:border-white/20 flex items-center justify-center uppercase font-bold text-gray-700 dark:text-white overflow-hidden shadow-lg">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : user?.displayName ? (
                  user.displayName.charAt(0)
                ) : (
                  <UserIcon className="w-6 h-6" />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-grow overflow-hidden p-4 md:p-8 relative z-10">
          {activeTab === 'study' && <StudyChatFeature user={user} showToast={showToast} />}
          {activeTab === 'rooms' && <StudyRoomsFeature user={user} showToast={showToast} />}
          {activeTab === 'leaderboard' && <LeaderboardFeature />}
        </div>
      </div>
    </div>
  );
};
