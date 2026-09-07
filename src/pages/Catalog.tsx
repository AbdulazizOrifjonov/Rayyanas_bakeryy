import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  const { data: categories, isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories
  });

  const { data: products, isLoading: prodsLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => api.getProducts(selectedCategory || undefined)
  });

  return (
    <div className="pb-6">
      <header className="px-5 pt-6 pb-4 bg-background sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-foreground mb-4">Kategoriyalar</h1>
        
        {/* Category Pills */}
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-5 px-5 hide-scrollbar">
          <button
            onClick={() => setSearchParams({})}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              !selectedCategory 
                ? 'bg-foreground text-background' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Barchasi
          </button>
          
          {catsLoading ? (
             [1,2,3].map(i => <div key={i} className="w-20 h-9 rounded-full bg-muted animate-pulse shrink-0"></div>)
          ) : (
            categories?.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.id })}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === cat.id 
                    ? 'bg-foreground text-background' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </header>

      <div className="px-5">
        {prodsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-muted/30 rounded-[20px] h-60 animate-pulse border border-border/50"></div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="bg-muted/20 rounded-2xl p-8 text-center mt-10 border border-dashed border-border">
            <p className="text-muted-foreground">Ushbu kategoriyada mahsulotlar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
