import { useStore } from '../store/useStore';
import { Heart, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { t } from '../lib/i18n';
import { parseImages } from '../utils/imageParser';
const WebApp = (window as any).Telegram.WebApp;

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, toggleFavorite, isFavorite, lang } = useStore();
  const navigate = useNavigate();

  const total = cartTotal();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-20 text-center">
        <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-muted-foreground/50" />
        </div>
        <h2 className="text-xl font-bold mb-2">{t('cart_empty', lang)}</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          {t('cart_empty_desc', lang)}
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full active:scale-95 transition-transform"
        >
          {t('go_to_menu', lang)}
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 relative min-h-screen">
      <header className="px-5 pt-6 pb-4 bg-background sticky top-0 z-10 border-b border-border/50">
        <h1 className="text-2xl font-bold text-foreground">{t('cart', lang)}</h1>
      </header>

      <div className="px-5 py-4 flex flex-col gap-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-border/60 items-stretch">
            <div className="w-20 h-20 bg-muted/30 rounded-xl overflow-hidden shrink-0">
              {parseImages(item.image_url)[0] ? (
                <img src={parseImages(item.image_url)[0]} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                  <ShoppingBag size={24} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 flex justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-sm truncate mb-1 pr-2">{item.name}</h3>
                <p className="text-amber-600 font-bold text-sm mb-2">{item.price.toLocaleString('uz-UZ')} {t('currency', lang)}</p>
                <div className="flex items-center justify-between bg-amber-50 rounded-xl border border-amber-200/60 p-1 w-fit">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-600 active:bg-amber-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm px-3">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-amber-500 text-white shadow-sm flex items-center justify-center active:bg-amber-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end pb-1 gap-2">
                <button 
                  onClick={() => toggleFavorite(item)}
                  className="p-2 -mr-2 active:scale-95 transition-transform"
                >
                  <Heart size={20} className={isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </button>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-20">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-muted-foreground">{t('total', lang)}:</span>
            <span className="font-extrabold text-xl">{total.toLocaleString('uz-UZ')} {t('currency', lang)}</span>
          </div>
          <button 
            onClick={() => {
              if (WebApp.initDataUnsafe?.user) {
                WebApp.HapticFeedback.impactOccurred('medium');
              }
              navigate('/checkout');
            }}
            className="w-full bg-foreground text-background py-4 rounded-full font-bold text-lg active:scale-95 transition-transform shadow-lg shadow-foreground/20"
          >
            {t('checkout', lang)}
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pb-[130px]">
        <Footer />
      </div>
    </div>
  );
}
