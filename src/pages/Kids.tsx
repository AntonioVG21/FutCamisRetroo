import React from 'react';
import { jerseys } from '../data/jerseys';
import JerseyCard from '../components/JerseyCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const Kids = () => {
  // Filtrar solo las camisetas de niños
  const kidsJerseys = jerseys.filter(jersey => jersey.isKids);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Camisetas de Niños</h1>
          <p className="text-gray-300 text-lg">
            Encuentra las mejores camisetas de fútbol para los más pequeños
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {kidsJerseys.map((jersey) => (
            <JerseyCard key={jersey.id} jersey={jersey} />
          ))}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Kids;