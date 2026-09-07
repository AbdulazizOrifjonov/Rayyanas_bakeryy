export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="flex flex-col items-center animate-pulse">
        <img 
          src="/logo.jpg" 
          alt="Rayyanas Bakery" 
          className="w-40 h-40 rounded-full object-cover shadow-[0_0_40px_rgba(197,160,89,0.5)]"
        />
      </div>
    </div>
  );
}
