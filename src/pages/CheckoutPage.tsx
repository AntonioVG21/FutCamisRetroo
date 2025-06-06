import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiPackage } from 'react-icons/fi';
import { FaMobileAlt } from 'react-icons/fa';
import { orderServices } from '../services/firebaseServices';
import BizumCheckout from '../components/BizumCheckout';
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

  // En la función handlePaymentMethod, simplificar la lógica:
  // Importar el nuevo componente al inicio del archivo
  import OrderConfirmation from '../components/OrderConfirmation';

  const handlePaymentMethod = async (method: 'order') => {
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
      discount: discountApplied ? {
        code: discountCode,
        amount: discountAmount
      } : null,
      createdAt: new Date(),
      status: 'pending' as const
    };
    
    console.log('Datos del pedido preparados:', orderData);
    
    // Mostrar el componente de confirmación
    setShowBizum(true); // Reutilizamos esta variable para mostrar el nuevo componente
    setOrderId(`FC${Date.now().toString().slice(-6)}`);
    
    // Si se aplicó un descuento, intentar marcarlo como canjeado
    if (discountApplied) {
      try {
        await discountServices.redeemDiscount(discountCode);
      } catch (discountError) {
        console.warn('Error al canjear descuento:', discountError);
      }
    }
    
    // Scroll automático al componente
    setTimeout(() => {
      const orderElement = document.getElementById('order-confirmation');
      if (orderElement) {
        orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    
  } catch (error) {
    console.error('Error al procesar el pedido:', error);
    toast.error('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
  }
};
  
  // Función para manejar el éxito del pago
  const handleOrderSuccess = () => {
    console.log('Ejecutando handleOrderSuccess');
    try {
      console.log('Limpiando carrito...');
      clearCart();
      
      console.log('Redirigiendo a la página principal...');
      // Usar window.location.href para una redirección más confiable
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
      console.log('Mostrando mensaje de éxito...');
      toast.success('¡Compra realizada con éxito! Gracias por tu pedido.');
      console.log('Proceso de pago completado correctamente');
    } catch (error) {
      console.error('Error en handleOrderSuccess:', error);
      toast.error('Hubo un problema al finalizar tu compra, pero tu pago ha sido registrado.');
      // Asegurar la redirección incluso si hay un error
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  const validateForm = () => {
    return (
      customerData.name.trim() !== '' &&
      customerData.email.trim() !== '' &&
      customerData.phone.trim() !== '' &&
      customerData.address.trim() !== '' &&
      customerData.city.trim() !== '' &&
      customerData.postalCode.trim() !== ''
    );
  };

  if (items.length === 0) {
    // Usar window.location.href para una redirección más confiable
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Cliente */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FiPackage className="h-6 w-6 mr-2" />
              Datos de Envío
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo *"
                  value={customerData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={customerData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  required
                />
              </div>
              <input
                type="text"
                name="phone"
                placeholder="Teléfono *"
                value={customerData.phone}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white rounded px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
              <div className="space-y-2">
                <label className="block text-white text-sm font-medium">Ligas de preferencia</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                   <label className="flex items-center space-x-2 text-white cursor-pointer">
                     <input
                       type="checkbox"
                       name="retro"
                       checked={customerData.leagues.retro}
                       onChange={handleInputChange}
                       className="form-checkbox text-yellow-500"
                     />
                     <span>Retro</span>
                   </label>
                   <label className="flex items-center space-x-2 text-white cursor-pointer">
                     <input
                       type="checkbox"
                       name="selecciones"
                       checked={customerData.leagues.selecciones}
                       onChange={handleInputChange}
                       className="form-checkbox text-yellow-500"
                     />
                     <span>Selecciones</span>
                   </label>
                   <label className="flex items-center space-x-2 text-white cursor-pointer">
                     <input
                       type="checkbox"
                       name="premierLeague"
                       checked={customerData.leagues.premierLeague}
                       onChange={handleInputChange}
                       className="form-checkbox text-yellow-500"
                     />
                     <span>Premier League</span>
                   </label>
                   <label className="flex items-center space-x-2 text-white cursor-pointer">
                     <input
                       type="checkbox"
                       name="laLiga"
                       checked={customerData.leagues.laLiga}
                       onChange={handleInputChange}
                       className="form-checkbox text-yellow-500"
                     />
                     <span>LaLiga</span>
                   </label>
                   <label className="flex items-center space-x-2 text-white cursor-pointer">
                     <input
                       type="checkbox"
                       name="serieA"
                       checked={customerData.leagues.serieA}
                       onChange={handleInputChange}
                       className="form-checkbox text-yellow-500"
                     />
                     <span>Serie A</span>
                   </label>
                   <label className="flex items-center space-x-2 text-white cursor-pointer">
                     <input
                       type="checkbox"
                       name="bundesliga"
                       checked={customerData.leagues.bundesliga}
                       onChange={handleInputChange}
                       className="form-checkbox text-yellow-500"
                     />
                     <span>Bundesliga</span>
                   </label>
                   <label className="flex items-center space-x-2 text-white cursor-pointer">
                     <input
                       type="checkbox"
                       name="ligue1"
                       checked={customerData.leagues.ligue1}
                       onChange={handleInputChange}
                       className="form-checkbox text-yellow-500"
                     />
                     <span>Ligue 1</span>
                   </label>
                </div>
              </div>
              <input
                type="text"
                name="address"
                placeholder="Dirección *"
                value={customerData.address}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white rounded px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="Ciudad *"
                  value={customerData.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Código Postal *"
                  value={customerData.postalCode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Resumen del Pedido</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 pb-4 border-b border-gray-700">
                    <img src={item.image} alt={item.name} className="h-20 w-20 object-cover rounded" />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-white font-medium flex-1">{item.name}</h3>
                        {item.isPack && (
                          <FiPackage className="h-5 w-5 text-yellow-500 ml-2" />
                        )}
                      </div>
                      <p className="text-gray-400">Cantidad: {item.quantity}</p>
                      <p className="text-yellow-500 font-bold">{(item.price * item.quantity).toFixed(2)} €</p>
                      
                      {item.isPack && (
                        <div className="mt-2 space-y-2">
                          <div
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm whitespace-pre-line"
                          >
                            <span className="text-gray-400">Especificaciones del pack:</span> {item.specifications || 'No hay especificaciones'}
                          </div>
                          <div
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm whitespace-pre-line"
                          >
                            <span className="text-gray-400">Equipaciones que NO deseas recibir:</span> {item.notes || 'No especificado'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Sección de código de descuento */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Código de Descuento</h3>
                {!discountApplied ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Introduce tu código"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                      disabled={isCheckingDiscount}
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={isCheckingDiscount || !discountCode.trim()}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isCheckingDiscount ? 'Aplicando...' : 'Aplicar'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-700 rounded p-3 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{discountCode}</p>
                      <p className="text-green-400 text-sm">Descuento: {discountAmount.toFixed(2)} €</p>
                    </div>
                    <button
                      onClick={handleRemoveDiscount}
                      className="text-red-400 hover:text-red-300 focus:outline-none"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

// En la sección de métodos de pago, reemplazar el contenido:
{showBizum && orderId ? (
  <div className="mb-6">
    <OrderConfirmation 
      orderData={{
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          specifications: item.specifications || '',
          unwantedKits: item.notes || ''
        }))
      }}
      customerData={customerData}
      total={totalWithDiscount}
      onSuccess={() => {
        console.log('Pedido completado exitosamente');
        handleOrderSuccess();
      }}
      onCancel={() => {
        console.log('Cancelando pedido');
        setShowBizum(false);
      }}
    />
  </div>
) : (
  <div className="grid grid-cols-1 gap-4">
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