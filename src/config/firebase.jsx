import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA9zS3QQWFsjAEx2ltKIQCnWMussbneDO0",
  authDomain: "social-media-d2e82.firebaseapp.com",
  projectId: "social-media-d2e82",
  storageBucket: "social-media-d2e82.appspot.com",
  messagingSenderId: "471831645761",
  appId: "1:471831645761:web:ee0add5194559acb73c0c0",
  measurementId: "G-EEPNT131M0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 
export const db = getFirestore(app);
export const storage = getStorage(app);