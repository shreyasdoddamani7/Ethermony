import React, { useState } from 'react';
import { Brain, Send, Sparkles, PlayCircle, FileQuestion, Plus } from '../Icons';
import { EthermonyLogo } from '../EthermonyLogo';
import { generateAIContent, addHarmonyPoints } from '../../utils/ai';
import { QuizInteractive } from './QuizInteractive';
import { AI_PROMPTS, JSON_SCHEMA_REQ, POINTS } from '../../config/constants';

export const StudyChatFeature = ({ user, showToast }) => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const parsedData = await generateAIContent(
        AI_PROMPTS.STUDY,
        prompt + "\n\n" + JSON_SCHEMA_REQ,
        true
      );

      const newSession = {
        id: Date.now().toString(),
        title: prompt.substring(0, 20) || "Study Module",
        query: prompt,
        result: parsedData
      };

      setSessions([newSession, ...sessions]);
      setActiveSessionId(newSession.id);
      setPrompt("");
      if (user) addHarmonyPoints(user.uid, POINTS.STUDY_SESSION, showToast);
    } catch (err) {
      console.error(err);
      setError("Failed to generate module. The free AI might be busy, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setPrompt("");
    setError(null);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      <div className="w-64 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-2xl hidden lg:flex flex-col overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <button
            onClick={startNewChat}
            className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> New Study Session
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-3 space-y-2">
          {sessions.length === 0 && (
            <div className="text-xs text-center text-gray-400 mt-4">No sessions yet</div>
          )}
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`w-full text-left p-3 rounded-xl text-sm font-medium truncate transition-colors ${
                activeSessionId === s.id
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {s.title}...
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col max-w-5xl mx-auto overflow-hidden bg-white dark:bg-white/[0.01] rounded-3xl border border-transparent dark:border-white/5 shadow-xl dark:shadow-none">
        {!activeSessionId ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-purple-100 dark:bg-white/5 border border-purple-200 dark:border-white/10 mb-8 flex items-center justify-center shadow-inner">
              <Brain className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              What do you want to learn?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 text-center max-w-lg text-lg">
              Type any academic topic below to generate a comprehensive AI study module instantly.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-2xl p-2 shadow-lg focus-within:border-purple-500/50 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
              <div className="flex items-center">
                <div className="pl-4 pr-2 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Explain the Krebs cycle in detail..."
                  className="flex-grow bg-transparent border-none text-gray-900 dark:text-white focus:outline-none py-4 px-2 text-lg"
                />
                <button
                  disabled={isLoading || !prompt.trim()}
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-all disabled:opacity-50 disabled:hover:scale-100 hover:scale-105 active:scale-95 shadow-md"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm px-4 pb-2 pt-2 font-medium text-center">
                  {error}
                </p>
              )}
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-transparent">
            <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-10 animate-fade-in-up">
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 self-end max-w-2xl ml-auto text-right shadow-sm">
                <p className="text-gray-900 dark:text-white text-lg font-medium">
                  {activeSession.query}
                </p>
              </div>

              <div className="space-y-10">
                <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-md">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <EthermonyLogo className="w-8 h-8 rounded-lg" fallbackSize="w-5 h-5" /> Comprehensive Explanation
                  </h3>
                  <div
                    className="text-gray-700 dark:text-gray-300 text-base leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: activeSession.result.explanation }}
                  />
                </div>

                {activeSession.result.videos && activeSession.result.videos.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <PlayCircle className="w-6 h-6 text-red-500" /> Suggested YouTube Searches
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {activeSession.result.videos.map((vid, i) => (
                        <a
                          key={i}
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(vid.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden group hover:border-red-500/50 hover:shadow-lg transition-all block"
                        >
                          <div className="aspect-video bg-gradient-to-br from-red-500/20 to-purple-500/20 relative flex items-center justify-center border-b border-gray-200 dark:border-white/10">
                            <PlayCircle className="w-12 h-12 text-red-500 opacity-80 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="p-4">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                              {vid.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">
                              Click to Search
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {activeSession.result.quizzes && activeSession.result.quizzes.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <FileQuestion className="w-6 h-6 text-blue-500" /> Interactive Knowledge Check
                    </h3>
                    <QuizInteractive
                      quizzes={activeSession.result.quizzes}
                      user={user}
                      showToast={showToast}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-white/[0.02] border-t border-gray-200 dark:border-white/10">
              <button
                onClick={startNewChat}
                className="w-full bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 text-purple-700 dark:text-white py-4 rounded-xl text-base font-bold transition-colors shadow-sm"
              >
                Start a new study session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
