// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED, PersistenceSettings } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqJ6K4nj9mQqY_m7kHQGOoYxqKwvZuqt8",
  authDomain: "tiendaoficial-b1a87.firebaseapp.com",
  projectId: "tiendaoficial-b1a87",
  storageBucket: "tiendaoficial-b1a87.appspot.com",
  messagingSenderId: "1098332036175",
  appId: "1:1098332036175:web:c3a04b7d8e8e9d7c4e4e4e",
  measurementId: "G-XXXXXXXXXX"
};

console.log('Inicializando Firebase con configuración:', firebaseConfig);

// Declare variables outside the try-catch block
let app;
let db;
let storage;
let auth;
let analytics = null;

try {
  console.log('Intentando inicializar Firebase app...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase app inicializado correctamente');

  // Initialize Firestore with optimized settings
  console.log('Inicializando Firestore con configuración optimizada...');
  db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    experimentalForceLongPolling: true,  // Enable long polling as fallback
    experimentalAutoDetectLongPolling: true,
    ignoreUndefinedProperties: true,
  });
  console.log('Firestore inicializado correctamente con configuración optimizada');
  
  storage = getStorage(app);
  auth = getAuth(app);
  
  // Solo inicializar Analytics si estamos en un navegador
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }

} catch (error) {
  console.error('Error al inicializar Firebase:', error);
}

export { app, db, storage, auth, analytics };
export default app;