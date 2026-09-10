import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product } from '../../lib/types';
import { useCart } from '../../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ShoppingCart, Heart, Star } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('status', 'in', ['PUBLISHED', 'OUT_OF_STOCK']));
        const snapshot = await getDocs(q);
        const prods: Product[] = [];
        snapshot.forEach(doc => {
          prods.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(prods);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Shop All Products</h1>
        <p className="text-slate-500">Explore our entire collection of high-quality items.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No products found. Add products from the Admin Panel.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map(product => (
            <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/5] bg-[#F8F9FA] overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.slug || product.id}`)}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain bg-slate-50 object-center group-hover:scale-105 transition-transform duration-500" />
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
                
                {/* Add to cart overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out hidden md:block z-10">
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} disabled={(product.stock ?? 1) <= 0} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed">
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
                  <h3 className="text-sm font-medium text-slate-900 mb-1 line-clamp-2 hover:text-slate-600 transition-colors">{product.name}</h3>
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
