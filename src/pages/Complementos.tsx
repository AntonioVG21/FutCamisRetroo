import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { complementos } from '../data/complementos';
import { FiSearch } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore'; // Ajusta la ruta según tu proyecto

const PRODUCTS_PER_PAGE = 12;

const ComplementoCard = ({ complemento, onAddToCart }: { complemento: any; onAddToCart: (c: any) => void }) => (
  <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center">
    <img src={complemento.image} alt={complemento.name} className="w-32 h-32 object-contain mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">{complemento.name}</h3>
    <p className="text-gray-300 mb-2">{complemento.description}</p>
    <span className="text-yellow-400 font-bold mb-2">{complemento.price} €</span>
    <button
      onClick={() => onAddToCart(complemento)}
      className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 font-semibold transition"
    >
      Añadir al carrito
    </button>
  </div>
);

const Complementos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    document.title = 'Complementos | FutCamisRetros';
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = 'Descubre complementos de fútbol únicos y originales. Calidad premium y envío rápido. Compra ahora en FutCamisRetros.';
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  // Filtrado y búsqueda
  const filteredComplementos = complementos.filter(complemento =>
    complemento.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complemento.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenación
  const sortedComplementos = [...filteredComplementos].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Paginación
  const totalPages = Math.ceil(sortedComplementos.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = startIdx + PRODUCTS_PER_PAGE;
  const paginatedComplementos = sortedComplementos.slice(startIdx, endIdx);

  // Lógica igual que JerseyDetail
  const handleAddToCart = (complemento: any) => {
    addItem({
      id: complemento.id,
      name: complemento.name,
      price: complemento.price,
      quantity: 1,
      image: complemento.image
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Complementos
            </h1>
            <p className="text-gray-400">
              {sortedComplementos.length} productos encontrados
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar complemento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pl-10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Sorting */}
          <div className="mb-8 flex items-center">
            <label htmlFor="sort" className="text-white mr-2">Ordenar por:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="default">Destacados</option>
              <option value="price-asc">Precio (menor a mayor)</option>
              <option value="price-desc">Precio (mayor a menor)</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
            </select>
          </div>

          {/* Products Grid */}
          {paginatedComplementos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedComplementos.map((complemento) => (
                  <ComplementoCard key={complemento.id} complemento={complemento} onAddToCart={handleAddToCart} />
                ))}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-yellow-500 hover:text-black'}`}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-800 text-white hover:bg-yellow-500 hover:text-black'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-yellow-500 hover:text-black'}`}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-white text-xl">No se encontraron complementos.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Complementos;