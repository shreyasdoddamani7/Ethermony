import React from 'react';
import { Brain } from './Icons';
import { cn } from '../utils/ai';

export const EthermonyLogo = ({ className = "w-8 h-8", fallbackSize = "w-5 h-5" }) => (
  <div className={cn("flex items-center justify-center bg-purple-600/10 border border-purple-500/20 shadow-inner overflow-hidden relative flex-shrink-0", className)}>
    <img 
      src="ETHERMONY.jpeg" 
      alt="Logo" 
      className="w-full h-full object-cover relative z-10"
      onError={(e) => {
        e.target.style.display = 'none';
        if (e.target.nextElementSibling) {
          e.target.nextElementSibling.style.display = 'block';
        }
      }}
    />
    <Brain className={cn("text-purple-500 absolute hidden z-0", fallbackSize)} />
  </div>
);
