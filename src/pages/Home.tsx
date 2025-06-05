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
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    document.title = 'FUTShirts - Camisetas de Fútbol';
  }, []);
  
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