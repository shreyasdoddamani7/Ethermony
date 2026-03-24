// App Constants
export const APP_NAME = 'ETHERMONY';
export const INITIAL_POMODORO_WORK = 25 * 60;
export const INITIAL_POMODORO_BREAK = 5 * 60;

// Colors
export const COLORS = {
  background: '#030712',
  foreground: '#f9fafb',
  primary: '#8b5cf6'
};

// Harmony Points
export const POINTS = {
  STUDY_SESSION: 10,
  QUIZ_CORRECT: 5,
  POMODORO_COMPLETE: 20,
  COLLABORATION: 2
};

// Tailwind Config
export const TAILWIND_CONFIG = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: COLORS.background,
        foreground: COLORS.foreground,
        primary: COLORS.primary
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      }
    }
  }
};

// AI Prompts
export const AI_PROMPTS = {
  STUDY: "You are a brilliant academic tutor. Provide an explanation of the topic. Generate up to 5 quizzes ranging from Easy to Hard. Provide exactly 3 realistic YouTube search terms (as titles).",
  CHAT: "You are ETHERMONY AI in a live student chat. Answer concisely (under 3 sentences)."
};

export const JSON_SCHEMA_REQ = `Output STRICTLY as JSON with this exact format: {"explanation": "HTML formatted text", "videos": [{"title": "Search Term 1"}, {"title": "Search Term 2"}, {"title": "Search Term 3"}], "quizzes": [{"question": "?", "options": ["A","B","C","D"], "correctAnswerIndex": 0, "explanation": "Why", "difficulty": "Easy"}]}`;
