import React, { useState } from 'react';
import { db, safeAppId, doc, collection, setDoc, addDoc, serverTimestamp } from '../../config/firebase';
import { Users } from '../Icons';
import { ActiveStudyRoom } from './ActiveStudyRoom';

export const StudyRoomsFeature = ({ user, showToast }) => {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [joinId, setJoinId] = useState("");

  const handleCreateRoom = async () => {
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      await setDoc(doc(db, 'artifacts', safeAppId, 'public', 'data', 'rooms', newId), {
        createdAt: serverTimestamp(),
        sharedNotes: ""
      });
      await addDoc(
        collection(db, 'artifacts', safeAppId, 'public', 'data', 'rooms', newId, 'messages'),
        {
          text: `${user?.displayName || "Student"} created the room.`,
          isSystem: true,
          timestamp: serverTimestamp()
        }
      );
      setCurrentRoomId(newId);
    } catch (err) {
      setCurrentRoomId(newId);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    const code = joinId.trim().toUpperCase();
    if (code) {
      try {
        await addDoc(
          collection(db, 'artifacts', safeAppId, 'public', 'data', 'rooms', code, 'messages'),
          {
            text: `${user?.displayName || "Student"} joined the room.`,
            isSystem: true,
            timestamp: serverTimestamp()
          }
        );
        setCurrentRoomId(code);
      } catch (err) {
        setCurrentRoomId(code);
      }
    }
  };

  if (currentRoomId)
    return <ActiveStudyRoom roomId={currentRoomId} user={user} onLeave={() => setCurrentRoomId(null)} showToast={showToast} />;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] items-center justify-center animate-fade-in-up px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 md:p-14 shadow-2xl relative overflow-hidden text-center">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 mx-auto flex items-center justify-center mb-8 shadow-inner">
          <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Collaborative Network</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-lg mx-auto text-lg">
          Create a secure study room to collaborate with peers, or join an existing session using a Room ID.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-purple-400 dark:hover:border-purple-500/30 transition-colors shadow-sm flex flex-col justify-center group">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Start a Session</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Generate a new secure room ID and invite your study group.
            </p>
            <button
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] group-hover:shadow-purple-500/25"
            >
              Create New Room
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-blue-400 dark:hover:border-blue-500/30 transition-colors shadow-sm flex flex-col justify-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Join a Session</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Enter a 6-character Room ID to enter an active study room.
            </p>
            <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="e.g. X7K9A2"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                maxLength={10}
                required
                className="w-full bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-xl py-4 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono text-center tracking-widest uppercase text-lg shadow-inner"
              />
              <button
                type="submit"
                className="w-full bg-gray-900 dark:bg-white/10 hover:bg-gray-800 dark:hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-md"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
