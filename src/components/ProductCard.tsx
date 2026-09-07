import { Plus, Minus, Heart } from 'lucide-react';
import type { Product } from '../store/useStore';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const toggleFavorite = useStore(state => state.toggleFavorite);
  const isFavorite = useStore(state => state.isFavorite);
  const navigate = useNavigate();
  
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const loved = isFavorite(product.id);

  return (
    <div 
      onClick={() => navigate('/product/' + product.id)}
      className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 flex flex-col h-full relative transition-all active:scale-95 cursor-pointer"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-4xl">
            🎂
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            TOP
          </div>
        )}
        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          <Heart size={14} className={loved ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </div>
      
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground text-[13px] line-clamp-2 leading-tight mb-1">{product.name}</h3>
        
        <div className="mt-auto flex items-end justify-between pt-2">
          <p className="font-bold text-sm bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            {product.price.toLocaleString()} <span className="text-[10px]">so'm</span>
          </p>
          
          {quantity > 0 ? (
            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 bg-amber-50 rounded-full border border-amber-200/60 px-1 py-0.5">
              <button 
                onClick={() => quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, quantity - 1)}
                className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold w-5 text-center">{quantity}</span>
              <button 
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-6 h-6 rounded-full bg-amber-500 text-white shadow-sm flex items-center justify-center"
              >
                <Plus size={12} />
              </button>
            </div>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-500/30 active:scale-90 transition-transform"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
