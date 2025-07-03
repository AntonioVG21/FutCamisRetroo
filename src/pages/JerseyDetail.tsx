import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { FiShoppingCart, FiHeart, FiTruck, FiPackage } from 'react-icons/fi';
import { GiShirt } from 'react-icons/gi';
import { TbRuler } from 'react-icons/tb';
import { AiOutlineNumber } from 'react-icons/ai';
import { BsTypeH1 } from 'react-icons/bs';
import { useParams, useNavigate } from 'react-router-dom';
import { jerseys } from '../data/jerseys';
import toast from 'react-hot-toast';
import OptimizedImage from '../components/OptimizedImage';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

const CUSTOMIZATION_PRICE = 2.50;

interface RouteParams {
  jerseyId: string;
}

const JerseyDetail: React.FC = () => {
  const { jerseyId } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const addToCart = useCartStore((state) => state.addItem);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const jersey = jerseys.find(j => j.id === jerseyId);
  
  // Verificar si la camiseta está en favoritos
  const isInFavorites = jersey ? isFavorite(jersey.id) : false;

  // Establecer el título y metaetiquetas de la página
  useEffect(() => {
    if (jersey) {
      // Establecer el título
      document.title = `${jersey.name} | FutCamisRetros`;
      
      // Establecer metaetiquetas
      const metaDescription = document.querySelector('meta[name="description"]');
      const description = `Camiseta ${jersey.name} de ${jersey.team}. Calidad premium y envío rápido. Compra ahora en FutCamisRetros.`;
      
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [jersey]);

  if (!jersey) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Camiseta no encontrada</h2>
            <p className="text-gray-400 mb-8">La camiseta que buscas no está disponible.</p>
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('¡Debes seleccionar una talla antes de añadir al carrito!');
      return;
    }

    const finalPrice = isCustomizing ? jersey.price + CUSTOMIZATION_PRICE : jersey.price;
    const customization = isCustomizing ? {
      name: customName,
      number: customNumber,
      price: CUSTOMIZATION_PRICE
    } : undefined;

    let productName = `${jersey.name} (${selectedSize})`;
    if (isCustomizing) {
      productName += ` - ${customName} ${customNumber}`;
    }

    addToCart({
      id: jerseyId,
      name: productName,
      price: finalPrice,
      quantity: 1,
      image: jersey.image,
      customization
    });
  };
  
  // Manejar la adición o eliminación de favoritos
  const handleToggleFavorite = () => {
    if (!jersey) return;
    
    if (isInFavorites) {
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
  };
  
  // Navegar a la página de favoritos
  const goToFavorites = () => {
    navigate('/favorites');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            {/* Image Section */}
            <div className="relative aspect-square">
              <OptimizedImage 
                src={jersey.image} 
                alt={jersey.name}
                className="rounded-lg"
                priority="high"
                width={600}
                height={600}
              />
              <button 
                onClick={handleToggleFavorite}
                className={`absolute top-4 right-4 ${isInFavorites ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-full p-2 transition-colors duration-300`}
              >
                <FiHeart className="h-6 w-6" />
              </button>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{jersey.name}</h1>
                <p className="text-gray-400">{jersey.team}</p>
              </div>

              <div>
                <span className="text-3xl font-bold text-yellow-500">{jersey.price.toFixed(2)} €</span>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Descripción</h3>
                <p className="text-gray-400">{jersey.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Talla</h3>
                  <button 
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2"
                  >
                    <TbRuler className="h-4 w-4" />
                    Guía de tallas
                  </button>
                </div>

                {showSizeGuide && (
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Guía de Tallas</h4>
                    <table className="w-full text-sm text-gray-300">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-2">Talla</th>
                          <th className="py-2">Pecho (cm)</th>
                          <th className="py-2">Largo (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 text-center">S</td>
                          <td className="py-2 text-center">96-101</td>
                          <td className="py-2 text-center">71</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-center">M</td>
                          <td className="py-2 text-center">101-106</td>
                          <td className="py-2 text-center">73</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-center">L</td>
                          <td className="py-2 text-center">106-111</td>
                          <td className="py-2 text-center">75</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-center">XL</td>
                          <td className="py-2 text-center">111-116</td>
                          <td className="py-2 text-center">77</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-center">XXL</td>
                          <td className="py-2 text-center">116-121</td>
                          <td className="py-2 text-center">79</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-lg font-semibold transition-colors ${
                        selectedSize === size
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-800 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Personalización</h3>
                  <button 
                    onClick={() => setIsCustomizing(!isCustomizing)}
                    className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2"
                  >
                    <GiShirt className="h-4 w-4" />
                    {isCustomizing ? 'Cancelar personalización' : 'Personalizar camiseta'}
                  </button>
                </div>

                {isCustomizing && (
                  <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
                    <div className="space-y-2">
                      <label className="text-white text-sm flex items-center gap-2">
                        <BsTypeH1 className="h-4 w-4" />
                        Nombre en la camiseta
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                        maxLength={20}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Ej: MESSI"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-white text-sm flex items-center gap-2">
                        <AiOutlineNumber className="h-4 w-4" />
                        Número
                      </label>
                      <input
                        type="text"
                        value={customNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 2) {
                            setCustomNumber(value);
                          }
                        }}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Ej: 10"
                      />
                    </div>

                    <div className="text-yellow-500 text-sm">
                      Precio de personalización: +{CUSTOMIZATION_PRICE.toFixed(2)}€
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-400">
                  <FiPackage className="h-5 w-5" />
                  <span>Envío gratuito en pedidos superiores a 50€</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <FiTruck className="h-5 w-5" />
                  <span>Entrega estimada: 3-5 días laborables</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xl font-bold text-white mb-4">
                  Precio total: {(jersey.price + (isCustomizing ? CUSTOMIZATION_PRICE : 0)).toFixed(2)}€
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="md:col-span-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FiShoppingCart className="h-5 w-5 mr-2" />
                    Añadir al Carrito
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className={`${isInFavorites ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center`}
                  >
                    <FiHeart className="h-5 w-5 mr-2" />
                    {isInFavorites ? 'Quitar' : 'Guardar'}
                  </button>
                </div>
                {isInFavorites && (
                  <div className="mt-3">
                    <button 
                      onClick={goToFavorites}
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Ver mis favoritos
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default JerseyDetail;