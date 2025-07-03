/**
 * Utilidades para el manejo de imágenes
 */

/**
 * Obtiene la ruta optimizada para una imagen
 * @param imagePath Ruta original de la imagen
 * @returns Ruta optimizada
 */
export const getOptimizedImagePath = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Si ya es una ruta optimizada, devolverla tal cual
  if (imagePath.includes('/imagenes/optimized/')) {
    return imagePath;
  }
  
  // Convertir rutas de camisetas-web a optimized
  if (imagePath.includes('/imagenes/camisetas-web/')) {
    // Extraer el nombre del archivo de la ruta
    const fileName = imagePath.split('/').pop();
    if (fileName) {
      return `/imagenes/optimized/${fileName}`;
    }
  }
  
  // Para otras rutas de imágenes, intentar usar la versión optimizada
  if (imagePath.startsWith('/imagenes/')) {
    const fileName = imagePath.split('/').pop();
    if (fileName) {
      return `/imagenes/optimized/${fileName}`;
    }
  }
  
  // Si no se puede optimizar, devolver la ruta original
  return imagePath;
};

/**
 * Obtiene la ruta WebP para una imagen
 * @param imagePath Ruta original de la imagen
 * @returns Ruta WebP
 */
export const getWebPPath = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Si ya es una ruta WebP, devolverla tal cual
  if (imagePath.endsWith('.webp')) {
    return imagePath;
  }
  
  // Convertir a WebP
  return imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
};

/**
 * Verifica si el navegador soporta WebP
 * @returns Promise que se resuelve a true si el navegador soporta WebP
 */
export const supportsWebP = async (): Promise<boolean> => {
  if (!window.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
};

/**
 * Obtiene la mejor ruta de imagen disponible según las capacidades del navegador
 * @param imagePath Ruta original de la imagen
 * @returns Promise que se resuelve a la mejor ruta disponible
 */
export const getBestImagePath = async (imagePath: string): Promise<string> => {
  if (!imagePath) return '';
  
  const optimizedPath = getOptimizedImagePath(imagePath);
  
  // Verificar si el navegador soporta WebP
  const webpSupported = await supportsWebP();
  
  if (webpSupported) {
    return getWebPPath(optimizedPath);
  }
  
  return optimizedPath;
};