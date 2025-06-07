import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaWhatsapp, FaCreditCard } from 'react-icons/fa';
import { orderServices } from '../services/firebaseServices';
import OrderConfirmation from '../components/OrderConfirmation';
import { discountServices } from '../services/discountServices';
import BizumCheckout from '../components/BizumCheckout';
import { emailServices } from '../services/emailService';
import OrderTracker from '../components/OrderTracker';

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

// Add this interface for form errors
interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
}

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart } = useCartStore();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'bizum'>('whatsapp');
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderData, setOrderData] = useState<{ id: string; status: string } | null>(null);
  
  // Add this state for form errors
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormTouched, setIsFormTouched] = useState(false);
  
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
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    // Set form as touched on first input
    if (!isFormTouched) {
      setIsFormTouched(true);
    }
    
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
      
      // Clear error when field is being edited
      if (formErrors[name as keyof FormErrors]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
      
      // Validate field if it's been touched
      if (isFormTouched) {
        validateField(name, value);
      }
    }
  };
  
  // Add this function for field validation
  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'El nombre es obligatorio';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'El email es obligatorio';
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = 'Email inválido';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'El teléfono es obligatorio';
        } else if (!/^\d{9}$/.test(value.replace(/\s/g, ''))) {
          error = 'Teléfono inválido (debe tener 9 dígitos)';
        }
        break;
      case 'address':
        if (!value.trim()) error = 'La dirección es obligatoria';
        break;
      case 'city':
        if (!value.trim()) error = 'La ciudad es obligatoria';
        break;
      case 'postalCode':
        if (!value.trim()) {
          error = 'El código postal es obligatorio';
        } else if (!/^\d{5}$/.test(value.replace(/\s/g, ''))) {
          error = 'Código postal inválido (debe tener 5 dígitos)';
        }
        break;
      default:
        break;
    }
    
    if (error) {
      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));
      return false;
    }
    
    return true;
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Por favor, introduce un código de descuento');
      return;
    }

    setIsCheckingDiscount(true);
    try {
      const isRedeemed = await discountServices.checkDiscountStatus(discountCode);
      if (isRedeemed) {
        toast.error('Este código de descuento ya ha sido utilizado');
        setIsCheckingDiscount(false);
        return;
      }

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

  const totalWithDiscount = total - discountAmount;

  const validateForm = () => {
    if (!customerData.name.trim()) return toast.error('Por favor, introduce tu nombre'), false;
    if (!customerData.email.trim()) return toast.error('Por favor, introduce tu email'), false;
    if (!customerData.phone.trim()) return toast.error('Por favor, introduce tu teléfono'), false;
    if (!customerData.address.trim()) return toast.error('Por favor, introduce tu dirección'), false;
    if (!customerData.city.trim()) return toast.error('Por favor, introduce tu ciudad'), false;
    if (!customerData.postalCode.trim()) return toast.error('Por favor, introduce tu código postal'), false;
    return true;
  };

  const handleOrderSuccess = (details: any) => {
    clearCart();
    toast.success('¡Pedido enviado con éxito! Te contactaremos pronto.');
  };

  const createOrder = async () => {
    if (!validateForm()) return null;

    try {
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
          notes: item.notes || ''
        })),
        total: totalWithDiscount,
        status: 'pending',
        paymentMethod: paymentMethod
      };

      const orderResponse = await orderServices.createOrder(orderData);
      const newOrderId = orderResponse.id;

      console.log('Pedido creado con ID:', newOrderId);
      setOrderId(newOrderId);
      setOrderCreated(true);

      // Enviar correo de confirmación
      try {
        await emailServices.sendOrderConfirmation({
          ...orderData,
          id: newOrderId
        });
      } catch (emailError) {
        console.error('Error al enviar el correo de confirmación:', emailError);
        // No bloqueamos el proceso si falla el envío del correo
      }

      return { id: newOrderId, status: 'pending' };
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      toast.error('Error al crear el pedido. Por favor, inténtalo de nuevo.');
      return null;
    }
  };

  const handleSendWhatsAppOrder = async () => {
    console.log(`Procesando pedido por WhatsApp...`);
    try {
      const orderResult = await createOrder();
      if (!orderResult) return;

      const reference = `FutCamisRetros-${orderResult.id.substring(0, 8)}`;

      let message = `🛒 *NUEVO PEDIDO - REF: ${reference}*\n\n`;
      message += `👤 *Cliente:* ${customerData.name}\n`;
      message += `📱 *Teléfono:* ${customerData.phone}\n`;
      message += `📧 *Email:* ${customerData.email}\n`;
      message += `🏠 *Dirección:* ${customerData.address}, ${customerData.city}, ${customerData.postalCode}\n\n`;

      message += `📋 *PRODUCTOS:*\n`;
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.quantity}x ${item.price.toFixed(2)}€\n`;
        if (item.specifications) {
          message += `   ↳ Especificaciones: ${item.specifications}\n`;
        }
        if (item.notes) {
          message += `   ↳ Notas: ${item.notes}\n`;
        }
      });

      message += `\n💰 *Subtotal:* ${total.toFixed(2)}€\n`;
      if (discountApplied) {
        message += `🏷️ *Descuento:* -${discountAmount.toFixed(2)}€\n`;
      }
      message += `💵 *TOTAL:* ${totalWithDiscount.toFixed(2)}€\n\n`;

      message += `🆔 *Referencia de pedido:* ${reference}\n`;
      message += `\n¡Gracias por tu compra! 🙌 Te contactaremos pronto para confirmar los detalles.`;

      const whatsappUrl = `https://wa.me/34640660362?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      handleOrderSuccess({});
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toast.error('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
    }
  };

  const handleStartBizumPayment = async () => {
    console.log(`Iniciando pago con Bizum...`);
    const orderResult = await createOrder();
    if (orderResult) {
      setOrderData(orderResult);
      setPaymentMethod('bizum');
    }
  };

  const [showOrderTracker, setShowOrderTracker] = useState(false);
  
  const handleBizumSuccess = (details: any) => {
    handleOrderSuccess(details);
    setShowOrderTracker(true);
  };

  const handleBizumCancel = () => {
    setOrderData(null);
    setPaymentMethod('whatsapp');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>
          
          {showOrderTracker && orderId ? (
            <div className="mb-8">
              <OrderTracker orderId={orderId} />
            </div>
          ) : null}
          
          {orderData && paymentMethod === 'bizum' ? (
            <BizumCheckout 
              amount={totalWithDiscount} 
              orderData={orderData}
              onSuccess={handleBizumSuccess}
              onCancel={handleBizumCancel}
            />
          ) : (
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
                        className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${formErrors.name ? 'border-red-500' : 'border-gray-600'} focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
                        required
                      />
                      {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
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
                  
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={handleSendWhatsAppOrder}
                      className="flex items-center justify-center space-x-2 w-full py-4 px-6 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <FaWhatsapp className="h-5 w-5 mr-2" />
                      <span className="text-lg font-semibold">Enviar Pedido por WhatsApp</span>
                    </button>
                    
                    <button
                      onClick={handleStartBizumPayment}
                      className="flex items-center justify-center space-x-2 w-full py-4 px-6 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
                    >
                      <FaCreditCard className="h-5 w-5 mr-2" />
                      <span className="text-lg font-semibold">Pagar con Bizum</span>
                    </button>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <span className="mr-2">ℹ️</span> Cómo funciona:
                      </h4>
                      <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                        <li>Completa tus datos de envío</li>
                        <li>Haz clic en "Enviar Pedido por WhatsApp"</li>
                        <li>Se abrirá WhatsApp con todos los detalles de tu pedido</li>
                        <li>Envía el mensaje y te responderemos con la confirmación</li>
                        <li>Cada pedido tiene una referencia única para su seguimiento</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
