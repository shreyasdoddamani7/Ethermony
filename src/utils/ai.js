// AI & Content Generation Utilities
import { db, safeAppId, doc, setDoc, increment } from '../config/firebase.js';

/**
 * Generate AI content using Puter.js and fallback to Pollinations API
 * @param {string} systemPrompt - System prompt for the AI
 * @param {string} userPrompt - User's prompt
 * @param {boolean} isJson - Whether to parse response as JSON
 * @returns {Promise<string|object>} - AI response
 */
export const generateAIContent = async (systemPrompt, userPrompt, isJson = false) => {
  const parseAIResult = (text) => {
    if (!isJson) return text;
    let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start !== -1 && end !== -1) clean = clean.substring(start, end + 1);
    return JSON.parse(clean);
  };

  let finalPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}`;
  if (isJson) finalPrompt += "\n\nCRITICAL: Output ONLY raw JSON matching the schema requested. No markdown, no conversational text.";

  try {
    // Try Puter.js first
    if (typeof puter !== 'undefined') {
      const response = await puter.ai.chat(finalPrompt);
      let textResult = typeof response === 'string' ? response : (response.message?.content || response.text || String(response));
      if (textResult) return parseAIResult(textResult);
    }
  } catch (error) {
    console.warn("Puter AI unavailable, switching to Fallback API.", error);
  }

  try {
    // Fallback to Pollinations API
    const fallbackRes = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: finalPrompt }
        ],
        jsonMode: isJson
      })
    });

    if (!fallbackRes.ok) throw new Error("Fallback failed");
    const fallbackText = await fallbackRes.text();
    return parseAIResult(fallbackText);

  } catch (err) {
    console.error("All AI Engines Failed:", err);
    throw new Error("Unable to connect to AI providers. Please check your connection.");
  }
};

/**
 * Add Harmony Points to a user
 * @param {string} uid - User ID
 * @param {number} amount - Points to add
 * @param {Function} showToast - Toast notification function
 */
export const addHarmonyPoints = async (uid, amount, showToast) => {
  try {
    const userRef = doc(db, 'artifacts', safeAppId, 'users', uid);
    await setDoc(userRef, { points: increment(amount) }, { merge: true });
    if (showToast) showToast(`+${amount} Harmony Points!`, 'success');
  } catch (e) {
    console.warn("Points system functioning locally.");
  }
};

/**
 * Format timestamp to readable time
 * @param {*} ts - Timestamp from Firebase
 * @returns {string} - Formatted time
 */
export const formatTime = (ts) => {
  if (!ts) return "Just now";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Class name utility for Tailwind
 * @param {...any} classes - Classes to join
 * @returns {string} - Joined class names
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');
