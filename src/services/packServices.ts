import { db, storage } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Pack } from '../types';

// Colección de packs en Firestore
const PACKS_COLLECTION = 'packs';

// Función para generar un ID único
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Servicio para manejar operaciones con packs
export const packServices = {
  // Obtener todos los packs
  getAllPacks: async (): Promise<Pack[]> => {
    try {
      const packsCollection = collection(db, PACKS_COLLECTION);
      const packsSnapshot = await getDocs(packsCollection);
      const packsList = packsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Pack[];
      return packsList;
    } catch (error) {
      console.error('Error al obtener packs:', error);
      throw error;
    }
  },

  // Obtener un pack por ID
  getPackById: async (id: string): Promise<Pack | null> => {
    try {
      const packDoc = doc(db, PACKS_COLLECTION, id);
      const packSnapshot = await getDoc(packDoc);
      
      if (packSnapshot.exists()) {
        return {
          id: packSnapshot.id,
          ...packSnapshot.data()
        } as Pack;
      }
      
      return null;
    } catch (error) {
      console.error(`Error al obtener pack con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo pack
  createPack: async (pack: Pack, imageFile: File | null): Promise<Pack> => {
    try {
      let imageUrl = pack.image;
      
      // Si hay un archivo de imagen, subirlo a Storage
      if (imageFile) {
        const storageRef = ref(storage, `packs/${pack.id || generateUniqueId()}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      // Crear el documento en Firestore
      const packData = {
        ...pack,
        image: imageUrl
      };
      
      // Si el pack tiene un ID personalizado, usarlo
      if (pack.id) {
        await updateDoc(doc(db, PACKS_COLLECTION, pack.id), packData);
        return { ...packData, id: pack.id };
      } else {
        const docRef = await addDoc(collection(db, PACKS_COLLECTION), packData);
        return { ...packData, id: docRef.id };
      }
    } catch (error) {
      console.error('Error al crear pack:', error);
      throw error;
    }
  },

  // Actualizar un pack existente
  updatePack: async (id: string, packData: Partial<Pack>, imageFile: File | null): Promise<void> => {
    try {
      const packRef = doc(db, PACKS_COLLECTION, id);
      
      // Si hay un archivo de imagen, subirlo a Storage
      if (imageFile) {
        const storageRef = ref(storage, `packs/${id}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        packData.image = imageUrl;
      }
      
      await updateDoc(packRef, packData);
    } catch (error) {
      console.error(`Error al actualizar pack con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un pack
  deletePack: async (id: string): Promise<void> => {
    try {
      // Eliminar la imagen de Storage si existe
      try {
        const storageRef = ref(storage, `packs/${id}`);
        await deleteObject(storageRef);
      } catch {
        // Si la imagen no existe, ignorar el error
        console.log('No se encontró imagen para eliminar o ya fue eliminada');
      }
      
      // Eliminar el documento de Firestore
      await deleteDoc(doc(db, PACKS_COLLECTION, id));
    } catch (error) {
      console.error(`Error al eliminar pack con ID ${id}:`, error);
      throw error;
    }
  },

  // Importar packs desde un archivo local
  importPacks: async (packs: Pack[]): Promise<void> => {
    try {
      const batch = writeBatch(db);
      
      packs.forEach(pack => {
        const packRef = doc(db, PACKS_COLLECTION, pack.id);
        batch.set(packRef, pack);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error al importar packs:', error);
      throw error;
    }
  }
};