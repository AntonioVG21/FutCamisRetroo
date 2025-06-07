import React, { useState, useEffect } from 'react';
import { orderServices } from '../services/firebaseServices';
import { FaSpinner, FaCheckCircle, FaTruck, FaBoxOpen } from 'react-icons/fa';

interface OrderTrackerProps {
  orderId: string;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState<string>('pending');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        setLoading(true);
        const order = await orderServices.getOrderById(orderId);
        if (order) {
          setOrderStatus(order.status);
        } else {
          setError('No se encontró el pedido');
        }
      } catch (err) {
        console.error('Error al obtener el estado del pedido:', err);
        setError('Error al obtener el estado del pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();

    // Actualizar el estado cada 30 segundos
    const intervalId = setInterval(fetchOrderStatus, 30000);

    return () => clearInterval(intervalId);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <FaSpinner className="animate-spin text-yellow-500 mr-2" />
        <span>Cargando estado del pedido...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (orderStatus) {
      case 'pending':
        return {
          icon: <FaSpinner className="text-yellow-500" />,
          text: 'Pendiente de confirmación',
          description: 'Tu pedido está siendo procesado',
          color: 'yellow'
        };
      case 'processing':
        return {
          icon: <FaCheckCircle className="text-blue-500" />,
          text: 'Pago confirmado',
          description: 'Estamos preparando tu pedido',
          color: 'blue'
        };
      case 'shipped':
        return {
          icon: <FaTruck className="text-green-500" />,
          text: 'Enviado',
          description: 'Tu pedido está en camino',
          color: 'green'
        };
      case 'completed':
        return {
          icon: <FaBoxOpen className="text-green-700" />,
          text: 'Entregado',
          description: '¡Tu pedido ha sido entregado!',
          color: 'green'
        };
      case 'cancelled':
        return {
          icon: <FaCheckCircle className="text-red-500" />,
          text: 'Cancelado',
          description: 'Tu pedido ha sido cancelado',
          color: 'red'
        };
      default:
        return {
          icon: <FaSpinner className="text-gray-500" />,
          text: 'Estado desconocido',
          description: 'Contacta con nosotros para más información',
          color: 'gray'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Estado de tu pedido</h3>
      
      <div className="flex items-center mb-4">
        <div className={`text-2xl mr-3`}>{statusInfo.icon}</div>
        <div>
          <p className={`font-bold text-${statusInfo.color}-500`}>{statusInfo.text}</p>
          <p className="text-gray-300 text-sm">{statusInfo.description}</p>
        </div>
      </div>
      
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${orderStatus === 'pending' || orderStatus === 'processing' || orderStatus === 'shipped' || orderStatus === 'completed' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
              Pedido
            </span>
          </div>
          <div>
            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${orderStatus === 'processing' || orderStatus === 'shipped' || orderStatus === 'completed' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
              Pago
            </span>
          </div>
          <div>
            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${orderStatus === 'shipped' || orderStatus === 'completed' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
              Envío
            </span>
          </div>
          <div>
            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${orderStatus === 'completed' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
              Entrega
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300">
          <div style={{ width: orderStatus === 'pending' ? '25%' : orderStatus === 'processing' ? '50%' : orderStatus === 'shipped' ? '75%' : orderStatus === 'completed' ? '100%' : '0%' }} 
               className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mt-4">ID de pedido: {orderId}</p>
    </div>
  );
};

export default OrderTracker;