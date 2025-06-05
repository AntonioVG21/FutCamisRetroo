import React, { useState } from 'react';
import { jerseys } from '../data/jerseys';
import { leagues } from '../data/leagues';
import JerseyCard from '../components/JerseyCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { FiSearch } from 'react-icons/fi';

import { useParams } from 'react-router-dom';

interface RouteParams {
  leagueId: string;
}

const LeaguePage: React.FC = () => {
  const { leagueId } = useParams<RouteParams>();
  // Encontrar la liga actual
  const currentLeague = leagues.find(league => league.id === leagueId);
  
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filtrar camisetas por liga
  const leagueJerseys = jerseys.filter(jersey => jersey.league === leagueId);

  // Filtrar por término de búsqueda
  const filteredJerseys = searchTerm.trim() === '' 
    ? leagueJerseys 
    : leagueJerseys.filter(jersey => 
        jersey.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        jersey.team.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (!currentLeague) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Liga no encontrada</h2>
            <p className="text-gray-400 mb-8">La liga que buscas no está disponible.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg"
            >
              Volver
            </button>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {currentLeague.isRetro ? 'Camisetas Retro' : currentLeague.name}
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            {currentLeague.isRetro
              ? 'Revive la historia del fútbol con nuestras camisetas retro'
              : `Descubre las mejores camisetas de ${currentLeague.name}`}
          </p>
          
          {/* Buscador */}
          <div className="mb-8 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-3">Buscar camisetas</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por equipo o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pl-10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid de camisetas */}
        <div className={`grid grid-cols-2 ${currentLeague.isRetro ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-8`}>
          {filteredJerseys.map((jersey) => (
            <JerseyCard key={jersey.id} jersey={jersey} />
          ))}
        </div>

        {filteredJerseys.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No hay camisetas disponibles con los filtros seleccionados.</p>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LeaguePage;