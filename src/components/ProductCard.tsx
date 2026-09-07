import { Plus, Check } from 'lucide-react';
import { Product, useStore } from '../store/useStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore(state => state.addToCart);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-[20px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-border/50 p-3 flex flex-col h-full relative overflow-hidden group">
      <div className="aspect-square bg-muted/30 rounded-2xl mb-3 overflow-hidden relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            {/* Fallback image placeholder */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-tight mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2 leading-snug">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-primary font-bold text-sm">{product.price.toLocaleString('uz-UZ')} so'm</p>
          <button 
            onClick={handleAdd}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              added ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {added ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
