import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart, Share2, Info } from 'lucide-react';
import { useState } from 'react';
import { parseImages } from '../utils/imageParser';

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
    <div className="min-h-screen bg-[#F8F9FA] pb-6">
      {/* Header inside image */}
      <div className="relative w-full aspect-[4/5] bg-white overflow-hidden rounded-b-[40px] shadow-sm">
        {(() => {
          const imgs = parseImages(product.image_url);
          if (imgs.length > 0) {
            return (
              <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {imgs.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={product.name}
                    onLoad={() => setImgLoaded(true)}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=500&q=80'; }}
                    className={`w-full h-full object-cover shrink-0 snap-center transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
              </div>
            );
          }
          return <div className="w-full h-full flex items-center justify-center text-6xl bg-amber-50/50">🎂</div>;
        })()}
        {parseImages(product.image_url).length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 pointer-events-none z-10">
            {parseImages(product.image_url).map((_, idx) => (
              <div key={idx} className="w-2 h-2 rounded-full bg-white/70 shadow-sm" />
            ))}
          </div>
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
        
        {/* Price and Cart Action */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-600 tracking-tight">
              {product.price.toLocaleString()}
            </span>
            <span className="text-gray-500 font-semibold text-sm">so'm</span>
          </div>

          <div className="min-w-[140px]">
            {quantity > 0 ? (
              <div className="flex items-center justify-between bg-amber-50 rounded-xl p-1.5 border border-amber-200">
                <button 
                  onClick={() => quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, quantity - 1)}
                  className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Minus size={20} className="text-amber-700" />
                </button>
                <span className="text-lg font-bold text-amber-900 px-3">{quantity}</span>
                <button 
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-amber-500 shadow-sm flex items-center justify-center active:scale-95 transition-transform text-white"
                >
                  <Plus size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => addToCart(product)}
                className="w-full h-[52px] rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md active:scale-95 transition-transform"
              >
                <ShoppingCart size={18} />
                Savatga
              </button>
            )}
          </div>
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


    </div>
  );
}
