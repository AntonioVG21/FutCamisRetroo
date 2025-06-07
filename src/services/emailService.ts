import emailjs from '@emailjs/browser';

// Reemplaza estos valores con tus propias credenciales de EmailJS
const SERVICE_ID = 'your_service_id';
const TEMPLATE_ID_ORDER_CONFIRMATION = 'your_template_id';
const USER_ID = 'your_user_id';

export const emailServices = {
  sendOrderConfirmation: async (orderData: any) => {
    try {
      const templateParams = {
        order_id: orderData.id,
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        order_total: orderData.total.toFixed(2),
        order_date: new Date().toLocaleDateString(),
        payment_method: orderData.paymentMethod === 'bizum' ? 'Bizum' : 'WhatsApp',
        order_items: orderData.items.map((item: any) => 
          `${item.name} (${item.quantity}x) - ${(item.price * item.quantity).toFixed(2)}€`
        ).join('\n'),
        shipping_address: `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.postalCode}`
      };

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID_ORDER_CONFIRMATION,
        templateParams,
        USER_ID
      );

      console.log('Email enviado con éxito:', response);
      return response;
    } catch (error) {
      console.error('Error al enviar el email:', error);
      throw error;
    }
  }
};