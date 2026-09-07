import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingCart, Clock, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function BottomNav() {
  const cart = useStore(state => state.cart);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { to: '/', icon: Home, label: 'Asosiy' },
    { to: '/catalog', icon: Search, label: 'Katalog' },
    { to: '/cart', icon: ShoppingCart, label: 'Savat', badge: cartItemCount },
    { to: '/orders', icon: Clock, label: 'Buyurtmalar' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border pb-safe pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 relative transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <div className="relative">
              <item.icon size={24} strokeWidth={2} />
              {item.badge ? (
                <span className="absolute -top-1 -right-2 bg-secondary text-secondary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
