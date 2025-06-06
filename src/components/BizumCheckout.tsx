import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaWhatsapp, FaCopy, FaCheckCircle } from 'react-icons/fa';

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
  const [step, setStep] = useState<'instructions' | 'confirming' | 'completed'>('instructions');
  const [countdown, setCountdown] = useState(0);
  
  const reference = `FutCamisRetros-${orderData.id.substring(0, 8)}`;
  const bizumPhone = '640660362';
  
  // Auto-scroll al componente cuando se monta
  useEffect(() => {
    const element = document.getElementById('bizum-checkout');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);
  
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
  
  const handleConfirmPayment = () => {
    setStep('confirming');
    setCountdown(3);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStep('completed');
          
          const paymentDetails = {
            paymentMethod: 'bizum',
            reference: reference,
            status: 'processing',
            timestamp: new Date().toISOString(),
            amount: amount,
            phone: bizumPhone
          };
          
          // Guardar en localStorage como respaldo
          localStorage.setItem('lastBizumPayment', JSON.stringify({
            ...paymentDetails,
            orderId: orderData.id
          }));
          
          toast.success('¡Pago registrado! No olvides realizar la transferencia Bizum.');
          onSuccess(paymentDetails);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const openWhatsApp = () => {
    const message = `🛒 *NUEVO PEDIDO - PAGO BIZUM*\n\n` +
                   `💰 *Importe:* ${amount.toFixed(2)}€\n` +
                   `📱 *Referencia:* ${reference}\n` +
                   `📞 *Teléfono Bizum:* ${bizumPhone}\n` +
                   `🆔 *ID Pedido:* ${orderData.id}\n\n` +
                   `✅ He realizado el pago por Bizum.\n` +
                   `Por favor, confirma la recepción del pago.\n\n` +
                   `¡Gracias por tu compra! 🙌`;
    
    const whatsappUrl = `https://wa.me/34${bizumPhone}?text=${encodeURIComponent(message)}`;
    
    // Abrir en nueva ventana con configuración específica
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer,width=400,height=600');
    
    if (!newWindow) {
      // Fallback si el popup es bloqueado
      window.location.href = whatsappUrl;
    }
  };

  return (
    <div id="bizum-checkout" className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl max-w-lg mx-auto border border-gray-700">
      <div className="text-center mb-6">
        <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💳</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Pago con Bizum</h3>
        <p className="text-gray-300">Sigue estos pasos para completar tu compra</p>
      </div>
      
      {/* Información del pago */}
      <div className="bg-gray-700 p-5 rounded-xl mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Importe:</span>
          <span className="text-yellow-400 font-bold text-2xl">{amount.toFixed(2)} €</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Teléfono Bizum:</span>
          <span className="text-white font-bold text-lg">{bizumPhone}</span>
        </div>
        
        <div className="border-t border-gray-600 pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 font-medium">Referencia:</span>
            <span className="text-xs text-gray-400">¡Importante incluirla!</span>
          </div>
          <div className="flex items-center space-x-3 bg-gray-600 p-4 rounded-lg">
            <span className="text-white font-mono text-sm flex-1 select-all">{reference}</span>
            <button
              onClick={copyReference}
              className="p-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
              title="Copiar referencia"
            >
              <FaCopy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Instrucciones paso a paso */}
      {step === 'instructions' && (
        <>
          <div className="bg-blue-900 border border-blue-600 p-5 rounded-xl mb-6">
            <h4 className="text-blue-200 font-semibold mb-3 flex items-center">
              <span className="mr-2">📋</span> Instrucciones:
            </h4>
            <ol className="text-blue-100 text-sm space-y-2 list-decimal list-inside">
              <li>Abre tu app de <strong>Bizum</strong></li>
              <li>Selecciona <strong>"Enviar dinero"</strong></li>
              <li>Introduce el teléfono: <strong>{bizumPhone}</strong></li>
              <li>Importe: <strong>{amount.toFixed(2)}€</strong></li>
              <li>En concepto, escribe: <strong>{reference}</strong></li>
              <li>Confirma el envío en tu app</li>
              <li>Pulsa el botón de abajo cuando hayas enviado el dinero</li>
            </ol>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleConfirmPayment}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
            >
              <FaCheckCircle className="text-xl" />
              <span>✅ He enviado el Bizum</span>
            </button>
          </div>
        </>
      )}

      {/* Estado de confirmación */}
      {step === 'confirming' && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Registrando tu pago...</p>
          <p className="text-gray-300 text-sm">Procesando en {countdown} segundos</p>
        </div>
      )}

      {/* Estado completado */}
      {step === 'completed' && (
        <>
          <div className="bg-green-600 text-white p-5 rounded-xl text-center mb-6">
            <FaCheckCircle className="text-4xl mx-auto mb-3" />
            <p className="font-bold text-lg">¡Pago registrado correctamente!</p>
            <p className="text-sm opacity-90">Ahora notifícanos por WhatsApp para confirmar</p>
          </div>

          <button
            onClick={openWhatsApp}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
          >
            <FaWhatsapp className="text-2xl" />
            <span>📱 Notificar por WhatsApp</span>
          </button>
        </>
      )}

      {/* Botón cancelar */}
      <button
        onClick={onCancel}
        className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
      >
        ← Volver a métodos de pago
      </button>
    </div>
  );
};

export default BizumCheckout;