import React, { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '34640660362',
  message = '¡Hola! Me gustaría obtener más información sobre las camisetas.'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    // Registrar el evento de clic en WhatsApp
    console.log('WhatsApp button clicked');
    
    // Crear la URL de WhatsApp con el número y mensaje
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp en una nueva ventana
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isHovered && (
        <div className="mb-2 bg-white text-gray-800 p-2 rounded-lg shadow-lg text-sm max-w-xs animate-fade-in">
          ¿Tienes dudas? ¡Contáctanos por WhatsApp!
        </div>
      )}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default WhatsAppButton;