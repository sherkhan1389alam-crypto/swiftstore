import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2, ArrowRight, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '../../lib/types';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productPromises = wishlist.map(id => getDoc(doc(db, 'products', id)));
        const docs = await Promise.all(productPromises);
        
        const fetchedProducts = docs
          .filter(d => d.exists())
          .map(d => ({ id: d.id, ...d.data() } as Product));
          
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to load wishlist products", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [wishlist, currentUser]);

  const handleRemove = async (productId: string) => {
    try {
      await toggleWishlist(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e) {
      alert("Failed to remove item from wishlist");
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.hasVariants) {
      navigate(`/product/${product.slug || product.id}`);
    } else {
      addToCart(product, 1);
      alert("Added to cart");
    }
  };

  if (!currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <Heart className="h-16 w-16 text-slate-300 mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Login Required</h1>
        <p className="text-slate-500 mb-8">Please sign in to view and save items to your wishlist.</p>
        <Link to="/login" className="bg-[#0b382d] text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-900 transition-colors uppercase tracking-widest text-sm">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#0b382d]" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <Heart className="h-16 w-16 text-slate-300 mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Your Wishlist is Empty</h1>
        <p className="text-slate-500 mb-8">Save items you love here and buy them later.</p>
        <Link to="/shop" className="bg-[#0b382d] text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-900 transition-colors uppercase tracking-widest text-sm flex items-center gap-2">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight uppercase">My Wishlist</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {products.map((product) => (
          <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
            <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
              <Link to={`/product/${product.slug || product.id}`} className="block w-full h-full">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    No Image
                  </div>
                )}
              </Link>
              
              <button 
                onClick={(e) => { e.preventDefault(); handleRemove(product.id); }}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors text-red-500 hover:text-red-600 z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 sm:p-5 flex flex-col flex-1">
              <Link to={`/product/${product.slug || product.id}`} className="text-sm sm:text-base font-bold text-slate-900 mb-1 line-clamp-2 hover:text-[#0b382d] transition-colors">
                {product.name}
              </Link>
              <div className="mt-auto pt-3 flex items-center gap-2 mb-4">
                <span className="text-base font-extrabold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              
              <button 
                onClick={() => handleAddToCart(product)}
                disabled={(product.stock ?? 1) <= 0}
                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                  (product.stock ?? 1) <= 0 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0b382d] text-white hover:bg-emerald-900'
                }`}
              >
                {(product.stock ?? 1) > 0 ? (
                  <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                ) : (
                  'Out of Stock'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
