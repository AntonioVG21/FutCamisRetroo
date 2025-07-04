import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JerseyCard from '../components/JerseyCard';
import WhatsAppButton from '../components/WhatsAppButton';
import { jerseys } from '../data/jerseys';
import { leagues } from '../data/leagues';
import { FiShield, FiAward, FiSearch } from 'react-icons/fi';

const PRODUCTS_PER_PAGE = 12;

const Catalog: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    document.title = 'Catálogo - FUTShirts';
  }, []);


  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedLeague, sortOption, searchTerm]);


  const filteredJerseys = jerseys.filter(jersey => {
    const matchesLeague = selectedLeague ? jersey.league === selectedLeague : true;
    const matchesSearch = searchTerm.trim() === '' ? true : 
      jersey.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      jersey.team.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesLeague && matchesSearch;
  });

  const sortedJerseys = [...filteredJerseys].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedJerseys.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = startIdx + PRODUCTS_PER_PAGE;
  const paginatedJerseys = sortedJerseys.slice(startIdx, endIdx);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {selectedLeague ? leagues.find(l => l.id === selectedLeague)?.name : 'Todas las Camisetas'}
            </h1>
            <p className="text-gray-400">
              {sortedJerseys.length} productos encontrados
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-4 relative">
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
          
          {/* Filters and Sorting */}
          <div className="mb-8 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto md:max-h-none md:overflow-visible">
              <button 
                onClick={() => setSelectedLeague(null)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedLeague === null 
                    ? 'bg-yellow-500 text-black font-semibold' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Todas
              </button>
              {leagues.map((league) => (
                <button 
                  key={league.id}
                  onClick={() => setSelectedLeague(league.id)}
                  className={`px-4 py-2 rounded-full text-sm flex items-center ${
                    selectedLeague === league.id 
                      ? 'bg-yellow-500 text-black font-semibold' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {league.isRetro ? (
                    <FiAward className="h-4 w-4 mr-1" />
                  ) : (
                    <FiShield className="h-4 w-4 mr-1" />
                  )}
                  {league.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center">
              <label htmlFor="sort" className="text-white mr-2">Ordenar por:</label>
              <select 
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="default">Destacados</option>
                <option value="price-asc">Precio (menor a mayor)</option>
                <option value="price-desc">Precio (mayor a menor)</option>
                <option value="name-asc">Nombre (A-Z)</option>
                <option value="name-desc">Nombre (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {paginatedJerseys.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedJerseys.map((jersey) => (
                  <JerseyCard key={jersey.id} jersey={jersey} />
                ))}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center mt-8 gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-yellow-500 hover:text-black'}`}
                    aria-label="Página anterior"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === i + 1 ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-800 text-white hover:bg-yellow-500 hover:text-black'}`}
                      aria-label={`Página ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-yellow-500 hover:text-black'}`}
                    aria-label="Página siguiente"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-white text-xl">No se encontraron camisetas para esta liga.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Catalog;