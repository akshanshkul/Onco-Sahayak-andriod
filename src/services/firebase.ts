import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_FIREBASE_AUTH_DOMAIN",
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_FIREBASE_PROJECT_ID",
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_FIREBASE_STORAGE_BUCKET",
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_FIREBASE_MESSAGING_SENDER_ID",
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "YOUR_FIREBASE_APP_ID",
    });

const auth = (() => {
  try {
    return initializeAuth(app, { persistence: [] });
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return getAuth(app);
    }
    throw error;
  }
})();

export const signInWithPassword = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const signUpWithPassword = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const forgotPassword = (email: string) => sendPasswordResetEmail(auth, email);
export const signOutFirebase = () => signOut(auth);
