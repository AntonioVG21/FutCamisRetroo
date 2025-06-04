export interface CustomerData {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  leagues: {
    retro: boolean;
    selecciones: boolean;
    premierLeague: boolean;
    laLiga: boolean;
    serieA: boolean;
    bundesliga: boolean;
    ligue1: boolean;
  };
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isPack?: boolean;
  specifications?: string;
  unwantedKits?: string;
}

export interface Order {
  id: string;
  customer: CustomerData;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: Date;
  paymentDetails?: {
    paymentMethod: string;
    paymentId?: string;
    paymentStatus?: string;
    reference?: string;
    timestamp?: Date;
  };
}