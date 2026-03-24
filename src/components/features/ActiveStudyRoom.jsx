import React, { useState, useEffect, useRef } from 'react';
import {
  db,
  safeAppId,
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc
} from '../../config/firebase';
import { ArrowLeft, MessageSquare, Edit3, PenTool, Users, Sparkles, Send, UserIcon } from '../Icons';
import { EthermonyLogo } from '../EthermonyLogo';
import { generateAIContent, addHarmonyPoints, formatTime } from '../../utils/ai';
import { AI_PROMPTS, POINTS } from '../../config/constants';

export const ActiveStudyRoom = ({ roomId, user, onLeave, showToast }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [activeTool, setActiveTool] = useState('chat');
  const chatEndRef = useRef(null);

  const roomDocRef = doc(db, 'artifacts', safeAppId, 'public', 'data', 'rooms', roomId);
  const messagesColRef = collection(db, 'artifacts', safeAppId, 'public', 'data', 'rooms', roomId, 'messages');

  useEffect(() => {
    if (!user) return;
    const q = query(messagesColRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(liveMessages);
        setIsLocalMode(false);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      },
      (error) => {
        console.warn("Silent Local Mode.");
        setIsLocalMode(true);
      }
    );
    return () => unsubscribe();
  }, [roomId, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending || !user) return;

    const textToSend = newMessage;
    const currentName = user.displayName || "Student User";
    setIsSending(true);
    setNewMessage("");

    const msgObj = {
      text: textToSend,
      sender: currentName,
      senderUid: user.uid,
      photoURL: user.photoURL || null,
      isBot: false,
      timestamp: serverTimestamp()
    };

    try {
      if (!isLocalMode) await addDoc(messagesColRef, msgObj);
      else setMessages(prev => [...prev, { id: Date.now().toString(), ...msgObj, timestamp: new Date() }]);

      addHarmonyPoints(user.uid, POINTS.COLLABORATION, null);

      if (textToSend.toLowerCase().includes("@ai")) {
        const cleanPrompt = textToSend.replace(/@ai/gi, '').trim() || "Hello!";
        const botResponseText = await generateAIContent(AI_PROMPTS.CHAT, cleanPrompt, false);
        const botObj = { text: botResponseText, sender: "ETHERMONY AI", isBot: true, timestamp: serverTimestamp() };

        if (!isLocalMode) await addDoc(messagesColRef, botObj);
        else setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), ...botObj, timestamp: new Date() }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const SharedNotes = () => {
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      if (!user || isLocalMode) return;
      const unsub = onSnapshot(roomDocRef, (docSnap) => {
        if (docSnap.exists()) setNotes(docSnap.data().sharedNotes || "");
      });
      return () => unsub();
    }, [roomId, user, isLocalMode]);

    const handleChange = async (e) => {
      const newText = e.target.value;
      setNotes(newText);
      if (isLocalMode) return;
      setIsSaving(true);
      try {
        await updateDoc(roomDocRef, { sharedNotes: newText });
      } catch (err) {}
      setIsSaving(false);
    };

    return (
      <div className="h-full flex flex-col p-6 bg-gray-50 dark:bg-white/[0.01]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-gray-900 dark:text-white font-bold flex items-center gap-2 text-lg">
            <Edit3 className="w-6 h-6 text-purple-500" /> Live Collaborative Notes
          </h4>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400">
            {isLocalMode ? "Local Mode Active" : isSaving ? "Saving..." : "Synced to Cloud"}
          </span>
        </div>
        <textarea
          value={notes}
          onChange={handleChange}
          placeholder="Start typing... Anyone in the room will see this instantly!"
          className="flex-grow bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 resize-none transition-colors leading-relaxed shadow-inner"
        ></textarea>
      </div>
    );
  };

  const Whiteboard = () => (
    <div className="h-full w-full bg-white dark:bg-gray-900">
      <iframe
        src={`https://excalidraw.com/#room=${roomId}`}
        title="Excalidraw Whiteboard"
        className="w-full h-full border-none"
      ></iframe>
    </div>
  );

  const activeMembers = Array.from(
    new Set(
      messages
        .filter(m => !m.isSystem && !m.isBot)
        .map(m => JSON.stringify({ name: m.sender, uid: m.senderUid, photo: m.photoURL }))
    )
  ).map(s => JSON.parse(s));
  if (!activeMembers.find(m => m.uid === user.uid)) {
    activeMembers.unshift({ name: user.displayName || "Student User", uid: user.uid, photo: user.photoURL });
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] gap-6 animate-fade-in-up">
      <div className="flex-grow flex flex-col bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden relative shadow-xl dark:shadow-none">
        <div className="h-[72px] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 md:px-6 bg-gray-50 dark:bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <button
              onClick={onLeave}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-white dark:bg-transparent shadow-sm dark:shadow-none p-2 rounded-lg border border-gray-200 dark:border-transparent"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden md:block">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> Collab Session
              </h3>
            </div>
          </div>

          <div className="flex bg-gray-200 dark:bg-black/40 rounded-xl p-1.5 border border-gray-300 dark:border-white/10">
            <button
              onClick={() => setActiveTool('chat')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTool === 'chat'
                  ? 'bg-white dark:bg-white/10 text-purple-600 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Chat
            </button>
            <button
              onClick={() => setActiveTool('notes')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTool === 'notes'
                  ? 'bg-white dark:bg-white/10 text-purple-600 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" /> Notes
            </button>
            <button
              onClick={() => setActiveTool('whiteboard')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTool === 'whiteboard'
                  ? 'bg-white dark:bg-white/10 text-purple-600 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <PenTool className="w-4 h-4" /> Whiteboard
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-hidden flex flex-col bg-gray-50 dark:bg-transparent">
          {activeTool === 'notes' && <SharedNotes />}
          {activeTool === 'whiteboard' && <Whiteboard />}

          {activeTool === 'chat' && (
            <>
              <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-base flex-col gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center mb-2">
                      <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">Room initialized securely.</p>
                    <p>
                      Share ID <strong>{roomId}</strong> or tag <strong className="text-purple-500">@ai</strong> for help!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    if (msg.isSystem)
                      return (
                        <div key={msg.id} className="text-center my-4">
                          <span className="bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 text-xs px-4 py-1.5 rounded-full font-medium">
                            {msg.text}
                          </span>
                        </div>
                      );
                    const isMe = msg.senderUid === user?.uid;

                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isMe ? 'ml-auto items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          <span
                            className={`text-xs font-bold flex items-center gap-2 ${
                              msg.isBot ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {msg.isBot ? (
                              <EthermonyLogo className="w-5 h-5 rounded-md shadow-sm" fallbackSize="w-3 h-3" />
                            ) : msg.photoURL ? (
                              <img
                                src={msg.photoURL}
                                alt={msg.sender}
                                className="w-5 h-5 rounded-full object-cover border border-gray-200 dark:border-white/10 shadow-sm"
                              />
                            ) : (
                              <UserIcon className="w-4 h-4" />
                            )}
                            {msg.sender}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div
                          className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-purple-600 text-white rounded-tr-none'
                              : msg.isBot
                              ? 'bg-purple-50 dark:bg-purple-600/10 border border-purple-100 dark:border-purple-500/20 text-gray-900 dark:text-gray-200 rounded-tl-none shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                              : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-300 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 md:p-6 bg-white dark:bg-white/[0.01] border-t border-gray-200 dark:border-white/10">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-2xl p-2 pr-2 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all"
                >
                  <div className="p-3 text-purple-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message or ask @ai..."
                    className="flex-grow bg-transparent border-none text-base text-gray-900 dark:text-white focus:outline-none py-2"
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-md"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl dark:shadow-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] pointer-events-none"></div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">Room Key</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Share this ID for others to join.
          </p>
          <div className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-inner">
            <span className="font-mono text-2xl text-gray-900 dark:text-white tracking-widest font-bold">
              {roomId}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                showToast("Copied!", "success");
              }}
              className="text-xs font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-500/40 transition-colors shadow-sm"
            >
              COPY
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex-grow shadow-xl dark:shadow-none">
          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-500" /> Active Members
          </h4>
          <div className="space-y-5">
            {activeMembers.map((member, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-700 dark:text-purple-300 overflow-hidden shadow-sm">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name[0].toUpperCase()
                  )}
                </div>
                <span className="text-sm text-gray-800 dark:text-gray-200 font-bold">
                  {member.name}{' '}
                  {member.uid === user.uid && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium ml-1">(You)</span>
                  )}
                </span>
                <div className="ml-auto w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
