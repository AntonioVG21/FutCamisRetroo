import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCartStore } from '../store/cartStore';
import OptimizedImage from './OptimizedImage';
import { jerseyServices } from '../services/jerseyServices';
import { Jersey } from '../types';
import { jerseys as localJerseys } from '../data/jerseys';

const FeaturedJerseys: React.FC = () => {
  const [featuredJerseys, setFeaturedJerseys] = useState<Jersey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  // Cargar camisetas destacadas desde Firebase
  useEffect(() => {
    const loadFeaturedJerseys = async () => {
      try {
        setLoading(true);
        // Intentar cargar camisetas retro desde Firebase
        const retroJerseys = await jerseyServices.getRetroJerseys();
        
        if (retroJerseys && retroJerseys.length > 0) {
          // Tomar las primeras 4 camisetas retro
          setFeaturedJerseys(retroJerseys.slice(0, 4));
          console.log('Camisetas retro cargadas desde Firebase:', retroJerseys.length);
        } else {
          // Si no hay camisetas en Firebase, usar datos locales como fallback
          console.log('No se encontraron camisetas en Firebase, usando datos locales');
          const localFeatured = localJerseys.filter(jersey => jersey.isRetro).slice(0, 4);
          setFeaturedJerseys(localFeatured);
        }
      } catch (err) {
        console.error('Error al cargar camisetas destacadas:', err);
        setError('No se pudieron cargar las camisetas destacadas');
        // Usar datos locales como fallback en caso de error
        const localFeatured = localJerseys.filter(jersey => jersey.isRetro).slice(0, 4);
        setFeaturedJerseys(localFeatured);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedJerseys();
  }, []);

  const handleAddToCart = (jersey: Jersey) => {
    addItem({
      id: jersey.id,
      name: jersey.name,
      price: jersey.price,
      image: jersey.image,
      quantity: 1
    });
  };

  return (
    <section className="py-16 bg-gray-800">
      <div className="w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            CAMISETAS <span className="text-yellow-500">RETRO DESTACADAS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Revive la historia con nuestras camisetas retro de fútbol más icónicas a precios increíbles
          </p>
          <p className="text-gray-500 max-w-3xl mx-auto mt-4">
            Encuentra las mejores camisetas clásicas de tus equipos favoritos. Calidad premium a precios baratos.
          </p>
        </div>
        
        {loading ? (
          // Mostrar indicador de carga mientras se cargan las camisetas
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          // Mostrar mensaje de error si hay algún problema
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-full transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          // Mostrar las camisetas destacadas
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {featuredJerseys.map((jersey) => (
              <div 
                key={jersey.id} 
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              >
                <a href={`/jersey/${jersey.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    <OptimizedImage 
                      src={jersey.image} 
                      alt={jersey.name} 
                      className="group-hover:scale-110"
                      priority="low"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                    {jersey.isRetro && (
                      <div className="bg-yellow-500 text-black font-bold py-1 px-3 rounded-full text-xs uppercase">
                        Retro
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isFavorite(jersey.id)) {
                          removeFavorite(jersey.id);
                        } else {
                          addFavorite({
                            id: jersey.id,
                            name: jersey.name,
                            price: jersey.price,
                            image: jersey.image,
                            team: jersey.team
                          });
                        }
                      }}
                      className={`rounded-full p-2 transition-colors ${isFavorite(jersey.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                      <FiHeart className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  </div>
                </a>
                <div className="p-4">
                  <a href={`/jersey/${jersey.id}`} className="block hover:opacity-80 transition-opacity">
                    <h3 className="text-white font-semibold text-lg mb-1 truncate">{jersey.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{jersey.team}</p>
                  </a>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-500 font-bold text-xl">{jersey.price.toFixed(2)} €</span>
                    <button 
                      onClick={() => handleAddToCart(jersey)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-full p-2 transition-colors"
                    >
                      <FiShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a 
            href="/catalog" 
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-colors"
          >
            Ver Catálogo Completo
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJerseys;