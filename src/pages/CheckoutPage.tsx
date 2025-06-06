import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiPackage } from 'react-icons/fi';
import { FaMobileAlt } from 'react-icons/fa';
import { orderServices } from '../services/firebaseServices';
import BizumCheckout from '../components/BizumCheckout';
import OrderConfirmation from '../components/OrderConfirmation';
import { discountServices } from '../services/discountServices';

interface CustomerData {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  leagues: {
    retro: boolean;
    selecciones: boolean;
    premierLeague: boolean;
    laLiga: boolean;
    serieA: boolean;
    bundesliga: boolean;
    ligue1: boolean;
  };
}

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart, updateNotes, updateSpecifications } = useCartStore();
  const [showBizum, setShowBizum] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    leagues: {
      retro: false,
      selecciones: false,
      premierLeague: false,
      laLiga: false,
      serieA: false,
      bundesliga: false,
      ligue1: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setCustomerData(prev => ({
        ...prev,
        leagues: {
          ...prev.leagues,
          [name]: checked
        }
      }));
    } else {
      setCustomerData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Por favor, introduce un código de descuento');
      return;
    }

    setIsCheckingDiscount(true);
    try {
      // Verificar si el código ya ha sido canjeado
      const isRedeemed = await discountServices.checkDiscountStatus(discountCode);
      
      if (isRedeemed) {
        toast.error('Este código de descuento ya ha sido utilizado');
        setIsCheckingDiscount(false);
        return;
      }
      
      // Aquí puedes implementar la lógica para diferentes tipos de descuentos
      // Por ahora, aplicamos un descuento fijo de 10€
      const discount = 10;
      
      setDiscountAmount(discount);
      setDiscountApplied(true);
      toast.success(`¡Código de descuento aplicado! Descuento: ${discount}€`);
    } catch (error) {
      console.error('Error al aplicar el código de descuento:', error);
      toast.error('Error al aplicar el código de descuento');
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setDiscountApplied(false);
    setDiscountAmount(0);
    toast.success('Código de descuento eliminado');
  };

  // Calcular el total con descuento
  const totalWithDiscount = total - discountAmount;

  // Función para validar el formulario
  const validateForm = () => {
    // Implementa la validación del formulario aquí
    return true; // Cambia esto con tu lógica de validación real
  };

  // Función para manejar el éxito del pedido
  const handleOrderSuccess = () => {
    // Implementa la lógica para manejar el éxito del pedido
    clearCart();
  };

  const handlePaymentMethod = async (method: string) => {
    console.log(`Procesando pedido...`);
    try {
      if (!validateForm()) {
        toast.error('Por favor, completa todos los campos obligatorios.');
        return;
      }
      
      // Preparar los datos del pedido
      const orderData = {
        customer: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          postalCode: customerData.postalCode,
          leagues: customerData.leagues
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          isPack: item.isPack || false,
          specifications: item.specifications || '',
          unwantedKits: item.notes || ''
        })),
        total: totalWithDiscount,
        // Añade más campos según sea necesario
      };

      if (method === 'bizum') {
        // Lógica para pago con Bizum
        const newOrderId = await orderServices.createOrder(orderData);
        setOrderId(newOrderId);
        setShowBizum(true);
      } else if (method === 'order') {
        // Lógica para realizar pedido sin pago inmediato
        const newOrderId = await orderServices.createOrder(orderData);
        setOrderId(newOrderId);
        // Mostrar confirmación de pedido
        toast.success('¡Pedido realizado con éxito! Te contactaremos pronto.');
        handleOrderSuccess();
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toast.error('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario de datos del cliente */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Datos de Envío</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre completo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={customerData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={customerData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Teléfono *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Dirección *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={customerData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">Ciudad *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={customerData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">Código Postal *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={customerData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Sección de ligas preferidas */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Ligas Preferidas</h2>
                <p className="text-gray-400 mb-4">Selecciona las ligas que más te interesan (opcional)</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="retro"
                      name="retro"
                      checked={customerData.leagues.retro}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                    <label htmlFor="retro" className="ml-2 text-sm text-gray-300">Retro</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="selecciones"
                      name="selecciones"
                      checked={customerData.leagues.selecciones}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                    <label htmlFor="selecciones" className="ml-2 text-sm text-gray-300">Selecciones</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="premierLeague"
                      name="premierLeague"
                      checked={customerData.leagues.premierLeague}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                    <label htmlFor="premierLeague" className="ml-2 text-sm text-gray-300">Premier League</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="laLiga"
                      name="laLiga"
                      checked={customerData.leagues.laLiga}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                    <label htmlFor="laLiga" className="ml-2 text-sm text-gray-300">La Liga</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="serieA"
                      name="serieA"
                      checked={customerData.leagues.serieA}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                    <label htmlFor="serieA" className="ml-2 text-sm text-gray-300">Serie A</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="bundesliga"
                      name="bundesliga"
                      checked={customerData.leagues.bundesliga}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                    <label htmlFor="bundesliga" className="ml-2 text-sm text-gray-300">Bundesliga</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ligue1"
                      name="ligue1"
                      checked={customerData.leagues.ligue1}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                    />
                    <label htmlFor="ligue1" className="ml-2 text-sm text-gray-300">Ligue 1</label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resumen del pedido */}
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Resumen del Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 pb-4 border-b border-gray-700">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-700 rounded-md overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm">Cantidad: {item.quantity}</p>
                        <p className="text-gray-400 text-sm">{item.price.toFixed(2)} €</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Código de descuento */}
                <div className="mb-6 pt-2 border-t border-gray-700">
                  <h3 className="text-white font-medium mb-2">Código de Descuento</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      disabled={discountApplied}
                      placeholder="Introduce tu código"
                      className="flex-1 px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                    {discountApplied ? (
                      <button
                        onClick={handleRemoveDiscount}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyDiscount}
                        disabled={isCheckingDiscount}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCheckingDiscount ? 'Aplicando...' : 'Aplicar'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center text-lg text-white mb-2">
                    <span>Subtotal</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  
                  {discountApplied && (
                    <div className="flex justify-between items-center text-lg text-green-400 mb-2">
                      <span>Descuento</span>
                      <span>-{discountAmount.toFixed(2)} €</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xl font-bold text-white">
                    <span>Total</span>
                    <span>{totalWithDiscount.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Métodos de Pago */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Método de Pago</h2>
                
                {showBizum && orderId ? (
                  <div className="mb-6">
                    <BizumCheckout 
                      amount={total} 
                      orderData={{ id: orderId, status: 'pending' }} 
                      onSuccess={(details) => {
                        console.log('Pago iniciado con Bizum:', details);
                        // Asegurarse de que handleOrderSuccess se ejecuta correctamente
                        try {
                          console.log('Ejecutando handleOrderSuccess después del pago con Bizum');
                          handleOrderSuccess();
                        } catch (error) {
                          console.error('Error en handleOrderSuccess:', error);
                          toast.error('Error al finalizar el proceso de pago');
                        }
                      }}
                      onCancel={() => {
                        console.log('Cancelando pago con Bizum');
                        setShowBizum(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => handlePaymentMethod('bizum')}
                      className="flex items-center justify-center space-x-2 w-full py-4 px-6 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <FaMobileAlt className="h-5 w-5 mr-2" />
                      <span className="text-lg font-semibold">Pagar con Bizum</span>
                    </button>
                    
                    <button
                      onClick={() => handlePaymentMethod('order')}
                      className="flex items-center justify-center space-x-2 w-full py-4 px-6 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <span className="text-2xl">📋</span>
                      <span className="text-lg font-semibold">Realizar Pedido</span>
                    </button>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <span className="mr-2">ℹ️</span> Cómo funciona:
                      </h4>
                      <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                        <li>Confirma tu pedido con tus datos</li>
                        <li>Te enviaremos los detalles por WhatsApp o Email</li>
                        <li>Te responderemos con la confirmación y forma de pago</li>
                        <li>Preparamos y enviamos tu pedido</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

