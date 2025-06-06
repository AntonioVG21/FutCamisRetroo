import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaWhatsapp, FaEnvelope, FaCheckCircle, FaCopy } from 'react-icons/fa';

interface OrderConfirmationProps {
  orderData: any;
  customerData: any;
  total: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderData,
  customerData,
  total,
  onSuccess,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [orderId] = useState(`FC${Date.now().toString().slice(-6)}`);
  
  // Auto-scroll al componente cuando se monta
  useEffect(() => {
    const element = document.getElementById('order-confirmation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const formatOrderDetails = () => {
    const itemsList = orderData.items.map((item: any, index: number) => 
      `${index + 1}. ${item.name} - ${item.price.toFixed(2)}€ (x${item.quantity})${
        item.specifications ? `\n   Especificaciones: ${item.specifications}` : ''
      }${
        item.unwantedKits ? `\n   NO desea: ${item.unwantedKits}` : ''
      }`
    ).join('\n\n');

    return {
      whatsapp: `🛒 *NUEVO PEDIDO*\n\n` +
                `👤 *Cliente:* ${customerData.name}\n` +
                `📧 *Email:* ${customerData.email}\n` +
                `📞 *Teléfono:* ${customerData.phone}\n` +
                `📍 *Dirección:* ${customerData.address}, ${customerData.city} (${customerData.postalCode})\n\n` +
                `🛍️ *Productos:*\n${itemsList}\n\n` +
                `💰 *Total:* ${total.toFixed(2)}€\n` +
                `🆔 *Nº Pedido:* ${orderId}\n\n` +
                `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}\n\n` +
                `¡Nuevo pedido recibido! Por favor confirma disponibilidad.`,
      
      email: {
        subject: `Nuevo Pedido #${orderId} - FutCamisRetros`,
        body: `Nuevo pedido recibido:\n\n` +
              `DATOS DEL CLIENTE:\n` +
              `Nombre: ${customerData.name}\n` +
              `Email: ${customerData.email}\n` +
              `Teléfono: ${customerData.phone}\n` +
              `Dirección: ${customerData.address}\n` +
              `Ciudad: ${customerData.city}\n` +
              `Código Postal: ${customerData.postalCode}\n\n` +
              `PRODUCTOS PEDIDOS:\n${itemsList}\n\n` +
              `TOTAL: ${total.toFixed(2)}€\n` +
              `NÚMERO DE PEDIDO: ${orderId}\n` +
              `FECHA: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`
      }
    };
  };

  const copyOrderDetails = async () => {
    const details = formatOrderDetails();
    try {
      await navigator.clipboard.writeText(details.email.body);
      toast.success('¡Detalles del pedido copiados!');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = details.email.body;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('¡Detalles copiados!');
    }
  };

  const sendWhatsApp = () => {
    const details = formatOrderDetails();
    const whatsappUrl = `https://wa.me/34640660362?text=${encodeURIComponent(details.whatsapp)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const sendEmail = () => {
    const details = formatOrderDetails();
    const emailUrl = `mailto:Futcamisretros@gmail.com?subject=${encodeURIComponent(details.email.subject)}&body=${encodeURIComponent(details.email.body)}`;
    window.open(emailUrl, '_blank');
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    
    // Guardar pedido en localStorage como respaldo
    const orderDetails = {
      id: orderId,
      customer: customerData,
      items: orderData.items,
      total: total,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    
    // Simular procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSent(true);
      toast.success('¡Pedido registrado! Envía los detalles por WhatsApp o Email.');
    }, 2000);
  };

  return (
    <div id="order-confirmation" className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl max-w-2xl mx-auto border border-gray-700">
      <div className="text-center mb-6">
        <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Confirmar Pedido</h3>
        <p className="text-gray-300">Revisa tu pedido y envíanos los detalles</p>
      </div>

      {/* Resumen del pedido */}
      <div className="bg-gray-700 p-5 rounded-xl mb-6">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <span className="mr-2">🛍️</span> Resumen del Pedido
        </h4>
        
        <div className="space-y-3 mb-4">
          {orderData.items.map((item: any, index: number) => (
            <div key={index} className="bg-gray-600 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-white font-medium">{item.name}</p>
                  {item.specifications && (
                    <p className="text-gray-300 text-sm">Especificaciones: {item.specifications}</p>
                  )}
                  {item.unwantedKits && (
                    <p className="text-red-300 text-sm">NO desea: {item.unwantedKits}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{item.price.toFixed(2)}€</p>
                  <p className="text-gray-300 text-sm">x{item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-600 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Total:</span>
            <span className="text-yellow-400 font-bold text-xl">{total.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-300 font-medium">Nº Pedido:</span>
            <span className="text-white font-mono">{orderId}</span>
          </div>
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="bg-gray-700 p-5 rounded-xl mb-6">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <span className="mr-2">👤</span> Datos de Envío
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-300">Nombre:</span> <span className="text-white">{customerData.name}</span></div>
          <div><span className="text-gray-300">Email:</span> <span className="text-white">{customerData.email}</span></div>
          <div><span className="text-gray-300">Teléfono:</span> <span className="text-white">{customerData.phone}</span></div>
          <div><span className="text-gray-300">Ciudad:</span> <span className="text-white">{customerData.city}</span></div>
          <div className="md:col-span-2"><span className="text-gray-300">Dirección:</span> <span className="text-white">{customerData.address}</span></div>
        </div>
      </div>

      {!orderSent ? (
        <>
          {/* Instrucciones */}
          <div className="bg-blue-900 border border-blue-600 p-5 rounded-xl mb-6">
            <h4 className="text-blue-200 font-semibold mb-3 flex items-center">
              <span className="mr-2">📋</span> Instrucciones:
            </h4>
            <ol className="text-blue-100 text-sm space-y-2 list-decimal list-inside">
              <li>Confirma tu pedido pulsando el botón de abajo</li>
              <li>Envía los detalles por <strong>WhatsApp</strong> o <strong>Email</strong></li>
              <li>Te responderemos con la confirmación y forma de pago</li>
              <li>Una vez confirmado, prepararemos tu pedido</li>
            </ol>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg mb-4"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Procesando pedido...
              </>
            ) : (
              <>
                <FaCheckCircle className="text-xl" />
                <span>✅ Confirmar Pedido</span>
              </>
            )}
          </button>
        </>
      ) : (
        <>
          <div className="bg-green-600 text-white p-5 rounded-xl text-center mb-6">
            <FaCheckCircle className="text-4xl mx-auto mb-3" />
            <p className="font-bold text-lg">¡Pedido Confirmado!</p>
            <p className="text-sm opacity-90">Ahora envía los detalles para procesar tu pedido</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button
              onClick={sendWhatsApp}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
            >
              <FaWhatsapp className="text-xl" />
              <span>📱 Enviar por WhatsApp</span>
            </button>

            <button
              onClick={sendEmail}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
            >
              <FaEnvelope className="text-xl" />
              <span>📧 Enviar por Email</span>
            </button>
          </div>

          <button
            onClick={copyOrderDetails}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
          >
            <FaCopy className="text-lg" />
            <span>📋 Copiar Detalles del Pedido</span>
          </button>

          <button
            onClick={onSuccess}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            ✅ Finalizar
          </button>
        </>
      )}

      <button
        onClick={onCancel}
        className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
      >
        ← Volver atrás
      </button>
    </div>
  );
};

export default OrderConfirmation;