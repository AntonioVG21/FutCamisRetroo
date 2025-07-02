import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  setDoc
} from 'firebase/firestore';

// Tipos
interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specifications?: string;
  notes?: string;
  isPack?: boolean;
}

interface CustomerData {
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

interface Order {
  customer: CustomerData;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: Date;
}

// Servicios para mensajes de contacto
export const contactServices = {
  // Crear un nuevo mensaje de contacto
  createContactMessage: async (message: ContactMessage) => {
    console.log('Iniciando createContactMessage con:', message);
    try {
      console.log('Obteniendo referencia a la colección contactMessages');
      const collectionRef = collection(db, 'contactMessages');
      console.log('Referencia a la colección obtenida:', collectionRef);
      
      // Crear un ID único para el documento
      const docId = `contact_${Date.now()}`;
      const docRef = doc(db, 'contactMessages', docId);
      
      console.log('Añadiendo documento a Firestore con ID:', docId);
      await setDoc(docRef, {
        ...message,
        createdAt: new Date()
      });
      console.log('Documento añadido con éxito, ID:', docId);
      
      return { id: docId, ...message };
    } catch (error) {
      console.error('Error detallado al crear mensaje de contacto:', error);
      throw error;
    }
  },

  // Obtener todos los mensajes de contacto
  getContactMessages: async () => {
    try {
      const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error('Error al obtener mensajes de contacto:', error);
      throw error;
    }
  },

  // Obtener un mensaje de contacto por ID
  getContactMessageById: async (id: string) => {
    try {
      const docRef = doc(db, 'contactMessages', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate()
        };
      } else {
        throw new Error('No se encontró el mensaje de contacto');
      }
    } catch (error) {
      console.error('Error al obtener mensaje de contacto por ID:', error);
      throw error;
    }
  },

  // Actualizar un mensaje de contacto
  updateContactMessage: async (id: string, message: Partial<ContactMessage>) => {
    try {
      const docRef = doc(db, 'contactMessages', id);
      await updateDoc(docRef, message);
      return { id, ...message };
    } catch (error) {
      console.error('Error al actualizar mensaje de contacto:', error);
      throw error;
    }
  },

  // Eliminar un mensaje de contacto
  deleteContactMessage: async (id: string) => {
    try {
      const docRef = doc(db, 'contactMessages', id);
      await deleteDoc(docRef);
      return { id };
    } catch (error) {
      console.error('Error al eliminar mensaje de contacto:', error);
      throw error;
    }
  }
};

// Servicios para pedidos
// Servicios para análisis de clientes
export const clientAnalyticsServices = {
  // Obtener top clientes por cantidad gastada
  getTopSpenders: async (limit: number = 10) => {
    try {
      const q = query(
        collection(db, 'clients'),
        orderBy('totalSpent', 'desc'),
        limit(limit)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener top spenders:', error);
      throw error;
    }
  },

  // Obtener clientes frecuentes
  getFrequentBuyers: async (minPurchases: number = 3) => {
    try {
      const q = query(
        collection(db, 'clients'),
        where('totalPurchases', '>=', minPurchases),
        orderBy('totalPurchases', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener compradores frecuentes:', error);
      throw error;
    }
  },

  // Obtener estadísticas de uso de códigos de descuento
  getDiscountCodeStats: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'clients'));
      const codeStats: { [key: string]: number } = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.usedDiscountCodes) {
          data.usedDiscountCodes.forEach((code: string) => {
            codeStats[code] = (codeStats[code] || 0) + 1;
          });
        }
      });
      
      return Object.entries(codeStats).map(([code, uses]) => ({
        code,
        uses
      }));
    } catch (error) {
      console.error('Error al obtener estadísticas de códigos de descuento:', error);
      throw error;
    }
  },

  // Obtener preferencias de ligas más populares
  getLeaguePreferences: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'clients'));
      const leagueStats: { [key: string]: number } = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.preferences) {
          Object.entries(data.preferences).forEach(([league, isPreferred]) => {
            if (isPreferred) {
              leagueStats[league] = (leagueStats[league] || 0) + 1;
            }
          });
        }
      });
      
      return Object.entries(leagueStats).map(([league, count]) => ({
        league,
        count
      }));
    } catch (error) {
      console.error('Error al obtener preferencias de ligas:', error);
      throw error;
    }
  }
};

export const orderServices = {
  // Crear un nuevo pedido y actualizar estadísticas del cliente
  createOrder: async (order: Order) => {
    try {
      // Buscar cliente existente
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef, where('email', '==', order.customer.email));
      const clientSnapshot = await getDocs(q);
      
      let clientData;
      if (clientSnapshot.empty) {
        // Crear nuevo cliente
        const newClientRef = await addDoc(clientsRef, {
          email: order.customer.email,
          name: order.customer.name,
          phone: order.customer.phone,
          address: order.customer.address,
          city: order.customer.city,
          postalCode: order.customer.postalCode,
          leagues: order.customer.leagues,
          firstPurchaseDate: new Date(),
          lastPurchaseDate: new Date(),
          totalPurchases: 1,
          totalSpent: order.total,
          usedDiscountCodes: order.discountCodes || [],
          preferences: order.customer.leagues
        });
        clientData = { id: newClientRef.id };
      } else {
        // Actualizar cliente existente
        const clientDoc = clientSnapshot.docs[0];
        const existingData = clientDoc.data();
        await updateDoc(clientDoc.ref, {
          lastPurchaseDate: new Date(),
          totalPurchases: (existingData.totalPurchases || 0) + 1,
          totalSpent: (existingData.totalSpent || 0) + order.total,
          usedDiscountCodes: [...(existingData.usedDiscountCodes || []), ...(order.discountCodes || [])],
          preferences: order.customer.leagues
        });
        clientData = { id: clientDoc.id };
      }

      // Crear el pedido con referencia al cliente
      const docRef = await addDoc(collection(db, 'orders'), {
        ...order,
        createdAt: new Date(),
        clientId: clientData.id
      });
      return { id: docRef.id, ...order };
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  },

  // Obtener todos los pedidos
  getOrders: async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },

  // Obtener un pedido por ID
  getOrderById: async (id: string) => {
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      throw error;
    }
  },

  // Actualizar el estado de un pedido
  updateOrderStatus: async (id: string, status: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status });
      return { id, status };
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      throw error;
    }
  },

  // Obtener pedidos por estado
  getOrdersByStatus: async (status: Order['status']) => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error(`Error al obtener pedidos con estado ${status}:`, error);
      throw error;
    }
  },

  // Obtener pedidos por cliente (email)
  getOrdersByCustomerEmail: async (email: string) => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('customer.email', '==', email),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error(`Error al obtener pedidos del cliente ${email}:`, error);
      throw error;
    }
  },

  // Actualizar los detalles de pago de un pedido
  updateOrderPaymentDetails: async (id: string, paymentDetails: any) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { paymentDetails });
      return { id, paymentDetails };
    } catch (error) {
      console.error('Error al actualizar detalles de pago del pedido:', error);
      throw error;
    }
  }
};