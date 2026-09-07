import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
  category_id?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface AppState {
  user: TelegramUser | null;
  isAdmin: boolean;
  setUser: (user: TelegramUser | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  cartTotal: () => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            cart: cart.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },
      
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set({
          cart: get().cart.map(item => 
            item.id === productId ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => set({ cart: [] }),
      
      cartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'rayyanas-bakery-storage',
      partialize: (state) => ({ cart: state.cart }), // Only persist cart
    }
  )
);
