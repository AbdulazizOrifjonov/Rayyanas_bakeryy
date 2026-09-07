import { Code, Send, Phone } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="mt-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-[32px] p-6 pb-8 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 mb-3 shadow-lg">
          <img src="/logo.jpg" alt="Rayyanas Bakery" className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl font-bold mb-1">Rayyanas Bakery</h3>
        <a href="https://t.me/Rayyanas_bakeryy" target="_blank" rel="noreferrer" className="text-amber-400 text-sm flex items-center gap-1.5 mb-6 active:text-amber-300">
          <Send size={14} /> @Rayyanas_bakeryy
        </a>
        
        <div className="h-px w-full bg-white/10 mb-6"></div>
        
        <p className="text-xs text-gray-300 mb-4 text-center leading-relaxed font-medium">
          Sizga ham xuddi shunday zamonaviy va qulay Telegram ilova kerakmi? Dasturchi bilan bog'laning:
        </p>
        
        <div className="space-y-3 w-full">
          <a href="https://t.me/AbdulazizbekITMentor" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 active:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-[#2AABEE] p-2 rounded-lg shadow-inner"><Send size={18} className="text-white" /></div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Telegram</span>
                <span className="text-sm font-semibold text-white">@AbdulazizbekITMentor</span>
              </div>
            </div>
          </a>

          <a href="https://t.me/AbdulazizITMentor" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 active:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-[#2AABEE] p-2 rounded-lg shadow-inner"><Send size={18} className="text-white" /></div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Telegram</span>
                <span className="text-sm font-semibold text-white">@AbdulazizITMentor</span>
              </div>
            </div>
          </a>
          
          <a href="tel:+998935821774" className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 active:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg shadow-inner"><Phone size={18} className="text-white" /></div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Qo'ng'iroq qilish</span>
                <span className="text-sm font-semibold text-white">+998 93 582 17 74</span>
                <span className="text-[10px] text-gray-400 mt-0.5">+998 93 610 17 74</span>
              </div>
            </div>
          </a>
        </div>
        
        <div className="mt-8 flex flex-col items-center justify-center gap-1 opacity-60">
          <div className="flex items-center gap-1.5 text-[10px]">
            <Code size={12} /> Developed by Abdulazizbek
          </div>
          <span className="text-[9px]">© 2024 All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
