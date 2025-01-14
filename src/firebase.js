// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBvAO6vvvGmKHjEM_K6mgvANMTPEtyernE",
    authDomain: "linguasphere-e056b.firebaseapp.com",
    projectId: "linguasphere-e056b",
    storageBucket: "linguasphere-e056b.firebasestorage.app",
    messagingSenderId: "873926621961",
    appId: "1:873926621961:web:2375a8dbd61af967f3b1d8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;