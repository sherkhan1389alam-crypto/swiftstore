import fs from 'fs';

const content = `import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, HeroBanner } from '../../lib/types';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Loader2, ShoppingCart, ShieldCheck, Truck, RotateCcw, Lock, ArrowRight, Heart, Star } from 'lucide-react';
import { useSettings } from '../../lib/settingsContext';
import HomeReviews from '../../components/HomeReviews';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, imageUrl?: string}[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch all published products to distribute them into sections
        const prodQ = query(collection(db, 'products'), where('status', '==', 'PUBLISHED'), orderBy('createdAt', 'desc'), limit(50));
        const prodSnap = await getDocs(prodQ);
        const allProds = prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        setProducts(allProds);
        
        const catQ = query(collection(db, 'categories'), where('status', '==', 'ENABLED'));
        const catSnap = await getDocs(catQ);
        const fetchedCats = catSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        fetchedCats.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(fetchedCats);

        const bannerQ = query(collection(db, 'heroBanners'), where('status', '==', 'ENABLED'), orderBy('order', 'asc'));
        const bannerSnap = await getDocs(bannerQ);
        const activeBanners = bannerSnap.docs.map(d => ({ id: d.id, ...d.data() } as HeroBanner));
        setBanners(activeBanners);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0b382d] mb-4" />
      </div>
    );
  }

  // Derive sections from products
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 8);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);
  const deals = products.filter(p => (p.discount || 0) > 0).slice(0, 8);

  // Fallback for featured if none explicitly marked
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  const ProductGrid = ({ title, items, subtitle }: { title: string, items: Product[], subtitle?: string }) => {
    if (items.length === 0) return null;
    return (
      <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 sm:mb-14">
            <div>
              {subtitle && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#0b382d] text-xs font-bold tracking-[0.2em] uppercase">{subtitle}</span>
                </div>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">{title}</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0b382d] transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-[#0b382d] pb-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {items.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                  <Link to={\`/product/\${product.id}\`} className="block w-full h-full">
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
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isNewArrival && (
                      <span className="bg-white text-slate-900 text-[9px] sm:text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm rounded-sm">NEW</span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm rounded-sm">BEST SELLER</span>
                    )}
                    {product.discount ? (
                      <span className="bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm rounded-sm">-{product.discount}% OFF</span>
                    ) : null}
                  </div>

                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors text-slate-400 hover:text-red-500 z-10">
                    <Heart className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
                    className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-[#0b382d] hover:text-white text-slate-900 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg z-10"
                  >
                    Add To Cart
                  </button>
                </div>
                
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-2 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs text-slate-400 ml-1">(0)</span>
                  </div>
                  <Link to={\`/product/\${product.id}\`} className="text-sm sm:text-base font-bold text-slate-900 mb-1 line-clamp-2 hover:text-[#0b382d] transition-colors">
                    {product.name}
                  </Link>
                  <div className="mt-auto pt-3 flex items-center gap-2">
                    <span className="text-base sm:text-lg font-extrabold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs sm:text-sm text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:hidden flex justify-center">
            <Link to="/shop" className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-widest border border-slate-200 px-6 py-3 rounded-full hover:bg-slate-50 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative w-full">
        {banners.length > 0 ? (
          <div className="relative w-full aspect-[4/5] sm:aspect-video md:aspect-[21/9] lg:aspect-[2.5/1] bg-slate-100 overflow-hidden group block">
            {banners[0].buttonLink ? (
              <Link to={banners[0].buttonLink} className="block w-full h-full relative">
                <img src={banners[0].imageUrl} alt={banners[0].heading || 'Hero Banner'} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 sm:p-12">
                  {banners[0].subheading && (
                    <span className="inline-block bg-white text-[#0b382d] text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full tracking-[0.2em] uppercase mb-4 sm:mb-6 shadow-sm">
                      {banners[0].subheading}
                    </span>
                  )}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 sm:mb-8 max-w-4xl drop-shadow-lg">
                    {banners[0].heading}
                  </h1>
                  {banners[0].buttonText && (
                    <span className="bg-[#0b382d] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:bg-emerald-900 transition-colors">
                      {banners[0].buttonText}
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <div className="block w-full h-full relative">
                <img src={banners[0].imageUrl} alt={banners[0].heading || 'Hero Banner'} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 sm:p-12">
                  {banners[0].subheading && (
                    <span className="inline-block bg-white text-[#0b382d] text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full tracking-[0.2em] uppercase mb-4 sm:mb-6 shadow-sm">
                      {banners[0].subheading}
                    </span>
                  )}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl drop-shadow-lg">
                    {banners[0].heading}
                  </h1>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full min-h-[500px] sm:min-h-[600px] bg-[#f9f8f6] flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center order-2 md:order-1 z-10">
              <span className="inline-block border border-[#0b382d]/20 text-[#0b382d] text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase mb-6 w-max bg-white/50">
                TRENDING NOW
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6">
                DISCOVER WHAT\\'S <br className="hidden sm:block" /> WORTH BUYING.
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mb-8 sm:mb-10 max-w-md leading-relaxed font-medium">
                Trending products, everyday essentials and premium picks &mdash; curated for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="bg-[#0b382d] hover:bg-[#07241d] text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-colors text-center shadow-lg shadow-emerald-900/20">
                  Shop Now &rarr;
                </Link>
                <Link to="/categories" className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-colors text-center">
                  Explore Collections
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-[300px] md:h-full absolute md:relative top-0 right-0 order-1 md:order-2 bg-[#0b382d]/5">
              <div className="w-full h-full flex items-center justify-center">
                 <div className="w-64 h-64 rounded-full bg-emerald-900/10 blur-3xl absolute"></div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. CATEGORIES SECTION (Must be immediately after Hero) */}
      {categories.length > 0 && (
        <section className="py-16 sm:py-24 bg-white overflow-hidden border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-12 sm:mb-16">
              <span className="text-[#0b382d] text-xs font-bold tracking-[0.2em] uppercase mb-3">Collections</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center uppercase">SHOP BY CATEGORY</h2>
            </div>
            
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 snap-x hide-scrollbar">
              {categories.map((cat) => (
                <Link key={cat.id} to={\`/category/\${cat.id}\`} className="flex-none w-36 sm:w-auto group snap-start">
                  <div className="w-36 h-36 sm:w-full sm:aspect-square bg-slate-50 rounded-full overflow-hidden mb-4 relative shadow-sm border border-slate-100 group-hover:border-[#0b382d]/30 transition-all duration-500">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#f9f8f6] text-[#0b382d]">
                        <span className="font-bold text-2xl uppercase opacity-20">{cat.name.substring(0,2)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-center font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0b382d] transition-colors">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED PRODUCTS SECTION */}
      <ProductGrid title="Featured Products" items={displayFeatured} subtitle="Curated Picks" />

      {/* 4. MORE PRODUCT COLLECTIONS */}
      <ProductGrid title="New Arrivals" items={newArrivals} />
      <ProductGrid title="Best Sellers" items={bestSellers} />
      <ProductGrid title="Deals & Offers" items={deals} />

      {/* 5. PROMOTIONAL BANNER */}
      {products.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0b382d] rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                <span className="text-emerald-300 text-xs font-bold tracking-[0.2em] uppercase mb-4">Limited Time</span>
                <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">Elevate Your Lifestyle</h3>
                <p className="text-emerald-100 mb-8 max-w-md text-lg">Shop our premium collections with up to 50% off select items.</p>
                <Link to="/shop?filter=deals" className="inline-block bg-white text-[#0b382d] px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-colors text-center w-max hover:bg-emerald-50">
                  Explore Offers
                </Link>
              </div>
              <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-emerald-900/50 flex items-center justify-center">
                {/* Abstract shape for premium feel without fake images */}
                <div className="w-64 h-64 border-4 border-white/10 rounded-full flex items-center justify-center">
                  <div className="w-48 h-48 border-4 border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. REVIEWS SECTION */}
      <section className="bg-white border-t border-slate-100">
        <HomeReviews />
      </section>

      {/* 7. TRUST / SERVICE FEATURES (MUST BE NEAR THE BOTTOM) */}
      {settings?.trustStripEnabled && (
        <section className="bg-[#f9f8f6] border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
              {settings.trustStrips.map((strip, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 bg-white shadow-sm group-hover:shadow-md group-hover:-translate-y-1 rounded-full flex items-center justify-center text-[#0b382d] transition-all duration-300 border border-slate-100">
                    {strip.icon === 'ShieldCheck' && <ShieldCheck className="w-6 h-6 stroke-[1.5]" />}
                    {strip.icon === 'Truck' && <Truck className="w-6 h-6 stroke-[1.5]" />}
                    {strip.icon === 'RotateCcw' && <RotateCcw className="w-6 h-6 stroke-[1.5]" />}
                    {strip.icon === 'Lock' && <Lock className="w-6 h-6 stroke-[1.5]" />}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900 mb-1">{strip.text}</h4>
                    {/* Add short supporting text based on icon */}
                    <p className="text-xs text-slate-500 font-medium">
                      {strip.icon === 'ShieldCheck' && 'Handpicked products for you'}
                      {strip.icon === 'Truck' && 'Quick and reliable delivery'}
                      {strip.icon === 'RotateCcw' && 'Hassle-free returns'}
                      {strip.icon === 'Lock' && 'Safe and protected payments'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
`
fs.writeFileSync('src/pages/store/Home.tsx', content);
