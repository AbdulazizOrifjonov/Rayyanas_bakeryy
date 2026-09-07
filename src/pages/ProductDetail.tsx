import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart, Share2, Info } from 'lucide-react';
import { useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart, toggleFavorite, isFavorite } = useStore();
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-medium">Mahsulot topilmadi</p>
      </div>
    );
  }

  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const loved = isFavorite(product.id);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Header inside image */}
      <div className="relative w-full aspect-[4/5] bg-white overflow-hidden rounded-b-[40px] shadow-sm">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=500&q=80'; }}
            className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-amber-50/50">🎂</div>
        )}
        
        {/* Navigation Bar overlaid on image */}
        <div className="absolute top-0 left-0 right-0 pt-6 px-5 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft size={22} className="text-gray-800" />
          </button>

          <div className="flex gap-3">
            <button 
              className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <Share2 size={20} className="text-gray-800" />
            </button>
            <button 
              onClick={() => toggleFavorite(product)}
              className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <Heart size={20} className={loved ? 'fill-red-500 text-red-500' : 'text-gray-800'} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pt-8">
        {product.is_featured && (
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider mb-3">
            Mashhur tanlov
          </span>
        )}
        
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          {product.name}
        </h1>
        
        <div className="flex items-end gap-2 mb-8">
          <span className="text-4xl font-black text-amber-600">
            {product.price.toLocaleString()}
          </span>
          <span className="text-gray-500 font-semibold mb-1">so'm</span>
        </div>

        {/* Info Alert */}
        <div className="bg-green-50/80 border border-green-100 rounded-2xl p-4 flex gap-3 mb-8">
          <Info size={20} className="text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 leading-relaxed font-medium">
            Sifatli mahsulotlarimiz eng yangi masalliqlardan tayyorlanadi. Hoziroq buyurtma bering!
          </p>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Tavsif</h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description || 'Ushbu mahsulot haqida batafsil ma\'lumot kiritilmagan. Ammo u juda mazali ekanligiga kafolat beramiz!'}
          </p>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 pb-safe z-50">
        <div className="max-w-md mx-auto">
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 border border-gray-100">
              <button 
                onClick={() => quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, quantity - 1)}
                className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
              >
                <Minus size={24} className="text-gray-700" />
              </button>
              <span className="text-3xl font-black text-gray-900">{quantity}</span>
              <button 
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-14 h-14 rounded-xl bg-amber-500 shadow-sm shadow-amber-500/30 flex items-center justify-center active:scale-95 transition-transform text-white"
              >
                <Plus size={24} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => addToCart(product)}
              className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 bg-amber-500 text-white shadow-lg shadow-amber-500/30 active:scale-[0.98] transition-transform"
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
