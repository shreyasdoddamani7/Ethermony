import React, { useState, useEffect } from 'react';
import { db, safeAppId, collection, query, orderBy, onSnapshot, limit } from '../../config/firebase';
import { Trophy, Sparkles } from '../Icons';

export const LeaderboardFeature = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'artifacts', safeAppId, 'users'), orderBy('points', 'desc'), limit(10));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLeaders(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col animate-fade-in-up">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mx-auto flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Global Leaderboard</h2>
        <p className="text-gray-500 dark:text-gray-400">Earn Harmony Points by studying, completing quizzes, and collaborating.</p>
      </div>

      <div className="flex-grow bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl p-2 md:p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No scores yet. Start studying to rank up!</div>
        ) : (
          <div className="space-y-3">
            {leaders.map((user, idx) => (
              <div
                key={user.uid}
                className={`flex items-center p-4 rounded-2xl transition-all hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 ${
                  idx === 0 ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 shadow-sm' : ''
                }`}
              >
                <div
                  className={`w-8 font-bold text-lg text-center ${
                    idx === 0
                      ? 'text-yellow-500'
                      : idx === 1
                      ? 'text-gray-400'
                      : idx === 2
                      ? 'text-amber-700 dark:text-orange-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  #{idx + 1}
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10 ml-4 mr-4 flex-shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                      {user.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900 dark:text-white">{user.name || "Anonymous Student"}</h4>
                </div>
                <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-500/20 px-4 py-2 rounded-xl">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-mono font-bold text-purple-700 dark:text-purple-300">{user.points || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
