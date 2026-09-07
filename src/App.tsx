import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';

const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const setUser = useStore(state => state.setUser);
  const setIsAdmin = useStore(state => state.setIsAdmin);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    setTimeout(() => setShowSplash(false), 1500);
    
    // WebApp.expand(); // optionally expand
    // We enforce our premium light/gold theme, so we ignore Telegram's bg_color
    if (WebApp.initDataUnsafe?.user) {
      setUser(WebApp.initDataUnsafe.user as any);
      
      const adminId = import.meta.env.VITE_ADMIN_ID;
      if (adminId && WebApp.initDataUnsafe.user.id.toString() === adminId) {
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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="product/:id" element={<ProductDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
