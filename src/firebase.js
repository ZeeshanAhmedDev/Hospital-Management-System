// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmY1e82vl3RUfj5EtPhC8Zl5RnXm9NrZg",
  authDomain: "hospital-management-syst-5db87.firebaseapp.com",
  projectId: "hospital-management-syst-5db87",
  storageBucket: "hospital-management-syst-5db87.firebasestorage.app",
  messagingSenderId: "879885060770",
  appId: "1:879885060770:web:e6c172dfb74d6c15ada5fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbRef = getFirestore(app);
export { app, auth, onAuthStateChanged, dbRef };
