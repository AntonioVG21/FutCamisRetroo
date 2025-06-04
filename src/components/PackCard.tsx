import React from 'react';
import { Pack } from '../types';

interface PackCardProps {
  pack: Pack;
  loading: string;
  handleAddToCart: (pack: Pack) => void;
  type: 'promesa' | 'profesional' | 'icono';
}

const PackCard: React.FC<PackCardProps> = ({ pack, loading, handleAddToCart, type }) => {
  // Definir estilos según el tipo de pack
  let baseStyle = '';
  let textColor = '';
  let buttonGradient = '';
  let checkColor = '';
  let borderColor = '';
  let titleColor = '';
  let bgPattern = '';
  
  switch (type) {
    case 'promesa':
      baseStyle = 'bg-gradient-to-br from-[#b87333] via-[#da8a67] to-[#8b4513]';
      textColor = 'text-gray-300';
      buttonGradient = 'from-[#cd7f32] to-[#b87333]';
      checkColor = 'text-[#cd7f32]';
      borderColor = 'border-[#b87333]';
      titleColor = 'text-[#cd7f32]';
      bgPattern = "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMjBMMjAgMEw0MCAyMEwyMCA0MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NkN2YzMiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]";
      break;
    case 'profesional':
      baseStyle = 'bg-gradient-to-br from-[#c0c0c0] to-[#e8e8e8]';
      textColor = 'text-gray-800';
      buttonGradient = 'from-[#808080] to-[#a9a9a9]';
      checkColor = 'text-[#4a90e2]';
      borderColor = 'border-[#a9a9a9]';
      titleColor = 'text-[#808080]';
      bgPattern = "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMCwwIEwyMDAsMjAwIE0tNTAsLTUwIEwyNTAsMjUwIE0tMjUsLTI1IEwyMjUsMjI1IE0yNSwtMjUgTDIyNSwxNzUgTS01MCwwIEwyMDAsMjUwIE0wLC01MCBMMjUwLDIwMCIgc3Ryb2tlPSIjZjVmNWY1IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbWFyYmxlKSIvPjwvc3ZnPg==')]";
      break;
    case 'icono':
      baseStyle = 'bg-gradient-to-br from-white to-[#f5f5f5]';
      textColor = 'text-gray-800';
      buttonGradient = 'from-[#daa520] to-[#b8860b]';
      checkColor = 'text-[#4a90e2]';
      borderColor = 'border-[#daa520]';
      titleColor = 'text-[#daa520]';
      bgPattern = "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMCwwIEwyMDAsMjAwIE0tNTAsLTUwIEwyNTAsMjUwIE0tMjUsLTI1IEwyMjUsMjI1IE0yNSwtMjUgTDIyNSwxNzUgTS01MCwwIEwyMDAsMjUwIE0wLC01MCBMMjUwLDIwMCIgc3Ryb2tlPSIjZjVmNWY1IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbWFyYmxlKSIvPjwvc3ZnPg==')]";
      break;
  }

  // Renderizar el componente de tarjeta
  return (
    <div 
      key={pack.id} 
      className={`relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 ${baseStyle}`}
    >
      <div className={`absolute inset-0 ${bgPattern} opacity-40`}></div>
      
      {type === 'icono' && (
        <div className="absolute inset-0">
          <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-1/4 left-[-50%] opacity-30"></div>
          <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-2/4 left-[-50%] opacity-30"></div>
          <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-3/4 left-[-50%] opacity-30"></div>
        </div>
      )}
      
      <div className={`absolute inset-0 border-[3px] ${borderColor} rounded-xl opacity-70`}></div>
      <div className={`absolute inset-0 border-[1px] ${borderColor} rounded-xl opacity-40 transform scale-[0.98]`}></div>
      
      <div className="p-6 md:p-8 relative">
        <h3 className={`text-2xl font-bold mb-3 ${titleColor} drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]`}>
          {pack.name}
        </h3>
        <div className="flex flex-col mb-6">
          <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {pack.price.toFixed(2)} €
          </span>
          {pack.jerseyCount > 1 && (
            <div className="mt-1">
              <span className={`text-sm font-medium ${textColor} drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]`}>
                {(pack.price / pack.jerseyCount).toFixed(2)} € por unidad
              </span>
              {pack.jerseyCount === 5 && (
                <span className="ml-2 text-sm font-bold text-green-500">
                  ¡Ahorras {type === 'promesa' ? '15' : '25'}€!
                </span>
              )}
              {pack.jerseyCount === 10 && (
                <span className="ml-2 text-sm font-bold text-green-500">
                  ¡Ahorras {type === 'promesa' ? '50' : '80'}€!
                </span>
              )}
            </div>
          )}
        </div>
        <p className={`mb-6 ${textColor} drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]`}>
          {pack.description}
        </p>
      
        <ul className="space-y-3 mb-8">
          <li className={`flex items-center ${textColor} drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]`}>
            <span className={`mr-2 ${checkColor}`}>✓</span>
            {pack.jerseyCount} Camisetas de fútbol
          </li>
          <li className={`flex items-center ${textColor} drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]`}>
            <span className={`mr-2 ${checkColor}`}>✓</span>
            Envío rápido y seguro
          </li>
          <li className={`flex items-center ${textColor} drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]`}>
            <span className={`mr-2 ${checkColor}`}>✓</span>
            Selección aleatoria
          </li>
        </ul>
      
        <button 
          type="button"
          data-testid={`add-to-cart-${pack.id}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart(pack);
          }}
          disabled={loading === pack.id}
          className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 ${loading === pack.id ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r ${buttonGradient} text-white shadow-md hover:shadow-lg`}
        >
          {loading === pack.id ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2"></div>
              Añadiendo...
            </div>
          ) : (
            <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] text-white">
              Añadir al carrito
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PackCard;