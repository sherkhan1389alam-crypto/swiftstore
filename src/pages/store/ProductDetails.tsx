import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product } from '../../lib/types';
import { useCart } from '../../contexts/CartContext';
import { useSettings } from '../../lib/settingsContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import ProductReviews from '../../components/ProductReviews';
import { Loader2, ArrowLeft, Heart, Share2, Star, Minus, Plus, Truck, ShieldCheck, Check, ShoppingCart, X, Maximize2, MapPin } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [reviewStats, setReviewStats] = useState({ count: 0, average: 0 });
  
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<'IDLE' | 'CHECKING' | 'AVAILABLE' | 'UNAVAILABLE'>('IDLE');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        let data: Product | null = null;
        const q = query(collection(db, 'products'), where('slug', '==', id));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          const docSnap = qSnap.docs[0];
          data = { id: docSnap.id, ...docSnap.data() } as Product;
        } else {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            data = { id: docSnap.id, ...docSnap.data() } as Product;
          }
        }
        if (data) {
          setProduct(data);
          setActiveImage(data.images && data.images.length > 0 ? data.images[0] : (data.imageUrl || ''));
          
          // Auto-select first options for variants
          if (data.variantOptions && data.variantOptions.length > 0) {
            const initialVariants: Record<string, string> = {};
            data.variantOptions.forEach(v => {
              if (v.name.length > 0) {
                initialVariants[v.name] = v.options[0];
              }
            });
            setSelectedVariants(initialVariants);
          }
        }
      } catch (error) {
        console.error("Error loading product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const q = query(
          collection(db, 'reviews'),
          where('productId', '==', id),
          where('status', '==', 'APPROVED')
        );
        const snapshot = await getDocs(q);
        const count = snapshot.docs.length;
        if (count > 0) {
          const totalRating = snapshot.docs.reduce((sum, d) => sum + d.data().rating, 0);
          setReviewStats({ count, average: totalRating / count });
        }
      } catch (error) {
        console.error("Error loading reviews", error);
      }
    };
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Check if all variants are selected
      if (product.variants) {
        const unselected = product.variants.find(v => !selectedVariants[v.name]);
        if (unselected) {
          alert(`Please select ${unselected.name} before adding to cart.`);
          return;
        }
      }
      
      addToCart(product, quantity, selectedVariants);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (product.variants) {
        const unselected = product.variants.find(v => !selectedVariants[v.name]);
        if (unselected) {
          alert(`Please select ${unselected.name} before buying.`);
          return;
        }
      }
      addToCart(product, quantity, selectedVariants);
      navigate('/checkout');
    }
  };

  const handleWishlist = async () => {
    if (!currentUser) {
      alert("Please login to save items to your wishlist.");
      navigate('/login');
      return;
    }
    if (!product) return;
    
    try {
      await toggleWishlist(product.id);
    } catch (e) {
      alert("Failed to update wishlist");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'SwiftStore Product',
      text: product?.description || 'Check out this product on SwiftStore!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const checkDelivery = () => {
    if (pincode.length !== 6) {
      alert("Please enter a valid 6-digit PIN code");
      return;
    }
    setDeliveryStatus('CHECKING');
    setTimeout(() => {
      // Simulate backend check
      setDeliveryStatus(Math.random() > 0.2 ? 'AVAILABLE' : 'UNAVAILABLE');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-10 w-10 animate-spin text-[#0b382d]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAFAFA]">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Product Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-slate-600 hover:text-slate-900 flex items-center font-bold">
          <ArrowLeft className="h-4 w-4 mr-2" /> Return to Shop
        </button>
      </div>
    );
  }

  const allImages = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []);
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const inStock = (product.stock ?? 1) > 0;
  const stockCount = product.stock ?? 1;

  return (
    <div className="bg-white min-h-screen pb-36 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden group border border-slate-100">
              {allImages.length > 0 ? (
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain bg-slate-50 object-center transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                  onClick={() => setIsFullscreen(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No Image</div>
              )}
              
              <button 
                onClick={() => setIsFullscreen(true)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm hover:bg-white transition-colors text-slate-600 z-10 hidden md:block"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isNewArrival && <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 uppercase tracking-widest shadow-sm rounded-sm">NEW</span>}
                {product.isBestSeller && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-widest shadow-sm rounded-sm">BEST SELLER</span>}
                {product.discount ? <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-widest shadow-sm rounded-sm">-{product.discount}% OFF</span> : null}
              </div>
            </div>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#0b382d] shadow-sm' : 'border-transparent hover:border-slate-200 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain bg-slate-50" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* PRODUCT INFO */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight pr-4">
                {product.name}
              </h1>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={handleShare} className="p-3 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={handleWishlist} className={`p-3 rounded-full transition-colors ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            
            {reviewStats.count > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviewStats.average) ? 'fill-current' : 'text-slate-200'}`} />)}
                </div>
                <span className="text-sm font-bold text-slate-700">{reviewStats.average.toFixed(1)}</span>
                <span className="text-sm text-slate-400">({reviewStats.count} reviews)</span>
              </div>
            )}

            <div className="flex items-end gap-3 mb-6">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">₹{product.price.toLocaleString('en-IN')}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-lg text-slate-400 line-through font-semibold mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</p>
              )}
            </div>

            <div className="h-px w-full bg-slate-100 my-6"></div>

            {/* VARIANTS */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8 space-y-6">
                {product.variants.map(variant => (
                  <div key={variant.name}>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">{variant.name}</h3>
                    <div className="flex flex-wrap gap-3">
                      {variant.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariants({...selectedVariants, [variant.name]: opt})}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                            selectedVariants[variant.name] === opt
                              ? 'border-[#0b382d] bg-[#0b382d] text-white'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DESCRIPTION PREVIEW */}
            <p className="text-slate-600 leading-relaxed font-medium text-[15px] mb-8">
              {product.description}
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-8">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Truck className="w-5 h-5" /> Check Delivery Availability</h3>
              <div className="flex gap-2 relative">
                <input 
                  type="text" 
                  value={pincode} 
                  onChange={e => {setPincode(e.target.value); setDeliveryStatus('IDLE');}} 
                  placeholder="Enter PIN Code" 
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                  maxLength={6}
                />
                <button onClick={() => {
    if (!pincode) return;
    const allowed = settings?.shippingSettings?.serviceablePincodes;
    if (!allowed || allowed.trim() === '') {
      setDeliveryStatus('AVAILABLE');
      return;
    }
    const list = allowed.split(',').map(s => s.trim());
    if (list.includes(pincode)) {
      setDeliveryStatus('AVAILABLE');
    } else {
      setDeliveryStatus('UNAVAILABLE');
    }
  }} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">Check</button>
              </div>
              {deliveryStatus !== 'IDLE' && (
                <p className={`mt-3 text-sm font-bold ${deliveryStatus === 'AVAILABLE' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {deliveryStatus === 'AVAILABLE' ? 'Delivery available to your location!' : 'Sorry, we do not deliver to this PIN code.'}
                </p>
              )}
            </div>
            
            

            {/* ADD TO CART & QUANTITY DESKTOP */}
            <div className="hidden md:block mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quantity</span>
                <span className={`text-xs font-extrabold flex items-center gap-1 ${inStock ? 'text-emerald-600' : 'text-red-600'}`}>
                  {inStock ? <><Check className="w-3.5 h-3.5"/> In Stock ({stockCount} left)</> : 'Out of Stock'}
                </span>
              </div>
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                <Truck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-indigo-900 text-sm uppercase tracking-wider">Free Standard Delivery</p>
                  <p className="text-indigo-700 font-medium text-sm mt-0.5">Estimated delivery in {settings?.shippingSettings?.standardDeliveryDays || 7} days</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center bg-slate-50 rounded-xl p-1 w-32 border border-slate-200">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-slate-500 hover:text-slate-900 transition-colors"
                  ><Minus className="h-4 w-4" /></button>
                  <span className="flex-1 text-center font-bold text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                    className="p-3 text-slate-500 hover:text-slate-900 transition-colors"
                  ><Plus className="h-4 w-4" /></button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={added || !inStock}
                  className={`flex-1 flex items-center justify-center space-x-2 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                    added ? 'bg-emerald-600 text-white' : 
                    !inStock ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
                    'bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {added ? <><Check className="w-5 h-5" /><span>Added</span></> : <><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></>}
                </button>
              </div>
              {inStock ? (
                <button
                  onClick={handleBuyNow}
                  className="w-full mt-4 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all bg-[#0b382d] text-white hover:bg-emerald-900 shadow-lg shadow-emerald-900/20"
                >
                  Buy Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full mt-4 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all bg-slate-200 text-slate-500 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
            
            {/* DELIVERY CHECK */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-slate-600" />
                <h4 className="font-bold text-slate-900">Delivery Options</h4>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter PIN Code" 
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0b382d] bg-white text-sm"
                />
                <button onClick={checkDelivery} disabled={deliveryStatus === 'CHECKING'} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors">
                  {deliveryStatus === 'CHECKING' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
                </button>
              </div>
              {deliveryStatus === 'AVAILABLE' && <p className="text-emerald-600 text-xs font-bold mt-2">Delivery available within 7 days. Free shipping.</p>}
              {deliveryStatus === 'UNAVAILABLE' && <p className="text-red-500 text-xs font-bold mt-2">Currently undeliverable to this PIN code.</p>}
            </div>

            {/* TRUST SECTION */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                <ShieldCheck className="w-6 h-6 text-[#0b382d]" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Secure<br/>Checkout</span>
              </div>
              <div className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                <Truck className="w-6 h-6 text-[#0b382d]" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Free<br/>Shipping</span>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* PRODUCT TABS */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
            <button className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-widest text-slate-900 border-b-2 border-[#0b382d] bg-slate-50 whitespace-nowrap">Description</button>
            <button className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 whitespace-nowrap">Specifications</button>
            <button className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 whitespace-nowrap">Shipping & Returns</button>
          </div>
          <div className="p-8">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed font-medium">{product.description}</p>
              {product.specifications && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Specifications</h4>
                  <pre className="text-sm text-slate-600 font-sans whitespace-pre-wrap">{product.specifications}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}

        <div className="mt-20">
           <ProductReviews productId={product.id} productName={product.name} productImageUrl={product.imageUrl} />
        </div>
      </div>
      
      {/* MOBILE STICKY BOTTOM BAR */}
      <div 
        className="md:hidden fixed left-0 right-0 bg-white border-t border-slate-200 p-3 z-[60] flex items-center gap-2 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]" 
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex-shrink-0 px-2 flex flex-col justify-center min-w-[70px]">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Price</p>
          <p className="text-lg font-black text-slate-900 leading-none">₹{product.price}</p>
        </div>
        
        {inStock ? (
          <>
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex-1 h-12 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                added ? 'bg-emerald-600 text-white border-emerald-600' : 
                'bg-white text-slate-900 border-slate-900'
              }`}
            >
              {added ? 'Added' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 h-12 border-2 border-[#0b382d] rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-[#0b382d] text-white shadow-lg shadow-emerald-900/20"
            >
              Buy Now
            </button>
          </>
        ) : (
           <button disabled className="flex-1 h-12 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-200 text-slate-500 cursor-not-allowed">
              Out of Stock
           </button>
        )}
      </div>
      {/* FULLSCREEN IMAGE OVERLAY */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-sm">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white bg-black/50 p-2 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
          <img src={activeImage} alt={product.name} className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}
    </div>
  );
}
