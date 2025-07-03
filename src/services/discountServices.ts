import { db } from '../lib/firebase';
import { collection, getDocs, query, where, doc, setDoc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

export interface DiscountStatus {
  isValid: boolean;
  percentage: number;
  message: string;
  code?: string;
  usedBy?: string[];
  maxUses?: number; // Ahora se usa solo para estadísticas
  currentUses?: number; // Ahora se usa solo para estadísticas
  isActive?: boolean;
}

// Función para verificar si un código de descuento es válido
export const checkDiscountStatus = async (code: string): Promise<DiscountStatus> => {
  try {
    // Validar entrada
    if (!code || typeof code !== 'string') {
      console.error('Código de descuento inválido:', code);
      return {
        isValid: false,
        percentage: 0,
        message: 'Código de descuento inválido',
      };
    }

    // Normalizar el código a mayúsculas para evitar problemas de case sensitivity
    const normalizedCode = code.toUpperCase();
    console.log('Verificando código de descuento:', normalizedCode);
    
    // Verificar conexión a Firestore
    if (!db) {
      console.error('Error: Firestore no está inicializado correctamente');
      return {
        isValid: false,
        percentage: 0,
        message: 'Error de conexión con el servidor',
      };
    }
    
    // Intentar obtener el documento
    const discountRef = doc(db, 'discounts', normalizedCode);
    console.log('Obteniendo referencia a documento:', `discounts/${normalizedCode}`);
    
    let discountSnap;
    try {
      discountSnap = await getDoc(discountRef);
    } catch (fetchError) {
      console.error('Error al obtener documento de Firestore:', fetchError);
      return {
        isValid: false,
        percentage: 0,
        message: 'Error al conectar con la base de datos',
      };
    }

    // Verificar si el documento existe
    if (discountSnap.exists()) {
      const discountData = discountSnap.data();
      console.log('Datos del descuento obtenidos:', JSON.stringify(discountData));
      
      // Verificar si el descuento está activo
      if (!discountData.isActive) {
        return {
          isValid: false,
          percentage: 0,
          message: 'Este código de descuento ya no está activo.',
          code: normalizedCode
        };
      }
      
      // IMPORTANTE: No verificamos el límite de usos para permitir uso ilimitado
      // Los códigos pueden usarse múltiples veces por cualquier usuario
      
      return {
        isValid: true,
        percentage: discountData.percentage || 0,
        message: 'Código de descuento aplicado correctamente',
        code: normalizedCode,
        usedBy: discountData.usedBy || [],
        maxUses: discountData.maxUses,
        currentUses: discountData.currentUses || 0,
        isActive: discountData.isActive
      };
    } else {
      console.log('El código de descuento no existe:', normalizedCode);
      return {
        isValid: false,
        percentage: 0,
        message: 'Código de descuento no válido',
        code: normalizedCode
      };
    }
  } catch (error) {
    console.error('Error al verificar el código de descuento:', error);
    // Información detallada del error para depuración
    if (error instanceof Error) {
      console.error('Detalles del error:', error.message, error.stack);
    }
    return {
      isValid: false,
      percentage: 0,
      message: 'Error al verificar el código de descuento. Por favor, inténtalo de nuevo.',
    };
  }
};

// Función para crear un nuevo código de descuento
// Ahora con uso ilimitado por defecto (maxUses muy alto)
export const createDiscount = async (code: string, percentage: number, maxUses: number = 999999): Promise<boolean> => {
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
};

// Función para registrar el uso de un código de descuento por un usuario
// Solo registra el uso para estadísticas pero NO limita la reutilización
export const redeemDiscount = async (code: string, userId: string): Promise<boolean> => {
  try {
    // Validar entrada
    if (!code || typeof code !== 'string' || !userId) {
      console.error('Parámetros inválidos - código:', code, 'userId:', userId);
      return false;
    }

    // Normalizar el código a mayúsculas
    const normalizedCode = code.toUpperCase();
    console.log('Registrando uso de código de descuento:', normalizedCode, 'para usuario:', userId);
    
    // Verificar conexión a Firestore
    if (!db) {
      console.error('Error: Firestore no está inicializado correctamente');
      return false;
    }
    
    const discountRef = doc(db, 'discounts', normalizedCode);
    
    let discountSnap;
    try {
      discountSnap = await getDoc(discountRef);
    } catch (fetchError) {
      console.error('Error al obtener documento de Firestore:', fetchError);
      return false;
    }
    
    if (!discountSnap.exists()) {
      console.log('El código de descuento no existe:', normalizedCode);
      return false;
    }
    
    // Actualizar el documento para añadir el usuario a la lista de usados
    // e incrementar el contador de usos (solo para estadísticas)
    // Esto NO impide que el mismo usuario use el código múltiples veces
    try {
      await updateDoc(discountRef, {
        usedBy: arrayUnion(userId),
        currentUses: (discountSnap.data().currentUses || 0) + 1
      });
      console.log('Uso de código registrado exitosamente');
      return true;
    } catch (updateError) {
      console.error('Error al actualizar documento en Firestore:', updateError);
      return false;
    }
  } catch (error) {
    console.error('Error al registrar el uso del código de descuento:', error);
    // Información detallada del error para depuración
    if (error instanceof Error) {
      console.error('Detalles del error:', error.message, error.stack);
    }
    return false;
  }
};

// Función para configurar códigos de descuento predeterminados
export const setupDefaultDiscounts = async (): Promise<void> => {
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
        }
      }
    }
  } catch (error) {
    console.error('Error al configurar los códigos de descuento predeterminados:', error);
  }
};
