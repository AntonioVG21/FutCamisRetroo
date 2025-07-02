import { db } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';

interface DiscountStatus {
  code: string;
  percentage: number;
}

export const discountServices = {
  // ✅ Verifica si el código existe y devuelve su porcentaje
  checkDiscountStatus: async (
    code: string
  ): Promise<{ isValid: boolean; percentage?: number }> => {
    try {
      const discountRef = doc(db, 'discounts', code);
      const discountSnap = await getDoc(discountRef);

      if (discountSnap.exists()) {
        const discountData = discountSnap.data() as DiscountStatus;
        return {
          isValid: true,
          percentage: discountData.percentage,
        };
      } else {
        return { isValid: false };
      }
    } catch (error) {
      console.error('Error al verificar el código de descuento:', error);
      throw error;
    }
  },

  // ✅ Crea un nuevo código de descuento sin límites
  createDiscount: async (
    code: string,
    percentage: number = 15
  ): Promise<void> => {
    try {
      const discountRef = doc(db, 'discounts', code);
      await setDoc(discountRef, {
        code,
        percentage,
      });
      console.log(`✅ Código "${code}" creado con ${percentage}% de descuento.`);
    } catch (error) {
      console.error('Error al crear el código de descuento:', error);
      throw error;
    }
  },

  // ✅ Configura los códigos predeterminados
  setupDefaultDiscounts: async (): Promise<void> => {
    const defaultCodes = [
      { code: 'LIVERGOL', percentage: 15 },
      { code: 'RAYOOMANN', percentage: 15 },
      { code: 'FRANMORENO', percentage: 15 },
    ];

    for (const discount of defaultCodes) {
      await discountServices.createDiscount(discount.code, discount.percentage);
    }

    console.log('✅ Códigos predeterminados creados o actualizados.');
  }
};
