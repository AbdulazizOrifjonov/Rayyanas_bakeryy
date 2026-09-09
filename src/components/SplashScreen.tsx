import { Send } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0f172a] flex items-center justify-center p-6">
      <div className="flex flex-col items-center animate-pulse w-full max-w-[280px]">
        <img 
          src="/logo.jpg" 
          alt="Rayyanas Bakery" 
          className="w-32 h-32 rounded-full object-cover shadow-[0_0_40px_rgba(197,160,89,0.6)] mb-[-24px] relative z-20 border-[3px] border-[#0f172a]"
        />
        
        <div className="w-full bg-[#1e293b] rounded-xl pt-10 pb-5 px-4 flex flex-col items-center justify-center border border-gray-700/50 shadow-2xl relative z-10">
          <h2 className="text-white font-extrabold text-2xl tracking-tight mb-1.5">Rayyanas Bakery</h2>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Send size={14} className="transform -rotate-45 -mt-1" />
            <span className="font-semibold text-[15px]">@Rayyanas_bakeryy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
