import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] bg-black">
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          isLoaded ? 'opacity-60' : 'opacity-0'
        }`}
        style={{ 
          backgroundImage: `url(https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
        <div className={`text-center transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            ELIGE TU <span className="text-yellow-500">CAMISETA</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Las mejores camisetas de fútbol de todas las ligas y épocas
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/catalog" 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              VER CATÁLOGO
            </a>
            <a 
              href="/packs" 
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 border border-yellow-500 shadow-lg"
            >
              PACKS SORPRESA
            </a>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </div>
  );
};

export default Hero;