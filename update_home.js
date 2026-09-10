import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const heroRegex = /\{\/\* 1\. HERO BANNER \*\/\}[\s\S]*?\{\/\* 2\. SHOP BY CATEGORY \*\/\}/;

const newHero = `{/* 1. HERO BANNER */}
          <section className="pt-4 pb-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full rounded-[24px] overflow-hidden shadow-sm">
              {banners.length > 0 ? (
                <div className="relative w-full">
                  <img 
                    src={banners[0].imageUrl} 
                    alt={banners[0].heading} 
                    className="w-full h-auto object-cover object-center block rounded-[24px]"
                    style={{ minHeight: '200px' }}
                  />
                  {banners[0].buttonLink && (
                    <Link to={banners[0].buttonLink} className="absolute inset-0 z-10">
                      <span className="sr-only">{banners[0].buttonText || 'Shop Now'}</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="relative w-full aspect-[4/5] md:aspect-[21/9] bg-[#eef2eb] rounded-[24px] overflow-hidden shadow-sm flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-24 flex flex-col justify-center order-2 md:order-1">
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase mb-6 w-max">
                      New Arrivals 2026
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                      Style Better.<br />Live Better.
                    </h1>
                    <p className="text-slate-600 text-base md:text-lg mb-8 max-w-sm">
                      Discover premium products, handpicked for your lifestyle.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/shop" className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-colors">
                        Shop Now &rarr;
                      </Link>
                      <Link to="/categories" className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-colors shadow-sm">
                        Explore Collections
                      </Link>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 h-full order-1 md:order-2 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-10">
                    <div className="relative w-full h-full min-h-[300px]">
                      <div className="absolute inset-0 bg-emerald-200/50 rounded-[24px] animate-pulse"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <Camera className="w-12 h-12 text-emerald-600 mb-2 opacity-50" />
                        <span className="text-sm font-bold text-emerald-800 uppercase tracking-widest">Set up Hero Banners</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 2. SHOP BY CATEGORY */}`;

code = code.replace(heroRegex, newHero);
fs.writeFileSync('src/pages/store/Home.tsx', code);
