import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { packs } from '../data/packs';
import { Package, CheckCircle, Award, Gift } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useEffect, useState } from 'react';
import { Pack } from '../types';

// Verificar que los packs se están importando correctamente
console.log('Packs importados:', packs);

const PacksPage: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    document.title = 'Packs Sorpresa - FutCamisRetros';
  }, []);
  
  // Usar los packs importados directamente
  const packsData = packs || [];
  
  // Verificamos si packs existe y tiene elementos
  const packsExist = packs && packs.length > 0;
  console.log('¿Existen packs?', packsExist);
  console.log('Número de packs:', packs ? packs.length : 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-500 text-white p-4 rounded-lg inline-block">
              {error}
            </div>
          </div>
        )}
        {!isLoading && !error && (
          <>
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  PACKS <span className="text-yellow-500">SORPRESA</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Descubre la emoción de no saber qué camisetas vas a recibir. Cada pack es una sorpresa única.
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-yellow-500" />
                    <span>Camisetas exclusivas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-yellow-500" />
                    <span>Sorpresa garantizada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Calidad premium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="py-16 bg-gray-800">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white text-center mb-12">
                  ¿CÓMO <span className="text-yellow-500">FUNCIONA?</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-900 p-6 rounded-lg text-center">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black text-2xl font-bold mx-auto mb-4">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Elige tu pack</h3>
                    <p className="text-gray-400">
                      Selecciona el pack que más te guste según tu presupuesto y preferencias.
                    </p>
                  </div>
                  
                  <div className="bg-gray-900 p-6 rounded-lg text-center">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black text-2xl font-bold mx-auto mb-4">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Realiza tu pedido</h3>
                    <p className="text-gray-400">
                      Completa tu compra de forma segura y recibe la confirmación al instante.
                    </p>
                  </div>
                  
                  <div className="bg-gray-900 p-6 rounded-lg text-center">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black text-2xl font-bold mx-auto mb-4">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Recibe tus camisetas</h3>
                    <p className="text-gray-400">
                      Espera la sorpresa en casa y disfruta de tus nuevas camisetas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Packs */}
        {!isLoading && !error && (
          <div className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                ELIGE TU <span className="text-yellow-500">PACK</span>
              </h2>
              
              {/* Packs Individuales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {packsData.filter(pack => pack.jerseyCount === 0 && pack.id.includes('-1') && !pack.id.includes('-10')).length > 0 ? (
                  packsData.filter(pack => pack.jerseyCount === 0 && pack.id.includes('-1') && !pack.id.includes('-10')).map((pack) => {
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
                        className={`relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 ${baseStyle} h-full flex flex-col`}
                      >
                        {/* Decorative elements based on pack type and level */}
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
                            {/* Fondo marmolizado */}
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMCwwIEwyMDAsMjAwIE0tNTAsLTUwIEwyNTAsMjUwIE0tMjUsLTI1IEwyMjUsMjI1IE0yNSwtMjUgTDIyNSwxNzUgTS01MCwwIEwyMDAsMjUwIE0wLC01MCBMMjUwLDIwMCIgc3Ryb2tlPSIjZjVmNWY1IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbWFyYmxlKSIvPjwvc3ZnPg==')] opacity-40"></div>
                            {/* Líneas doradas diagonales */}
                            <div className="absolute inset-0">
                              <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-1/4 left-[-50%] opacity-30"></div>
                              <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-2/4 left-[-50%] opacity-30"></div>
                              <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-3/4 left-[-50%] opacity-30"></div>
                            </div>
                            {/* Marco dorado */}
                            <div className="absolute inset-0 border-[3px] border-[#daa520] rounded-xl opacity-70"></div>
                            <div className="absolute inset-0 border-[1px] border-[#ffd700] rounded-xl opacity-40 transform scale-[0.98]"></div>
                            {/* Efecto brillante */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                          </>
                        )}
                        
                        <div className="p-6 md:p-8 relative flex flex-col flex-grow">
                          {/* Pack name */}
                          <h3 className={`text-2xl md:text-3xl font-bold text-center mb-6 tracking-tight ${isPromesa ? 'text-[#cd7f32] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : isProfesional ? 'text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]' : 'text-[#daa520] drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]'}`}>
                            {pack.name}
                          </h3>

                          {/* Price */}
                          <div className="flex items-center gap-3 mb-6">
                            <span className={`text-2xl md:text-3xl font-bold ${isIcono ? 'text-[#daa520]' : isProfesional ? 'text-black' : 'text-white'} drop-shadow-[0_2px_2px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                              {pack.price.toFixed(2)} €
                            </span>
                            {(pack.id.includes('-5') || pack.id.includes('-10')) && (
                              <>
                                {(() => {
                                  const quantity = pack.id.includes('-10') ? 10 : 5;
                                  const basePackId = pack.id.replace(pack.id.includes('-10') ? '-10' : '-5', '-1');
                                  const basePack = packsData.find(p => p.id === basePackId);
                                  if (basePack) {
                                    const originalTotal = basePack.price * quantity;
                                    const savings = originalTotal - pack.price;
                                    const pricePerUnit = pack.price / quantity;
                                    return (
                                      <>
                                        <span className={`text-[10px] font-semibold ${isIcono ? 'text-green-700' : isProfesional ? 'text-green-800' : 'text-green-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                                          Ahorras {savings.toFixed(2)} €
                                        </span>
                                        <span className={`text-[9px] text-black font-medium drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                                          ({pricePerUnit.toFixed(2)} € por unidad)
                                        </span>
                                      </>
                                    );
                                  }
                                  return null;
                                })()}
                              </>
                            )}
                          </div>

                          {/* Description */}
                          <p className={`text-center mb-6 ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                            {pack.description}
                          </p>
                          
                          {/* Specifications */}
                          <div className={`mb-8 flex-grow ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                            <div className="whitespace-pre-line text-sm leading-relaxed">
                              {pack.specifications}
                            </div>
                          </div>
                          
                          {/* Call-to-action button */}
                          <button 
                            onClick={() => {
                              addItem({
                                ...pack,
                                isPack: true,
                                specifications: '',
                                notes: ''
                              });
                            }}
                            className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 mt-auto ${
                              isPromesa
                                ? 'bg-gradient-to-r from-[#cd7f32] to-[#b87333] text-white shadow-md hover:shadow-lg'
                                : isProfesional
                                  ? 'bg-gradient-to-r from-[#ffd700] to-[#ffcc00] text-black shadow-md hover:shadow-lg'
                                  : 'bg-gradient-to-r from-[#daa520] to-[#b8860b] text-white shadow-md hover:shadow-lg'
                            }`}
                          >
                            <span className={`${isProfesional ? 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]' : isIcono ? 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] text-white' : 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'}`}>
                              Añadir al carrito
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-white text-xl">No hay packs disponibles en este momento. Por favor, vuelve más tarde.</p>
                  </div>
                )}
              </div>
               
               {/* Packs x5 */}
               <div className="mb-12">
                 <h3 className="text-2xl font-bold text-white text-center mb-8">
                   PACKS <span className="text-yellow-500">x5</span> - ¡Ahorra más!
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                   {packsData.filter(pack => pack.jerseyCount === 0 && pack.id.includes('-5')).length > 0 ? (
                     packsData.filter(pack => pack.jerseyCount === 0 && pack.id.includes('-5')).map((pack) => {
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
                           className={`relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 ${baseStyle} h-full flex flex-col`}
                         >
                           {/* Decorative elements based on pack type and level */}
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
                               {/* Fondo marmolizado */}
                               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMCwwIEwyMDAsMjAwIE0tNTAsLTUwIEwyNTAsMjUwIE0tMjUsLTI1IEwyMjUsMjI1IE0yNSwtMjUgTDIyNSwxNzUgTS01MCwwIEwyMDAsMjUwIE0wLC01MCBMMjUwLDIwMCIgc3Ryb2tlPSIjZjVmNWY1IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbWFyYmxlKSIvPjwvc3ZnPg==')] opacity-40"></div>
                               {/* Líneas doradas diagonales */}
                               <div className="absolute inset-0">
                                 <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-1/4 left-[-50%] opacity-30"></div>
                                 <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-2/4 left-[-50%] opacity-30"></div>
                                 <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-3/4 left-[-50%] opacity-30"></div>
                               </div>
                               {/* Marco dorado */}
                               <div className="absolute inset-0 border-[3px] border-[#daa520] rounded-xl opacity-70"></div>
                               <div className="absolute inset-0 border-[1px] border-[#ffd700] rounded-xl opacity-40 transform scale-[0.98]"></div>
                               {/* Efecto brillante */}
                               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                             </>
                           )}
                           
                           <div className="p-6 md:p-8 relative flex flex-col flex-grow">
                             {/* Pack name */}
                             <h3 className={`text-2xl md:text-3xl font-bold text-center mb-6 tracking-tight ${isPromesa ? 'text-[#cd7f32] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : isProfesional ? 'text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]' : 'text-[#daa520] drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]'}`}>
                               {pack.name}
                             </h3>

                             {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                              <span className={`text-2xl md:text-3xl font-bold ${isIcono ? 'text-[#daa520]' : isProfesional ? 'text-black' : 'text-white'} drop-shadow-[0_2px_2px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                                {pack.price.toFixed(2)} €
                              </span>
                              {(() => {
                                 const quantity = 5;
                                 const basePackId = pack.id.replace('-5', '-1');
                                 const basePack = packsData.find(p => p.id === basePackId);
                                if (basePack) {
                                  const originalTotal = basePack.price * quantity;
                                  const savings = originalTotal - pack.price;
                                  const pricePerUnit = pack.price / quantity;
                                  return (
                                    <>
                                      <span className={`text-[10px] font-semibold ${isIcono ? 'text-green-700' : isProfesional ? 'text-green-800' : 'text-green-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                                        Ahorras {savings.toFixed(2)} €
                                      </span>
                                      <span className={`text-[9px] text-black font-medium drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                                        ({pricePerUnit.toFixed(2)} € por unidad)
                                      </span>
                                    </>
                                  );
                                }
                                return null;
                              })()}
                            </div>

                             {/* Description */}
                             <p className={`text-center mb-6 ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                               {pack.description}
                             </p>
                             
                             {/* Specifications */}
                             <div className={`mb-8 flex-grow ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                               <div className="whitespace-pre-line text-sm leading-relaxed">
                                 {pack.specifications}
                               </div>
                             </div>
                             
                             {/* Call-to-action button */}
                             <button 
                               onClick={() => {
                                 addItem({
                                   ...pack,
                                   isPack: true,
                                   specifications: '',
                                   notes: ''
                                 });
                               }}
                               className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 mt-auto ${
                                 isPromesa
                                   ? 'bg-gradient-to-r from-[#cd7f32] to-[#b87333] text-white shadow-md hover:shadow-lg'
                                   : isProfesional
                                     ? 'bg-gradient-to-r from-[#ffd700] to-[#ffcc00] text-black shadow-md hover:shadow-lg'
                                     : 'bg-gradient-to-r from-[#daa520] to-[#b8860b] text-white shadow-md hover:shadow-lg'
                               }`}
                             >
                               <span className={`${isProfesional ? 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]' : isIcono ? 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] text-white' : 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'}`}>
                                 Añadir al carrito
                               </span>
                             </button>
                           </div>
                         </div>
                       );
                     })
                   ) : (
                     <div className="col-span-3 text-center py-8">
                       <p className="text-white text-xl">No hay packs x5 disponibles en este momento.</p>
                     </div>
                   )}
                 </div>
               </div>
               
               {/* Packs x10 */}
               <div className="mb-12">
                 <h3 className="text-2xl font-bold text-white text-center mb-8">
                   PACKS <span className="text-yellow-500">x10</span> - ¡Máximo ahorro!
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {packsData.filter(pack => pack.jerseyCount === 0 && pack.id.includes('-10')).length > 0 ? (
                     packsData.filter(pack => pack.jerseyCount === 0 && pack.id.includes('-10')).map((pack) => {
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
                           className={`relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 ${baseStyle} h-full flex flex-col`}
                         >
                           {/* Decorative elements based on pack type and level */}
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
                               {/* Fondo marmolizado */}
                               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMCwwIEwyMDAsMjAwIE0tNTAsLTUwIEwyNTAsMjUwIE0tMjUsLTI1IEwyMjUsMjI1IE0yNSwtMjUgTDIyNSwxNzUgTS01MCwwIEwyMDAsMjUwIE0wLC01MCBMMjUwLDIwMCIgc3Ryb2tlPSIjZjVmNWY1IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbWFyYmxlKSIvPjwvc3ZnPg==')] opacity-40"></div>
                               {/* Líneas doradas diagonales */}
                               <div className="absolute inset-0">
                                 <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-1/4 left-[-50%] opacity-30"></div>
                                 <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-2/4 left-[-50%] opacity-30"></div>
                                 <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-3/4 left-[-50%] opacity-30"></div>
                               </div>
                               {/* Marco dorado */}
                               <div className="absolute inset-0 border-[3px] border-[#daa520] rounded-xl opacity-70"></div>
                               <div className="absolute inset-0 border-[1px] border-[#ffd700] rounded-xl opacity-40 transform scale-[0.98]"></div>
                               {/* Efecto brillante */}
                               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                             </>
                           )}
                           
                           <div className="p-6 md:p-8 relative flex flex-col flex-grow">
                             {/* Pack name */}
                             <h3 className={`text-2xl md:text-3xl font-bold text-center mb-6 tracking-tight ${isPromesa ? 'text-[#cd7f32] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : isProfesional ? 'text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]' : 'text-[#daa520] drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]'}`}>
                               {pack.name}
                             </h3>

                             {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                              <span className={`text-2xl md:text-3xl font-bold ${isIcono ? 'text-[#daa520]' : isProfesional ? 'text-black' : 'text-white'} drop-shadow-[0_2px_2px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                                {pack.price.toFixed(2)} €
                              </span>
                              {(() => {
                                 const quantity = 10;
                                 const basePackId = pack.id.replace('-10', '-1');
                                 const basePack = packsData.find(p => p.id === basePackId);
                                if (basePack) {
                                  const originalTotal = basePack.price * quantity;
                                  const savings = originalTotal - pack.price;
                                  const pricePerUnit = pack.price / quantity;
                                  return (
                                    <>
                                      <span className={`text-[10px] font-semibold ${isIcono ? 'text-green-700' : isProfesional ? 'text-green-800' : 'text-green-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                                        Ahorras {savings.toFixed(2)} €
                                      </span>
                                      <span className={`text-[9px] text-black font-medium drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                                        ({pricePerUnit.toFixed(2)} € por unidad)
                                      </span>
                                    </>
                                  );
                                }
                                return null;
                              })()}
                            </div>

                             {/* Description */}
                             <p className={`text-center mb-6 ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                               {pack.description}
                             </p>
                             
                             {/* Specifications */}
                             <div className={`mb-8 flex-grow ${isIcono ? 'text-gray-800' : isProfesional ? 'text-black' : 'text-gray-300'} drop-shadow-[0_1px_1px_${isProfesional ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)'}]`}>
                               <div className="whitespace-pre-line text-sm leading-relaxed">
                                 {pack.specifications}
                               </div>
                             </div>
                             
                             {/* Call-to-action button */}
                             <button 
                               onClick={() => {
                                 addItem({
                                   ...pack,
                                   isPack: true,
                                   specifications: '',
                                   notes: ''
                                 });
                               }}
                               className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 mt-auto ${
                                 isPromesa
                                   ? 'bg-gradient-to-r from-[#cd7f32] to-[#b87333] text-white shadow-md hover:shadow-lg'
                                   : isProfesional
                                     ? 'bg-gradient-to-r from-[#ffd700] to-[#ffcc00] text-black shadow-md hover:shadow-lg'
                                     : 'bg-gradient-to-r from-[#daa520] to-[#b8860b] text-white shadow-md hover:shadow-lg'
                               }`}
                             >
                               <span className={`${isProfesional ? 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]' : isIcono ? 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] text-white' : 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'}`}>
                                 Añadir al carrito
                               </span>
                             </button>
                           </div>
                         </div>
                       );
                     })
                   ) : (
                     <div className="col-span-3 text-center py-8">
                       <p className="text-white text-xl">No hay packs x10 disponibles en este momento.</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PacksPage;