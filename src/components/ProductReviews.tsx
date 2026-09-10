import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { compressImage } from '../lib/imageUtils';
import { Star, CheckCircle, Image as ImageIcon, Loader2, Edit2, X } from 'lucide-react';

export default function ProductReviews({ productId, productName, productImageUrl }: { productId: string, productName: string, productImageUrl: string }) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          where('productId', '==', productId),
          where('status', '==', 'APPROVED')
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review));
        
        fetched.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.createdAt - a.createdAt;
        });
        
        setReviews(fetched);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const checkPurchaseStatus = async () => {
      if (!currentUser) return;
      try {
        // Find if user has a delivered order with this product
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const hasBought = snapshot.docs.some(doc => {
          const data = doc.data();
          // We can check if it's placed, processing or delivered. We'll allow it if they just have an order to make testing easier.
          if (data.status !== 'CANCELLED' && data.status !== 'FAILED') {
            return data.items && data.items.some((item: any) => item.productId === productId);
          }
          return false;
        });
        setHasPurchased(hasBought);
      } catch (err) {
        console.error("Error checking purchase", err);
      }
    };

    fetchReviews();
    checkPurchaseStatus();
  }, [productId, currentUser]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await compressImage(file, false);
      setReviewImage(b64);
    } catch (err) {
      alert("Failed to process image.");
    }
  };

  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setSubmitting(true);
    try {
      const reviewData = {
        productId,
        productName,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Customer',
        rating,
        text: reviewText,
        imageUrl: reviewImage,
        status: 'APPROVED', // Auto-approve for demo
        isVerifiedPurchase: hasPurchased,
        isFeatured: false,
        createdAt: Date.now()
      };
      
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      setReviews([{ id: docRef.id, ...reviewData } as Review, ...reviews]);
      setShowForm(false);
      setRating(5);
      setReviewText('');
      setReviewImage('');
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#0b382d]" />
      </div>
    );
  }

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => reviews.filter(rev => rev.rating === r).length);

  return (
    <div className="bg-slate-50 rounded-3xl p-6 md:p-10 border border-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 uppercase">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'fill-current' : 'text-slate-200'}`} />
              ))}
            </div>
            <span className="text-xl font-bold text-slate-900">{averageRating.toFixed(1)}/5</span>
            <span className="text-sm font-medium text-slate-500">({totalReviews} reviews)</span>
          </div>
        </div>
        
        {currentUser && hasPurchased && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-white border-2 border-[#0b382d] text-[#0b382d] hover:bg-[#0b382d] hover:text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all"
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-10 shadow-sm relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Write your review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button type="button" key={s} onClick={() => setRating(s)} className="p-1">
                    <Star className={`w-8 h-8 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Review</label>
              <textarea 
                required 
                rows={4} 
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                className="w-full border-slate-200 rounded-xl p-3 focus:ring-[#0b382d] focus:border-[#0b382d] bg-slate-50"
                placeholder="What did you like or dislike?"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Photo (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#0b382d]/10 file:text-[#0b382d] hover:file:bg-[#0b382d]/20" />
              {reviewImage && <img src={reviewImage} alt="Preview" className="mt-3 h-20 rounded-lg object-cover" />}
            </div>
            <button disabled={submitting} type="submit" className="bg-[#0b382d] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-colors hover:bg-emerald-900">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {totalReviews === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500 font-medium">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star, idx) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center w-10 text-xs font-bold text-slate-700">
                    {star} <Star className="w-3.5 h-3.5 ml-1 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(ratingCounts[idx] / totalReviews) * 100}%` }}></div>
                  </div>
                  <div className="w-8 text-right text-xs font-medium text-slate-500">{ratingCounts[idx]}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-8 space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{review.userName}</h4>
                      {review.isVerifiedPurchase && (
                        <div className="flex items-center text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified Purchase
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                
                <p className="text-slate-700 text-sm leading-relaxed">{review.text}</p>
                
                {review.imageUrl && (
                  <img src={review.imageUrl} alt="Customer upload" className="mt-4 w-24 h-24 object-cover rounded-lg border border-slate-200" />
                )}
                
                {review.adminReply && (
                  <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-900 mb-1 uppercase tracking-widest">Store Reply</p>
                    <p className="text-sm text-slate-600">{review.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
