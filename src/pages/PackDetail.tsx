import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { FiPackage, FiX } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import { packs } from '../data/packs';

const PackDetail: React.FC = () => {
  const [excludedTeams, setExcludedTeams] = useState<string[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const pack = packs.find(p => p.id === 'pack-2');
  const addItem = useCartStore((state) => state.addItem);

  const addExcludedTeam = () => {
    if (newTeam.trim() && !excludedTeams.includes(newTeam.trim())) {
      setExcludedTeams([...excludedTeams, newTeam.trim()]);
      setNewTeam('');
    }
  };

  const removeExcludedTeam = (team: string) => {
    setExcludedTeams(excludedTeams.filter(t => t !== team));
  };

  if (!pack) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto py-8">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-yellow-500 p-3 rounded-full">
                  <FiPackage className="h-8 w-8 text-black" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white text-center mb-2">{pack.name}</h1>
              <p className="text-gray-400 text-center mb-8">{pack.description}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Detalles del Pack</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{pack.jerseyCount} camisetas de equipos aleatorios</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><strong className="text-yellow-500">+{pack.freeJerseys} GRATIS</strong></span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Envío gratuito</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Equipos a Excluir</h3>
                  <p className="text-gray-400 mb-4">
                    Si hay algún equipo del que prefieres no recibir camisetas, indícalo aquí:
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newTeam}
                      onChange={(e) => setNewTeam(e.target.value)}
                      placeholder="Nombre del equipo"
                      className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      onClick={addExcludedTeam}
                      className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
                    >
                      Añadir
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {excludedTeams.map((team) => (
                      <div
                        key={team}
                        className="bg-gray-700 text-white px-3 py-1 rounded-full flex items-center"
                      >
                        {team}
                        <button
                          onClick={() => removeExcludedTeam(team)}
                          className="ml-2 text-gray-400 hover:text-white"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      addItem({
                        ...pack,
                        isPack: true,
                        specifications: '',
                        notes: excludedTeams.length > 0 ? `Equipos excluidos: ${excludedTeams.join(', ')}` : ''
                      });
                    }}
                    className="w-full bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
                  >
                    Añadir al Carrito - {pack.price.toFixed(2)}€
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PackDetail;