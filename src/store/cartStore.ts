import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isPack?: boolean;
  specifications?: string;
  notes?: string;
  jerseyCount?: number;
  freeJerseys?: number;
  description?: string;
  customization?: {
    name: string;
    number: string;
    price: number;
  };
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  updateSpecifications: (id: string, specifications: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,
      addItem: (item) => {
        try {
          console.log('Adding item to cart:', item);
          const items = get().items;
          const existingItem = items.find((i) => i.id === item.id);

          if (existingItem) {
            console.log('Updating existing item quantity');
            set({
              items: items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              total: get().total + item.price,
            });
          } else {
            console.log('Adding new item to cart');
            set({
              items: [...items, { ...item, quantity: 1 }],
              total: get().total + item.price,
            });
          }
          console.log('Updated cart state:', get().items);
          toast.success('Producto añadido al carrito');
          // No abrir automáticamente el carrito al añadir productos
          // set({ isOpen: true });
        } catch (error) {
          console.error('Error in addItem:', error);
          toast.error('Error al añadir el producto al carrito');
        }
      },
      removeItem: (id) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        if (item) {
          set({
            items: items.filter((i) => i.id !== id),
            total: get().total - (item.price * item.quantity),
          });
          toast.success('Producto eliminado del carrito');
        }
      },
      updateQuantity: (id, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        if (item) {
          const priceDiff = item.price * (quantity - item.quantity);
          set({
            items: items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
            total: get().total + priceDiff,
          });
        }
      },
      updateNotes: (id, notes) => {
        const items = get().items;
        set({
          items: items.map((i) =>
            i.id === id ? { ...i, notes } : i
          ),
        });
      },
      updateSpecifications: (id, specifications) => {
        const items = get().items;
        set({
          items: items.map((i) =>
            i.id === id ? { ...i, specifications } : i
          ),
        });
      },
      clearCart: () => set({ items: [], total: 0 }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        total: state.total,
      }),
    }
  )
);