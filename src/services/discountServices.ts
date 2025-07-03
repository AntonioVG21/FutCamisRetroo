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
    // Normalizar el código a mayúsculas para evitar problemas de case sensitivity
    const normalizedCode = code.toUpperCase();
    
    const discountRef = doc(db, 'discounts', normalizedCode);
    const discountSnap = await getDoc(discountRef);

    if (discountSnap.exists()) {
      const discountData = discountSnap.data();
      
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
      return {
        isValid: false,
        percentage: 0,
        message: 'Código de descuento no válido',
        code: normalizedCode
      };
    }
  } catch (error) {
    console.error('Error al verificar el código de descuento:', error);
    return {
      isValid: false,
      percentage: 0,
      message: 'Error al verificar el código de descuento',
    };
  }
};

// Función para crear un nuevo código de descuento
// Ahora con uso ilimitado por defecto (maxUses muy alto)
export const createDiscount = async (code: string, percentage: number, maxUses: number = 999999): Promise<boolean> => {
  try {
    // Normalizar el código a mayúsculas
    const normalizedCode = code.toUpperCase();
    
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
    return true;
  } catch (error) {
    console.error('Error al crear el código de descuento:', error);
    return false;
  }
};

// Función para registrar el uso de un código de descuento por un usuario
// Solo registra el uso para estadísticas pero NO limita la reutilización
export const redeemDiscount = async (code: string, userId: string): Promise<boolean> => {
  try {
    // Normalizar el código a mayúsculas
    const normalizedCode = code.toUpperCase();
    
    const discountRef = doc(db, 'discounts', normalizedCode);
    const discountSnap = await getDoc(discountRef);
    
    if (!discountSnap.exists()) {
      return false;
    }
    
    // Actualizar el documento para añadir el usuario a la lista de usados
    // e incrementar el contador de usos (solo para estadísticas)
    // Esto NO impide que el mismo usuario use el código múltiples veces
    await updateDoc(discountRef, {
      usedBy: arrayUnion(userId),
      currentUses: (discountSnap.data().currentUses || 0) + 1
    });
    
    return true;
  } catch (error) {
    console.error('Error al registrar el uso del código de descuento:', error);
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
      { code: 'PROMO15', percentage: 15, maxUses: 999999 }
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
        }
      }
    }
  } catch (error) {
    console.error('Error al configurar los códigos de descuento predeterminados:', error);
  }
};
