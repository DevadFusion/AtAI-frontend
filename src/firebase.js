import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBvkf8hxk84fabKW8hFbnDVqiXTYGPtYh4",
    authDomain: "atai-14440.firebaseapp.com",
    projectId: "atai-14440",
    storageBucket: "atai-14440.firebasestorage.app",
    messagingSenderId: "455962452620",
    appId: "1:455962452620:web:a06c3975c459d843b291a9",
    measurementId: "G-8QMNVKBDRZ"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export default {firebaseApp, db};