import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, BarChart2, Package, Image as ImageIcon, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { checkDiscountStatus, createDiscount } from '../services/discountServices';
import { clientServices } from '../services/firebaseServices';

interface DiscountCode {
  code: string;
  percentage: number;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
}

interface DiscountStat {
  code: string;
  uses: number;
}

const AdminDiscounts: React.FC = () => {
  const navigate = useNavigate();
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [discountStats, setDiscountStats] = useState<DiscountStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newDiscount, setNewDiscount] = useState<Partial<DiscountCode>>({
    code: '',
    percentage: 15,
    maxUses: 999999,
    isActive: true
  });

  // Cargar códigos de descuento y estadísticas al iniciar
  useEffect(() => {
    const loadDiscountData = async () => {
      try {
        setLoading(true);
        
        // Cargar estadísticas de uso de códigos
        const stats = await clientServices.getDiscountCodeStats();
        setDiscountStats(stats);
        
        // Cargar todos los códigos de descuento
        // Nota: Esto es una simulación ya que no tenemos una función específica para obtener todos los códigos
        // En una implementación real, deberíamos crear esta función en discountServices
        const codes: DiscountCode[] = [];
        
        // Verificar códigos predeterminados y otros conocidos
        const defaultCodes = ['BIENVENIDO10', 'VERANO20', 'PROMO15'];
        
        // Añadir códigos de las estadísticas
        const allCodes = [...defaultCodes, ...stats.map(stat => stat.code)];
        const uniqueCodes = [...new Set(allCodes)];
        
        for (const code of uniqueCodes) {
          try {
            const result = await checkDiscountStatus(code);
            if (result.code) {
              codes.push({
                code: result.code,
                percentage: result.percentage,
                maxUses: result.maxUses || 999999,
                currentUses: result.currentUses || 0,
                isActive: result.isActive !== undefined ? result.isActive : true
              });
            }
          } catch (error) {
            console.error(`Error al verificar código ${code}:`, error);
          }
        }
        
        setDiscountCodes(codes);
      } catch (error) {
        console.error('Error al cargar datos de descuentos:', error);
        toast.error('Error al cargar datos de descuentos');
      } finally {
        setLoading(false);
      }
    };
    
    loadDiscountData();
  }, []);

  // Filtrar códigos basado en el término de búsqueda
  const filteredCodes = discountCodes.filter(discount => 
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para crear un nuevo código de descuento
  const handleAddDiscount = async () => {
    if (!newDiscount.code || !newDiscount.percentage) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }
    
    try {
      setLoading(true);
      const success = await createDiscount(
        newDiscount.code,
        newDiscount.percentage,
        newDiscount.maxUses || 999999
      );
      
      if (success) {
        // Añadir el nuevo código a la lista
        setDiscountCodes(prev => [...prev, {
          code: newDiscount.code!.toUpperCase(),
          percentage: newDiscount.percentage!,
          maxUses: newDiscount.maxUses || 999999,
          currentUses: 0,
          isActive: true
        }]);
        
        // Limpiar el formulario
        setNewDiscount({
          code: '',
          percentage: 15,
          maxUses: 999999,
          isActive: true
        });
        
        setShowForm(false);
        toast.success(`Código "${newDiscount.code!.toUpperCase()}" creado con éxito`);
      } else {
        toast.error('Error al crear el código de descuento');
      }
    } catch (error) {
      console.error('Error al crear código de descuento:', error);
      toast.error('Error al crear el código de descuento');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambios en el formulario de nuevo descuento
  const handleNewDiscountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewDiscount(prev => ({...prev, [name]: checked}));
    } else if (name === 'percentage' || name === 'maxUses') {
      // Convertir a número
      setNewDiscount(prev => ({...prev, [name]: parseFloat(value)}));
    } else {
      // Otros campos
      setNewDiscount(prev => ({...prev, [name]: value}));
    }
  };

  // Obtener estadísticas para un código específico
  const getStatsForCode = (code: string) => {
    const stat = discountStats.find(s => s.code === code);
    return stat ? stat.uses : 0;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-4">Administración de Códigos de Descuento</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <Link to="/secret-admin" className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                <ImageIcon size={18} className="mr-2" />
                Camisetas
              </Link>
              
              <Link to="/admin-packs" className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                <Package size={18} className="mr-2" />
                Packs
              </Link>
              
              <Link to="/admin-discounts" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Tag size={18} className="mr-2" />
                Códigos de Descuento
              </Link>
            </div>
          </div>
          
          {/* Barra de búsqueda y botón para añadir */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Buscar códigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
              {showForm ? 'Cancelar' : 'Nuevo Código'}
            </button>
          </div>
          
          {/* Formulario para añadir nuevo código */}
          {showForm && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Crear Nuevo Código de Descuento</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">Código *</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={newDiscount.code}
                    onChange={handleNewDiscountChange}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Ej: INFLUENCER20"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="percentage" className="block text-sm font-medium text-gray-300 mb-1">Porcentaje de Descuento *</label>
                  <input
                    type="number"
                    id="percentage"
                    name="percentage"
                    value={newDiscount.percentage}
                    onChange={handleNewDiscountChange}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    min="1"
                    max="100"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="maxUses" className="block text-sm font-medium text-gray-300 mb-1">Usos Máximos (999999 = ilimitado)</label>
                  <input
                    type="number"
                    id="maxUses"
                    name="maxUses"
                    value={newDiscount.maxUses}
                    onChange={handleNewDiscountChange}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    min="1"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={newDiscount.isActive}
                    onChange={handleNewDiscountChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">Activo</label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleAddDiscount}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Código'}
                </button>
              </div>
            </div>
          )}
          
          {/* Tabla de códigos de descuento */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Código</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descuento</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usos</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estadísticas</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-white">Cargando códigos de descuento...</td>
                    </tr>
                  ) : filteredCodes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-white">No se encontraron códigos de descuento</td>
                    </tr>
                  ) : (
                    filteredCodes.map((discount) => (
                      <tr key={discount.code} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{discount.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{discount.percentage}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          {getStatsForCode(discount.code)} / {discount.maxUses === 999999 ? '∞' : discount.maxUses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {discount.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          <div className="flex items-center">
                            <BarChart2 size={18} className="mr-2 text-blue-400" />
                            <span>{getStatsForCode(discount.code)} compras</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Sección de estadísticas */}
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Estadísticas de Uso</h2>
            
            {discountStats.length === 0 ? (
              <p className="text-gray-400">No hay datos de uso de códigos de descuento</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {discountStats
                  .sort((a, b) => b.uses - a.uses)
                  .map((stat) => (
                    <div key={stat.code} className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-2">{stat.code}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Compras realizadas:</span>
                        <span className="text-2xl font-bold text-blue-400">{stat.uses}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDiscounts;