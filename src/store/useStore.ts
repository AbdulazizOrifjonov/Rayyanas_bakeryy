import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../lib/i18n';
import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
  category_id?: string;
  is_featured?: boolean;
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
  lang: Language;
  setLang: (l: Language) => void;
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
  loadCartFromDB: () => Promise<void>;
  syncCartToDB: () => Promise<void>;

  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  loadFavoritesFromDB: () => Promise<void>;
  syncFavoritesToDB: () => Promise<void>;
}

const STORAGE_KEY = 'rayyanas-bakery-storage';

const getLocalCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.cart || [];
    }
  } catch {}
  return [];
};

const getLocalFavorites = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.favorites || [];
    }
  } catch {}
  return [];
};

const saveLocalCart = (cart: CartItem[]) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, cart }));
  } catch {}
};

const saveLocalFavorites = (favorites: Product[]) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, favorites }));
  } catch {}
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: 'uz',
      setLang: (lang) => set({ lang }),
      user: null,
      isAdmin: false,
      setUser: async (user) => {
        console.log('[useStore] setUser called:', user);
        set({ user });
        if (user) {
          await get().loadCartFromDB();
          await get().loadFavoritesFromDB();
        } else {
          set({ cart: [], favorites: [] });
        }
      },
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      
      cart: getLocalCart(),
      addToCart: async (product) => {
        const { cart, user } = get();
        const existingItem = cart.find(item => item.id === product.id);
        let newCart: CartItem[];
        
        if (existingItem) {
          newCart = cart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        } else {
          newCart = [...cart, { ...product, quantity: 1 }];
        }
        
        set({ cart: newCart });
        saveLocalCart(newCart);
        
        if (user) {
          await get().syncCartToDB();
        }
      },
      
      removeFromCart: async (productId) => {
        const { cart, user } = get();
        const newCart = cart.filter(item => item.id !== productId);
        set({ cart: newCart });
        saveLocalCart(newCart);
        
        if (user) {
          await get().syncCartToDB();
        }
      },
      
      updateQuantity: async (productId, quantity) => {
        const { cart, user } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        const newCart = cart.map(item => 
          item.id === productId ? { ...item, quantity } : item
        );
        
        set({ cart: newCart });
        saveLocalCart(newCart);
        
        if (user) {
          await get().syncCartToDB();
        }
      },
      
      clearCart: async () => {
        set({ cart: [] });
        saveLocalCart([]);
        
        const { user } = get();
        if (user) {
          try {
            const { data: dbUser } = await supabase.from('users').select('id').eq('telegram_id', user.id.toString()).single();
            if (dbUser) {
              await supabase.from('cart_items').delete().eq('user_id', dbUser.id);
            }
          } catch (e) {
            console.error('Clear cart from DB failed:', e);
          }
        }
      },
      
      cartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      loadCartFromDB: async () => {
        const { user } = get();
        if (!user) return;
        
        try {
          console.log('[useStore] Loading cart from DB for user:', user.id);
          const { data: dbUser, error: userError } = await supabase.from('users').select('id').eq('telegram_id', user.id.toString()).single();
          if (userError) {
            console.error('[useStore] User lookup error:', userError);
            return;
          }
          if (!dbUser) {
            console.log('[useStore] No user found in DB for telegram_id:', user.id);
            return;
          }
          console.log('[useStore] Found user in DB:', dbUser.id);
          
          const { data: cartItems, error: cartError } = await supabase
            .from('cart_items')
            .select('product_id, quantity, products(*)')
            .eq('user_id', dbUser.id);
          
          if (cartError) {
            console.error('[useStore] Cart items query error:', cartError);
            return;
          }
          
          console.log('[useStore] Cart items from DB:', cartItems);
          
          if (cartItems && cartItems.length > 0) {
            const newCart: CartItem[] = cartItems.map(item => {
              const product = Array.isArray(item.products) ? item.products[0] : item.products;
              return {
                ...product,
                quantity: item.quantity
              } as CartItem;
            });
            set({ cart: newCart });
            saveLocalCart(newCart);
            console.log('[useStore] Cart loaded and set:', newCart);
          }
        } catch (e) {
          console.error('Load cart from DB failed:', e);
        }
      },
      
      syncCartToDB: async () => {
        const { cart, user } = get();
        if (!user) return;
        
        try {
          console.log('[useStore] Syncing cart to DB for user:', user.id, 'cart:', cart);
          const { data: dbUser, error: userError } = await supabase.from('users').select('id').eq('telegram_id', user.id.toString()).single();
          if (userError) {
            console.error('[useStore] User lookup error:', userError);
            return;
          }
          if (!dbUser) {
            console.log('[useStore] No user found in DB for telegram_id:', user.id);
            return;
          }
          console.log('[useStore] Found user in DB:', dbUser.id);
          
          // Delete all existing cart items for this user
          const { error: deleteError } = await supabase.from('cart_items').delete().eq('user_id', dbUser.id);
          if (deleteError) {
            console.error('[useStore] Delete cart items error:', deleteError);
          }
          
          // Insert current cart items
          if (cart.length > 0) {
            const cartItems = cart.map(item => ({
              user_id: dbUser.id,
              product_id: item.id,
              quantity: item.quantity
            }));
            
            const { error: insertError } = await supabase.from('cart_items').insert(cartItems);
            if (insertError) {
              console.error('[useStore] Insert cart items error:', insertError);
            } else {
              console.log('[useStore] Cart synced to DB successfully');
            }
          }
        } catch (e) {
          console.error('Sync cart to DB failed:', e);
        }
      },

      favorites: getLocalFavorites(),
      toggleFavorite: async (product) => {
        const { favorites, user } = get();
        const exists = favorites.find(f => f.id === product.id);
        let newFavorites: Product[];
        
        if (exists) {
          newFavorites = favorites.filter(f => f.id !== product.id);
        } else {
          newFavorites = [...favorites, product];
        }
        
        set({ favorites: newFavorites });
        saveLocalFavorites(newFavorites);
        
        if (user) {
          await get().syncFavoritesToDB();
        }
      },
      
      isFavorite: (productId) => {
        return get().favorites.some(f => f.id === productId);
      },
      
      loadFavoritesFromDB: async () => {
        const { user } = get();
        if (!user) return;
        
        try {
          console.log('[useStore] Loading favorites from DB for user:', user.id);
          const { data: dbUser, error: userError } = await supabase.from('users').select('id').eq('telegram_id', user.id.toString()).single();
          if (userError) {
            console.error('[useStore] User lookup error:', userError);
            return;
          }
          if (!dbUser) {
            console.log('[useStore] No user found in DB for telegram_id:', user.id);
            return;
          }
          console.log('[useStore] Found user in DB:', dbUser.id);
          
          const { data: favItems, error: favError } = await supabase
            .from('favorites')
            .select('product_id, products(*)')
            .eq('user_id', dbUser.id);
          
          if (favError) {
            console.error('[useStore] Favorites query error:', favError);
            return;
          }
          
          console.log('[useStore] Favorites from DB:', favItems);
          
          if (favItems && favItems.length > 0) {
            const newFavorites: Product[] = favItems.map(item => {
              const product = Array.isArray(item.products) ? item.products[0] : item.products;
              return product as Product;
            });
            set({ favorites: newFavorites });
            saveLocalFavorites(newFavorites);
            console.log('[useStore] Favorites loaded and set:', newFavorites);
          }
        } catch (e) {
          console.error('Load favorites from DB failed:', e);
        }
      },
      
      syncFavoritesToDB: async () => {
        const { favorites, user } = get();
        if (!user) return;
        
        try {
          console.log('[useStore] Syncing favorites to DB for user:', user.id, 'favorites:', favorites);
          const { data: dbUser, error: userError } = await supabase.from('users').select('id').eq('telegram_id', user.id.toString()).single();
          if (userError) {
            console.error('[useStore] User lookup error:', userError);
            return;
          }
          if (!dbUser) {
            console.log('[useStore] No user found in DB for telegram_id:', user.id);
            return;
          }
          console.log('[useStore] Found user in DB:', dbUser.id);
          
          // Delete all existing favorites for this user
          const { error: deleteError } = await supabase.from('favorites').delete().eq('user_id', dbUser.id);
          if (deleteError) {
            console.error('[useStore] Delete favorites error:', deleteError);
          }
          
          // Insert current favorites
          if (favorites.length > 0) {
            const favItems = favorites.map(item => ({
              user_id: dbUser.id,
              product_id: item.id
            }));
            
            const { error: insertError } = await supabase.from('favorites').insert(favItems);
            if (insertError) {
              console.error('[useStore] Insert favorites error:', insertError);
            } else {
              console.log('[useStore] Favorites synced to DB successfully');
            }
          }
        } catch (e) {
          console.error('Sync favorites to DB failed:', e);
        }
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ cart: state.cart, favorites: state.favorites }),
    }
  )
);