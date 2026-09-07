import { Plus, Minus, Heart, ShoppingCart } from 'lucide-react';
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
      className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-border/40 flex flex-col h-full relative transition-all active:scale-95 cursor-pointer"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30 p-2">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=500&q=80'; }}
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full rounded-xl flex items-center justify-center text-muted-foreground/30 text-4xl bg-muted/50">
            🎂
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
            TOP
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
        >
          <Heart size={16} className={loved ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </div>
      
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-foreground text-sm line-clamp-2 leading-snug mb-2">{product.name}</h3>
        
        <div className="mt-auto flex flex-col gap-3">
          <p className="font-extrabold text-amber-600">
            {product.price.toLocaleString()} <span className="text-[10px] font-semibold">so'm</span>
          </p>
          
          {quantity > 0 ? (
            <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-between bg-amber-50 rounded-xl border border-amber-200/60 p-1">
              <button 
                onClick={() => quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, quantity - 1)}
                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-600 active:bg-amber-100"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-sm">{quantity}</span>
              <button 
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-8 h-8 rounded-lg bg-amber-500 text-white shadow-sm flex items-center justify-center active:bg-amber-600"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center gap-1.5 active:bg-amber-200 transition-colors"
            >
              <ShoppingCart size={14} />
              Savatga qo'shish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
