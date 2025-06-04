export interface League {
  id: string;
  name: string;
  icon: string;
  isRetro?: boolean;
  teams?: string[];
}

export interface Jersey {
  id: string;
  name: string;
  team: string;
  league: string;
  price: number;
  image: string; // Mantener para compatibilidad con código existente
  images?: string[]; // Array de URLs de imágenes
  isRetro?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  discount?: number;
  isKids?: boolean;
  description?: string;
  customization?: {
    name: string;
    number: string;
    price: number;
  };
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  jerseyCount: number;
  freeJerseys?: number;
  image: string;
  specifications?: string;
  notes?: string;
  isPack?: boolean;
  type?: 'promesa' | 'profesional' | 'icono';
}