import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import Footer from '../components/Footer';

export default function Favorites() {
  const { favorites } = useStore();

  return (
    <div className="pb-6">
      <header className="px-5 pt-6 pb-4 bg-white sticky top-0 z-30 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.06)]">
        <h1 className="text-2xl font-bold text-foreground">Sevimlilar</h1>
      </header>

      <div className="px-5 pt-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-center">Sevimli mahsulotlar yo'q</p>
            <p className="text-muted-foreground/60 text-sm text-center mt-1">Mahsulot ustidagi ♡ tugmasini bosing</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favorites.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
