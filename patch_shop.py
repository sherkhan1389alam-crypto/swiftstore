import re

with open("src/pages/store/Shop.tsx", "r") as f:
    content = f.read()

# Update colors and styling
content = content.replace('bg-indigo-600', 'bg-slate-800')
content = content.replace('text-indigo-600', 'text-slate-600')
content = content.replace('bg-slate-100 overflow-hidden cursor-pointer', 'bg-[#F8F9FA] overflow-hidden cursor-pointer')
content = content.replace('fill-amber-400 text-amber-400', 'fill-slate-900 text-slate-900')
content = content.replace('text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded', 'text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-sm shadow-sm')
content = content.replace('bg-red-500', 'bg-red-600')
content = content.replace('hover:text-red-500 hover:bg-white transition-colors', 'hover:text-red-500 hover:bg-white shadow-sm transition-all z-10')
content = content.replace('hidden md:block z-10', 'z-10')

# Update title
content = content.replace('text-3xl font-bold tracking-tight text-slate-900 mb-2', 'text-3xl font-extrabold tracking-tight text-slate-900 mb-2')
content = content.replace('text-sm font-medium text-slate-900 mb-1 line-clamp-2 hover:text-indigo-600 transition-colors', 'text-sm font-semibold text-slate-900 mb-1 line-clamp-2 hover:text-slate-600 transition-colors leading-snug')

# Mobile Quick Add
mobile_add = '''                <div className="mt-4 md:hidden">
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    disabled={(product.stock ?? 1) <= 0}
                    className="w-full bg-slate-100 text-slate-900 font-bold py-2.5 rounded-lg flex justify-center items-center text-xs hover:bg-slate-200 transition-colors disabled:bg-slate-50 disabled:text-slate-300"
                  >
                    {(product.stock ?? 1) > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>'''

content = re.sub(r'<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\)\}\s*<\/div>', f'</div>{mobile_add}\n            </div>\n          ))}}\n        </div>', content)

# Desktop overlay button disabled logic
content = re.sub(
    r'<button\s*onClick={\(e\) => \{\s*e\.stopPropagation\(\);\s*addToCart\(product\);\s*\}}\s*className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors"\s*>',
    '<button onClick={(e) => { e.stopPropagation(); addToCart(product); }} disabled={(product.stock ?? 1) <= 0} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed">',
    content
)

content = content.replace('<ShoppingCart className="h-4 w-4" /> Add to Cart', '<ShoppingCart className="h-4 w-4" /> {(product.stock ?? 1) > 0 ? \'Add to Cart\' : \'Out of Stock\'}')
content = content.replace('transition-transform duration-300 ease-in-out">', 'transition-transform duration-300 ease-in-out hidden md:block z-10">')

with open("src/pages/store/Shop.tsx", "w") as f:
    f.write(content)

