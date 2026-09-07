import { useStore } from '../store/useStore';
import { Settings, ShieldAlert, Package, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
const WebApp = (window as any).Telegram?.WebApp;

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAdmin } = useStore();

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      return data || [];
    }
  });

  const { data: newOrdersCount } = useQuery({
    queryKey: ['admin-new-orders-count'],
    queryFn: async () => {
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new');
      return count || 0;
    },
    enabled: isAdmin,
    refetchInterval: 10000 // Refetch every 10 seconds to keep badge fresh
  });

  return (
    <div className="pb-6">
      <header className="px-5 pt-6 pb-4 bg-white sticky top-0 z-30 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.06)]">
        <h1 className="text-2xl font-bold text-foreground">Profil</h1>
      </header>

      <div className="px-5 pt-4">
        {/* User Info */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-2xl p-5 mb-6 border border-amber-200/40">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="" className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/40 shadow-md" />
            <div>
              <h2 className="font-bold text-lg text-foreground">
                {user?.first_name || 'Mehmon'} {user?.last_name || ''}
              </h2>
              {user?.username && (
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              )}
            </div>
          </div>
        </div>

        {/* Admin */}
        {isAdmin && (
          <button 
            onClick={() => navigate('/admin')}
            className="w-full bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50 rounded-2xl p-4 mb-6 flex items-center gap-3 active:scale-[0.98] transition-transform relative"
          >
            <ShieldAlert size={20} className="text-red-500" />
            <span className="text-sm font-bold text-red-700 flex-1 text-left">Admin Panel</span>
            {newOrdersCount && newOrdersCount > 0 ? (
              <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {newOrdersCount} yangi
              </div>
            ) : null}
            <ChevronRight size={16} className="text-red-400" />
          </button>
        )}

        {/* Orders */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Package size={20} className="text-amber-600" />
            Buyurtmalarim
          </h3>
          {!orders || orders.length === 0 ? (
            <div className="bg-muted/30 rounded-2xl p-6 text-center border border-dashed border-border">
              <p className="text-muted-foreground text-sm">Hali buyurtmalar yo'q</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order: any) => (
                <div key={order.id} className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'new' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status === 'new' ? 'Yangi' : order.status === 'completed' ? 'Bajarildi' : order.status}
                    </span>
                  </div>
                  <p className="font-bold text-foreground">{Number(order.total_amount).toLocaleString()} so'm</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button 
          onClick={() => WebApp?.close?.()}
          className="w-full bg-muted/50 rounded-xl p-4 flex items-center justify-between border border-border/50"
        >
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium">Ilovani yopish</span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
