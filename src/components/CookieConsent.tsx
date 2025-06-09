import React, { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { X, Info, Shield } from 'lucide-react';

const CustomCookieConsent: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  // Verificar si ya se ha dado consentimiento
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setHasConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setHasConsent(true);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setHasConsent(true);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (hasConsent) {
    return null;
  }

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Aceptar"
        declineButtonText="Rechazar"
        cookieName="cookieConsent"
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.25)',
          borderTop: '1px solid rgba(255, 215, 0, 0.3)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 9999,
        }}
        buttonStyle={{
          background: '#FFD700',
          color: '#000',
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        declineButtonStyle={{
          background: 'transparent',
          border: '1px solid #fff',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginRight: '10px',
        }}
        contentStyle={{
          flex: 1,
          margin: '0 20px 0 0',
        }}
        expires={365}
        onAccept={handleAccept}
        onDecline={handleDecline}
        enableDeclineButton
      >
        <div className="flex items-start">
          <div className="mr-4 mt-1">
            <Shield className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-yellow-500 mb-2">Política de Cookies</h3>
            <p className="text-sm text-gray-300 mb-2">
              Utilizamos cookies para mejorar tu experiencia en nuestra web, personalizar contenido y analizar el tráfico.
            </p>
            <button 
              onClick={toggleDetails}
              className="text-yellow-500 text-sm flex items-center hover:underline focus:outline-none"
            >
              <Info className="h-4 w-4 mr-1" />
              {showDetails ? 'Ocultar detalles' : 'Más información'}
            </button>
          </div>
        </div>
      </CookieConsent>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000] p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-yellow-500/30">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-500 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Política de Cookies Detallada
                </h2>
                <button 
                  onClick={toggleDetails}
                  className="text-gray-400 hover:text-white focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4 text-gray-300 text-sm">
                <section>
                  <h3 className="text-white font-semibold mb-2">¿Qué son las cookies?</h3>
                  <p>
                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestra web. 
                    Estas cookies nos ayudan a hacer que el sitio funcione correctamente, hacerlo más seguro, 
                    proporcionar una mejor experiencia de usuario y entender cómo se utiliza el sitio.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-white font-semibold mb-2">Tipos de cookies que utilizamos</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium text-white">Cookies esenciales:</span> Necesarias para el funcionamiento básico del sitio.
                    </li>
                    <li>
                      <span className="font-medium text-white">Cookies de preferencias:</span> Permiten recordar información para personalizar tu experiencia.
                    </li>
                    <li>
                      <span className="font-medium text-white">Cookies estadísticas:</span> Nos ayudan a entender cómo los visitantes interactúan con el sitio.
                    </li>
                    <li>
                      <span className="font-medium text-white">Cookies de marketing:</span> Utilizadas para rastrear a los visitantes en los sitios web.
                    </li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-white font-semibold mb-2">Tus opciones</h3>
                  <p>
                    Puedes elegir aceptar o rechazar las cookies no esenciales. Al hacer clic en "Aceptar", 
                    consientes el uso de todas las cookies. Si haces clic en "Rechazar", solo se utilizarán 
                    las cookies esenciales. Puedes cambiar tu configuración en cualquier momento visitando 
                    nuestra página de política de privacidad.
                  </p>
                </section>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 border border-white text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Rechazar
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-yellow-500 text-black font-medium rounded hover:bg-yellow-600 transition-colors"
                >
                  Aceptar todas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomCookieConsent;