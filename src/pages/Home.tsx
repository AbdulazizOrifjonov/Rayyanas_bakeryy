import { useQuery } from '@tanstack/react-query';

import { supabase } from '../lib/supabase';

import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { CakeSlice, ChevronRight } from 'lucide-react';

import { t, translateDynamic } from '../lib/i18n';
import { useStore } from '../store/useStore';

export default function Home() {
  const navigate = useNavigate();
  const { lang, setLang } = useStore();

  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: ['categories', lang],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').order('created_at');
      if (!data) return [];
      if (lang === 'uz') return data;
      const names = data.map(c => c.name);
      const translatedNames = await translateDynamic(names, lang);
      return data.map((c, i) => ({ ...c, name: translatedNames[i] }));
    }
  });

  const { data: featuredProducts, isLoading: prodsLoading } = useQuery({
    queryKey: ['products', lang],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*').order('created_at');
      if (!data) return [];
      if (lang === 'uz') return data;
      const names = data.map(p => p.name);
      const translatedNames = await translateDynamic(names, lang);
      return data.map((p, i) => ({ ...p, name: translatedNames[i] }));
    }
  });

  return (
    <div className="pb-6">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 bg-background sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shadow-sm">
            <CakeSlice className="text-amber-600" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-1">
              Rayyanas <span className="text-amber-500">Bakery</span>
            </h1>
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">By Rasulova Nigora</p>
          </div>
        </div>
        
        {/* Language Switcher */}
        <div className="flex bg-muted/50 rounded-lg p-1 border border-border/50">
          {(['uz', 'ru', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase transition-colors ${lang === l ? 'bg-white shadow-sm text-amber-600' : 'text-muted-foreground'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5">
        {/* Banner */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200/50 rounded-[24px] p-6 mb-8 relative mt-4 shadow-sm">
          <div className="absolute -top-4 -right-1 z-0">
            <img src="/logo.jpg" alt="" className="w-24 h-24 rounded-full object-cover shadow-md border-[3px] border-amber-300/60" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1 text-foreground">
              {t('welcome', lang)}
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-[80%]">
              {t('subtitle', lang)}
            </p>
            <button 
              onClick={() => navigate('/catalog')}
              className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 px-5 py-2.5 rounded-full text-sm font-semibold active:scale-95 transition-transform"
            >
              {t('view_menu', lang)}
            </button>
          </div>
        </div>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-foreground">{t('categories', lang)}</h2>
            <button onClick={() => navigate('/catalog')} className="text-amber-600 font-bold text-sm flex items-center">
              {t('all', lang)} <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="-mx-5 mt-2">
            {catsLoading ? (
              // Skeletons
              <div className="flex overflow-hidden gap-3 pb-2 px-5">
                {[1,2,3,4].map(i => (
                  <div key={i} className="min-w-[100px] h-[110px] bg-muted/50 rounded-2xl animate-pulse shrink-0"></div>
                ))}
              </div>
            ) : categories?.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 px-5">Kategoriyalar mavjud emas</p>
            ) : (
              <div className="overflow-hidden relative w-full -mx-5 px-5 py-1">
                <div className="flex gap-3 animate-scroll">
                  {/* First Set */}
                  {categories?.map(cat => (
                    <div 
                      key={cat.id + '-1'} 
                      onClick={() => navigate(`/catalog?category=${cat.id}`)}
                      className="w-[100px] shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border-2 border-transparent active:border-amber-400 transition-colors shadow-sm">
                        {cat.image_url ? (
                          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover pointer-events-none" />
                        ) : (
                          <CakeSlice className="text-secondary-foreground opacity-50 w-full h-full p-4 pointer-events-none" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-center text-foreground line-clamp-2 leading-tight">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                  {/* Duplicate Set for Infinite Scroll */}
                  {categories?.map(cat => (
                    <div 
                      key={cat.id + '-2'} 
                      onClick={() => navigate(`/catalog?category=${cat.id}`)}
                      className="w-[100px] shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border-2 border-transparent active:border-amber-400 transition-colors shadow-sm">
                        {cat.image_url ? (
                          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover pointer-events-none" />
                        ) : (
                          <CakeSlice className="text-secondary-foreground opacity-50 w-full h-full p-4 pointer-events-none" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-center text-foreground line-clamp-2 leading-tight">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-foreground">{t('popular', lang)}</h2>
          </div>
          
          {prodsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-muted/30 rounded-[20px] h-60 animate-pulse border border-border/50"></div>
              ))}
            </div>
          ) : featuredProducts?.length === 0 ? (
            <div className="bg-muted/20 rounded-2xl p-8 text-center border border-dashed border-border">
              <p className="text-muted-foreground">Tez orada yangi mahsulotlar qo'shiladi...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {featuredProducts?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
