// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcBnpUKkXZ_Jh7zD33OfIMr5ssMINFGHo",
  authDomain: "hospital-marketing-6dfc3.firebaseapp.com",
  projectId: "hospital-marketing-6dfc3",
  storageBucket: "hospital-marketing-6dfc3.firebasestorage.app",
  messagingSenderId: "69558315735",
  appId: "1:69558315735:web:d03e7ee56480ca89d09e92"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
