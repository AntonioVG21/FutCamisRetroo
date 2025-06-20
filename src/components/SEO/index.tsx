import React from 'react';
import { Helmet } from 'react-helmet-async';
import SchemaData from './SchemaData';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  schemaType?: 'WebSite' | 'Organization' | 'Product' | 'BreadcrumbList';
  schemaData?: any;
  children?: React.ReactNode;
}

/**
 * Componente SEO para optimizar las metaetiquetas en cada página
 * Permite configurar dinámicamente el título, descripción, palabras clave y otras metaetiquetas
 */
const SEO: React.FC<SEOProps> = ({
  title = 'FutCamisRetros | Camisetas Retro de Fútbol Baratas | Tienda Oficial',
  description = 'FutCamisRetros - Tienda oficial especializada en camisetas retro de fútbol baratas. Revive la historia con nuestras camisetas clásicas de todas las épocas. Envíos rápidos y seguros.',
  keywords = 'camisetas retro, camisetas de fútbol, camisetas baratas, camisetas retro de fútbol, camisetas clásicas, camisetas vintage',
  canonicalUrl = 'https://futcamisretros.com',
  ogType = 'website',
  ogImage = '/imagenes/camisetas-web/Logo-removebg-preview.png',
  schemaType = 'WebSite',
  schemaData = {},
  children,
}) => {
  // Construir la URL canónica completa
  const fullCanonicalUrl = canonicalUrl.startsWith('http')
    ? canonicalUrl
    : `https://futcamisretros.com${canonicalUrl}`;

  return (
    <Helmet>
      {/* Metaetiquetas básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Metaetiquetas Open Graph para redes sociales */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={ogImage} />
      
      {/* Metaetiquetas Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Metaetiquetas adicionales para SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="FutCamisRetros" />
      
      {/* Datos estructurados JSON-LD */}
      <SchemaData 
        type={schemaType} 
        data={{
          ...schemaData,
          name: schemaData.name || title.split('|')[0].trim(),
          description: schemaData.description || description,
          url: schemaData.url || fullCanonicalUrl
        }} 
      />
      
      {/* Contenido adicional si es necesario */}
      {children}
    </Helmet>
  );
};

export default SEO;