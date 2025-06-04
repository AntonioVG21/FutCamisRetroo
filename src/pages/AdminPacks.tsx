import React, { useState, useEffect, useRef } from 'react';
import { packs as localPacks } from '../data/packs';
import { Pack } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Edit, Trash2, Save, X, Plus, Upload, Image as ImageIcon, XCircle, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { packServices } from '../services/packServices';
import { useNavigate } from 'react-router-dom';

const AdminPacks: React.FC = () => {
  const [packList, setPackList] = useState<Pack[]>([]);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [newPack, setNewPack] = useState<Partial<Pack>>({
    id: '',
    name: '',
    description: '',
    price: 0,
    jerseyCount: 1,
    type: 'promesa',
    image: ''
  });
  
  // Referencias para los inputs de archivos
  const newImageInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);
  
  // Estado para manejar los archivos de imágenes
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  
  // Estado para previsualizar imágenes
  const [newImagePreview, setNewImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  
  // Cargar packs desde Firebase al iniciar
  useEffect(() => {
    const loadPacks = async () => {
      try {
        setLoading(true);
        const packs = await packServices.getAllPacks();
        setPackList(packs);
        toast.success('Packs cargados correctamente');
      } catch (error) {
        console.error('Error al cargar packs:', error);
        toast.error('Error al cargar packs');
        // Cargar packs locales como respaldo
        setPackList(localPacks);
      } finally {
        setLoading(false);
      }
    };
    
    loadPacks();
  }, []);

  // Filtrar packs basado en el término de búsqueda
  const filteredPacks = packList.filter(pack => {
    return pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Función para comenzar a editar un pack
  const handleEdit = (pack: Pack) => {
    setEditingPack({...pack});
    setEditImageFile(null);
    setEditImagePreview('');
  };

  // Función para guardar los cambios de un pack
  const handleSave = async () => {
    if (!editingPack) return;
    
    try {
      setLoading(true);
      const { id, ...packData } = editingPack;
      
      // Actualizar el pack con la nueva imagen si hay
      await packServices.updatePack(id, packData, editImageFile);
      
      // Actualizar el estado local
      const updatedPacks = packList.map(pack => 
        pack.id === editingPack.id ? editingPack : pack
      );
      
      setPackList(updatedPacks);
      setEditingPack(null);
      setEditImageFile(null);
      setEditImagePreview('');
      
      toast.success('Cambios guardados correctamente');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      toast.error('Error al guardar cambios');
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar la edición
  const handleCancel = () => {
    setEditingPack(null);
    setEditImageFile(null);
    setEditImagePreview('');
  };

  // Función para eliminar un pack
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pack?')) return;
    
    try {
      setLoading(true);
      await packServices.deletePack(id);
      
      // Actualizar el estado local
      const updatedPacks = packList.filter(pack => pack.id !== id);
      setPackList(updatedPacks);
      
      toast.success('Pack eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar pack:', error);
      toast.error('Error al eliminar pack');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingPack) return;
    
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'jerseyCount') {
      // Convertir a número
      setEditingPack(prev => prev ? {...prev, [name]: parseFloat(value)} : null);
    } else {
      // Otros campos
      setEditingPack(prev => prev ? {...prev, [name]: value} : null);
    }
  };

  // Función para manejar cambios en el formulario de nuevo pack
  const handleNewPackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'jerseyCount') {
      // Convertir a número
      setNewPack(prev => ({...prev, [name]: parseFloat(value)}));
    } else {
      // Otros campos
      setNewPack(prev => ({...prev, [name]: value}));
    }
  };

  // Función para manejar la selección de imagen para nuevo pack
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewImageFile(file);
      
      // Crear URL para previsualización
      const previewUrl = URL.createObjectURL(file);
      setNewImagePreview(previewUrl);
    }
  };
  
  // Función para manejar la selección de imagen para editar pack
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setEditImageFile(file);
      
      // Crear URL para previsualización
      const previewUrl = URL.createObjectURL(file);
      setEditImagePreview(previewUrl);
    }
  };
  
  // Función para eliminar la imagen de previsualización (nuevo pack)
  const removeNewImagePreview = () => {
    setNewImagePreview('');
    setNewImageFile(null);
  };
  
  // Función para eliminar la imagen de previsualización (editar pack)
  const removeEditImagePreview = () => {
    setEditImagePreview('');
    setEditImageFile(null);
  };
  
  // Función para agregar un nuevo pack
  const handleAddPack = async () => {
    // Validar campos requeridos
    if (!newPack.id || !newPack.name || !newPack.price || !newPack.jerseyCount) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    try {
      setLoading(true);
      const { id, ...packData } = newPack as Pack;
      
      // Crear el pack con la imagen seleccionada
      const createdPack = await packServices.createPack(
        {
          ...packData,
          id: id
        } as Pack,
        newImageFile
      );
      
      // Actualizar el estado local
      setPackList([...packList, createdPack as Pack]);
      
      // Resetear el formulario
      setNewPack({
        id: '',
        name: '',
        description: '',
        price: 0,
        jerseyCount: 1,
        type: 'promesa',
        image: ''
      });
      setNewImageFile(null);
      setNewImagePreview('');
      
      setShowForm(false);
      toast.success('Pack agregado correctamente');
    } catch (error) {
      console.error('Error al agregar pack:', error);
      toast.error('Error al agregar pack');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para importar packs desde el archivo local
  const handleImportFromLocal = async () => {
    if (confirm('¿Estás seguro de que quieres importar todos los packs del archivo local a Firebase? Esto puede sobrescribir datos existentes.')) {
      try {
        setLoading(true);
        await packServices.importPacks(localPacks);
        const packs = await packServices.getAllPacks();
        setPackList(packs);
        toast.success(`${localPacks.length} packs importados correctamente`);
      } catch (error) {
        console.error('Error al importar packs:', error);
        toast.error('Error al importar packs');
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para volver al panel de administración de camisetas
  const goToJerseysAdmin = () => {
    navigate('/secret-admin');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Lock className="h-6 w-6 text-yellow-500 mr-2" />
              <h1 className="text-3xl font-bold">Panel de Administración de Packs</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={goToJerseysAdmin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Camisetas
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                {showForm ? 'Cancelar' : 'Nuevo Pack'}
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                onClick={handleImportFromLocal}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Local
              </button>
            </div>
          </div>
        
          {/* Buscador */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar packs..."
              className="w-full md:w-1/3 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        
        {/* Formulario para agregar nuevo pack */}
        {showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Agregar Nuevo Pack</h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setShowForm(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">ID</label>
                <input
                  type="text"
                  name="id"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={newPack.id}
                  onChange={handleNewPackChange}
                  placeholder="ID único (se generará automáticamente si se deja vacío)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nombre*</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={newPack.name}
                  onChange={handleNewPackChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  name="type"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={newPack.type}
                  onChange={handleNewPackChange}
                >
                  <option value="promesa">Promesa</option>
                  <option value="profesional">Profesional</option>
                  <option value="icono">Icono</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Precio*</label>
                <input
                  type="number"
                  name="price"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={newPack.price || ''}
                  onChange={handleNewPackChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad de Camisetas*</label>
                <input
                  type="number"
                  name="jerseyCount"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={newPack.jerseyCount || 1}
                  onChange={handleNewPackChange}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Imagen</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => newImageInputRef.current?.click()}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                      <ImageIcon size={18} />
                      Seleccionar Imagen
                    </button>
                    <input
                      ref={newImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleNewImageChange}
                    />
                  </div>
                  
                  {/* Previsualización de imagen */}
                  {newImagePreview && (
                    <div className="relative w-32 h-32 mt-2">
                      <img 
                        src={newImagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded border border-gray-600"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                        onClick={removeNewImagePreview}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="description"
                rows={3}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                value={newPack.description || ''}
                onChange={handleNewPackChange}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={handleAddPack}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Tabla de packs */}
        {loading && packList.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Imagen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Camisetas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPacks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                      No se encontraron packs
                    </td>
                  </tr>
                ) : (
                  filteredPacks.map((pack) => (
                    <tr key={pack.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">{pack.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {pack.image ? (
                          <img 
                            src={pack.image} 
                            alt={pack.name} 
                            className="h-12 w-12 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-700 rounded flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{pack.name}</td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs truncate">{pack.description}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{pack.price.toFixed(2)} €</td>
                      <td className="px-4 py-3 whitespace-nowrap">{pack.jerseyCount}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${pack.type === 'promesa' ? 'bg-blue-500 text-white' : pack.type === 'profesional' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                          {pack.type.charAt(0).toUpperCase() + pack.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                            onClick={() => handleEdit(pack)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                            onClick={() => handleDelete(pack.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
        
        {/* Modal de edición */}
        {editingPack && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Editar Pack</h2>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={handleCancel}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                <label className="block text-sm font-medium mb-1">ID</label>
                <input
                  type="text"
                  name="id"
                  className="w-full p-2 rounded bg-gray-700 text-gray-400 border border-gray-600 focus:outline-none cursor-not-allowed"
                  value={editingPack.id}
                  disabled
                />
              </div>
                
                <div>
                <label className="block text-sm font-medium mb-1">Nombre*</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={editingPack.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <select
                    name="type"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                    value={editingPack.type}
                    onChange={handleEditChange}
                  >
                    <option value="promesa">Promesa</option>
                    <option value="profesional">Profesional</option>
                    <option value="icono">Icono</option>
                  </select>
                </div>
                
                <div>
                <label className="block text-sm font-medium mb-1">Precio*</label>
                <input
                  type="number"
                  name="price"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={editingPack.price}
                  onChange={handleEditChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
                
                <div>
                <label className="block text-sm font-medium mb-1">Cantidad de Camisetas*</label>
                <input
                  type="number"
                  name="jerseyCount"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={editingPack.jerseyCount}
                  onChange={handleEditChange}
                  min="1"
                  required
                />
              </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Imagen</label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editImageInputRef.current?.click()}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
                      >
                        <ImageIcon size={18} />
                        Cambiar Imagen
                      </button>
                      <input
                        ref={editImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditImageChange}
                      />
                    </div>
                    
                    {/* Imagen existente */}
                    {!editImagePreview && editingPack.image && (
                      <div className="relative w-32 h-32 mt-2">
                        <img 
                          src={editingPack.image} 
                          alt={editingPack.name} 
                          className="w-full h-full object-cover rounded border border-gray-600"
                        />
                      </div>
                    )}
                    
                    {/* Previsualización de nueva imagen */}
                    {editImagePreview && (
                      <div className="relative w-32 h-32 mt-2">
                        <img 
                          src={editImagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded border border-gray-600"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                          onClick={removeEditImagePreview}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={editingPack.description || ''}
                  onChange={handleEditChange}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Cambios
                  </>
                )}
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPacks;