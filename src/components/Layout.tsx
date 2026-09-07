import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto relative shadow-sm">
      {/* Main Content Area */}
      <main className="w-full">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
