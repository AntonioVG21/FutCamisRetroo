/**
 * Utilidades para la optimización de imágenes
 */

/**
 * Precarga un conjunto de imágenes para mejorar el rendimiento
 * @param imageUrls Array de URLs de imágenes a precargar
 */
export const preloadImages = (imageUrls: string[]): void => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

  // Si el navegador soporta Service Worker y está registrado
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Enviar mensaje al Service Worker para precargar imágenes
    navigator.serviceWorker.controller.postMessage({
      type: 'PRECACHE_IMAGES',
      imageUrls,
    });
  }

  // Precargar imágenes usando el método tradicional como respaldo
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

/**
 * Genera una versión de baja resolución de una imagen para usar como placeholder
 * @param imageUrl URL de la imagen original
 * @returns URL de la imagen de baja resolución
 */
export const generateLowResPlaceholder = (imageUrl: string): string => {
  // En un entorno real, esto podría generar una versión de baja resolución
  // Para este ejemplo, usamos un SVG simple como placeholder
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23333"/></svg>';
};

/**
 * Registra el Service Worker para la optimización de imágenes
 */
export const registerImageOptimizationServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado con éxito:', registration.scope);
    } catch (error) {
      console.error('Error al registrar el Service Worker:', error);
    }
  }
};

/**
 * Optimiza una URL de imagen para mejorar el rendimiento
 * @param imageUrl URL de la imagen original
 * @returns URL optimizada
 */
export const optimizeImageUrl = (imageUrl: string): string => {
  // En un entorno real, aquí podrías añadir parámetros para un servicio de optimización de imágenes
  // como Cloudinary, Imgix, etc.
  return imageUrl;
};

/**
 * Precarga las imágenes de las camisetas más populares
 * @param jerseys Array de camisetas
 */
export const preloadPopularJerseyImages = (jerseys: any[]): void => {
  if (!Array.isArray(jerseys) || jerseys.length === 0) return;

  // Obtener las URLs de las imágenes de las camisetas destacadas o populares
  const popularJerseyImages = jerseys
    .filter(jersey => jersey.isRetro || jersey.isFeatured || jersey.isNew)
    .map(jersey => jersey.image);

  // Precargar estas imágenes
  preloadImages(popularJerseyImages);
};