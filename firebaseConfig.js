// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBEeCCyKp6F0B0Go8-mgQGhNS7bcrnV2uo",
    authDomain: "technocore-75dfc.firebaseapp.com",
    databaseURL: "https://technocore-75dfc-default-rtdb.firebaseio.com",
    projectId: "technocore-75dfc",
    storageBucket: "technocore-75dfc.firebasestorage.app",
    messagingSenderId: "957710516702",
    appId: "1:957710516702:web:9137d0f18122a9a8419d4f",
    measurementId: "G-MS8HHBZMZ5"
  };
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
