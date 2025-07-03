/**
 * Utilidad para depurar problemas de conexión con Firebase
 */

import { db } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

/**
 * Verifica la conexión a Firebase y muestra información de depuración
 */
export const checkFirebaseConnection = async (): Promise<boolean> => {
  console.log('Verificando conexión a Firebase...');
  
  // Verificar que las variables de entorno estén cargadas
  const firebaseEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];
  
  console.log('Variables de entorno de Firebase:');
  for (const envVar of firebaseEnvVars) {
    const value = import.meta.env[envVar];
    console.log(`${envVar}: ${value ? '✅ Definida' : '❌ No definida'}`);
  }
  
  // Verificar que Firestore esté inicializado
  if (!db) {
    console.error('❌ Error: Firestore no está inicializado');
    return false;
  }
  
  try {
    // Intentar realizar una consulta simple a Firestore
    console.log('Intentando consultar la colección "discounts"...');
    const discountsRef = collection(db, 'discounts');
    const q = query(discountsRef, limit(1));
    const querySnapshot = await getDocs(q);
    
    console.log(`✅ Conexión exitosa. Documentos encontrados: ${querySnapshot.size}`);
    
    // Si hay documentos, mostrar información del primero (sin datos sensibles)
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      console.log('Ejemplo de documento:', {
        id: doc.id,
        exists: doc.exists(),
        fields: Object.keys(doc.data()),
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con Firestore:', error);
    if (error instanceof Error) {
      console.error('Detalles del error:', error.message, error.stack);
    }
    return false;
  }
};

/**
 * Verifica específicamente la colección de descuentos
 */
export const checkDiscountsCollection = async (): Promise<boolean> => {
  console.log('Verificando colección de descuentos...');
  
  if (!db) {
    console.error('❌ Error: Firestore no está inicializado');
    return false;
  }
  
  try {
    const discountsRef = collection(db, 'discounts');
    const querySnapshot = await getDocs(discountsRef);
    
    console.log(`✅ Consulta exitosa. Códigos de descuento encontrados: ${querySnapshot.size}`);
    
    // Mostrar información básica de los códigos (sin mostrar el código completo)
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Código: ${doc.id.substring(0, 2)}*** (${data.isActive ? 'Activo' : 'Inactivo'}) - ${data.percentage}%`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error al consultar códigos de descuento:', error);
    if (error instanceof Error) {
      console.error('Detalles del error:', error.message, error.stack);
    }
    return false;
  }
};