import React from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const Favorites: React.FC = () => {
  const { items, removeFavorite } = useFavoritesStore();
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mis Favoritos</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-6">No tienes camisetas favoritas guardadas</p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-colors"
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div 
                  className="relative aspect-square cursor-pointer"
                  onClick={() => navigate(`/jersey/${item.id}`)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-1 truncate">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{item.team}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-500 font-bold text-xl">{item.price.toFixed(2)} €</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => removeFavorite(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-full p-2 transition-colors"
                      >
                        <FiShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Favorites;