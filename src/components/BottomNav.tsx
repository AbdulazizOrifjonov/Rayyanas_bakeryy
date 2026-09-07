import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { t } from '../lib/i18n';

export default function BottomNav() {
  const cart = useStore(state => state.cart);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const favCount = useStore(state => state.favorites.length);
  const lang = useStore(state => state.lang);

  const navItems = [
    { to: '/', icon: Home, label: t('home', lang) },
    { to: '/catalog', icon: Search, label: t('catalog', lang) },
    { to: '/favorites', icon: Heart, label: t('favorites', lang), badge: favCount },
    { to: '/cart', icon: ShoppingCart, label: t('cart', lang), badge: cartItemCount },
    { to: '/profile', icon: User, label: t('profile', lang) },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border/30 py-1.5 px-2 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.08)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center px-2 py-1 relative transition-colors ${
                isActive ? 'text-amber-600' : 'text-muted-foreground'
              }`
            }
          >
            <div className="relative">
              <item.icon size={20} strokeWidth={2} />
              {item.badge ? (
                <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[9px] mt-0.5 font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
