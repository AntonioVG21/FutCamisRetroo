import React from 'react';
import { packs } from '../data/packs';
import { Package } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const SurprisePacks: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const [loading, setLoading] = React.useState<string>('');

  const handleAddToCart = async (pack: typeof packs[0]) => {
    if (loading) return;
    console.log('Adding pack to cart:', pack);
    try {
      setLoading(pack.id);
      addItem({
        id: pack.id,
        name: pack.name,
        price: pack.price,
        image: pack.image,
        quantity: 1,
        isPack: true,
        specifications: "",
        notes: "",
        jerseyCount: pack.jerseyCount,
        freeJerseys: pack.freeJerseys,
        description: pack.description
      });
      console.log('Pack added successfully');
    } catch (error) {
      console.error('Error adding pack to cart:', error);
    } finally {
      setLoading('');
    }
  };

  return (
    <section className="py-16 bg-[#0c0c14] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-500 p-3 rounded-full mb-4">
            <Package className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            PACKS <span className="text-yellow-500">SORPRESA</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ¿Te atreves a probar suerte? Consigue camisetas a precios increíbles con nuestros packs sorpresa
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packs.filter(pack => pack.jerseyCount === 1).map((pack) => {
            const isPromesa = pack.name.toLowerCase().includes('promesa');
            const isProfesional = pack.name.toLowerCase().includes('profesional');
            const isIcono = pack.name.toLowerCase().includes('icono');

            const baseStyle = isPromesa
              ? 'bg-gradient-to-br from-[#b87333] via-[#da8a67] to-[#8b4513]' // Cobre mejorado
              : isProfesional
                ? 'bg-gradient-to-br from-[#ffd700] via-[#ffed4e] to-[#b8860b]' // Gradiente dorado mejorado
                : 'bg-gradient-to-br from-white to-[#f5f5f5]'; // Estilo FIFA Icon

            return (
              <div 
                key={pack.id} 
                className={`relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 ${baseStyle}`}
              >
                {isPromesa && (
                  <>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMjBMMjAgMEw0MCAyMEwyMCA0MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NkN2YzMiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent opacity-20"></div>
                    <div className="absolute inset-0 border-2 border-[#b87333] rounded-xl"></div>
                    <div className="absolute inset-0 border-[1px] border-[#cd7f32] rounded-xl opacity-50 transform scale-[0.99]"></div>
                  </>
                )}
                {isProfesional && (
                  <>
                    {/* Fondo base dorado con brillo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700] via-[#ffed4e] to-[#b8860b]"></div>
                    {/* Efecto de brillo central */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-white via-transparent to-transparent opacity-40"></div>
                    {/* Efecto de brillo superior */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent opacity-60"></div>
                    {/* Efecto de brillo horizontal */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffd700] via-[#ffed4e] to-[#ffd700] opacity-40"></div>
                    {/* Efecto de brillo en esquinas */}
                    <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-white to-transparent opacity-40"></div>
                    <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-white to-transparent opacity-30"></div>
                    {/* Borde superior brillante */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>
                    {/* Marco dorado mejorado con brillo */}
                    <div className="absolute inset-0 border-[3px] border-[#b8860b] rounded-xl shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute inset-0 border-[1px] border-[#ffd700] rounded-xl opacity-90 transform scale-[0.98]"></div>
                    <div className="absolute inset-0 border-[1px] border-[#ffed4e] rounded-xl opacity-60 transform scale-[0.96]"></div>
                  </>
                )}
                {isIcono && (
                  <>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMCwwIEwyMDAsMjAwIE0tNTAsLTUwIEwyNTAsMjUwIE0tMjUsLTI1IEwyMjUsMjI1IE0yNSwtMjUgTDIyNSwxNzUgTS01MCwwIEwyMDAsMjUwIE0wLC01MCBMMjUwLDIwMCIgc3Ryb2tlPSIjZjVmNWY1IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbWFyYmxlKSIvPjwvc3ZnPg==')] opacity-40"></div>
                    <div className="absolute inset-0">
                      <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-1/4 left-[-50%] opacity-30"></div>
                      <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-2/4 left-[-50%] opacity-30"></div>
                      <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-3/4 left-[-50%] opacity-30"></div>
                    </div>
                    <div className="absolute inset-0 border-[3px] border-[#daa520] rounded-xl opacity-70"></div>
                    <div className="absolute inset-0 border-[1px] border-[#ffd700] rounded-xl opacity-40 transform scale-[0.98]"></div>
                  </>
                )}
                
                <div className="p-6 md:p-8 relative">
                  <h3 className={`text-2xl font-bold mb-3 ${isPromesa ? 'text-[#cd7f32] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : isProfesional ? 'text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]' : 'text-[#daa520] drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]'}`}>
                    {pack.name}
                  </h3>
                  <div className="flex flex-col mb-6">
                    <span className={`text-3xl md:text-4xl font-bold ${isIcono ? 'text-[#daa520]' : isProfesional ? 'text-black' : 'text-white'} drop-shadow-[0_2px_2px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                      {pack.price.toFixed(2)} €
                    </span>
                    {pack.jerseyCount === 1 ? null : (
                      <div className="mt-1">
                        <span className={`text-sm font-medium ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                          {(pack.price / pack.jerseyCount).toFixed(2)} € por unidad
                        </span>
                        {pack.type === 'promesa' && pack.jerseyCount === 5 && (
                          <span className="ml-2 text-sm font-bold text-green-500">¡Ahorras 15€!</span>
                        )}
                        {pack.type === 'profesional' && pack.jerseyCount === 5 && (
                          <span className="ml-2 text-sm font-bold text-green-500">¡Ahorras 12.50€!</span>
                        )}
                        {pack.type === 'icono' && pack.jerseyCount === 5 && (
                          <span className="ml-2 text-sm font-bold text-green-500">¡Ahorras 25€!</span>
                        )}
                        {pack.type === 'promesa' && pack.jerseyCount === 10 && (
                          <span className="ml-2 text-sm font-bold text-green-500">¡Ahorras 50€!</span>
                        )}
                        {pack.type === 'profesional' && pack.jerseyCount === 10 && (
                          <span className="ml-2 text-sm font-bold text-green-500">¡Ahorras 50€!</span>
                        )}
                        {pack.type === 'icono' && pack.jerseyCount === 10 && (
                          <span className="ml-2 text-sm font-bold text-green-500">¡Ahorras 80€!</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className={`mb-6 ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                    {pack.description}
                  </p>
                
                <ul className="space-y-3 mb-8">
                    <li className={`flex items-center ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                      <span className={`mr-2 ${isPromesa ? 'text-[#cd7f32]' : isProfesional ? 'text-black' : 'text-[#4a90e2]'}`}>✓</span>
                      {pack.jerseyCount} Camisetas de fútbol
                    </li>
                    <li className={`flex items-center ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                      <span className={`mr-2 ${isPromesa ? 'text-[#cd7f32]' : isProfesional ? 'text-black' : 'text-[#4a90e2]'}`}>✓</span>
                      Envío rápido y seguro
                    </li>
                    <li className={`flex items-center ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                      <span className={`mr-2 ${isPromesa ? 'text-[#cd7f32]' : isProfesional ? 'text-black' : 'text-[#4a90e2]'}`}>✓</span>
                      Selección aleatoria
                    </li>
                  </ul>
                
                <button 
                  type="button"
                  data-testid={`add-to-cart-${pack.id}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    console.log('Button mousedown for pack:', pack.name);
                  }}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    console.log('Button mouseup for pack:', pack.name);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked for pack:', pack.name);
                    handleAddToCart(pack);
                  }}
                  disabled={loading === pack.id}
                  className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 ${loading === pack.id ? 'opacity-50 cursor-not-allowed' : ''} ${
                    isPromesa
                      ? 'bg-gradient-to-r from-[#cd7f32] to-[#b87333] text-white shadow-md hover:shadow-lg'
                      : isProfesional
                        ? 'bg-gradient-to-r from-[#ffd700] to-[#ffcc00] text-black shadow-md hover:shadow-lg'
                        : 'bg-gradient-to-r from-[#daa520] to-[#b8860b] text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {loading === pack.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                      Añadiendo...
                    </div>
                  ) : (
                    <span className={`${isProfesional ? 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]' : isIcono ? 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] text-white' : 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'}`}>
                      Añadir al carrito
                    </span>
                  )}
                </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SurprisePacks;