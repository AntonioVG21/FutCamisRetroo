import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import { orderServices } from '../services/firebaseServices';
import { Order } from '../types/Order';

// Definir interfaces para los tipos de PayPal
interface PayPalOrderDetails {
  id: string;
  status: string;
  [key: string]: unknown; // Para otros campos que pueda tener
}

interface PayPalOrderActions {
  order: {
    create: (orderData: Record<string, unknown>) => Promise<string>;
    capture: () => Promise<PayPalOrderDetails>;
  };
  [key: string]: unknown; // Para otros campos que pueda tener
}

interface PayPalErrorData {
  message: string;
  name?: string;
  stack?: string;
  [key: string]: unknown; // Para otros campos que pueda tener
}

interface PayPalCheckoutProps {
  amount: number;
  orderData: Order;
  onSuccess: (details: PayPalOrderDetails) => void;
  currency?: string;
}

const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  amount,
  orderData,
  onSuccess,
  currency = 'EUR'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
  
  useEffect(() => {
    console.log('PayPalCheckout component mounted');
    console.log('PayPal Client ID:', paypalClientId ? 'Configurado correctamente' : 'No configurado');
    console.log('Order Data:', orderData);
    console.log('Amount:', amount);
    
    // Verificar que el ID de cliente de PayPal esté configurado
    if (!paypalClientId) {
      console.error('Error: No se ha configurado el ID de cliente de PayPal');
      setError('No se ha configurado el ID de cliente de PayPal');
      setLoading(false);
      return;
    }
    
    // Simular un tiempo de carga para asegurarse de que PayPal se inicialice correctamente
    const timer = setTimeout(() => {
      setLoading(false);
      setScriptLoaded(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [paypalClientId, orderData, amount]);

  const createOrder = (_data: Record<string, unknown>, actions: PayPalOrderActions) => {
    console.log('Creating PayPal order with amount:', amount);
    try {
      return actions.order.create({
        purchase_units: [
          {
            description: 'Compra en FutCamisRetros',
            amount: {
              currency_code: currency,
              value: amount.toString(),
            },
            // Añadir dirección de envío o cambiar la preferencia de envío
            shipping: {
              name: {
                full_name: orderData.customer?.name || 'Cliente'
              },
              address: {
                address_line_1: orderData.customer?.address || '',
                admin_area_2: orderData.customer?.city || '',
                postal_code: orderData.customer?.postalCode || '',
                country_code: 'ES'
              }
            }
          },
        ],
        application_context: {
          shipping_preference: 'GET_FROM_FILE', // Cambiado de SET_PROVIDED_ADDRESS a GET_FROM_FILE
          brand_name: 'FutCamisRetros'
        }
      });
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast.error('Error al crear la orden de PayPal');
      throw error;
    }
  };

  const onApprove = async (_data: Record<string, unknown>, actions: PayPalOrderActions) => {
    console.log('Payment approved, capturing payment...');
    try {
      // Capturar el pago
      const details = await actions.order.capture();
      console.log('Payment captured successfully:', details);
      
      // Actualizar el estado de la orden en Firestore
      if (details.status === 'COMPLETED') {
        console.log('Updating order status in Firestore...');
        await orderServices.updateOrderStatus(orderData.id, 'completed');
        await orderServices.updateOrderPaymentDetails(orderData.id, {
          paymentId: details.id,
          paymentStatus: details.status,
          paymentMethod: 'paypal'
        });
        
        toast.success('¡Pago completado con éxito!');
        // Llamar a onSuccess para redirigir a la página de inicio
        onSuccess(details);
        
        // Asegurar la redirección a la página de inicio
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        console.warn('Payment not completed, status:', details.status);
        toast.error(`El pago no se completó. Estado: ${details.status}`);
      }
    } catch (error) {
      console.error('Error al procesar el pago con PayPal:', error);
      toast.error('Hubo un error al procesar tu pago con PayPal. Por favor, contacta con soporte.');
    }
  };

  const onError = (err: PayPalErrorData) => {
    console.error('Error en PayPal:', err);
    setError('Ocurrió un error con PayPal. Por favor, intenta de nuevo.');
    toast.error('Ocurrió un error con PayPal. Por favor, intenta de nuevo.');
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-md text-center">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="h-12 w-12 bg-yellow-500 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        <p className="mt-4 text-gray-400">Cargando PayPal...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p className="font-medium">Error:</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Reintentar
        </button>
      </div>
    );
  }
  
  if (!paypalClientId) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p className="font-medium">Error:</p>
        <p>No se ha configurado el ID de cliente de PayPal.</p>
      </div>
    );
  }
  
  return (
    <div className="paypal-button-container">
      {scriptLoaded ? (
        <PayPalScriptProvider options={{
          'client-id': paypalClientId,
          currency: currency,
          intent: 'capture',
          components: 'buttons',
          debug: process.env.NODE_ENV !== 'production'
        }}>
          <div className="mb-4 p-2 bg-yellow-50 text-yellow-700 rounded-md text-sm">
            Si los botones de PayPal no aparecen, por favor haz clic en Reintentar.
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <PayPalButtons
              style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              onCancel={(data) => {
                console.log('Pago cancelado por el usuario:', data);
                toast.error('Has cancelado el pago con PayPal.');
              }}
              forceReRender={[amount, currency]}
            />
          </div>
          <button 
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setScriptLoaded(true);
              }, 1500);
            }} 
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Reintentar cargar PayPal
          </button>
        </PayPalScriptProvider>
      ) : (
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
          <p>Error al cargar el script de PayPal. Por favor, intenta de nuevo.</p>
          <button 
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setScriptLoaded(true);
              }, 1500);
            }} 
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

export default PayPalCheckout;