import React, { useState, useEffect, useRef } from 'react';
import { jerseys as localJerseys } from '../data/jerseys';
import { leagues } from '../data/leagues';
import { Jersey } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Edit, Trash2, Save, X, Plus, Upload, Image as ImageIcon, XCircle } from 'lucide-react';
import { jerseyServices } from '../services/jerseyServices';
import toast from 'react-hot-toast';

const Admin: React.FC = () => {
  const [jerseyList, setJerseyList] = useState<Jersey[]>([]);
  const [editingJersey, setEditingJersey] = useState<Jersey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newJersey, setNewJersey] = useState<Partial<Jersey>>({
    id: '',
    name: '',
    team: '',
    league: '',
    price: 0,
    image: '',
    isRetro: false,
    description: ''
  });
  
  // Referencias para los inputs de archivos
  const newImageInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);
  
  // Estado para manejar los archivos de imágenes
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  
  // Estado para previsualizar imágenes
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  
  // Cargar camisetas desde Firebase al iniciar
  useEffect(() => {
    const loadJerseys = async () => {
      try {
        setLoading(true);
        const jerseys = await jerseyServices.getAllJerseys();
        setJerseyList(jerseys);
      } catch (error) {
        console.error('Error al cargar camisetas:', error);
        toast.error('Error al cargar camisetas');
        // Cargar camisetas locales como respaldo
        setJerseyList(localJerseys);
      } finally {
        setLoading(false);
      }
    };
    
    loadJerseys();
  }, []);

  // Filtrar camisetas basado en el término de búsqueda
  const filteredJerseys = jerseyList.filter(jersey => 
    jersey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jersey.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jersey.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para comenzar a editar una camiseta
  const handleEdit = (jersey: Jersey) => {
    setEditingJersey({...jersey});
    setEditImageFiles([]);
    setEditImagePreviews([]);
  };

  // Función para guardar los cambios de una camiseta
  const handleSave = async () => {
    if (!editingJersey) return;
    
    try {
      const { id, ...jerseyData } = editingJersey;
      
      // Actualizar la camiseta con las nuevas imágenes si hay
      await jerseyServices.updateJersey(id, jerseyData, editImageFiles);
      
      // Actualizar el estado local
      const updatedJerseys = jerseyList.map(jersey => 
        jersey.id === editingJersey.id ? editingJersey : jersey
      );
      
      setJerseyList(updatedJerseys);
      setEditingJersey(null);
      setEditImageFiles([]);
      setEditImagePreviews([]);
      
      toast.success('Cambios guardados correctamente');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      toast.error('Error al guardar cambios');
    }
  };

  // Función para cancelar la edición
  const handleCancel = () => {
    setEditingJersey(null);
    setEditImageFiles([]);
    setEditImagePreviews([]);
  };

  // Función para eliminar una camiseta
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta camiseta?')) {
      try {
        await jerseyServices.deleteJersey(id);
        
        // Actualizar el estado local
        const updatedJerseys = jerseyList.filter(jersey => jersey.id !== id);
        setJerseyList(updatedJerseys);
        
        toast.success('Camiseta eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar camiseta:', error);
        toast.error('Error al eliminar camiseta');
      }
    }
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingJersey) return;
    
    const { name, value, type } = e.target;
    
    // Manejar checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditingJersey(prev => prev ? {...prev, [name]: checked} : null);
    } else if (name === 'price') {
      // Convertir precio a número
      setEditingJersey(prev => prev ? {...prev, [name]: parseFloat(value)} : null);
    } else {
      // Otros campos
      setEditingJersey(prev => prev ? {...prev, [name]: value} : null);
    }
  };

  // Función para manejar cambios en el formulario de nueva camiseta
  const handleNewJerseyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Manejar checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewJersey(prev => ({...prev, [name]: checked}));
    } else if (name === 'price') {
      // Convertir precio a número
      setNewJersey(prev => ({...prev, [name]: parseFloat(value)}));
    } else {
      // Otros campos
      setNewJersey(prev => ({...prev, [name]: value}));
    }
  };

  // Función para manejar la selección de imágenes para nueva camiseta
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewImageFiles(prev => [...prev, ...filesArray]);
      
      // Crear URLs para previsualización
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  // Función para manejar la selección de imágenes para editar camiseta
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setEditImageFiles(prev => [...prev, ...filesArray]);
      
      // Crear URLs para previsualización
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setEditImagePreviews(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  // Función para eliminar una imagen de la previsualización (nueva camiseta)
  const removeNewImagePreview = (index: number) => {
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Función para eliminar una imagen de la previsualización (editar camiseta)
  const removeEditImagePreview = (index: number) => {
    setEditImagePreviews(prev => prev.filter((_, i) => i !== index));
    setEditImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Función para eliminar una imagen existente de la camiseta
  const removeExistingImage = (index: number) => {
    if (!editingJersey || !editingJersey.images) return;
    
    const updatedImages = [...editingJersey.images];
    updatedImages.splice(index, 1);
    
    // Si eliminamos todas las imágenes, asegurarnos de que image también se actualice
    let updatedMainImage = editingJersey.image;
    if (updatedImages.length === 0) {
      updatedMainImage = '';
    } else if (index === 0 && editingJersey.image === editingJersey.images[0]) {
      // Si eliminamos la primera imagen y era la principal, actualizar la principal
      updatedMainImage = updatedImages[0];
    }
    
    setEditingJersey({
      ...editingJersey,
      images: updatedImages,
      image: updatedMainImage
    });
  };
  
  // Función para agregar una nueva camiseta
  const handleAddJersey = async () => {
    // Validar campos requeridos
    if (!newJersey.id || !newJersey.name || !newJersey.team || !newJersey.price) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    try {
      const { id, ...jerseyData } = newJersey as Jersey;
      
      // Crear la camiseta con las imágenes seleccionadas
      const createdJersey = await jerseyServices.createJersey(
        {
          ...jerseyData,
          id: id
        } as Jersey,
        newImageFiles
      );
      
      // Actualizar el estado local
      setJerseyList([...jerseyList, createdJersey as Jersey]);
      
      // Resetear el formulario
      setNewJersey({
        id: '',
        name: '',
        team: '',
        league: '',
        price: 0,
        image: '',
        isRetro: false,
        description: ''
      });
      setNewImageFiles([]);
      setNewImagePreviews([]);
      
      setShowForm(false);
      toast.success('Camiseta agregada correctamente');
    } catch (error) {
      console.error('Error al agregar camiseta:', error);
      toast.error('Error al agregar camiseta');
    }
  };
  
  // Función para importar camisetas desde el archivo local
  const handleImportFromLocal = async () => {
    if (window.confirm('¿Estás seguro de que quieres importar todas las camisetas del archivo local a Firebase? Esto puede sobrescribir datos existentes.')) {
      try {
        await jerseyServices.importJerseys(localJerseys);
        const jerseys = await jerseyServices.getAllJerseys();
        setJerseyList(jerseys);
        toast.success(`${localJerseys.length} camisetas importadas correctamente`);
      } catch (error) {
        console.error('Error al importar camisetas:', error);
        toast.error('Error al importar camisetas');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 text-center">Panel de Administración</h1>
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Buscar camisetas..."
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
              onClick={handleImportFromLocal}
            >
              <Upload size={18} />
              Importar desde Local
            </button>
            
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Agregar Nueva Camiseta
            </button>
          </div>
        </div>
        
        {/* Formulario para agregar nueva camiseta */}
        {showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Agregar Nueva Camiseta</h2>
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
                  value={newJersey.id}
                  onChange={handleNewJerseyChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={newJersey.name}
                  onChange={handleNewJerseyChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Equipo</label>
                <input
                  type="text"
                  name="team"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={newJersey.team}
                  onChange={handleNewJerseyChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Liga</label>
                <select
                  name="league"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={newJersey.league}
                  onChange={handleNewJerseyChange}
                >
                  <option value="">Seleccionar Liga</option>
                  {leagues.map(league => (
                    <option key={league.id} value={league.id}>{league.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Precio</label>
                <input
                  type="number"
                  name="price"
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={newJersey.price || ''}
                  onChange={handleNewJerseyChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Imágenes</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => newImageInputRef.current?.click()}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                      <ImageIcon size={18} />
                      Seleccionar Imágenes
                    </button>
                    <span className="text-sm text-gray-400">{newImageFiles.length} imágenes seleccionadas</span>
                    <input
                      ref={newImageInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleNewImageChange}
                    />
                  </div>
                  
                  {/* Previsualización de imágenes */}
                  {newImagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {newImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={preview} 
                            alt={`Preview ${index}`} 
                            className="h-24 w-full object-cover rounded border border-gray-600"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                            onClick={() => removeNewImagePreview(index)}
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRetro"
                  id="new-isRetro"
                  className="mr-2"
                  checked={newJersey.isRetro || false}
                  onChange={handleNewJerseyChange}
                />
                <label htmlFor="new-isRetro" className="text-sm font-medium">Es Retro</label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="description"
                rows={3}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                value={newJersey.description || ''}
                onChange={handleNewJerseyChange}
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
                onClick={handleAddJersey}
              >
                <Save size={18} />
                Guardar
              </button>
            </div>
          </div>
        )}
        
        {/* Tabla de camisetas */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredJerseys.length === 0 ? (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
              <p className="text-gray-400">No se encontraron camisetas</p>
            </div>
          ) : (
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Imagen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Equipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Liga</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredJerseys.map((jersey) => (
                  <tr key={jersey.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{jersey.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <img 
                          src={jersey.image} 
                          alt={jersey.name} 
                          className="h-12 w-12 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                        {jersey.images && jersey.images.length > 1 && (
                          <span className="bg-gray-700 text-xs text-white px-1.5 py-0.5 rounded-full">
                            +{jersey.images.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{jersey.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{jersey.team}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{jersey.league}</td>
                    <td className="px-4 py-3 whitespace-nowrap">${jersey.price.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          onClick={() => handleEdit(jersey)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 transition-colors"
                          onClick={() => handleDelete(jersey.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Modal de edición */}
        {editingJersey && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Editar Camiseta</h2>
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
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                    value={editingJersey.id}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                    value={editingJersey.name}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Equipo</label>
                  <input
                    type="text"
                    name="team"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                    value={editingJersey.team}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Liga</label>
                  <select
                    name="league"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                    value={editingJersey.league}
                    onChange={handleEditChange}
                  >
                    <option value="">Seleccionar Liga</option>
                    {leagues.map(league => (
                      <option key={league.id} value={league.id}>{league.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Precio</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                    value={editingJersey.price}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Imágenes</label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editImageInputRef.current?.click()}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
                      >
                        <ImageIcon size={18} />
                        Agregar Más Imágenes
                      </button>
                      <span className="text-sm text-gray-400">{editImageFiles.length} nuevas imágenes</span>
                      <input
                        ref={editImageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditImageChange}
                      />
                    </div>
                    
                    {/* Imágenes existentes */}
                    {editingJersey.images && editingJersey.images.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mt-2 mb-1">Imágenes existentes:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {editingJersey.images.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={imageUrl} 
                                alt={`${editingJersey.name} ${index}`} 
                                className="h-24 w-full object-cover rounded border border-gray-600"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                onClick={() => removeExistingImage(index)}
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Previsualización de nuevas imágenes */}
                    {editImagePreviews.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mt-2 mb-1">Nuevas imágenes:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {editImagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={preview} 
                                alt={`Preview ${index}`} 
                                className="h-24 w-full object-cover rounded border border-gray-600"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                onClick={() => removeEditImagePreview(index)}
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isRetro"
                    id="edit-isRetro"
                    className="mr-2"
                    checked={editingJersey.isRetro || false}
                    onChange={handleEditChange}
                  />
                  <label htmlFor="edit-isRetro" className="text-sm font-medium">Es Retro</label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  value={editingJersey.description || ''}
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
                >
                  <Save size={18} />
                  Guardar Cambios
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

export default Admin;