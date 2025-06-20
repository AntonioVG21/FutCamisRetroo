import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import LeagueBlocks from '../components/LeagueBlocks';
import FeaturedJerseys from '../components/FeaturedJerseys';
import SurprisePacks from '../components/SurprisePacks';
import AboutSection from '../components/About';
import WhatsAppButton from '../components/WhatsAppButton';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();
  
  // Ya no necesitamos este efecto porque el título se maneja con el componente SEO
  // React.useEffect(() => {
  //   document.title = 'FUTShirts - Camisetas de Fútbol';
  // }, []);
  
  // Función para manejar los clics en el logo y mostrar el panel de administración
  const handleLogoClick = () => {
    // Usamos clickCount explícitamente para que ESLint no lo marque como no utilizado
    console.log(`Contador actual: ${clickCount}`);
    
    setClickCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount === 5) {
        toast.success('Accediendo al panel de administración', { duration: 2000 });
        setTimeout(() => navigate('/secret-admin'), 500);
        return 0;
      }
      return newCount;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 w-full overflow-x-hidden">
      <SEO 
        title="FutCamisRetros | Camisetas Retro de Fútbol Baratas | Tienda Oficial"
        description="Tienda oficial de camisetas retro de fútbol baratas. Encuentra las mejores camisetas clásicas de todas las ligas y épocas. Envíos rápidos y seguros a toda España."
        keywords="camisetas retro, camisetas de fútbol, camisetas baratas, camisetas retro de fútbol, camisetas clásicas, camisetas vintage, camisetas de equipos históricos, camisetas de fútbol baratas"
        canonicalUrl="/"
        schemaType="WebSite"
        schemaData={{
          name: "FutCamisRetros",
          url: "https://futcamisretros.com",
          description: "Tienda oficial especializada en camisetas retro de fútbol baratas. Revive la historia con nuestras camisetas clásicas de todas las épocas."
        }}
      />
      <SEO 
        schemaType="Organization"
        schemaData={{
          name: "FutCamisRetros",
          url: "https://futcamisretros.com",
          logo: "/imagenes/camisetas-web/Logo-removebg-preview.png",
          description: "Tienda oficial especializada en camisetas retro de fútbol baratas",
          telephone: "+34 640 660 362",
          email: "futcamisretros@gmail.com"
        }}
      />
      <Header onLogoClick={handleLogoClick} />
      <main className="flex-grow pt-16 w-full">
        <Hero />
        <LeagueBlocks />
        <FeaturedJerseys />
        <SurprisePacks />
        <AboutSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;