import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { Loader2, Grid } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catSnapshot = await getDocs(collection(db, 'categories'));
        let cats: any[] = [];
        catSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status !== 'DISABLED') {
            cats.push({ id: doc.id, ...data });
          }
        });
        cats.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        // Fallback categories if none exist in db
        if (cats.length === 0) {
          cats.push(
            { id: '1', name: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80' },
            { id: '2', name: 'Fashion', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80' },
            { id: '3', name: 'Home & Kitchen', imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80' },
            { id: '4', name: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80' },
            { id: '5', name: 'Beauty', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=800&q=80' },
            { id: '6', name: 'Daily Use', imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80' }
          );
        }
        setCategories(cats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Shop by Category</h1>
        <p className="text-slate-500">Browse products organized by categories.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 sm:gap-10">
          {categories.map((category, idx) => (
            <Link key={idx} to={`/shop?category=${category.id}`} className="group flex flex-col items-center gap-4">
              <div className="w-full aspect-square rounded-2xl bg-[#f8f9fa] border border-slate-100 overflow-hidden flex items-center justify-center p-3 group-hover:border-emerald-200 group-hover:shadow-lg transition-all shadow-sm">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-xl text-slate-400">
                    <Grid className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-slate-800 font-bold text-sm sm:text-base group-hover:text-emerald-700 transition-colors leading-tight">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
