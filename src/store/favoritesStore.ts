import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  team: string;
}

interface FavoritesStore {
  items: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (item) => {
        const items = get().items;
        if (!items.some(i => i.id === item.id)) {
          set({ items: [...items, item] });
          toast.success('Añadido a favoritos');
        }
      },
      removeFavorite: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
        toast.success('Eliminado de favoritos');
      },
      isFavorite: (id) => {
        return get().items.some(item => item.id === id);
      }
    }),
    {
      name: 'favorites-storage',
    }
  )
);