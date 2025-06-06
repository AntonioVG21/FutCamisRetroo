import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
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
  const bizumPhone = '640660362';
  
  const handleConfirmPayment = async () => {
    setIsConfirming(true);
    try {
      // Simplemente notificamos el éxito y pasamos los detalles
      const paymentDetails = {
        paymentMethod: 'bizum',
        reference: reference,
        status: 'processing',
        timestamp: new Date()
      };
      
      toast.success('¡Pago registrado! Por favor, realiza la transferencia Bizum.');
      onSuccess(paymentDetails);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un error. Por favor, inténtalo de nuevo.');
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
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

      <div className="space-y-4">
        <button
          onClick={handleConfirmPayment}
          disabled={isConfirming}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isConfirming ? 'Procesando...' : 'Confirmar Pago'}
        </button>

        <button
          onClick={openWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
        >
          <FaWhatsapp className="text-xl" />
          <span>Notificar por WhatsApp</span>
        </button>

        <button
          onClick={onCancel}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default BizumCheckout;