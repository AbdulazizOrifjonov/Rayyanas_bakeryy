import { useStore } from '../store/useStore';
import { Settings, ShieldAlert, Package, LogOut } from 'lucide-react';
const WebApp = (window as any).Telegram.WebApp;

export default function Profile() {
  const { user, isAdmin } = useStore();

  const handleClose = () => {
    WebApp.close();
  };

  return (
    <div className="p-5 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Profil</h1>
      </header>

      <div className="bg-white rounded-[20px] p-5 shadow-sm border border-border mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
          {user ? user.first_name?.[0] : 'U'}
        </div>
        <div>
          <h2 className="font-bold text-lg">{user ? `${user.first_name} ${user.last_name || ''}` : 'Mehmon'}</h2>
          {user?.username && <p className="text-muted-foreground text-sm">@{user.username}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-border">
          <Package className="text-primary" />
          <span className="font-medium">Mening buyurtmalarim</span>
        </button>

        <button className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-border">
          <Settings className="text-muted-foreground" />
          <span className="font-medium">Sozlamalar</span>
        </button>
        
        {isAdmin && (
          <button className="flex items-center gap-3 bg-primary/10 text-primary p-4 rounded-2xl border border-primary/20">
            <ShieldAlert />
            <span className="font-bold">Admin Panel</span>
          </button>
        )}

        <button 
          onClick={handleClose}
          className="flex items-center gap-3 bg-red-50 text-red-500 p-4 rounded-2xl border border-red-100 mt-4"
        >
          <LogOut />
          <span className="font-bold">Chiqish (Dasturni yopish)</span>
        </button>
      </div>
    </div>
  );
}
