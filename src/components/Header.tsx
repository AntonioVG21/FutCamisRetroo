import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Trophy, ShieldCheck, Globe, PhoneCall, Heart } from 'lucide-react';
import { leagues } from '../data/leagues';
import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useDiscountStore } from '../store/discountStore';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leaguesMenuOpen, setLeaguesMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const { items, toggleCart } = useCartStore();
  const { items: favoriteItems } = useFavoritesStore();
  const { activateDiscount, isDiscountActive } = useDiscountStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (leaguesMenuOpen) setLeaguesMenuOpen(false);
  };

  const toggleLeaguesMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLeaguesMenuOpen(!leaguesMenuOpen);
  };

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    
    if (newCount === 5) {
      if (!isDiscountActive) {
        activateDiscount(50); // Activar descuento del 50%
        toast.success('¡Has conseguido un 50% de descuento en tu compra!');
      } else {
        toast.error('Ya tienes un descuento activo');
      }
      setLogoClickCount(0);
    } else {
      // Reset counter after 3 seconds if not completed
      setTimeout(() => {
        setLogoClickCount(0);
      }, 3000);
    }
  };

  return (
    <header className="bg-gradient-to-r from-black to-gray-900 text-white fixed w-full z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 lg:w-1/4 w-auto">
            <img src="/imagenes/camisetas-web/Logo-removebg-preview.png" alt="FutCamisRetros Logo" className="h-10 mr-2 cursor-pointer" onClick={handleLogoClick} />
            <div className="text-2xl font-bold mr-2 truncate">
              <span className="text-yellow-500 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">FutCamis</span>
              <span className="text-white drop-shadow-[0_1px_2px_rgba(255,215,0,0.3)]">Retros</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12 mx-auto justify-center w-2/4">
            <a href="/" className="font-medium hover:text-yellow-500 transition-all duration-300 transform hover:scale-105 border-b-2 border-transparent hover:border-yellow-500 pb-1">
              Inicio
            </a>
            <a href="/packs" className="font-medium hover:text-yellow-500 transition-all duration-300 transform hover:scale-105 border-b-2 border-transparent hover:border-yellow-500 pb-1">
              Packs Sorpresa
            </a>
            <div className="relative">
              <button 
                onClick={toggleLeaguesMenu}
                className="font-medium hover:text-yellow-500 transition-colors flex items-center"
              >
                Ligas
                <span className={`ml-1 transition-transform duration-200 ${leaguesMenuOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {/* Leagues Dropdown */}
              {leaguesMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 p-4 grid grid-cols-2 gap-2">
                  {leagues.map((league) => (
                    <a 
                      key={league.id}
                      href={`/league/${league.id}`}
                      className={`flex items-center px-3 py-2 text-sm rounded hover:bg-gray-800 ${
                        league.isRetro ? 'text-yellow-500 font-bold' : 'text-gray-200'
                      }`}
                    >
                      {league.isRetro ? (
                        <Trophy className="h-4 w-4 mr-2" />
                      ) : league.icon === 'Globe' ? (
                        <Globe className="h-4 w-4 mr-2" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 mr-2" />
                      )}
                      {league.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="/kids" className="font-medium hover:text-yellow-500 transition-all duration-300 transform hover:scale-105 border-b-2 border-transparent hover:border-yellow-500 pb-1">
              Niños
            </a>
          </nav>

          {/* Contact Button and Cart */}
          <div className="flex items-center space-x-2 flex-shrink-0 lg:w-1/4 w-auto justify-end">
            <a 
              href="https://wa.me/34640660362" 
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <PhoneCall className="h-4 w-4 mr-2 animate-pulse" />
              WhatsApp
            </a>
            <a href="/favorites" className="relative p-2 hover:bg-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-md ml-3">
              <Heart className="h-6 w-6 text-red-400 hover:text-red-500 transition-colors" />
              {favoriteItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {favoriteItems.length}
                </span>
              )}
            </a>
            <button 
              onClick={toggleCart} 
              className="relative p-2 hover:bg-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-md ml-3"
            >
              <ShoppingCart className="h-6 w-6 text-yellow-400 hover:text-yellow-500 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 focus:outline-none" 
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 p-4">
          <nav className="flex flex-col space-y-4">
            <a 
              href="/" 
              className="text-white hover:text-yellow-500 py-2 border-b border-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </a>
            <a 
              href="/packs" 
              className="text-white hover:text-yellow-500 py-2 border-b border-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Packs Sorpresa
            </a>
            <div className="py-2 border-b border-gray-800">
              <div 
                className="flex justify-between items-center text-white hover:text-yellow-500 cursor-pointer"
                onClick={toggleLeaguesMenu}
              >
                <span>Ligas</span>
                <span className={`transition-transform duration-200 ${leaguesMenuOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              
              {leaguesMenuOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  {leagues.map((league) => (
                    <a 
                      key={league.id}
                      href={`/league/${league.id}`}
                      className={`block py-1 ${
                        league.isRetro ? 'text-yellow-500 font-bold' : 'text-gray-300'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {league.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a 
              href="/kids" 
              className="text-white hover:text-yellow-500 py-2 border-b border-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Niños
            </a>
            <a 
              href="https://wa.me/34640660362" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Contactar por WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;