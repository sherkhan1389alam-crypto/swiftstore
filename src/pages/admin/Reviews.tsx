import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, Category, Review } from '../../lib/types';
import { Search, Loader2, Star, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminReviews() {
  const [products, setProducts] = useState<(Product & { reviewCount: number, averageRating: number })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pSnap = await getDocs(collection(db, 'products'));
      const prods: Product[] = [];
      pSnap.forEach(d => prods.push({ id: d.id, ...d.data() } as Product));

      const cSnap = await getDocs(collection(db, 'categories'));
      const cats: Category[] = [];
      cSnap.forEach(d => cats.push({ id: d.id, ...d.data() } as Category));
      setCategories(cats);

      const rSnap = await getDocs(collection(db, 'reviews'));
      const reviews: Review[] = [];
      rSnap.forEach(d => reviews.push({ id: d.id, ...d.data() } as Review));

      // Calculate review stats for each product
      const productsWithStats = prods.map(product => {
        const productReviews = reviews.filter(r => r.productId === product.id);
        const reviewCount = productReviews.length;
        const averageRating = reviewCount > 0 
          ? productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
          : 0;
        
        return {
          ...product,
          reviewCount,
          averageRating
        };
      });

      setProducts(productsWithStats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Product Reviews Manager</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Reviews</th>
                <th className="px-6 py-4">Average Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.categoryId);
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center"><ImageIcon className="h-5 w-5 text-slate-400" /></div>
                          )}
                        </div>
                        <div className="font-semibold text-slate-900 max-w-[200px] truncate" title={product.name}>
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                        {category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{product.reviewCount}</span>
                      <span className="text-xs text-slate-500 ml-1">reviews</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Star className={`w-4 h-4 ${product.averageRating > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        <span className="text-sm font-bold text-slate-900">{product.averageRating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/reviews/${product.id}`}
                        className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors"
                      >
                        Manage Reviews
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
