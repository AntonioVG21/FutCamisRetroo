import { db } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';

interface DiscountStatus {
  code: string;
  isRedeemed: boolean;
  redeemedAt?: Timestamp;
  percentage: number;
  maxUses?: number;
  currentUses: number;
}

// Servicios para gestionar descuentos
export const discountServices = {
  // Verificar si un código de descuento ya ha sido canjeado
  checkDiscountStatus: async (code: string): Promise<{ isValid: boolean; percentage?: number }> => {
    try {
      const discountRef = doc(db, 'discounts', code);
      const discountSnap = await getDoc(discountRef);
      
      if (discountSnap.exists()) {
        const discountData = discountSnap.data() as DiscountStatus;
        const isValid = !discountData.isRedeemed && 
          (!discountData.maxUses || discountData.currentUses < discountData.maxUses);
        return {
          isValid,
          percentage: isValid ? discountData.percentage : undefined
        };
      } else {
        return { isValid: false };
      }
    } catch (error) {
      console.error('Error al verificar estado del descuento:', error);
      throw error;
    }
  },

  // Marcar un código de descuento como canjeado
  createDiscount: async (code: string, percentage: number = 15, maxUses?: number): Promise<void> => {
    try {
      const discountRef = doc(db, 'discounts', code);
      await setDoc(discountRef, {
        code,
        isRedeemed: false,
        percentage,
        maxUses,
        currentUses: 0,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al crear descuento:', error);
      throw error;
    }
  },

  redeemDiscount: async (code: string): Promise<void> => {
    try {
      const discountRef = doc(db, 'discounts', code);
      const discountSnap = await getDoc(discountRef);
      
      if (discountSnap.exists()) {
        // Si ya existe, actualizar el estado
        const discountData = discountSnap.data() as DiscountStatus;
        await updateDoc(discountRef, {
          currentUses: discountData.currentUses + 1,
          isRedeemed: !discountData.maxUses || discountData.currentUses + 1 >= discountData.maxUses,
          redeemedAt: Timestamp.now()
        });
      } else {
        // Si no existe, crear un nuevo documento
        throw new Error('El código de descuento no existe');
      }
    } catch (error) {
      console.error('Error al canjear descuento:', error);
      throw error;
    }
  }
};