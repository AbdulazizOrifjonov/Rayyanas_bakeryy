import { useStore } from '../store/useStore';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();
  const navigate = useNavigate();

  const total = cartTotal();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-20 text-center">
        <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-muted-foreground/50" />
        </div>
        <h2 className="text-xl font-bold mb-2">Savatingiz bo'sh</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          Menyudan mazali shirinliklarni tanlab, savatga qo'shishingiz mumkin.
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full active:scale-95 transition-transform"
        >
          Menyuga o'tish
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 relative min-h-screen">
      <header className="px-5 pt-6 pb-4 bg-background sticky top-0 z-10 border-b border-border/50">
        <h1 className="text-2xl font-bold text-foreground">Savat</h1>
      </header>

      <div className="px-5 py-4 flex flex-col gap-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-4 shadow-sm border border-border/50 items-center">
            <div className="w-20 h-20 bg-muted/30 rounded-xl overflow-hidden shrink-0">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                  <ShoppingBag size={24} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate mb-1">{item.name}</h3>
              <p className="text-primary font-bold text-sm mb-3">{item.price.toLocaleString('uz-UZ')} so'm</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-muted/50 rounded-full px-2 py-1">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-background shadow-sm flex items-center justify-center text-foreground"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-background shadow-sm flex items-center justify-center text-foreground"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
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
            <span className="font-semibold text-muted-foreground">Jami:</span>
            <span className="font-extrabold text-xl">{total.toLocaleString('uz-UZ')} so'm</span>
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
            Buyurtma berish
          </button>
        </div>
      </div>
    </div>
  );
}
