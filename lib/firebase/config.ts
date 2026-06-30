import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY environment variable. Cannot initialize Firebase.");
}

const firebaseConfig = {
  apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Firebase Env Check:");
console.log("- API_KEY loaded:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? `Yes (${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 4)}...)` : "No");
console.log("- AUTH_DOMAIN loaded:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? `Yes (${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.substring(0, 4)}...)` : "No");
console.log("- PROJECT_ID loaded:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `Yes (${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.substring(0, 4)}...)` : "No");

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
