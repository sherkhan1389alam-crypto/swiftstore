import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product } from '../../lib/types';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Loader2, ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  const performSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setHasSearched(true);
    
    try {
      // In a real production app with Firebase, you'd use Algolia or Typesense for full-text search.
      // For this demo, we fetch all published products and filter in memory, which is fine for small catalogs.
      const qRef = query(collection(db, 'products'), where('status', 'in', ['PUBLISHED', 'OUT_OF_STOCK']));
      const snapshot = await getDocs(qRef);
      const allProds: Product[] = [];
      snapshot.forEach(doc => allProds.push({ id: doc.id, ...doc.data() } as Product));
      
      const lowerQ = q.toLowerCase();
      const filtered = allProds.filter(p => 
        p.name.toLowerCase().includes(lowerQ) || 
        (p.description && p.description.toLowerCase().includes(lowerQ)) ||
        (p.categoryId && p.categoryId.toLowerCase().includes(lowerQ))
      );
      
      setProducts(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
    performSearch(searchQuery);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full min-h-[60vh] bg-[#FAFAFA]">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6">Search Products</h1>
        <form onSubmit={handleSearchSubmit} className="relative flex shadow-sm rounded-2xl overflow-hidden">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-4 border-0 bg-white border-2 border-transparent focus:border-slate-900 focus:ring-0 focus:ring-slate-900 sm:text-base text-slate-900 shadow-sm"
            placeholder="Search for products, brands and more..."
          />
          <button type="submit" className="bg-slate-900 text-white font-bold px-8 hover:bg-slate-800 transition-colors">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : hasSearched && products.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200 max-w-2xl mx-auto">
          <SearchIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No results found for "{searchParams.get('q')}"</h3>
          <p className="text-slate-500">Check your spelling or try using more general terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map(product => (
            <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/5] bg-[#F8F9FA] overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.slug || product.id}`)}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                )}
                
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-sm shadow-sm">
                    {product.discount}% OFF
                  </div>
                )}
                
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-600 hover:text-red-500 hover:bg-white shadow-sm transition-all z-10">
                  <Heart className="h-4 w-4" />
                </button>
                
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out hidden md:block z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-900 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" /> {(product.stock ?? 1) > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                  <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                  <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                  <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                  <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                  <span className="text-xs text-slate-400 ml-1">(12)</span>
                </div>
                
                <Link to={`/product/${product.slug || product.id}`}>
                  <h3 className="text-sm font-medium text-slate-900 mb-1 line-clamp-2 hover:text-slate-900 transition-colors">{product.name}</h3>
                </Link>
                
                <div className="mt-auto pt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
