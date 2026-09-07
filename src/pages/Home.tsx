import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store/useStore';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { CakeSlice, ChevronRight } from 'lucide-react';

export default function Home() {
  const { user } = useStore();
  const navigate = useNavigate();

  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories
  });

  const { data: featuredProducts, isLoading: prodsLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: api.getFeaturedProducts
  });

  return (
    <div className="pb-6">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex justify-between items-center bg-white sticky top-0 z-30 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.06)]">
        <div>
          <h1 className="text-[28px] font-extrabold text-foreground tracking-tight leading-none mb-1">
            Rayyanas <span className="text-primary">Bakery</span>
          </h1>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">By Rayyulova Nigora</p>
        </div>
        <img src="/logo.jpg" alt="Rayyanas Bakery" className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-amber-500/30" />
      </header>

      <div className="px-5">
        {/* Banner */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200/50 rounded-[24px] p-6 mb-8 relative overflow-hidden">
          <div className="absolute -top-2 -right-2">
            <img src="/logo.jpg" alt="" className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-amber-300/40" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1 text-foreground">
              Xush kelibsiz{user ? `, ${user.first_name}` : ''}!
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-[80%]">
              Premium tortlar, shirinliklar va pishiriqlar olami.
            </p>
            <button 
              onClick={() => navigate('/catalog')}
              className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 px-5 py-2.5 rounded-full text-sm font-semibold active:scale-95 transition-transform"
            >
              Menyuni ko'rish
            </button>
          </div>
        </div>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-foreground">Kategoriyalar</h2>
            <button onClick={() => navigate('/catalog')} className="text-amber-600 font-bold text-sm flex items-center">
              Barchasi <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-3 pb-2 -mx-5 px-5 snap-x hide-scrollbar">
            {catsLoading ? (
              // Skeletons
              [1,2,3,4].map(i => (
                <div key={i} className="min-w-[100px] h-[110px] bg-muted/50 rounded-2xl animate-pulse shrink-0"></div>
              ))
            ) : categories?.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">Kategoriyalar mavjud emas</p>
            ) : (
              categories?.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => navigate(`/catalog?category=${cat.id}`)}
                  className="min-w-[100px] snap-start shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-full bg-secondary/30 border border-secondary/50 flex items-center justify-center p-4 overflow-hidden group-hover:bg-secondary/50 transition-colors">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <CakeSlice className="text-secondary-foreground opacity-50 w-full h-full" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-center leading-tight">{cat.name}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-foreground">Mashhur mahsulotlar</h2>
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
