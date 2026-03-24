import React, { useState, useEffect } from 'react';
import {
  auth,
  db,
  safeAppId,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc
} from '../config/firebase';
import { SplineSceneBasic } from './SplineSceneBasic';
import { AuthPage } from './AuthPage';
import { Workspace } from './Workspace';
import { EthermonyLogo } from './EthermonyLogo';

export function App() {
  const [currentView, setCurrentView] = useState('home');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'artifacts', safeAppId, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            await setDoc(userRef, {
              name: currentUser.displayName || "Student",
              photoURL: currentUser.photoURL || null,
              email: currentUser.email,
              points: 0
            });
          }
        } catch (e) {}
        setUser(currentUser);
        setCurrentView('workspace');
      } else {
        setUser(null);
        setCurrentView('home');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col relative selection:bg-purple-500/30 overflow-hidden">
      {currentView !== 'workspace' && (
        <div className="absolute inset-0 z-10 w-full h-full bg-[#030712]">
          <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-20 pointer-events-none">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity"
                onClick={() => setCurrentView('home')}
              >
                <EthermonyLogo className="w-10 h-10 rounded-xl shadow-lg shadow-purple-500/20" fallbackSize="w-6 h-6" />
                <span className="text-xl font-black tracking-widest text-white">ETHERMONY</span>
              </div>
              <div className="flex items-center gap-4 pointer-events-auto">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setCurrentView('auth');
                  }}
                  className="text-sm font-bold text-gray-300 hover:text-white transition-colors hidden sm:block cursor-pointer px-4 py-2"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setCurrentView('auth');
                  }}
                  className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all active:scale-95 cursor-pointer shadow-lg"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </nav>
          <main className="w-full h-full">
            <SplineSceneBasic />
          </main>
        </div>
      )}
      {currentView === 'auth' && <AuthPage onBack={() => setCurrentView('home')} initialMode={authMode} />}
      {currentView === 'workspace' && <Workspace user={user} />}
    </div>
  );
}
