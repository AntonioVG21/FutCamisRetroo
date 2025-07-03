import React, { useState } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import { FiShoppingCart, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import OptimizedImage from '../components/OptimizedImage';
import toast from 'react-hot-toast';

// Definir las tallas disponibles
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

const Favorites: React.FC = () => {
  const { items, removeFavorite } = useFavoritesStore();
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  
  // Estado para manejar la selección de talla para cada producto
  const [selectedSizes, setSelectedSizes] = useState<{[key: string]: string}>({});
  // Estado para manejar el modal de selección de talla
  const [showSizeModal, setShowSizeModal] = useState<string | null>(null);

  // Manejar la selección de talla
  const handleSelectSize = (itemId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }));
  };

  // Abrir el modal de selección de talla
  const openSizeModal = (itemId: string) => {
    setShowSizeModal(itemId);
  };

  // Cerrar el modal de selección de talla
  const closeSizeModal = () => {
    setShowSizeModal(null);
  };

  // Añadir al carrito con la talla seleccionada
  const handleAddToCart = (item: typeof items[0]) => {
    const selectedSize = selectedSizes[item.id];
    
    if (!selectedSize) {
      // Si no hay talla seleccionada, mostrar el modal
      openSizeModal(item.id);
      return;
    }
    
    addItem({
      id: item.id,
      name: `${item.name} (${selectedSize})`,
      price: item.price,
      image: item.image,
      quantity: 1
    });
    
    toast.success(`${item.name} añadido al carrito`);
  };
  
  // Eliminar de favoritos con confirmación
  const handleRemoveFavorite = (itemId: string, itemName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar ${itemName} de tus favoritos?`)) {
      removeFavorite(itemId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 mt-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mis Camisetas Favoritas</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl shadow-lg">
            <p className="text-gray-400 text-xl mb-6">No tienes camisetas favoritas guardadas</p>
            <p className="text-gray-500 mb-8">Añade camisetas a tus favoritos para verlas aquí</p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative aspect-square">
                    <OptimizedImage 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <button
                        onClick={() => navigate(`/jersey/${item.id}`)}
                        className="bg-white text-gray-900 rounded-full p-3 mx-2 transform hover:scale-110 transition-transform"
                        title="Ver detalles"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-lg mb-1 truncate">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.team}</p>
                    
                    {/* Selección de talla */}
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">Talla: {selectedSizes[item.id] || 'No seleccionada'}</p>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSelectSize(item.id, size)}
                            className={`px-2 py-1 text-xs font-semibold rounded ${selectedSizes[item.id] === size ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-500 font-bold text-xl">{item.price.toFixed(2)} €</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemoveFavorite(item.id, item.name)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 transition-colors"
                          title="Eliminar de favoritos"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg p-2 transition-colors flex-grow px-4 flex items-center justify-center"
                          title="Añadir al carrito"
                        >
                          <FiShoppingCart className="h-5 w-5 mr-2" />
                          <span>Añadir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Modal de selección de talla */}
            {showSizeModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Selecciona una talla</h3>
                    <button 
                      onClick={closeSizeModal}
                      className="text-gray-400 hover:text-white"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <p className="text-gray-400 mb-4">Por favor, selecciona una talla antes de añadir al carrito.</p>
                  
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          handleSelectSize(showSizeModal, size);
                          const item = items.find(i => i.id === showSizeModal);
                          if (item) {
                            addItem({
                              id: item.id,
                              name: `${item.name} (${size})`,
                              price: item.price,
                              image: item.image,
                              quantity: 1
                            });
                            toast.success(`${item.name} añadido al carrito`);
                          }
                          closeSizeModal();
                        }}
                        className="py-2 rounded-lg font-semibold transition-colors bg-gray-700 text-white hover:bg-yellow-500 hover:text-black"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={closeSizeModal}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Favorites;