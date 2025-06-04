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
}

// Servicios para gestionar descuentos
export const discountServices = {
  // Verificar si un código de descuento ya ha sido canjeado
  checkDiscountStatus: async (code: string): Promise<boolean> => {
    try {
      const discountRef = doc(db, 'discounts', code);
      const discountSnap = await getDoc(discountRef);
      
      if (discountSnap.exists()) {
        const discountData = discountSnap.data() as DiscountStatus;
        return discountData.isRedeemed;
      } else {
        // Si el documento no existe, el descuento no ha sido canjeado
        return false;
      }
    } catch (error) {
      console.error('Error al verificar estado del descuento:', error);
      throw error;
    }
  },

  // Marcar un código de descuento como canjeado
  redeemDiscount: async (code: string): Promise<void> => {
    try {
      const discountRef = doc(db, 'discounts', code);
      const discountSnap = await getDoc(discountRef);
      
      if (discountSnap.exists()) {
        // Si ya existe, actualizar el estado
        await updateDoc(discountRef, {
          isRedeemed: true,
          redeemedAt: Timestamp.now()
        });
      } else {
        // Si no existe, crear un nuevo documento
        await setDoc(discountRef, {
          code,
          isRedeemed: true,
          redeemedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error al canjear descuento:', error);
      throw error;
    }
  }
};