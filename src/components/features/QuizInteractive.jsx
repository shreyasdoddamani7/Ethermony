import React, { useState } from 'react';
import { CheckCircle, XCircle } from '../Icons';
import { addHarmonyPoints } from '../../utils/ai';

export const QuizInteractive = ({ quizzes, user, showToast }) => {
  const [answers, setAnswers] = useState({});

  const handleSelect = (quizIdx, optionIdx) => {
    if (answers[quizIdx] !== undefined) return;
    setAnswers({ ...answers, [quizIdx]: optionIdx });
    if (optionIdx === quizzes[quizIdx].correctAnswerIndex && user) {
      addHarmonyPoints(user.uid, 5, showToast);
    }
  };

  if (!quizzes || quizzes.length === 0) return null;

  return (
    <div className="space-y-6">
      {quizzes.map((quiz, i) => {
        const answered = answers[i] !== undefined;
        const isCorrect = answered && answers[i] === quiz.correctAnswerIndex;
        const diffClass =
          quiz.difficulty === 'Easy'
            ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10'
            : quiz.difficulty === 'Hard'
            ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-400/10'
            : 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-400/10';

        return (
          <div
            key={i}
            className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm transition-colors hover:border-purple-300 dark:hover:border-white/10"
          >
            <div className="flex justify-between items-start mb-4 gap-4">
              <p className="text-gray-900 dark:text-white font-medium leading-relaxed">
                <span className="text-purple-500 mr-2 font-bold">Q{i + 1}.</span>
                {quiz.question}
              </p>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg border border-transparent dark:border-white/5 whitespace-nowrap ${diffClass}`}
              >
                {quiz.difficulty || "Medium"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {quiz.options &&
                quiz.options.map((opt, optIdx) => {
                  let btnClass =
                    "bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-gray-300";
                  if (answered) {
                    if (optIdx === quiz.correctAnswerIndex)
                      btnClass =
                        "bg-green-100 border-green-500 text-green-800 dark:bg-green-500/20 dark:border-green-500/50 dark:text-green-300 shadow-md";
                    else if (optIdx === answers[i])
                      btnClass =
                        "bg-red-100 border-red-500 text-red-800 dark:bg-red-500/20 dark:border-red-500/50 dark:text-red-300";
                    else btnClass = "opacity-50 border-transparent";
                  }
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(i, optIdx)}
                      disabled={answered}
                      className={`p-4 rounded-xl text-left text-sm font-medium transition-all ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
            </div>

            {answered && (
              <div
                className={`p-4 rounded-xl text-sm flex items-start gap-3 animate-fade-in ${
                  isCorrect
                    ? 'bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-200 border border-green-100 dark:border-transparent'
                    : 'bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200 border border-red-100 dark:border-transparent'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <span>
                  <strong className="block mb-1">Explanation:</strong> {quiz.explanation}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
