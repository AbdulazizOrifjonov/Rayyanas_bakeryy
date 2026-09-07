import { useNavigate } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import type { Product } from '../store/useStore';
import { useStore } from '../store/useStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const navigate = useNavigate();
  
  const [isAdding, setIsAdding] = useState(false);
  const inCart = cart.some(item => item.id === product.id);

  return (
    <div onClick={() => navigate('/product/' + product.id)} className="cursor-pointer bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 flex flex-col h-full relative transition-all active:scale-95">
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
          <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
            TOP
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-tight mb-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{product.description}</p>
        
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-bold text-base text-primary">
              {product.price.toLocaleString()} <span className="text-xs font-normal">so'm</span>
            </p>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (inCart) return;
              setIsAdding(true);
              addToCart(product);
              setTimeout(() => setIsAdding(false), 500);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              inCart 
                ? 'bg-secondary text-secondary-foreground' 
                : 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
            }`}
          >
            {inCart ? <Check size={18} /> : <Plus size={18} className={isAdding ? 'scale-125' : ''} />}
          </button>
        </div>
      </div>
    </div>
  );
}
