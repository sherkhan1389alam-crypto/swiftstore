import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product } from '../../lib/types';
import { useCart } from '../../contexts/CartContext';
import { Loader2, ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react';

export default function CategoryProducts() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return;
      try {
        const q = query(
          collection(db, 'products'),
          where('categoryId', '==', categoryId),
          where('status', 'in', ['PUBLISHED', 'OUT_OF_STOCK'])
        );
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
  }, [categoryId]);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 flex items-center mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </button>

      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Category Products</h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-500 max-w-md mx-auto">There are currently no products in this category.</p>
          <Link to="/shop" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map(product => (
            <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.slug || product.id}`)}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain bg-slate-50 object-center group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                )}
                
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded">
                    {product.discount}% OFF
                  </div>
                )}
                
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-600 hover:text-red-500 hover:bg-white transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
                
                {/* Add to cart overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-indigo-600 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-slate-400 ml-1">(12)</span>
                </div>
                
                <Link to={`/product/${product.slug || product.id}`}>
                  <h3 className="text-sm font-medium text-slate-900 mb-1 line-clamp-2 hover:text-indigo-600 transition-colors">{product.name}</h3>
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
