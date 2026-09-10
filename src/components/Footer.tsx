import { Send, Phone, MessageCircle, Code, ChevronRight } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="mt-4 -mb-20 pb-28 pt-8 px-5 bg-[#0a0f1d] rounded-t-[32px] text-white relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -translate-y-20 translate-x-10 pointer-events-none"></div>
      <div className="absolute bottom-40 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] translate-y-10 -translate-x-10 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <h3 className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-1">Rayyanas Bakery</h3>
          <span className="text-xl text-gray-300 font-serif italic opacity-80">Shirin lahzalar siz bilan ♡</span>
        </div>
        
        <div className="space-y-4 w-full">
          {/* Telegram Channel */}
          <a href="https://t.me/rayyanas_bakery" target="_blank" rel="noreferrer" className="relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border border-blue-400/30 bg-blue-900/20 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)] group transition-all duration-300 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                 <Send className="text-white w-6 h-6 transform -translate-x-0.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-blue-200 font-bold tracking-widest uppercase mb-0.5">Telegram Kanalimiz</span>
                <span className="text-base font-extrabold text-white tracking-wide">Bizga a'zo bo'ling</span>
              </div>
            </div>
            <Send className="absolute right-20 top-1/2 -translate-y-1/2 w-28 h-28 text-blue-500/10 -rotate-12 pointer-events-none" />
            <div className="relative z-10 w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </a>

          {/* Telegram Username */}
          <a href="https://t.me/Rayyanas_bakeryy" target="_blank" rel="noreferrer" className="relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border border-cyan-400/30 bg-cyan-900/20 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] group transition-all duration-300 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                 <MessageCircle className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-cyan-200 font-bold tracking-widest uppercase mb-0.5">Admin bilan aloqa</span>
                <span className="text-base font-extrabold text-white tracking-wide">@Rayyanas_bakeryy</span>
              </div>
            </div>
            <MessageCircle className="absolute right-20 top-1/2 -translate-y-1/2 w-28 h-28 text-cyan-500/10 -rotate-12 pointer-events-none" />
            <div className="relative z-10 w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/rayyanas_bakeryy?stkn=MXV0Ym1vanNtYjdxMQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border border-pink-500/30 bg-pink-900/20 backdrop-blur-md shadow-[0_0_20px_rgba(236,72,153,0.15)] group transition-all duration-300 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-pink-200 font-bold tracking-widest uppercase mb-0.5">Instagram sahifamiz</span>
                <span className="text-base font-extrabold text-white tracking-wide">@rayyanas_bakeryy</span>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-16 top-1/2 -translate-y-1/2 text-pink-500/10 -rotate-12 pointer-events-none"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            <div className="relative z-10 w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </a>
          
          {/* Phone */}
          <a href="tel:+998998427449" className="relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border border-emerald-400/30 bg-emerald-900/20 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)] group transition-all duration-300 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                 <Phone className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-emerald-200 font-bold tracking-widest uppercase mb-0.5">Qo'ng'iroq qilish</span>
                <span className="text-base font-extrabold text-white tracking-wide">+998 99 842 74 49</span>
              </div>
            </div>
            <Phone className="absolute right-20 top-1/2 -translate-y-1/2 w-28 h-28 text-emerald-500/10 -rotate-12 pointer-events-none" />
            <div className="relative z-10 w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </a>
          
          {/* Developer Credit */}
          <a href="https://t.me/AbdulazizbekITMentor" target="_blank" rel="noreferrer" className="relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border border-purple-400/30 bg-purple-900/20 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)] group transition-all duration-300 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                 <Code className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-purple-200 font-bold tracking-widest uppercase mb-0.5">Shunday ilova kerakmi?</span>
                <span className="text-base font-extrabold text-white tracking-wide">@AbdulazizbekITMentor</span>
              </div>
            </div>
            <Code className="absolute right-20 top-1/2 -translate-y-1/2 w-28 h-28 text-purple-500/10 -rotate-12 pointer-events-none" />
            <div className="relative z-10 w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}
