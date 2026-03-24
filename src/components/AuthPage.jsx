import React, { useState, useEffect } from 'react';
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from '../config/firebase';
import { EthermonyLogo } from './EthermonyLogo';
import { ArrowLeft, Mail, Lock, UserIcon, PhoneIcon, GoogleIcon } from './Icons';

export const AuthPage = ({ onBack, initialMode }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [authMethod, setAuthMethod] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {}
      });
    }
  }, []);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: name });
      }
    } catch (error) {
      let cleanMsg = error.message.replace('Firebase: ', '');
      if (error.code === 'auth/email-already-in-use') cleanMsg = 'This email is already registered.';
      if (error.code === 'auth/wrong-password') cleanMsg = 'Incorrect password.';
      if (error.code === 'auth/user-not-found') cleanMsg = 'No account found with this email.';
      setErrorMsg(cleanMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setErrorMsg(error.message.replace('Firebase: ', '') + " (Ensure domain is whitelisted in Firebase Auth Settings)");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setShowOtpInput(true);
    } catch (error) {
      setErrorMsg(error.message.replace('Firebase: ', '') + " (Ensure domain is whitelisted in Firebase Auth Settings)");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await confirmationResult.confirm(otp);
    } catch (error) {
      setErrorMsg("Invalid or expired code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen absolute inset-0 z-[100] flex items-center justify-center p-6 bg-gray-50 dark:bg-[#030712] overflow-hidden animate-fade-in transition-colors">
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[radial-gradient(ellipse_at_center,_#4a154b_0%,_transparent_70%)] opacity-30 dark:opacity-80 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_#1c103f_0%,_transparent_70%)] opacity-30 dark:opacity-60 pointer-events-none"></div>

      <button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 px-4 py-2 rounded-full shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 z-20"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="w-full max-w-md bg-white dark:bg-[#0a0514]/60 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 transition-colors">
        <div className="text-center mb-8">
          <EthermonyLogo className="w-14 h-14 rounded-2xl mx-auto mb-4 border-purple-500/30" fallbackSize="w-8 h-8" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 dark:text-white/60 text-sm mt-2">
            {isLogin ? 'Log in to your unified study space' : 'Join ETHERMONY and master your focus'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl mb-4 text-center shadow-sm">
            {errorMsg}
          </div>
        )}

        {authMethod === 'email' && (
          <form className="space-y-4 animate-fade-in" onSubmit={handleEmailAuth}>
            {!isLogin && (
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl py-3.5 mt-4 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                <GoogleIcon className="w-5 h-5" /> Continue with Google
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setErrorMsg('');
                }}
                disabled={isLoading}
                className="w-full bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" /> Continue with Phone
              </button>
            </div>
          </form>
        )}

        {authMethod === 'phone' && (
          <form className="space-y-4 animate-fade-in" onSubmit={showOtpInput ? verifyOTP : sendOTP}>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              {showOtpInput
                ? "Enter the 6-digit code sent to your phone."
                : "We'll send a code to verify your number."}
            </p>

            {!showOtpInput ? (
              <div className="relative group">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="tel"
                  placeholder="+15551234567"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                />
              </div>
            ) : (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="123456"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono tracking-widest text-center text-lg"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-bold rounded-xl py-3.5 mt-4 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : showOtpInput ? 'Verify Code' : 'Send Verification Code'}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setShowOtpInput(false);
                  setConfirmationResult(null);
                }}
                className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                ← Back to Email
              </button>
            </div>
          </form>
        )}

        {authMethod === 'email' && (
          <p className="text-center mt-8 text-sm text-gray-500 dark:text-white/60">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
              }}
              className="text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
