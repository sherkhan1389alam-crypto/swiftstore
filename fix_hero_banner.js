import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const oldHero = `{banners.length > 0 ? (
                <div className="relative w-full aspect-[4/5] md:aspect-[21/9] bg-slate-100 rounded-3xl overflow-hidden shadow-sm group">
                  <img 
                    src={banners[0].imageUrl} 
                    alt={banners[0].heading} 
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex flex-col justify-center p-8 md:p-16 lg:p-20">
                    <div className="max-w-xl">
                      <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase mb-6 border border-white/30">
                        {banners[0].subheading || 'New Arrivals'}
                      </span>
                      <h1 className="text-4xl md:text-5xl md:leading-[1.1] lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                        {banners[0].heading}
                      </h1>
                      <div className="flex flex-wrap gap-4 mt-8">
                        {banners[0].buttonText && (
                          <Link to={banners[0].buttonLink || '/shop'} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-colors">
                            {banners[0].buttonText}
                          </Link>
                        )}
                        <Link to="/categories" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-colors">
                          Explore Collections
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (`;

const newHero = `{banners.length > 0 ? (
                <div className="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[3/1] bg-slate-100 rounded-3xl overflow-hidden shadow-sm group block">
                  {banners[0].buttonLink ? (
                    <Link to={banners[0].buttonLink} className="block w-full h-full">
                      <img 
                        src={banners[0].imageUrl} 
                        alt={banners[0].heading || 'Hero Banner'} 
                        className="w-full h-full object-cover object-center"
                      />
                    </Link>
                  ) : (
                    <img 
                      src={banners[0].imageUrl} 
                      alt={banners[0].heading || 'Hero Banner'} 
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                </div>
              ) : (`;
              
code = code.replace(oldHero, newHero);
fs.writeFileSync('src/pages/store/Home.tsx', code);
