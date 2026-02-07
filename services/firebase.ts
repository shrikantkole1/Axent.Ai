
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged as fbOnAuthStateChanged,
  signOut as fbSignOut,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  updateProfile as fbUpdateProfile
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
let isMock = false;

try {
  if (firebaseConfig.apiKey && typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 5) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    // Verification check - if this fails, we switch to mock mode
    const authInstance = getAuth(app);
    if (!authInstance) throw new Error("Auth initialization failed");
  } else {
    throw new Error("Missing or invalid API Key for Firebase initialization");
  }
} catch (error) {
  console.warn("Axent AI: Firebase Auth restricted or invalid. Using Local-First Storage mode.");
  isMock = true;
  app = { name: "[MOCK_APP]" } as any;
}

// Helper for Mock Auth State
const mockUser = () => {
  try {
    const saved = localStorage.getItem('axent_local_user');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

// Adapt auth functions to current mode
export const onAuthStateChanged = (authObj: any, callback: any) => {
  if (isMock) {
    const check = () => callback(mockUser());
    check(); // Initial check
    const interval = setInterval(check, 1000); // Poll for local storage changes
    return () => clearInterval(interval);
  }
  return fbOnAuthStateChanged(authObj, callback);
};

export const signOut = async (authObj: any) => {
  if (isMock) {
    localStorage.removeItem('axent_local_user');
    window.location.href = '#/';
    return Promise.resolve();
  }
  return fbSignOut(authObj);
};

export const createUserWithEmailAndPassword = async (authObj: any, email: string) => {
  if (isMock) {
    const user = { uid: 'local-' + Date.now(), email };
    localStorage.setItem('axent_local_user', JSON.stringify(user));
    return { user };
  }
  return fbCreateUserWithEmailAndPassword(authObj, email, "dummy-password");
};

export const signInWithEmailAndPassword = async (authObj: any, email: string) => {
  if (isMock) {
    const user = mockUser();
    if (user && user.email === email) return { user };
    throw new Error("Local session not found. Please register.");
  }
  return fbSignInWithEmailAndPassword(authObj, email, "dummy-password");
};

export const updateProfile = async (user: any, profile: any) => {
  if (isMock) {
    const current = mockUser();
    const updated = { ...current, ...profile };
    localStorage.setItem('axent_local_user', JSON.stringify(updated));
    return Promise.resolve();
  }
  return fbUpdateProfile(user, profile);
};

export const auth = isMock ? { currentUser: mockUser() } as any : getAuth(app);
export const db = isMock ? null : getFirestore(app);
export { doc, getDoc, setDoc } from "firebase/firestore";
