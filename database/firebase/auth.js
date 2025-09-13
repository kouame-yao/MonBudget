import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseConfigDeve = {
  apiKey: "AIzaSyC48ylCbxbM37NiGi0pZ7lWWdm9VsGq-Rk",
  authDomain: "monbudget-9e5a2.firebaseapp.com",
  projectId: "monbudget-9e5a2",
  storageBucket: "monbudget-9e5a2.firebasestorage.app",
  messagingSenderId: "404451098306",
  appId: "1:404451098306:web:1b38ff170610c736f9c55b"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfigDeve);

// Export Firestore et Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
