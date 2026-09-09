import { Send, Phone, MessageCircle, Code } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="mt-4 -mb-20 pb-28 pt-8 px-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-t-[32px] text-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex flex-row items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 w-full mb-6 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg shrink-0 bg-white">
            <img src="/logo.jpg" alt="Rayyanas Bakery" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center w-full">
            <h3 className="text-xl font-extrabold mb-0.5 text-white tracking-tight">Rayyanas Bakery</h3>
            <span className="text-amber-400 text-[11px] font-bold uppercase tracking-wider">Eng shirin va mazzali</span>
          </div>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
        
        <p className="text-[13px] text-gray-300 mb-4 text-center leading-relaxed font-semibold px-4">
          Buyurtma berish yoki savollar uchun biz bilan bog'laning:
        </p>
        
        <div className="space-y-3 w-full">
          {/* Telegram Channel */}
          <a href="https://t.me/+Q5YujT1WMfU1M2Uy" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3.5 active:bg-white/10 transition-colors shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="bg-blue-500 p-2.5 rounded-lg shadow-inner"><MessageCircle size={20} className="text-white" /></div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Telegram Kanalimiz</span>
                <span className="text-sm font-semibold text-white tracking-wide">Bizga a'zo bo'ling</span>
              </div>
            </div>
          </a>

          {/* Telegram Username */}
          <a href="https://t.me/Rayyanas_bakeryy" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3.5 active:bg-white/10 transition-colors shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#2AABEE] p-2.5 rounded-lg shadow-inner"><Send size={20} className="text-white transform -translate-x-0.5" /></div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Admin bilan aloqa</span>
                <span className="text-sm font-semibold text-white tracking-wide">@Rayyanas_bakeryy</span>
              </div>
            </div>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/rayyanas_bakeryy?stkn=MXV0Ym1vanNtYjdxMQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3.5 active:bg-white/10 transition-colors shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-2.5 rounded-lg shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Instagram sahifamiz</span>
                <span className="text-sm font-semibold text-white tracking-wide">@rayyanas_bakeryy</span>
              </div>
            </div>
          </a>
          
          {/* Phone */}
          <a href="tel:+998998427449" className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 active:bg-emerald-500/20 transition-colors shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="bg-emerald-500 p-2.5 rounded-lg shadow-inner"><Phone size={20} className="text-white" /></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-0.5">Qo'ng'iroq qilish</span>
                <span className="text-sm font-bold text-white tracking-wide">+998 99 842 74 49</span>
              </div>
            </div>
          </a>
        </div>
        
          {/* Developer Credit */}
          <a href="https://t.me/AbdulazizbekITMentor" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3.5 active:bg-white/10 transition-colors shadow-sm mt-4">
            <div className="flex items-center gap-3.5">
              <div className="bg-slate-700 p-2.5 rounded-lg shadow-inner"><Code size={20} className="text-amber-400" /></div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Shunday ilova kerakmi?</span>
                <span className="text-sm font-semibold text-white tracking-wide">@AbdulazizbekITMentor</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}
