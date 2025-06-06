// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqJ6K4nj9mQqY_m7kHQGOoYxqKwvZuqt8",
  authDomain: "tiendaoficial-b1a87.firebaseapp.com",
  projectId: "tiendaoficial-b1a87",
  storageBucket: "tiendaoficial-b1a87.appspot.com",
  messagingSenderId: "1098332036175",
  appId: "1:1098332036175:web:c3a04b7d8e8e9d7c4e4e4e"
};

console.log('Inicializando Firebase...');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

console.log('Firebase inicializado correctamente');

export { app, db, storage, auth };
export default app;