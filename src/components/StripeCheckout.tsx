import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_xxxxxxxxxxxxxxxxxxxxx'); 

const CheckoutForm: React.FC<{ amount: number; onSuccess: () => void; onCancel: () => void }> = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Aquí deberías crear el PaymentIntent en tu backend y obtener el clientSecret
    // Este ejemplo es solo ilustrativo
    alert('Aquí deberías integrar el backend de Stripe para procesar el pago.');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 bg-gray-700 rounded text-white" />
      <div className="flex space-x-2">
        <button type="submit" disabled={!stripe} className="px-4 py-2 bg-blue-600 text-white rounded">Pagar {amount.toFixed(2)} €</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
      </div>
    </form>
  );
};

const StripeCheckout: React.FC<{ amount: number; onSuccess: () => void; onCancel: () => void }> = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

export default StripeCheckout;