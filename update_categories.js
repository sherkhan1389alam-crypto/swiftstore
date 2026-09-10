import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

const regex = /\{\/\* 2\. SHOP BY CATEGORY \*\/\}[\s\S]*?\{\/\* 3\. FEATURED PRODUCTS \*\/\}/;

const newContent = `{/* 2. SHOP BY CATEGORY */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center mb-10 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[100px] border-t border-slate-300 relative after:content-[''] after:absolute after:w-1.5 after:h-1.5 after:bg-emerald-700 after:rotate-45 after:-top-0.5 after:-right-1"></div>
                  <div className="w-[160px]"></div>
                  <div className="w-[100px] border-t border-slate-300 relative before:content-[''] before:absolute before:w-1.5 before:h-1.5 before:bg-emerald-700 before:rotate-45 before:-top-0.5 before:-left-1"></div>
                </div>
                <h2 className="relative px-6 bg-white text-2xl font-bold text-slate-900 tracking-tight z-10">
                  Shop by Category
                </h2>
              </div>
              
              <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:grid sm:grid-cols-4 md:grid-cols-7 snap-x no-scrollbar">
                {categories.map((category) => (
                  <Link 
                    key={category.id} 
                    to={\`/category/\${category.id}\`} 
                    className="flex flex-col items-center group min-w-[120px] snap-start"
                  >
                    <div className="w-full aspect-[4/5] rounded-[20px] overflow-hidden bg-slate-50 border border-slate-100 mb-4 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 relative flex flex-col p-2">
                      <div className="w-full h-[65%] rounded-[14px] overflow-hidden bg-white mb-2">
                        {category.imageUrl ? (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name} 
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600">
                             <Camera className="w-6 h-6 opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <span className="text-[11px] md:text-sm font-bold text-slate-800 tracking-wide leading-tight group-hover:text-emerald-700 transition-colors">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 3. FEATURED PRODUCTS */}`;

code = code.replace(regex, newContent);
fs.writeFileSync('src/pages/store/Home.tsx', code);
