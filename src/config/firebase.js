// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  increment,
  limit
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIFE5gkf4aGuS2yqcziIDhL61O0HF_GlI",
  authDomain: "ethermony-dfd5d.firebaseapp.com",
  projectId: "ethermony-dfd5d",
  storageBucket: "ethermony-dfd5d.firebasestorage.app",
  messagingSenderId: "1077445135050",
  appId: "1:1077445135050:web:ef8e3e78ab373a2e9a4233"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const safeAppId = typeof __app_id !== 'undefined' ? __app_id : 'ethermony-dfd5d';

export {
  app,
  auth,
  db,
  googleProvider,
  safeAppId,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  increment,
  limit
};
