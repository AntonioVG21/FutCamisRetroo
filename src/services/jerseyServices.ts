import { db, storage } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Jersey } from '../types';

// Servicios para gestionar las camisetas
export const jerseyServices = {
  // Subir una imagen a Firebase Storage
  uploadImage: async (file: File, jerseyId: string, index: number = 0): Promise<string> => {
    try {
      const storageRef = ref(storage, `jerseys/${jerseyId}/image_${index}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  },

  // Subir múltiples imágenes a Firebase Storage
  uploadMultipleImages: async (files: File[], jerseyId: string): Promise<string[]> => {
    try {
      const uploadPromises = files.map((file, index) => 
        jerseyServices.uploadImage(file, jerseyId, index)
      );
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error al subir múltiples imágenes:', error);
      throw error;
    }
  },

  // Eliminar una imagen de Firebase Storage
  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      // Extraer la ruta del storage de la URL
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  },
  // Obtener todas las camisetas
  getAllJerseys: async () => {
    try {
      const q = query(collection(db, 'jerseys'), orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jersey[];
    } catch (error) {
      console.error('Error al obtener camisetas:', error);
      throw error;
    }
  },

  // Obtener una camiseta por ID
  getJerseyById: async (id: string) => {
    try {
      const docRef = doc(db, 'jerseys', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Jersey;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener camiseta por ID:', error);
      throw error;
    }
  },

  // Crear una nueva camiseta con soporte para múltiples imágenes
  createJersey: async (jersey: Omit<Jersey, 'id'>, imageFiles?: File[]) => {
    try {
      // Generar un ID único basado en el nombre de la camiseta
      const id = jersey.name.toLowerCase().replace(/\s+/g, '-');
      
      // Si hay archivos de imagen, subirlos a Firebase Storage
      if (imageFiles && imageFiles.length > 0) {
        const imageUrls = await jerseyServices.uploadMultipleImages(imageFiles, id);
        
        // Asignar la primera imagen como imagen principal para compatibilidad
        jersey.image = imageUrls[0];
        jersey.images = imageUrls;
      }
      
      const docRef = doc(db, 'jerseys', id);
      await setDoc(docRef, jersey);
      
      return { id, ...jersey };
    } catch (error) {
      console.error('Error al crear camiseta:', error);
      throw error;
    }
  },

  // Actualizar una camiseta existente con soporte para múltiples imágenes
  updateJersey: async (id: string, jersey: Partial<Jersey>, imageFiles?: File[], keepExistingImages: boolean = true) => {
    try {
      // Obtener la camiseta actual para manejar las imágenes
      const currentJersey = await jerseyServices.getJerseyById(id);
      
      // Si hay nuevos archivos de imagen, subirlos a Firebase Storage
      if (imageFiles && imageFiles.length > 0) {
        const newImageUrls = await jerseyServices.uploadMultipleImages(imageFiles, id);
        
        // Determinar cómo manejar las imágenes existentes
        if (keepExistingImages && currentJersey?.images) {
          // Combinar imágenes existentes con nuevas
          jersey.images = [...currentJersey.images, ...newImageUrls];
        } else {
          // Reemplazar con nuevas imágenes
          jersey.images = newImageUrls;
        }
        
        // Actualizar la imagen principal para compatibilidad
        if (newImageUrls.length > 0 && !keepExistingImages) {
          jersey.image = newImageUrls[0];
        }
      }
      
      const docRef = doc(db, 'jerseys', id);
      await updateDoc(docRef, jersey);
      return { id, ...jersey };
    } catch (error) {
      console.error('Error al actualizar camiseta:', error);
      throw error;
    }
  },

  // Eliminar una camiseta y sus imágenes asociadas
  deleteJersey: async (id: string) => {
    try {
      // Obtener la camiseta para eliminar sus imágenes
      const jersey = await jerseyServices.getJerseyById(id);
      
      // Eliminar las imágenes de Firebase Storage
      if (jersey) {
        // Eliminar la imagen principal
        if (jersey.image) {
          try {
            await jerseyServices.deleteImage(jersey.image);
          } catch (error) {
            console.warn('No se pudo eliminar la imagen principal:', error);
          }
        }
        
        // Eliminar las imágenes adicionales
        if (jersey.images && jersey.images.length > 0) {
          const deletePromises = jersey.images.map(imageUrl => 
            jerseyServices.deleteImage(imageUrl).catch(error => 
              console.warn(`No se pudo eliminar la imagen ${imageUrl}:`, error)
            )
          );
          
          await Promise.all(deletePromises);
        }
      }
      
      // Eliminar el documento de Firestore
      const docRef = doc(db, 'jerseys', id);
      await deleteDoc(docRef);
      
      return { id };
    } catch (error) {
      console.error('Error al eliminar camiseta:', error);
      throw error;
    }
  },

  // Obtener camisetas por liga
  getJerseysByLeague: async (league: string) => {
    try {
      const q = query(
        collection(db, 'jerseys'),
        where('league', '==', league),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jersey[];
    } catch (error) {
      console.error(`Error al obtener camisetas de la liga ${league}:`, error);
      throw error;
    }
  },

  // Obtener camisetas por equipo
  getJerseysByTeam: async (team: string) => {
    try {
      const q = query(
        collection(db, 'jerseys'),
        where('team', '==', team),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jersey[];
    } catch (error) {
      console.error(`Error al obtener camisetas del equipo ${team}:`, error);
      throw error;
    }
  },

  // Obtener camisetas destacadas
  getFeaturedJerseys: async () => {
    try {
      const q = query(
        collection(db, 'jerseys'),
        where('isFeatured', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jersey[];
    } catch (error) {
      console.error('Error al obtener camisetas destacadas:', error);
      throw error;
    }
  },

  // Obtener camisetas retro
  getRetroJerseys: async () => {
    try {
      const q = query(
        collection(db, 'jerseys'),
        where('isRetro', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jersey[];
    } catch (error) {
      console.error('Error al obtener camisetas retro:', error);
      throw error;
    }
  },

  // Obtener camisetas para niños
  getKidsJerseys: async () => {
    try {
      const q = query(
        collection(db, 'jerseys'),
        where('isKids', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jersey[];
    } catch (error) {
      console.error('Error al obtener camisetas para niños:', error);
      throw error;
    }
  },

  // Importar camisetas desde un array (útil para migrar datos)
  importJerseys: async (jerseys: Jersey[]) => {
    try {
      const batch = [];
      
      for (const jersey of jerseys) {
        const { id, ...jerseyData } = jersey;
        const docRef = doc(db, 'jerseys', id);
        batch.push(setDoc(docRef, jerseyData));
      }
      
      await Promise.all(batch);
      return { success: true, count: jerseys.length };
    } catch (error) {
      console.error('Error al importar camisetas:', error);
      throw error;
    }
  }
};