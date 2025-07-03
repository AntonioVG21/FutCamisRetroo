// Script para ejecutar la función setupDefaultDiscounts

// Importamos las funciones necesarias de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
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

// Ya importamos las funciones de Firestore al principio del archivo

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
    await setDoc(discountRef, {
      code: normalizedCode,
      percentage,
      usedBy: [],
      maxUses, // Valor muy alto para simular uso ilimitado
      currentUses: 0,
      isActive: true,
      createdAt: Timestamp.now()
    });
    
    console.log('Código de descuento creado exitosamente:', normalizedCode);
    return true;
  } catch (error) {
    console.error('Error al crear el código de descuento:', error);
    // Información detallada del error para depuración
    if (error instanceof Error) {
      console.error('Detalles del error:', error.message, error.stack);
    }
    return false;
  }
}

// Función para configurar códigos de descuento predeterminados
async function setupDefaultDiscounts() {
  try {
    // Códigos de descuento predeterminados con uso ilimitado (maxUses muy alto)
    const defaultDiscounts = [
      { code: 'BIENVENIDO10', percentage: 10, maxUses: 999999 },
      { code: 'VERANO20', percentage: 20, maxUses: 999999 },
      { code: 'PROMO15', percentage: 15, maxUses: 999999 },
      // Nuevos códigos de descuento del 15%
      { code: 'CLAUDITA12', percentage: 15, maxUses: 999999 },
      { code: 'LIVERGOL', percentage: 15, maxUses: 999999 },
      { code: 'FRANMORENO', percentage: 15, maxUses: 999999 },
      { code: 'CHIQUITIN', percentage: 15, maxUses: 999999 },
      { code: 'LIGAIBEROS', percentage: 15, maxUses: 999999 },
      { code: 'RAYOOMANN', percentage: 15, maxUses: 999999 }
    ];

    // Crear cada código de descuento si no existe
    for (const discount of defaultDiscounts) {
      const discountRef = doc(db, 'discounts', discount.code);
      const discountSnap = await getDoc(discountRef);

      if (!discountSnap.exists()) {
        await createDiscount(discount.code, discount.percentage, discount.maxUses);
        console.log(`Código de descuento ${discount.code} creado con éxito`);
      } else {
        // Actualizar códigos existentes para asegurarse de que estén activos y tengan uso ilimitado
        const discountData = discountSnap.data();
        if (!discountData.isActive || discountData.maxUses < 999999) {
          await updateDoc(discountRef, {
            isActive: true,
            maxUses: 999999
          });
          console.log(`Código de descuento ${discount.code} actualizado a uso ilimitado`);
        } else {
          console.log(`Código de descuento ${discount.code} ya existe y está activo`);
        }
      }
    }
    console.log('Configuración de códigos de descuento completada');
  } catch (error) {
    console.error('Error al configurar los códigos de descuento predeterminados:', error);
  }
}

// Ejecutar la función
setupDefaultDiscounts()
  .then(() => {
    console.log('Proceso completado con éxito');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error en el proceso:', error);
    process.exit(1);
  });