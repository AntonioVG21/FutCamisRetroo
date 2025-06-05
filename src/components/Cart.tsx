import React from 'react';
import { useCartStore } from '../store/cartStore';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const [error, setError] = React.useState<string>('');
  const { items, total, removeItem, updateQuantity, updateNotes, updateSpecifications, isOpen, toggleCart } = useCartStore();

  React.useEffect(() => {
    console.log('Cart items updated:', items);
  }, [items]);

  const navigate = useNavigate();

  const handleCheckout = () => {
    try {
      console.log('Starting checkout process');
      if (items.length === 0) {
        toast.error('El carrito está vacío');
        return;
      }
      console.log('Navigating to checkout');
      navigate('/checkout');
      toggleCart();
      setError('');
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Error al procesar el pedido');
      toast.error('Error al procesar el pedido');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleCart} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="h-6 w-6 mr-2 inline-flex items-center justify-center">🛍️</span>
              Carrito
            </h2>
            <button onClick={toggleCart} className="text-gray-400 hover:text-white">
              <span className="h-6 w-6 inline-flex items-center justify-center">✖️</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {error && (
              <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            {items.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <div className="h-12 w-12 mx-auto mb-4 opacity-50 text-4xl flex items-center justify-center">🛍️</div>
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded" />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-white font-medium flex-1">{item.name}</h3>
                          {item.isPack && (
                            <span className="h-5 w-5 text-yellow-500 ml-2 inline-flex items-center justify-center">📦</span>
                          )}
                        </div>
                        {item.customization && (
                          <div className="text-sm text-gray-400 mt-1">
                            <p>Personalización: {item.customization.name} {item.customization.number}</p>
                            <p>Coste adicional: +{item.customization.price.toFixed(2)} €</p>
                          </div>
                        )}
                        <p className="text-yellow-500 font-bold">{item.price.toFixed(2)} €</p>
                        <div className="flex items-center mt-2">
                          <select
                            value={item.quantity}
                            onChange={(e) => {
                              try {
                                const newQuantity = Number(e.target.value);
                                console.log('Updating quantity for item:', item.id, 'to:', newQuantity);
                                updateQuantity(item.id, newQuantity);
                                setError('');
                              } catch (err) {
                                console.error('Error updating quantity:', err);
                                setError('Error al actualizar la cantidad');
                              }
                            }}
                            className="bg-gray-700 text-white rounded px-2 py-1"
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              try {
                                console.log('Removing item:', item.id);
                                removeItem(item.id);
                                setError('');
                              } catch (err) {
                                console.error('Error removing item:', err);
                                setError('Error al eliminar el producto');
                              }
                            }}
                            className="ml-4 text-red-500 hover:text-red-400"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {item.isPack && (
                      <div className="mt-3 space-y-2">
                        <div className="text-gray-400 text-sm space-y-1">
                          <p>{item.description}</p>
                          <p>• {item.jerseyCount} Camisetas de fútbol</p>

                        </div>
                        <div className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm whitespace-pre-line">
                          {item.specifications || 'No hay especificaciones disponibles'}
                        </div>
                        <textarea
                          placeholder="Pon el equipo que no quieres que te toque"
                          value={item.notes || ''}
                          onChange={(e) => updateNotes(item.id, e.target.value)}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-800 p-4 space-y-4">
              <div className="flex justify-between items-center text-xl font-bold text-white">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Proceder al Pago
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;