import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { orderServices } from '../services/firebaseServices';
import { FaCheck, FaWhatsapp } from 'react-icons/fa';
import { Order } from '../types/Order';

interface BizumCheckoutProps {
  amount: number;
  orderData: Order;
  onSuccess: (details: any) => void;
  onCancel: () => void;
}

const BizumCheckout: React.FC<BizumCheckoutProps> = ({
  amount,
  orderData,
  onSuccess,
  onCancel
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [reference] = useState(`FutCamisRetros-${orderData.id.substring(0, 8)}`);
  const bizumPhone = '640660362'; // Número de teléfono para Bizum (reemplazar con el número real)
  
  const handleConfirmPayment = async () => {
    console.log('Iniciando confirmación de pago Bizum');
    setIsConfirming(true);
    try {
      console.log('OrderData recibido:', orderData);
      console.log('ID de la orden:', orderData.id);
      
      // Actualizar el estado de la orden en Firestore
      console.log('Actualizando estado de la orden a processing...');
      await orderServices.updateOrderStatus(orderData.id, 'processing');
      
      console.log('Actualizando detalles de pago...');
      const paymentDetails = {
        paymentMethod: 'bizum',
        reference: reference,
        status: 'processing',
        timestamp: new Date()
      };
      console.log('Detalles de pago a guardar:', paymentDetails);
      
      await orderServices.updateOrderPaymentDetails(orderData.id, paymentDetails);
      
      console.log('Pago confirmado exitosamente');
      toast.success('¡Pago confirmado! Verificaremos tu transferencia.');
      
      console.log('Llamando a onSuccess...');
      onSuccess({
        paymentMethod: 'bizum',
        reference: reference
      });
    } catch (error) {
      console.error('Error al confirmar el pago por Bizum:', error);
      toast.error('Hubo un error al confirmar tu pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsConfirming(false);
    }
  };

  const openWhatsApp = () => {
    const message = `Hola, acabo de realizar un pago por Bizum para mi pedido con referencia ${reference} por un importe de ${amount.toFixed(2)}€`;
    const whatsappUrl = `https://wa.me/${bizumPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Pago con Bizum</h3>
      
      <div className="bg-gray-700 p-4 rounded-lg mb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Importe:</span>
            <span className="text-yellow-500 font-bold">{amount.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Teléfono Bizum:</span>
            <span className="text-white font-medium">{bizumPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Referencia:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{reference}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reference);
                  toast.success('Referencia copiada');
                }}
                className="p-1.5 rounded-md bg-gray-600 hover:bg-gray-500 text-yellow-500 hover:text-yellow-400 transition-colors duration-200"
                title="Copiar referencia"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 p-4 rounded-lg mb-6">
        <h4 className="text-yellow-500 font-semibold mb-2">Instrucciones:</h4>
        <ol className="list-decimal list-inside text-gray-300 space-y-2">
          <li>Abre la app de tu banco o la app de Bizum</li>
          <li>Realiza un pago al número <span className="text-white font-medium">{bizumPhone}</span></li>
          <li>Introduce el importe exacto: <span className="text-white font-medium">{amount.toFixed(2)} €</span></li>
          <li>En el concepto, escribe la referencia: <span className="text-white font-medium">{reference}</span></li>
          <li>Una vez realizado el pago, pulsa "He realizado el pago"</li>
        </ol>
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleConfirmPayment}
          disabled={isConfirming}
          className="flex items-center justify-center space-x-2 w-full py-3 px-6 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaCheck className="h-5 w-5 mr-2" />
          <span className="text-lg font-semibold">
            {isConfirming ? 'Confirmando...' : 'He realizado el pago'}
          </span>
        </button>
        
        <button
          onClick={openWhatsApp}
          className="flex items-center justify-center space-x-2 w-full py-3 px-6 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
        >
          <FaWhatsapp className="h-5 w-5 mr-2" />
          <span className="text-lg font-semibold">Notificar por WhatsApp</span>
        </button>
        
        <button
          onClick={onCancel}
          className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancelar y elegir otro método de pago
        </button>
      </div>
    </div>
  );
};

export default BizumCheckout;