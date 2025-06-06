import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaWhatsapp, FaCopy } from 'react-icons/fa';
import { Order } from '../types/Order';

interface BizumCheckoutProps {
  amount: number;
  orderData: { id: string; status: string };
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
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const reference = `FutCamisRetros-${orderData.id.substring(0, 8)}`;
  const bizumPhone = '640660362';
  
  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      toast.success('¡Referencia copiada al portapapeles!');
    } catch (error) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = reference;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('¡Referencia copiada!');
    }
  };
  
  const handleConfirmPayment = async () => {
    setIsConfirming(true);
    
    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      setPaymentConfirmed(true);
      setIsConfirming(false);
      
      const paymentDetails = {
        paymentMethod: 'bizum',
        reference: reference,
        status: 'processing',
        timestamp: new Date(),
        amount: amount
      };
      
      toast.success('¡Pago registrado! Realiza la transferencia Bizum y notifícanos por WhatsApp.');
      onSuccess(paymentDetails);
    }, 1500);
  };

  const openWhatsApp = () => {
    const message = `Hola! He realizado un pago por Bizum:\n\n` +
                   `💰 Importe: ${amount.toFixed(2)}€\n` +
                   `📱 Referencia: ${reference}\n` +
                   `📞 Teléfono Bizum: ${bizumPhone}\n\n` +
                   `Por favor, confirma la recepción del pago. ¡Gracias!`;
    
    const whatsappUrl = `https://wa.me/34${bizumPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">💳 Pago con Bizum</h3>
        <p className="text-gray-300">Sigue estos pasos para completar tu pago</p>
      </div>
      
      <div className="bg-gray-700 p-4 rounded-lg mb-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Importe:</span>
          <span className="text-yellow-400 font-bold text-xl">{amount.toFixed(2)} €</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Teléfono Bizum:</span>
          <span className="text-white font-bold">{bizumPhone}</span>
        </div>
        
        <div className="border-t border-gray-600 pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 font-medium">Referencia:</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-600 p-3 rounded">
            <span className="text-white font-mono text-sm flex-1">{reference}</span>
            <button
              onClick={copyReference}
              className="p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded transition-colors duration-200 flex items-center justify-center"
              title="Copiar referencia"
            >
              <FaCopy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg mb-6">
        <h4 className="text-blue-200 font-semibold mb-2">📋 Instrucciones:</h4>
        <ol className="text-blue-100 text-sm space-y-1 list-decimal list-inside">
          <li>Abre tu app de Bizum</li>
          <li>Envía <strong>{amount.toFixed(2)}€</strong> al <strong>{bizumPhone}</strong></li>
          <li>Usa la referencia: <strong>{reference}</strong></li>
          <li>Confirma el pago aquí abajo</li>
          <li>Notifícanos por WhatsApp</li>
        </ol>
      </div>

      <div className="space-y-3">
        {!paymentConfirmed ? (
          <button
            onClick={handleConfirmPayment}
            disabled={isConfirming}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            {isConfirming ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Procesando...
              </>
            ) : (
              '✅ He realizado el pago Bizum'
            )}
          </button>
        ) : (
          <div className="bg-green-600 text-white p-4 rounded-lg text-center">
            <p className="font-semibold">✅ ¡Pago registrado!</p>
            <p className="text-sm">Ahora notifícanos por WhatsApp</p>
          </div>
        )}

        <button
          onClick={openWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <FaWhatsapp className="text-xl" />
          <span>Notificar por WhatsApp</span>
        </button>

        <button
          onClick={onCancel}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          ← Volver a métodos de pago
        </button>
      </div>
    </div>
  );
};

export default BizumCheckout;