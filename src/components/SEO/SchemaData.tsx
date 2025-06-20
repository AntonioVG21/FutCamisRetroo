import React from 'react';

interface SchemaOrgProps {
  type: 'WebSite' | 'Organization' | 'Product' | 'BreadcrumbList';
  data: any;
}

/**
 * Componente para generar datos estructurados JSON-LD para SEO
 * Ayuda a los motores de búsqueda a entender mejor el contenido del sitio
 */
const SchemaData: React.FC<SchemaOrgProps> = ({ type, data }) => {
  let schemaData = {};

  switch (type) {
    case 'WebSite':
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.name || 'FutCamisRetros',
        url: data.url || 'https://futcamisretros.com',
        description: data.description || 'Tienda oficial especializada en camisetas retro de fútbol baratas',
        potentialAction: {
          '@type': 'SearchAction',
          'target': `${data.url || 'https://futcamisretros.com'}/catalog?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };
      break;

    case 'Organization':
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name || 'FutCamisRetros',
        url: data.url || 'https://futcamisretros.com',
        logo: data.logo || 'https://futcamisretros.com/imagenes/camisetas-web/Logo-removebg-preview.png',
        description: data.description || 'Tienda oficial especializada en camisetas retro de fútbol baratas',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: data.telephone || '+34 640 660 362',
          contactType: 'customer service',
          email: data.email || 'futcamisretros@gmail.com'
        },
        sameAs: [
          'https://www.instagram.com/futcamisretros/',
          'https://www.tiktok.com/@futcamisretro_esp'
        ]
      };
      break;

    case 'Product':
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        image: data.image,
        description: data.description,
        brand: {
          '@type': 'Brand',
          name: data.brand || 'FutCamisRetros'
        },
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: data.currency || 'EUR',
          availability: data.availability || 'https://schema.org/InStock',
          url: data.url
        }
      };
      break;

    case 'BreadcrumbList':
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.itemListElement || []
      };
      break;

    default:
      break;
  }

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default SchemaData;