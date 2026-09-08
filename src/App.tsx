import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
const WebApp = (window as any).Telegram.WebApp;
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from './store/useStore';
import SplashScreen from './components/SplashScreen';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function TelegramStartAppHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const startParam = WebApp.initDataUnsafe?.start_param;
    if (startParam && startParam.length > 10) { 
      // Product IDs are UUIDs, so length is around 36
      navigate(`/product/${startParam}`);
    }
  }, [navigate]);

  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const setUser = useStore(state => state.setUser);
  const setIsAdmin = useStore(state => state.setIsAdmin);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    setTimeout(() => setShowSplash(false), 1500);
    
    if (WebApp.initDataUnsafe?.user) {
      setUser(WebApp.initDataUnsafe.user as any);
      
      const adminIds = ['1594150529'];
      const adminUsernames = ['Rayyanas_bakeryy', 'AbdulazizbekITMentor'];
      
      const userId = WebApp.initDataUnsafe.user.id?.toString();
      const username = WebApp.initDataUnsafe.user.username;
      
      if (adminIds.includes(userId) || (username && adminUsernames.includes(username))) {
        setIsAdmin(true);
      }
    }
  }, [setUser, setIsAdmin]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <TelegramStartAppHandler />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
