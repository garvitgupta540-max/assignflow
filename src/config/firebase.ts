import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD5cFNQPMiJo-RKKdTznYTQIjWd3vnzv6E",
  authDomain: "assignment-35a5c.firebaseapp.com",
  projectId: "assignment-35a5c",
  storageBucket: "assignment-35a5c.firebasestorage.app",
  messagingSenderId: "244108460793",
  appId: "1:244108460793:web:e55a680f8a6611e4029828",
  measurementId: "G-M43DCLTN29"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally
export const analyticsPromise = isSupported().then(supported => {
  return supported ? getAnalytics(app) : null;
});
