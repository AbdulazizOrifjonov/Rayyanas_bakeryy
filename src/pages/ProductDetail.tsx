import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart } = useStore();
  const [imgLoaded, setImgLoaded] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Mahsulot topilmadi</p>
      </div>
    );
  }

  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        {product.image_url && (
          <img 
            src={product.image_url} 
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {!product.image_url && (
          <div className="w-full h-full flex items-center justify-center text-6xl text-muted-foreground/20">🎂</div>
        )}
        
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>

        {product.is_featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            ⭐ TOP
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-card rounded-t-3xl p-6 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
          <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
          
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            {product.description || 'Premium sifatli mahsulot'}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              {product.price.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">so'm</span>
          </div>

          {/* Quantity Controls */}
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-muted/50 rounded-2xl p-2">
              <button 
                onClick={() => quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, quantity - 1)}
                className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
              >
                <Minus size={20} className="text-foreground" />
              </button>
              <span className="text-xl font-bold text-foreground">{quantity}</span>
              <button 
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
              >
                <Plus size={20} className="text-foreground" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => addToCart(product)}
              className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 active:scale-[0.98] transition-transform"
            >
              <ShoppingCart size={22} />
              Savatga qo'shish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
