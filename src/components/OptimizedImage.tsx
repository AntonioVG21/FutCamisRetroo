import React, { useState, useEffect } from 'react';
import { IMAGE_CONFIG } from '../config/imageConfig';

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
    if (!imageError) {
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
      
      <img 
        src={src} 
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
    </div>
  );
};

export default OptimizedImage;