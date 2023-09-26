import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCBmnTkUDTJ2z3p7fCr2NpSqX6xtdeXZX4",
	authDomain: "blog-ai-app-b67c8.firebaseapp.com",
	projectId: "blog-ai-app-b67c8",
	storageBucket: "blog-ai-app-b67c8.appspot.com",
	messagingSenderId: "629328967681",
	appId: "1:629328967681:web:7e89dcad35bdc7fa612800",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage(app)

export { app, db, auth, storage }
