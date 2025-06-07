import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

interface DiscountStore {
  discountPercentage: number;
  isDiscountActive: boolean;
  activateDiscount: (percentage: number) => void;
  removeDiscount: () => void;
}

export const useDiscountStore = create<DiscountStore>()(
  persist(
    (set) => ({
      discountPercentage: 0,
      isDiscountActive: false,
      activateDiscount: (percentage) => {
        set({
          discountPercentage: percentage,
          isDiscountActive: true,
        });
        toast.success(`¡Descuento del ${percentage}% aplicado!`);
      },
      removeDiscount: () => {
        set({
          discountPercentage: 0,
          isDiscountActive: false,
        });
      },
    }),
    {
      name: 'discount-storage',
    }
  )
);