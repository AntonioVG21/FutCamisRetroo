/**
 * Configuración para la optimización de imágenes
 */

export const IMAGE_CONFIG = {
  // Tamaños predefinidos para diferentes tipos de imágenes
  sizes: {
    thumbnail: {
      width: 100,
      height: 100,
    },
    small: {
      width: 300,
      height: 300,
    },
    medium: {
      width: 600,
      height: 600,
    },
    large: {
      width: 1200,
      height: 1200,
    },
  },
  
  // Formatos de imagen preferidos
  formats: ['webp', 'avif', 'jpg'],
  
  // Calidad de imagen por defecto
  defaultQuality: 80,
  
  // Número máximo de imágenes a precargar
  maxPreloadImages: 10,
  
  // Tiempo de caché para imágenes (en segundos)
  cacheDuration: 60 * 60 * 24 * 7, // 7 días
  
  // Estrategia de carga de imágenes
  loadingStrategy: {
    // Imágenes que se cargarán con prioridad alta (eager)
    highPriority: ['hero', 'featured', 'detail'],
    
    // Imágenes que se cargarán con prioridad baja (lazy)
    lowPriority: ['thumbnail', 'card', 'related'],
  },
  
  // Configuración para el efecto blur-up
  blurUp: {
    enabled: true,
    quality: 10,
    size: 20,
  },
};

/**
 * Determina si una imagen debe cargarse con prioridad alta
 * @param imageType Tipo de imagen
 * @returns true si la imagen debe cargarse con prioridad alta
 */
export const shouldLoadWithHighPriority = (imageType: string): boolean => {
  return IMAGE_CONFIG.loadingStrategy.highPriority.includes(imageType);
};

/**
 * Obtiene el tamaño óptimo para una imagen según su tipo
 * @param imageType Tipo de imagen
 * @returns Objeto con ancho y alto óptimos
 */
export const getOptimalImageSize = (imageType: 'thumbnail' | 'small' | 'medium' | 'large') => {
  return IMAGE_CONFIG.sizes[imageType] || IMAGE_CONFIG.sizes.medium;
};