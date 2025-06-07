// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm00tZ3sBgdxXpYRnCgmVhFLlKZ-X0C4k",
  authDomain: "futcamisretros-b2413.firebaseapp.com",
  databaseURL: "https://futcamisretros-b2413-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "futcamisretros-b2413",
  storageBucket: "futcamisretros-b2413.firebasestorage.app",
  messagingSenderId: "917265355922",
  appId: "1:917265355922:web:650947024c0efa3a78424b",
  measurementId: "G-C45EQ17CFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

console.log('Firebase inicializado correctamente');

// Export the Firebase services
export { app, db, storage, auth };
export default app;