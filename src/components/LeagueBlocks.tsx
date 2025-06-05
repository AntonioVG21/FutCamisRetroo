import React from 'react';
import { FiAward, FiShield, FiGlobe } from 'react-icons/fi';
import { leagues } from '../data/leagues';

const LeagueBlock: React.FC<{ 
  id: string; 
  name: string; 
  icon: string;
  isRetro?: boolean;
}> = ({ id, name, icon, isRetro }) => {
  return (
    <a 
      href={`/league/${id}`}
      className={`relative overflow-hidden group rounded-lg ${
        isRetro 
          ? 'bg-gradient-to-br from-yellow-500 to-yellow-700' 
          : 'bg-gradient-to-br from-gray-800 to-gray-900'
      } p-6 flex flex-col items-center justify-center h-44 transition-transform transform hover:scale-105 shadow-lg`}
    >
      {/* Background pattern for "card" effect */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
      
      {/* Icon */}
      <div className={`text-white mb-4 rounded-full p-3 ${
        isRetro ? 'bg-yellow-600' : 'bg-gray-700'
      }`}>
        {icon === 'Trophy' ? (
          <FiAward className={`h-8 w-8 ${isRetro ? 'text-white' : 'text-gray-300'}`} />
        ) : icon === 'Globe' ? (
          <FiGlobe className="h-8 w-8 text-gray-300" />
        ) : (
          <FiShield className="h-8 w-8 text-gray-300" />
        )}
      </div>
      
      {/* Name */}
      <h3 className={`text-xl font-bold text-white text-center ${
        isRetro ? 'text-black' : 'text-white'
      }`}>
        {name}
      </h3>
      
      {/* Shine effect on hover */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </a>
  );
};

const LeagueBlocks: React.FC = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            SELECCIONA <span className="text-yellow-500">TU LIGA</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explora nuestras colecciones por ligas y encuentra la camiseta de tu equipo favorito
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {leagues.sort((a, b) => (a.isRetro === b.isRetro) ? 0 : a.isRetro ? -1 : 1).map((league) => (
            <LeagueBlock 
              key={league.id}
              id={league.id}
              name={league.name}
              icon={league.icon}
              isRetro={league.isRetro}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeagueBlocks;