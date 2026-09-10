import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/HeroBanners.tsx', 'utf8');

const previewRegex = /<div className="relative aspect-\[21\/9\] rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">[\s\S]*?<\/div>\s*<\/div>/;

const newPreview = `
                    <div className="space-y-4">
                      {/* Desktop Preview */}
                      <div className="relative aspect-[21/9] md:aspect-[2.5/1] rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 shadow-inner">
                        <img src={imageUrl} alt="Desktop Preview" className="h-full w-full object-cover object-center" />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-md">Desktop</div>
                        
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                          {subheading && <span className="inline-block bg-white text-[#0b382d] text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded-full tracking-[0.2em] uppercase mb-2 shadow-sm">{subheading}</span>}
                          <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-tight mb-3 drop-shadow-lg max-w-sm">{heading || 'Heading'}</h3>
                          {buttonText && <span className="bg-[#0b382d] text-white px-4 py-2 rounded-full font-bold text-[10px] tracking-wide shadow-md">{buttonText}</span>}
                        </div>

                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col sm:flex-row items-center justify-center gap-3 backdrop-blur-sm">
                          <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-lg">
                            <Camera className="w-4 h-4" /> Replace
                            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} disabled={saving} />
                          </label>
                          <button type="button" onClick={() => setImageUrl('')} className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg">
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* Tablet Preview */}
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                           <img src={imageUrl} alt="Tablet Preview" className="h-full w-full object-cover object-center" />
                           <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-md">Tablet</div>
                           
                           <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2">
                             <h3 className="text-sm font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md">{heading || 'Heading'}</h3>
                           </div>
                        </div>
                        
                        {/* Mobile Preview */}
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                           <img src={imageUrl} alt="Mobile Preview" className="h-full w-full object-cover object-center" />
                           <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-md">Mobile</div>
                           
                           <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2">
                             <h3 className="text-xs font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md">{heading || 'Heading'}</h3>
                           </div>
                        </div>
                      </div>
                    </div>
`;

code = code.replace(previewRegex, newPreview);
fs.writeFileSync('src/pages/admin/HeroBanners.tsx', code);
