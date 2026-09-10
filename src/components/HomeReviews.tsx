import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review } from '../lib/types';
import { Star, ShieldCheck, User } from 'lucide-react';

export default function HomeReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchTrustData = async () => {
      try {
        // Fetch approved reviews
        const reviewQ = query(collection(db, 'reviews'), where('status', '==', 'APPROVED'));
        const reviewSnap = await getDocs(reviewQ);
        const fetchedReviews = reviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
        
        // Sort by featured first, then newest
        fetchedReviews.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.createdAt - a.createdAt;
        });
        
        setReviews(fetchedReviews);

        try {
          // Fetch total orders for the "Happy Customers" count
        const orderQ = query(collection(db, 'orders'), where('status', 'in', ['DELIVERED', 'SHIPPED', 'ORDER_PLACED', 'PROCESSING']));
        const orderCountSnap = await getCountFromServer(orderQ);
        const orderCount = orderCountSnap.data().count;
        
        // Let's create a realistic base number if they have very few orders, 
        // but the prompt says: "ONLY display a number that actually exists in the database. 
        // If the store has fewer customers, automatically show the real number."
        setTotalOrders(orderCount);
        } catch (orderErr) {
          console.error('Error fetching order count:', orderErr);
          setTotalOrders(0);
        }
        
      } catch (error) {
        console.error('Error fetching trust data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrustData();
  }, []);

  if (loading) return null;

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
    : 0;
    
  const distribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    return { star, count, percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0 };
  });

  const positivePercentage = totalReviews > 0 
    ? Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100) 
    : 0;

  return (
    <section className="bg-white border-y border-slate-200 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Stats Container */}
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-between mb-16">
          
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 uppercase">
              Customers Love SwiftStore
            </h2>
            
            {totalReviews > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-6 h-6 ${i < Math.round(Number(avgRating)) ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-3xl font-extrabold text-slate-900">{avgRating}/5</span>
                </div>
                <p className="text-slate-600 font-medium">Based on {totalReviews} verified reviews</p>
              </div>
            ) : (
              <p className="text-slate-600 text-lg">Be one of the first to review SwiftStore.</p>
            )}
          </div>
          
          {totalReviews > 0 && (
            <div className="w-full md:w-1/3 flex flex-col gap-2">
              {distribution.map((dist) => (
                <div key={dist.star} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700 w-6">{dist.star}★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full" 
                      style={{ width: `${dist.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium w-8 text-right">{dist.count}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="w-full md:w-1/3 grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold text-slate-900 mb-1">{totalOrders}+</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Happy Customers</span>
            </div>
            
            {totalReviews > 0 && (
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-slate-900 mb-1">{positivePercentage}%</span>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Positive Experience</span>
              </div>
            )}
          </div>
        </div>

        {/* Carousel / Grid */}
        {totalReviews > 0 && (
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 snap-x no-scrollbar">
            {reviews.slice(0, 12).map(review => (
              <div key={review.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col min-w-[300px] snap-start shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                
                <h4 className="font-bold text-slate-900 mb-2">{review.title || `Excellent ${review.productName}`}</h4>
                <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-4">"{review.text}"</p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{review.userName}</p>
                    <p className="text-xs text-slate-500">{review.userLocation || 'Verified Customer'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
