// Script para añadir el código de descuento ONEPITT_

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

// Leemos la configuración de Firebase desde el archivo .env
dotenv.config();

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para crear un nuevo código de descuento
async function createDiscount(code, percentage, maxUses = 999999) {
  try {
    // Validar entrada
    if (!code || typeof code !== 'string') {
      console.error('Código de descuento inválido:', code);
      return false;
    }
    
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      console.error('Porcentaje de descuento inválido:', percentage);
      return false;
    }

    // Normalizar el código a mayúsculas
    const normalizedCode = code.toUpperCase();
    console.log('Creando código de descuento:', normalizedCode, 'con porcentaje:', percentage);
    
    // Verificar conexión a Firestore
    if (!db) {
      console.error('Error: Firestore no está inicializado correctamente');
      return false;
    }
    
    const discountRef = doc(db, 'discounts', normalizedCode);
    
    // Verificar si ya existe
    const discountSnap = await getDoc(discountRef);
    
    if (discountSnap.exists()) {
      console.log(`El código ${normalizedCode} ya existe. Actualizando...`);
      await updateDoc(discountRef, {
        percentage,
        maxUses,
        isActive: true,
        updatedAt: Timestamp.now()
      });
      console.log(`Código de descuento ${normalizedCode} actualizado con éxito`);
    } else {
      // Crear nuevo código
      await setDoc(discountRef, {
        code: normalizedCode,
        percentage,
        usedBy: [],
        maxUses,
        currentUses: 0,
        isActive: true,
        createdAt: Timestamp.now()
      });
      console.log(`Código de descuento ${normalizedCode} creado con éxito`);
    }
    
    return true;
  } catch (error) {
    console.error('Error al crear/actualizar el código de descuento:', error);
    if (error instanceof Error) {
      console.error('Detalles del error:', error.message, error.stack);
    }
    return false;
  }
}

// Ejecutar la creación del código ONEPITT_
createDiscount('ONEPITT_', 15, 999999)
  .then(result => {
    if (result) {
      console.log('Proceso completado con éxito');
    } else {
      console.error('Error en el proceso');
    }
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Error inesperado:', error);
    process.exit(1);
  });