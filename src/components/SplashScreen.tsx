import { Send } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0f172a] flex items-center justify-center p-6">
      <div className="flex flex-row items-center bg-[#1e293b] rounded-2xl p-4 gap-4 border border-gray-700/50 shadow-2xl animate-pulse">
        <img 
          src="/logo.jpg" 
          alt="Rayyanas Bakery" 
          className="w-20 h-20 rounded-full object-cover shadow-[0_0_20px_rgba(197,160,89,0.4)] border-2 border-amber-500/20 shrink-0"
        />
        <div className="flex flex-col justify-center">
          <h2 className="text-white font-extrabold text-2xl tracking-tight mb-1">Rayyanas Bakery</h2>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Send size={16} className="transform -rotate-45 -mt-0.5" />
            <span className="font-bold text-[15px]">@Rayyanas_bakeryy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
