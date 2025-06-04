import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { packs } from '../data/packs';
import { Package } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useEffect, useState } from 'react';
import { Pack } from '../types';
import toast from 'react-hot-toast';

// Verificar que los packs se están importando correctamente
console.log('Packs importados:', packs);

const PacksPage: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const [loading, setLoading] = useState<string>('');
  
  useEffect(() => {
    document.title = 'Packs Sorpresa - FutCamisRetros';
  }, []);
  
  const handleAddToCart = async (pack: Pack) => {
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
        specifications: pack.specifications || "",
        notes: pack.notes || "",
        jerseyCount: pack.jerseyCount,
        freeJerseys: pack.freeJerseys || 0,
        description: pack.description
      });
      toast.success(`${pack.name} añadido al carrito`);
      console.log('Pack added successfully');
    } catch (error) {
      console.error('Error adding pack to cart:', error);
      toast.error('Error al añadir al carrito');
    } finally {
      setLoading('');
    }
  };

  // Agrupar packs por tipo (Promesa, Profesional, Icono)
  const promesaPacks = packs.filter(pack => pack.name.toLowerCase().includes('promesa'));
  const profesionalPacks = packs.filter(pack => pack.name.toLowerCase().includes('profesional'));
  const iconoPacks = packs.filter(pack => pack.name.toLowerCase().includes('icono'));
  
  // Ordenar cada grupo por cantidad (individual, x5, x10)
  const sortByJerseyCount = (a: Pack, b: Pack) => a.jerseyCount - b.jerseyCount;
  
  // Filtrar packs individuales y múltiples para cada tipo
  const promesaIndividual = promesaPacks.filter(pack => pack.jerseyCount === 1);
  const promesaMultiple = promesaPacks.filter(pack => pack.jerseyCount > 1).sort(sortByJerseyCount);
  
  const profesionalIndividual = profesionalPacks.filter(pack => pack.jerseyCount === 1);
  const profesionalMultiple = profesionalPacks.filter(pack => pack.jerseyCount > 1).sort(sortByJerseyCount);
  
  const iconoIndividual = iconoPacks.filter(pack => pack.jerseyCount === 1);
  const iconoMultiple = iconoPacks.filter(pack => pack.jerseyCount > 1).sort(sortByJerseyCount);

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0c14]">
      <Header />
      <main className="flex-grow pt-20 pb-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-yellow-500 p-3 rounded-full mb-4">
              <Package className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              PACKS <span className="text-yellow-500">SORPRESA</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              ¿Te atreves a probar suerte? Consigue camisetas a precios increíbles con nuestros packs sorpresa
            </p>
            
            {/* Sección de cómo funciona */}
            <div className="mt-8 mb-12">
              <h3 className="text-2xl font-bold text-white mb-6 animate-pulse">CÓMO FUNCIONA</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* Paso 1 */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-yellow-500 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                  <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <span className="text-black font-bold text-xl">1</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">ELIGE EL PACK QUE QUIERES</h4>
                  <p className="text-gray-300">Selecciona entre nuestros diferentes packs según tus preferencias y presupuesto.</p>
                </div>
                
                {/* Paso 2 */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-yellow-500 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: '0.1s'}}>
                    <span className="text-black font-bold text-xl">2</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">PON TUS ESPECIFICACIONES</h4>
                  <p className="text-gray-300">Indícanos tus preferencias de equipos, tallas o cualquier detalle especial.</p>
                </div>
                
                {/* Paso 3 */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-yellow-500 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                  <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: '0.2s'}}>
                    <span className="text-black font-bold text-xl">3</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">DISFRÚTALA SOLO Y CON TUS AMIGOS</h4>
                  <p className="text-gray-300">Recibe tus camisetas sorpresa y disfruta de tu nueva colección.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Grid principal de 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Columna 1: Packs Promesa */}
            <div className="flex flex-col space-y-8">
              {/* Pack Promesa Individual */}
              {promesaIndividual.map((pack) => {
                return (
                  <div 
                    key={pack.id} 
                    className="relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 bg-gradient-to-br from-[#b87333] via-[#da8a67] to-[#8b4513]"
                  >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMjBMMjAgMEw0MCAyMEwyMCA0MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NkN2YzMiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent opacity-20"></div>
                    <div className="absolute inset-0 border-2 border-[#b87333] rounded-xl"></div>
                    <div className="absolute inset-0 border-[1px] border-[#cd7f32] rounded-xl opacity-50 transform scale-[0.99]"></div>
                    
                    <div className="p-6 md:p-8 relative">
                      <h3 className="text-2xl font-bold mb-3 text-[#cd7f32] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {pack.name}
                      </h3>
                      <div className="flex flex-col mb-6">
                        <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                          {pack.price.toFixed(2)} €
                        </span>
                      </div>
                      <p className="mb-6 text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {pack.description}
                      </p>
                    
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#cd7f32]">✓</span>
                          {pack.jerseyCount} Camisetas de fútbol
                        </li>
                        <li className="flex items-center text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#cd7f32]">✓</span>
                          Envío rápido y seguro
                        </li>
                        <li className="flex items-center text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#cd7f32]">✓</span>
                          Selección aleatoria
                        </li>
                      </ul>
                    
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(pack);
                        }}
                        disabled={loading === pack.id}
                        className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 ${loading === pack.id ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r from-[#cd7f32] to-[#b87333] text-white shadow-md hover:shadow-lg`}
                      >
                        {loading === pack.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Añadiendo...
                          </div>
                        ) : (
                          <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                            Añadir al carrito
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Packs Promesa Múltiples */}
              {promesaMultiple.map((pack) => {
                return (
                  <div 
                    key={pack.id} 
                    className="relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 bg-gradient-to-br from-[#b87333] via-[#da8a67] to-[#8b4513]"
                  >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMjBMMjAgMEw0MCAyMEwyMCA0MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NkN2YzMiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent opacity-20"></div>
                    <div className="absolute inset-0 border-2 border-[#b87333] rounded-xl"></div>
                    <div className="absolute inset-0 border-[1px] border-[#cd7f32] rounded-xl opacity-50 transform scale-[0.99]"></div>
                    
                    <div className="p-6 md:p-8 relative">
                      <h3 className="text-2xl font-bold mb-3 text-[#cd7f32] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {pack.name}
                      </h3>
                      <div className="flex flex-col mb-6">
                        <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                          {pack.price.toFixed(2)} €
                        </span>
                        <div className="mt-1">
                          <span className="text-sm font-medium text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                            {(pack.price / pack.jerseyCount).toFixed(2)} € por unidad
                          </span>
                          {pack.jerseyCount === 5 && (
                            <span className="ml-2 text-sm font-bold text-green-500">
                              ¡Ahorras 15€!
                            </span>
                          )}
                          {pack.jerseyCount === 10 && (
                            <span className="ml-2 text-sm font-bold text-green-500">
                              ¡Ahorras 50€!
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mb-6 text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {pack.description}
                      </p>
                    
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#cd7f32]">✓</span>
                          {pack.jerseyCount} Camisetas de fútbol
                        </li>
                        <li className="flex items-center text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#cd7f32]">✓</span>
                          Envío rápido y seguro
                        </li>
                        <li className="flex items-center text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#cd7f32]">✓</span>
                          Selección aleatoria
                        </li>
                      </ul>
                    
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(pack);
                        }}
                        disabled={loading === pack.id}
                        className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 ${loading === pack.id ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r from-[#cd7f32] to-[#b87333] text-white shadow-md hover:shadow-lg`}
                      >
                        {loading === pack.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Añadiendo...
                          </div>
                        ) : (
                          <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                            Añadir al carrito
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Columna 2: Packs Profesional */}
            <div className="flex flex-col space-y-8">
              {/* Pack Profesional Individual */}
              {profesionalIndividual.map((pack) => {
                return (
                  <div 
                    key={pack.id} 
                    className="relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 bg-gradient-to-br from-[#ffd700] via-[#ffed4e] to-[#b8860b]"
                  >
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
                    
                    <div className="p-6 md:p-8 relative">
                      <h3 className="text-2xl font-bold mb-3 text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                        {pack.name}
                      </h3>
                      <div className="flex flex-col mb-6">
                        <span className="text-3xl md:text-4xl font-bold text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                          {pack.price.toFixed(2)} €
                        </span>
                      </div>
                      <p className="mb-6 text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                        {pack.description}
                      </p>
                    
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                          <span className="mr-2 text-black">✓</span>
                          {pack.jerseyCount} Camisetas de fútbol
                        </li>
                        <li className="flex items-center text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                          <span className="mr-2 text-black">✓</span>
                          Envío rápido y seguro
                        </li>
                        <li className="flex items-center text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                          <span className="mr-2 text-black">✓</span>
                          Selección aleatoria
                        </li>
                      </ul>
                    
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(pack);
                        }}
                        disabled={loading === pack.id}
                        className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 ${loading === pack.id ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r from-[#ffd700] to-[#ffcc00] text-black shadow-md hover:shadow-lg`}
                      >
                        {loading === pack.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                            Añadiendo...
                          </div>
                        ) : (
                          <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                            Añadir al carrito
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Packs Profesional Múltiples */}
              {profesionalMultiple.map((pack) => {
                return (
                  <div 
                    key={pack.id} 
                    className="relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 bg-gradient-to-br from-[#ffd700] via-[#ffed4e] to-[#b8860b]"
                  >
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
                    
                    <div className="p-6 md:p-8 relative">
                      <h3 className="text-2xl font-bold mb-3 text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                        {pack.name}
                      </h3>
                      <div className="flex flex-col mb-6">
                        <span className="text-3xl md:text-4xl font-bold text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                          {pack.price.toFixed(2)} €
                        </span>
                        <div className="mt-1">
                          <span className="text-sm font-medium text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                            {(pack.price / pack.jerseyCount).toFixed(2)} € por unidad
                          </span>
                          {pack.jerseyCount === 5 && (
                            <span className="ml-2 text-sm font-bold text-green-500">
                              ¡Ahorras 12.50€!
                            </span>
                          )}
                          {pack.jerseyCount === 10 && (
                            <span className="ml-2 text-sm font-bold text-green-500">
                              ¡Ahorras 50€!
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mb-6 text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                        {pack.description}
                      </p>
                    
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                          <span className="mr-2 text-black">✓</span>
                          {pack.jerseyCount} Camisetas de fútbol
                        </li>
                        <li className="flex items-center text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                          <span className="mr-2 text-black">✓</span>
                          Envío rápido y seguro
                        </li>
                        <li className="flex items-center text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                          <span className="mr-2 text-black">✓</span>
                          Selección aleatoria
                        </li>
                      </ul>
                    
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(pack);
                        }}
                        disabled={loading === pack.id}
                        className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 ${loading === pack.id ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r from-[#ffd700] to-[#ffcc00] text-black shadow-md hover:shadow-lg`}
                      >
                        {loading === pack.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                            Añadiendo...
                          </div>
                        ) : (
                          <span className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                            Añadir al carrito
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Columna 3: Packs Icono */}
            <div className="flex flex-col space-y-8">
              {/* Pack Icono Individual */}
              {iconoIndividual.map((pack) => {
                return (
                  <div 
                    key={pack.id} 
                    className="relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 bg-gradient-to-br from-white to-[#f5f5f5]"
                  >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMCwwIEwyMDAsMjAwIE0tNTAsLTUwIEwyNTAsMjUwIE0tMjUsLTI1IEwyMjUsMjI1IE0yNSwtMjUgTDIyNSwxNzUgTS01MCwwIEwyMDAsMjUwIE0wLC01MCBMMjUwLDIwMCIgc3Ryb2tlPSIjZjVmNWY1IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbWFyYmxlKSIvPjwvc3ZnPg==')] opacity-40"></div>
                    <div className="absolute inset-0">
                      <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-1/4 left-[-50%] opacity-30"></div>
                      <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-2/4 left-[-50%] opacity-30"></div>
                      <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-3/4 left-[-50%] opacity-30"></div>
                    </div>
                    <div className="absolute inset-0 border-[3px] border-[#daa520] rounded-xl opacity-70"></div>
                    <div className="absolute inset-0 border-[1px] border-[#ffd700] rounded-xl opacity-40 transform scale-[0.98]"></div>
                    
                    <div className="p-6 md:p-8 relative">
                      <h3 className="text-2xl font-bold mb-3 text-[#daa520] drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]">
                        {pack.name}
                      </h3>
                      <div className="flex flex-col mb-6">
                        <span className="text-3xl md:text-4xl font-bold text-[#daa520] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                          {pack.price.toFixed(2)} €
                        </span>
                      </div>
                      <p className="mb-6 text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {pack.description}
                      </p>
                    
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#4a90e2]">✓</span>
                          {pack.jerseyCount} Camisetas de fútbol
                        </li>
                        <li className="flex items-center text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#4a90e2]">✓</span>
                          Envío rápido y seguro
                        </li>
                        <li className="flex items-center text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#4a90e2]">✓</span>
                          Selección aleatoria
                        </li>
                      </ul>
                    
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(pack);
                        }}
                        disabled={loading === pack.id}
                        className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 ${loading === pack.id ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r from-[#daa520] to-[#b8860b] text-white shadow-md hover:shadow-lg`}
                      >
                        {loading === pack.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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
              })}
              
              {/* Packs Icono Múltiples */}
              {iconoMultiple.map((pack) => {
                return (
                  <div 
                    key={pack.id} 
                    className="relative overflow-hidden rounded-xl transition-transform transform hover:scale-105 bg-gradient-to-br from-white to-[#f5f5f5]"
                  >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0ibWFyYmxlIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMCwwIEwyMDAsMjAwIE0tNTAsLTUwIEwyNTAsMjUwIE0tMjUsLTI1IEwyMjUsMjI1IE0yNSwtMjUgTDIyNSwxNzUgTS01MCwwIEwyMDAsMjUwIE0wLC01MCBMMjUwLDIwMCIgc3Ryb2tlPSIjZjVmNWY1IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjbWFyYmxlKSIvPjwvc3ZnPg==')] opacity-40"></div>
                    <div className="absolute inset-0">
                      <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-1/4 left-[-50%] opacity-30"></div>
                      <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-2/4 left-[-50%] opacity-30"></div>
                      <div className="absolute w-[200%] h-[1px] bg-[#daa520] rotate-45 top-3/4 left-[-50%] opacity-30"></div>
                    </div>
                    <div className="absolute inset-0 border-[3px] border-[#daa520] rounded-xl opacity-70"></div>
                    <div className="absolute inset-0 border-[1px] border-[#ffd700] rounded-xl opacity-40 transform scale-[0.98]"></div>
                    
                    <div className="p-6 md:p-8 relative">
                      <h3 className="text-2xl font-bold mb-3 text-[#daa520] drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]">
                        {pack.name}
                      </h3>
                      <div className="flex flex-col mb-6">
                        <span className="text-3xl md:text-4xl font-bold text-[#daa520] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                          {pack.price.toFixed(2)} €
                        </span>
                        <div className="mt-1">
                          <span className="text-sm font-medium text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                            {(pack.price / pack.jerseyCount).toFixed(2)} € por unidad
                          </span>
                          {pack.jerseyCount === 5 && (
                            <span className="ml-2 text-sm font-bold text-green-500">
                              ¡Ahorras 25€!
                            </span>
                          )}
                          {pack.jerseyCount === 10 && (
                            <span className="ml-2 text-sm font-bold text-green-500">
                              ¡Ahorras 80€!
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mb-6 text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {pack.description}
                      </p>
                    
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#4a90e2]">✓</span>
                          {pack.jerseyCount} Camisetas de fútbol
                        </li>
                        <li className="flex items-center text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#4a90e2]">✓</span>
                          Envío rápido y seguro
                        </li>
                        <li className="flex items-center text-gray-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                          <span className="mr-2 text-[#4a90e2]">✓</span>
                          Selección aleatoria
                        </li>
                      </ul>
                    
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(pack);
                        }}
                        disabled={loading === pack.id}
                        className={`w-full py-3 px-6 rounded-md font-bold transition-all transform hover:scale-105 ${loading === pack.id ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r from-[#daa520] to-[#b8860b] text-white shadow-md hover:shadow-lg`}
                      >
                        {loading === pack.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PacksPage;