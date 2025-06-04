import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';

const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/34640660362"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <FiMessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppButton;