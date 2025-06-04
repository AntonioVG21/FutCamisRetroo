import React from 'react';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Jersey } from '../types';
import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';

interface JerseyCardProps {
  jersey: Jersey;
}

const JerseyCard: React.FC<JerseyCardProps> = ({ jersey }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem({
      id: jersey.id,
      name: jersey.name,
      price: jersey.price,
      image: jersey.image,
      quantity: 1
    });
  };

  return (
    <div 
      className="group bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl cursor-pointer" 
      onClick={() => navigate(`/jersey/${jersey.id}`)}>
      
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={jersey.image} 
          alt={jersey.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666" stroke="%23fff" stroke-width="0.5"><path d="M20 4L16 4 14 2 10 2 8 4 4 4 2 8 4 22 20 22 22 8 20 4zM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" /></svg>';
            img.onerror = null; // Prevent infinite loop if placeholder also fails
          }}
          loading="lazy"
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
            className={`rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity ${isFavorite(jersey.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
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
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full p-2 transition-colors"
          >
            <FiShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JerseyCard;