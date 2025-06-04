import React from 'react';
import { FiTruck, FiAward } from 'react-icons/fi';
import { IoFootball } from 'react-icons/io5';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              SOBRE <span className="text-yellow-500">NOSOTROS</span>
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              En FutCamisRetros somos apasionados del fútbol y las camisetas históricas. Nuestra misión es ofrecerte las mejores camisetas retro de fútbol de todas las ligas y épocas con la mejor calidad y al mejor precio. Revive los momentos más emblemáticos del deporte rey con nuestras camisetas de leyendas y equipos históricos.
            </p>
           
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <IoFootball className="h-8 w-8 text-yellow-500 mb-2" />
                <h3 className="text-white font-bold mb-1">Pasión por el fútbol</h3>
                <p className="text-gray-400 text-sm">Amamos este deporte tanto como tú</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <FiTruck className="h-8 w-8 text-yellow-500 mb-2" />
                <h3 className="text-white font-bold mb-1">Envío rápido</h3>
                <p className="text-gray-400 text-sm">Entregas en 24-48h a toda la península</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <FiAward className="h-8 w-8 text-yellow-500 mb-2" />
                <h3 className="text-white font-bold mb-1">Calidad</h3>
                <p className="text-gray-400 text-sm">Materiales premium y acabados perfectos</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Estadio de fútbol profesional" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-xl font-bold">Revive la historia del fútbol con nuestras camisetas retro</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 h-32 w-32 bg-yellow-500 opacity-20 rounded-full blur-2xl z-0"></div>
            <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-yellow-500 opacity-10 rounded-full blur-3xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;