import React from 'react';
import { FiFacebook, FiInstagram, FiTruck, FiCreditCard, FiMail } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Social Media Banner */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 mb-12 shadow-lg">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Síguenos en redes sociales</h3>
            <p className="text-gray-300">Mantente al día con nuestras novedades y ofertas exclusivas</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-700 text-gray-300 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-md">
              <FiFacebook className="h-7 w-7" />
            </a>
            <a href="https://www.instagram.com/futcamisretros/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-700 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 shadow-md">
              <FiInstagram className="h-7 w-7" />
            </a>
            <a href="https://www.tiktok.com/@futcamisretro_esp" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-700 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-[#00f2ea] hover:to-[#ff0050] transition-all duration-300 transform hover:scale-110 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="flex flex-col items-center text-center">
            <FiTruck className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Envío Rápido</h3>
            <p className="text-sm">Entrega en 24-48 horas a toda la península.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FiCreditCard className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Pago Seguro</h3>
            <p className="text-sm">Múltiples métodos de pago 100% seguros.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FiMail className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Atención al Cliente</h3>
            <p className="text-sm">Soporte vía WhatsApp, email o teléfono.</p>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-t border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              <span className="text-yellow-500">FutCamis</span>Retros
            </h2>
            <p className="mb-4 text-sm">
              Tu tienda especializada en camisetas retro de fútbol baratas de todas las ligas y épocas.
            </p>
            <p className="mb-4 text-sm text-gray-400">
              Ofrecemos las mejores camisetas clásicas con envíos rápidos y precios increíbles.
            </p>
            <h3 className="text-lg font-bold text-white mb-3">Síguenos en redes</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-md">
                <FiFacebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/futcamisretros/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 shadow-md">
                <FiInstagram className="h-6 w-6" />
              </a>
              <a href="https://www.tiktok.com/@futcamisretro_esp" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-[#00f2ea] hover:to-[#ff0050] transition-all duration-300 transform hover:scale-110 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/league/retro" className="hover:text-yellow-500 transition-colors">Camisetas Retro</a></li>
              <li><a href="/league/premier-league" className="hover:text-yellow-500 transition-colors">Camisetas Premier League</a></li>
              <li><a href="/league/la-liga" className="hover:text-yellow-500 transition-colors">Camisetas LaLiga</a></li>
              <li><a href="/league/serie-a" className="hover:text-yellow-500 transition-colors">Camisetas Serie A</a></li>
              <li><a href="/league/bundesliga" className="hover:text-yellow-500 transition-colors">Camisetas Bundesliga</a></li>
              <li><a href="/catalog" className="hover:text-yellow-500 transition-colors">Todas las Camisetas</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-yellow-500 transition-colors">Inicio</a></li>
              <li><a href="/packs" className="hover:text-yellow-500 transition-colors">Packs Sorpresa</a></li>
              <li><a href="/kids" className="hover:text-yellow-500 transition-colors">Camisetas para Niños</a></li>
              <li><a href="/#about" className="hover:text-yellow-500 transition-colors">Sobre Nosotros</a></li>
              <li><a href="/catalog?sort=price-asc" className="hover:text-yellow-500 transition-colors">Camisetas Baratas</a></li>
              <li><a href="/catalog?filter=retro" className="hover:text-yellow-500 transition-colors">Camisetas Retro</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: futcamisretros@gmail.com</li>
              <li>WhatsApp: +34 640 660 362</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-800 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} FutCamisRetros. Todos los derechos reservados.</p>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="#" className="hover:text-yellow-500 transition-colors">Términos y Condiciones</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Política de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;