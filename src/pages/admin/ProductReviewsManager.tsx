import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, Review } from '../../lib/types';
import { Star, Filter, Search, Check, X, EyeOff, MessageSquare, Trash2, Loader2, Award, Plus, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../lib/utils';

export default function ProductReviewsManager() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN'>('APPROVED');
  const [createdAt, setCreatedAt] = useState(Date.now());

  useEffect(() => {
    if (productId) {
      fetchData();
    }
  }, [productId]);

  const fetchData = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const pDoc = await getDoc(doc(db, 'products', productId));
      if (pDoc.exists()) {
        setProduct({ id: pDoc.id, ...pDoc.data() } as Product);
      } else {
        navigate('/admin/reviews');
        return;
      }

      const q = query(
        collection(db, 'reviews'), 
        where('productId', '==', productId)
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review));
      
      // Sort manually since we can't easily combine where and orderBy without composite index
      fetched.sort((a, b) => b.createdAt - a.createdAt);
      
      setReviews(fetched);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingReview(null);
    setUserName('');
    setRating(5);
    setTitle('');
    setText('');
    setImageUrl('');
    setIsVerifiedPurchase(true);
    setIsFeatured(false);
    setStatus('APPROVED');
    setCreatedAt(Date.now());
    setShowAddModal(true);
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setUserName(review.userName);
    setRating(review.rating);
    setTitle(review.title || '');
    setText(review.text);
    setImageUrl(review.imageUrl || '');
    setIsVerifiedPurchase(review.isVerifiedPurchase);
    setIsFeatured(review.isFeatured);
    setStatus(review.status);
    setCreatedAt(review.createdAt);
    setShowAddModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setImageUrl(compressed);
    } catch (err) {
      console.error(err);
      alert('Failed to process image');
    }
  };

  const saveReview = async () => {
    if (!userName.trim() || !text.trim() || !product) {
      alert("Please fill in the required fields (Name and Review text).");
      return;
    }

    setSaving(true);
    try {
      const reviewData: any = {
        productId: product.id,
        productName: product.name,
        userId: 'admin_created',
        userName,
        rating,
        title,
        text,
        imageUrl,
        isVerifiedPurchase,
        isFeatured,
        status,
        createdAt,
        updatedAt: Date.now()
      };

      if (editingReview) {
        await updateDoc(doc(db, 'reviews', editingReview.id), reviewData);
      } else {
        await addDoc(collection(db, 'reviews'), reviewData);
      }

      await fetchData();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
      setReviews(reviews.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const updateStatus = async (id: string, newStatus: Review['status']) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status: newStatus, updatedAt: Date.now() });
      setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { isFeatured: !current, updatedAt: Date.now() });
      setReviews(reviews.map(r => r.id === id ? { ...r, isFeatured: !current } : r));
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  // Stats calculation
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => reviews.filter(rev => rev.rating === r).length);
  const publishedReviews = reviews.filter(r => r.status === 'APPROVED').length;

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesRating = ratingFilter === 'ALL' || r.rating.toString() === ratingFilter;
    
    // Check for verified purchase filter if added
    const matchesVerified = statusFilter === 'VERIFIED' ? r.isVerifiedPurchase : true;
    
    return matchesSearch && (statusFilter === 'VERIFIED' ? matchesVerified : matchesStatus) && matchesRating;
  });

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/reviews" className="p-2 hover:bg-slate-200 rounded-full bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Reviews</h1>
            <p className="text-slate-500 font-medium">{product.name}</p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors font-bold shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Reviews</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalReviews}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Average Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-extrabold text-slate-900">{averageRating.toFixed(1)}</p>
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Published</p>
          <p className="text-3xl font-extrabold text-emerald-600">{publishedReviews}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Rating Breakdown</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((r, i) => (
              <div key={r} className="flex items-center gap-2 text-xs">
                <span className="w-2 font-medium text-slate-600">{r}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full" 
                    style={{ width: totalReviews > 0 ? `${(ratingCounts[i] / totalReviews) * 100}%` : '0%' }}
                  ></div>
                </div>
                <span className="w-6 text-right font-medium text-slate-500">{ratingCounts[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by customer or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-shadow"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-white font-medium text-sm"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Published</option>
                <option value="HIDDEN">Hidden</option>
                <option value="VERIFIED">Verified Only</option>
              </select>
            </div>
            <div className="relative">
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select 
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-white font-medium text-sm"
              >
                <option value="ALL">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No reviews found.</p>
              <button onClick={openAddModal} className="mt-4 text-emerald-600 font-bold hover:text-emerald-700">
                + Add the first review
              </button>
            </div>
          ) : (
            filteredReviews.map(review => (
              <div key={review.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      {review.isVerifiedPurchase && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider">
                          Verified
                        </span>
                      )}
                      {review.isFeatured && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                          <Award className="w-3 h-3" /> Featured
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        review.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {review.status === 'APPROVED' ? 'Published' : review.status}
                      </span>
                    </div>
                    
                    {review.title && <h3 className="font-bold text-slate-900 mb-1">{review.title}</h3>}
                    <p className="text-slate-700 mb-3 text-sm">{review.text}</p>
                    
                    {review.imageUrl && (
                      <div className="mb-3">
                        <img src={review.imageUrl} alt="Review attachment" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-700">{review.userName}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 justify-start md:items-end">
                    <button 
                      onClick={() => openEditModal(review)} 
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors w-24 text-center"
                    >
                      Edit
                    </button>
                    
                    {review.status === 'APPROVED' ? (
                      <button 
                        onClick={() => updateStatus(review.id, 'HIDDEN')} 
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors w-24 text-center"
                      >
                        Hide
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(review.id, 'APPROVED')} 
                        className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition-colors w-24 text-center"
                      >
                        Publish
                      </button>
                    )}
                    
                    <button 
                      onClick={() => toggleFeatured(review.id, review.isFeatured)} 
                      className={`px-3 py-1.5 border rounded-lg text-sm font-semibold transition-colors w-24 text-center ${
                        review.isFeatured 
                          ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                      }`}
                    >
                      {review.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(review.id)} 
                      className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors w-24 text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                {editingReview ? 'Edit Review' : 'Add New Review'}
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Customer Name *</label>
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Review Date</label>
                    <input 
                      type="date" 
                      value={new Date(createdAt).toISOString().split('T')[0]} 
                      onChange={(e) => setCreatedAt(new Date(e.target.value).getTime())}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-lg transition-colors ${rating >= star ? 'bg-amber-100' : 'bg-slate-100 hover:bg-slate-200'}`}
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Review Title (Optional)</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Brief summary of the review"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Review Text *</label>
                  <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    placeholder="Write the full review here..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Attached Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {imageUrl && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                        <img src={imageUrl} alt="Review" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setImageUrl('')}
                          className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 shadow hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <label className="cursor-pointer flex items-center justify-center w-16 h-16 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isVerifiedPurchase} 
                      disabled /* Admin cannot mark verified */
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                    />
                    <span className="font-semibold text-slate-700 text-sm">Verified Purchase</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isFeatured} 
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                    />
                    <span className="font-semibold text-slate-700 text-sm">Feature on Product Page Highlight</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={status === 'APPROVED'} 
                      onChange={(e) => setStatus(e.target.checked ? 'APPROVED' : 'HIDDEN')}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                    />
                    <span className="font-semibold text-slate-700 text-sm">Publish Immediately</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={saveReview}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
