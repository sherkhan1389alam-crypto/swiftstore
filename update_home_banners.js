import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const heroRegex = /\{banners\.length > 0 \? \([\s\S]*?\) : \(/;

const newHeroCode = `{banners.length > 0 ? (
          <div className="relative w-full aspect-[4/5] sm:aspect-video md:aspect-[21/9] lg:aspect-[2.5/1] bg-slate-100 overflow-hidden group block">
            {(() => {
              const b = banners[0];
              const desktopImg = b.desktopImageUrl || b.imageUrl;
              const tabletImg = b.tabletImageUrl || desktopImg;
              const mobileImg = b.mobileImageUrl || tabletImg || desktopImg;
              
              const ImageComponent = () => (
                <picture className="w-full h-full">
                  <source media="(max-width: 639px)" srcSet={mobileImg} />
                  <source media="(max-width: 1023px)" srcSet={tabletImg} />
                  <img src={desktopImg} alt={b.heading || 'Hero Banner'} className="w-full h-full object-cover object-center" />
                </picture>
              );

              if (b.buttonLink) {
                return (
                  <Link to={b.buttonLink} className="block w-full h-full relative">
                    <ImageComponent />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 sm:p-12">
                      {b.subheading && (
                        <span className="inline-block bg-white text-[#0b382d] text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full tracking-[0.2em] uppercase mb-4 sm:mb-6 shadow-sm">
                          {b.subheading}
                        </span>
                      )}
                      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 sm:mb-8 max-w-4xl drop-shadow-lg">
                        {b.heading}
                      </h1>
                      {b.buttonText && (
                        <span className="bg-[#0b382d] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:bg-emerald-900 transition-colors">
                          {b.buttonText}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              }
              return (
                <div className="block w-full h-full relative">
                  <ImageComponent />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 sm:p-12">
                    {b.subheading && (
                      <span className="inline-block bg-white text-[#0b382d] text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full tracking-[0.2em] uppercase mb-4 sm:mb-6 shadow-sm">
                        {b.subheading}
                      </span>
                    )}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl drop-shadow-lg">
                      {b.heading}
                    </h1>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (`

code = code.replace(heroRegex, newHeroCode);
fs.writeFileSync('src/pages/store/Home.tsx', code);
