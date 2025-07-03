// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAm00tZ3sBgdxXpYRnCgmVhFLlKZ-X0C4k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "futcamisretros-b2413.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://futcamisretros-b2413-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "futcamisretros-b2413",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "futcamisretros-b2413.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "917265355922",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:917265355922:web:650947024c0efa3a78424b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C45EQ17CFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (may not work in some environments like SSR)
let analytics = null;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch(e => {
  console.error('Error al inicializar Firebase Analytics:', e);
});

// Initialize Firestore
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Log initialization status
console.log('Firebase inicializado correctamente con proyecto:', firebaseConfig.projectId);

// Add error handling for Firestore operations
const handleFirestoreError = (error) => {
  console.error('Error en operación de Firestore:', error);
  if (error.code === 'permission-denied') {
    console.error('Error de permisos en Firestore. Verifica las reglas de seguridad.');
  }
  return error;
};

// Export the Firebase services
export { app, db, storage, auth };
export default app;