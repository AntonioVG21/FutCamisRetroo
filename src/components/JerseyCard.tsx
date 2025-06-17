import React, { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Jersey } from '../types';
import { useFavoritesStore } from '../store/favoritesStore';
import OptimizedImage from './OptimizedImage';

interface JerseyCardProps {
  jersey: Jersey;
}

const JerseyCard: React.FC<JerseyCardProps> = ({ jersey }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className="group bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl cursor-pointer" 
      onClick={() => navigate(`/jersey/${jersey.id}`)}>
      
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        <OptimizedImage 
          src={jersey.image} 
          alt={jersey.name} 
          className="group-hover:scale-110"
          onLoad={handleImageLoad}
          priority="low"
        />
        
        {/* Tags */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
          {jersey.isRetro && (
            <div className="bg-yellow-500 text-black font-bold py-1 px-3 rounded-full text-xs uppercase">
              Retro
            </div>
          )}
          {!jersey.isRetro && jersey.isNew && (
            <div className="bg-green-500 text-white font-bold py-1 px-3 rounded-full text-xs uppercase">
              Nuevo
            </div>
          )}
          {jersey.discount && (
            <div className="bg-red-500 text-white font-bold py-1 px-3 rounded-full text-xs uppercase">
              -{jersey.discount}%
            </div>
          )}
          {!jersey.isRetro && !jersey.isNew && !jersey.discount && <div></div>}
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (isFavorite(jersey.id)) {
                removeFavorite(jersey.id);
              } else {
                addFavorite({
                  id: jersey.id,
                  name: jersey.name,
                  price: jersey.price,
                  image: jersey.image,
                  team: jersey.team
                });
              }
            }}
            className={`rounded-full p-2 transition-opacity ${
              isFavorite(jersey.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <FiHeart className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-1 truncate">{jersey.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{jersey.team}</p>
        
        <div className="flex justify-between items-center">
          <div>
            {jersey.discount ? (
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 font-bold text-lg">
                  {(jersey.price * (1 - jersey.discount / 100)).toFixed(2)} €
                </span>
                <span className="text-gray-500 line-through text-sm">
                  {jersey.price.toFixed(2)} €
                </span>
              </div>
            ) : (
              <span className="text-yellow-500 font-bold text-lg">{jersey.price.toFixed(2)} €</span>
            )}
          </div>
          
          <div className="text-xs text-gray-400 italic">
            Ver detalles
          </div>
        </div>
      </div>
    </div>
  );
};

export default JerseyCard;