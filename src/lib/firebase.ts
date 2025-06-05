// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED, PersistenceSettings } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm00tZ3sBgdxXpYRnCgmVhFLlKZ-X0C4k",
  authDomain: "futcamisretros-b2413.firebaseapp.com",
  projectId: "futcamisretros-b2413",
  storageBucket: "futcamisretros-b2413.appspot.com",
  messagingSenderId: "917265355922",
  appId: "1:917265355922:web:650947024c0efa3a78424b",
  measurementId: "G-C45EQ17CFC"
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
    // Desactivar long polling y volver a WebSockets para resolver el error de SID
    experimentalForceLongPolling: false,
    experimentalAutoDetectLongPolling: true,
    ignoreUndefinedProperties: true, // Ignorar propiedades indefinidas
  });
  console.log('Firestore inicializado correctamente con configuración optimizada');
  
  // Comentamos la persistencia temporalmente para resolver problemas de conexión
  // enableIndexedDbPersistence(db)
  //   .then(() => {
  //     console.log('Persistencia de Firestore habilitada correctamente');
  //   })
  //   .catch((err) => {
  //     if (err.code === 'failed-precondition') {
  //       console.warn('La persistencia de Firestore no pudo ser habilitada porque múltiples pestañas están abiertas');
  //     } else if (err.code === 'unimplemented') {
  //       console.warn('El navegador actual no soporta todas las características necesarias para la persistencia');
  //     } else {
  //       console.error('Error al habilitar persistencia:', err);
  //     }
  //   });

  console.log('Inicializando Storage...');
  storage = getStorage(app);
  console.log('Storage inicializado correctamente');

  console.log('Inicializando Auth...');
  auth = getAuth(app);
  console.log('Auth inicializado correctamente');

  // Inicializar analytics solo en el navegador (no en SSR)
  if (typeof window !== 'undefined') {
    console.log('Inicializando Analytics...');
    analytics = getAnalytics(app);
    console.log('Analytics inicializado correctamente');
  }
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
}

// Export the Firebase services
export { db, storage, auth, analytics };
export default app;