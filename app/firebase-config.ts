import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCBmnTkUDTJ2z3p7fCr2NpSqX6xtdeXZX4",
	authDomain: "blog-ai-app-b67c8.firebaseapp.com",
	projectId: "blog-ai-app-b67c8",
	storageBucket: "blog-ai-app-b67c8.appspot.com",
	messagingSenderId: "629328967681",
	appId: "1:629328967681:web:7e89dcad35bdc7fa612800",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
