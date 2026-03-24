import React, { useState, useEffect } from 'react';
import { Sparkles } from './Icons';
import { ElegantShape } from './ElegantShape';

export const SplineSceneBasic = () => {
  const phrases = [
    "A Unified Study Ecosystem",
    "Your AI Learning Hub",
    "Zero Tabs, Infinite Focus",
    "Eliminate Fragmentation"
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fullText = phrases[currentPhraseIndex];
      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setCurrentText(
          isDeleting
            ? fullText.substring(0, currentText.length - 1)
            : fullText.substring(0, currentText.length + 1)
        );
      }
    }, isDeleting ? 30 : 80);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, phrases]);

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-indigo-500/[0.15] dark:from-indigo-500/[0.15]" className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-rose-500/[0.15] dark:from-rose-500/[0.15]" className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />
        <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-violet-500/[0.15] dark:from-violet-500/[0.15]" className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />
      </div>

      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto md:translate-x-[15%] lg:translate-x-[20%] transition-transform duration-700">
        <spline-viewer url="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full spline-watermark-clip"></spline-viewer>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-50/80 dark:from-[#030712] dark:via-transparent dark:to-[#030712]/80 pointer-events-none z-0" />

      <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-3xl pointer-events-none pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-neutral-300 w-fit mb-6 animate-fade-in-up pointer-events-auto backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-primary" /> AI-Powered Study Engine
        </div>
        <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight animate-fade-in-up min-h-[100px] md:min-h-[120px] lg:min-h-[160px]" style={{ animationDelay: "0.1s" }}>
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-neutral-50 dark:to-neutral-400">
            {currentText}
          </span>
          <span className="inline-block w-[3px] h-[0.9em] bg-purple-600 dark:bg-primary ml-2 animate-pulse align-middle"></span>
        </h3>
        <p className="mt-4 md:mt-6 text-gray-600 dark:text-neutral-400 max-w-md text-base md:text-lg leading-relaxed animate-fade-in-up drop-shadow-md" style={{ animationDelay: "0.2s" }}>
          Transform scattered learning into a guided, immersive experience. Get structured AI explanations, instant video resources, and focused summaries—all in one calm space.
        </p>
      </div>
    </div>
  );
};
