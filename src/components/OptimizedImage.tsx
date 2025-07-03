import React, { useState, useEffect } from 'react';
import { IMAGE_CONFIG } from '../config/imageConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { optimizeImageUrl } from '../utils/imageOptimization';
import { getOptimizedImagePath, getWebPPath, supportsWebP } from '../utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderClassName?: string;
  priority?: 'high' | 'low';
  onLoad?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  placeholderClassName = '',
  priority = 'low',
  onLoad,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState('');
  const [imageSrc, setImageSrc] = useState<string>('');

  // Cargar la imagen desde la mejor fuente disponible
  useEffect(() => {
    const loadImage = async () => {
      try {
        // Verificar si la URL es una ruta de Firebase Storage
        if (src.startsWith('gs://') || src.includes('firebasestorage.googleapis.com')) {
          // Es una URL de Firebase Storage, obtener la URL de descarga
          const storageRef = ref(storage, src);
          const url = await getDownloadURL(storageRef);
          console.log('Imagen cargada desde Firebase URL:', url);
          setImageSrc(url);
          return;
        } 
        
        // Para rutas locales, usar la estrategia de optimización
        if (src.startsWith('/')) {
          // Primero intentar con la ruta optimizada
          try {
            const optimizedPath = getOptimizedImagePath(src);
            console.log('Intentando cargar versión optimizada:', optimizedPath);
            
            // Verificar si el navegador soporta WebP
            const webpSupported = await supportsWebP();
            
            if (webpSupported && !src.includes('.svg')) {
              // Usar la versión WebP si está disponible
              const webpPath = getWebPPath(optimizedPath);
              console.log('Intentando versión WebP:', webpPath);
              
              // Verificar si la imagen WebP existe
              const webpImg = new Image();
              webpImg.src = webpPath;
              
              // Esperar a que la imagen cargue o falle
              await new Promise((resolve) => {
                webpImg.onload = () => {
                  console.log('WebP cargado correctamente');
                  setImageSrc(webpPath);
                  resolve(true);
                };
                webpImg.onerror = () => {
                  console.log('Error al cargar WebP, intentando JPG');
                  resolve(false);
                };
              });
              
              if (imageSrc) return; // Si se estableció la imagen WebP, terminar
            }
            
            // Si WebP falló o no es soportado, intentar con JPG optimizado
            console.log('Usando versión JPG optimizada:', optimizedPath);
            setImageSrc(optimizedPath);
          } catch (optimizationError) {
            console.warn('Error al procesar imagen optimizada:', optimizationError);
            // Si falla la optimización, usar la URL original
            console.log('Usando URL original:', src);
            setImageSrc(src);
          }
          return;
        }
        
        // Para otras rutas, intentar cargar desde Firebase
        try {
          const storageRef = ref(storage, src);
          const url = await getDownloadURL(storageRef);
          console.log('Imagen cargada desde Firebase:', url);
          setImageSrc(url);
        } catch (storageError) {
          console.warn('Error al cargar desde Firebase Storage:', storageError);
          // Si falla, usar la URL original
          setImageSrc(src);
        }
      } catch (error) {
        console.error('Error al procesar la imagen:', error);
        setImageError(true);
        // En caso de error, usar la URL original
        setImageSrc(src);
      }
    };

    loadImage();
  }, [src]);

  // Crear una versión de baja resolución para el efecto blur-up
  useEffect(() => {
    if (IMAGE_CONFIG.blurUp.enabled) {
      // En un entorno real, aquí generaríamos una versión de baja resolución de la imagen
      // Para este ejemplo, usamos un SVG simple como placeholder
      setBlurDataUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23333"/></svg>');
    }
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const currentSrc = img.src;
    console.error('Error al cargar la imagen:', currentSrc);
    
    if (!imageError) {
      // Intentar diferentes estrategias de fallback
      
      // Estrategia 1: Si es WebP, intentar con JPG
      if (currentSrc.endsWith('.webp')) {
        const jpgSrc = currentSrc.replace('.webp', '.jpg');
        console.log('Intentando cargar versión JPG:', jpgSrc);
        img.src = jpgSrc;
        return;
      }
      
      // Estrategia 2: Si es una imagen optimizada, intentar con la original
      if (currentSrc.includes('/imagenes/optimized/')) {
        const originalSrc = currentSrc.replace('/imagenes/optimized/', '/imagenes/camisetas-web/');
        console.log('Intentando cargar versión original:', originalSrc);
        img.src = originalSrc;
        return;
      }
      
      // Estrategia 3: Si es una ruta local, intentar cargar desde Firebase
      if (currentSrc.startsWith('/')) {
        try {
          const storagePath = currentSrc.startsWith('/') ? currentSrc.substring(1) : currentSrc;
          console.log('Intentando cargar desde Firebase:', storagePath);
          // No podemos usar async/await aquí, así que usamos una promesa
          getDownloadURL(ref(storage, storagePath))
            .then(url => {
              img.src = url;
            })
            .catch(error => {
              console.error('Error al cargar desde Firebase:', error);
              
              // Intentar con una ruta alternativa en Firebase
              const altPath = `images${currentSrc}`;
              console.log('Intentando ruta alternativa en Firebase:', altPath);
              getDownloadURL(ref(storage, altPath))
                .then(url => {
                  img.src = url;
                })
                .catch(altError => {
                  console.error('Error al cargar ruta alternativa:', altError);
                  // Si todo falla, mostrar un placeholder
                  setImageError(true);
                  img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666" stroke="%23fff" stroke-width="0.5"><path d="M20 4L16 4 14 2 10 2 8 4 4 4 2 8 4 22 20 22 22 8 20 4zM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" /></svg>';
                });
            });
          return;
        } catch (error) {
          console.error('Error al intentar cargar desde Firebase:', error);
        }
      }
      
      // Estrategia 4: Intentar con una versión sin optimizar
      if (currentSrc.includes('/optimized/')) {
        const nonOptimizedSrc = currentSrc.replace('/optimized/', '/');
        console.log('Intentando cargar versión sin optimizar:', nonOptimizedSrc);
        img.src = nonOptimizedSrc;
        return;
      }
      
      // Si todas las estrategias fallan, mostrar un placeholder
      setImageError(true);
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666" stroke="%23fff" stroke-width="0.5"><path d="M20 4L16 4 14 2 10 2 8 4 4 4 2 8 4 22 20 22 22 8 20 4zM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" /></svg>';
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Placeholder de baja resolución */}
      {!imageLoaded && !imageError && blurDataUrl && (
        <div 
          className={`absolute inset-0 bg-cover bg-center blur-sm transition-opacity duration-500 ${placeholderClassName}`}
          style={{
            backgroundImage: `url(${blurDataUrl})`,
            opacity: imageLoaded ? 0 : 1,
          }}
        />
      )}
      
      {/* Loading spinner */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {imageSrc && (
        <img 
          src={imageSrc} 
          alt={alt} 
          className={`w-full h-full object-cover transition-all duration-500 ${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority === 'high' ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority === 'high' ? 'high' : 'low'}
          width={width}
          height={height}
          style={{
            transform: imageLoaded ? 'none' : 'scale(1.05)',
            transition: 'transform 0.5s ease, opacity 0.5s ease',
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;