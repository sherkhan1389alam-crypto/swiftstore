import re

with open('src/pages/store/ProductDetails.tsx', 'r') as f:
    content = f.read()

# Replace desktop button
desktop_btn_pattern = r'<button\s*onClick=\{handleBuyNow\}[\s\S]*?Buy It Now\s*</button>'

desktop_btn_replacement = """{inStock ? (
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
              )}"""

content = re.sub(desktop_btn_pattern, desktop_btn_replacement, content)

# Replace mobile sticky bottom bar
mobile_bar_pattern = r'\{\/\* MOBILE STICKY BOTTOM BAR \*\/\}[\s\S]*?<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 flex items-center gap-3 shadow-\[0_-10px_20px_-10px_rgba\(0,0,0,0\.1\)\]" style=\{\{ paddingBottom: \'calc\(1rem \+ env\(safe-area-inset-bottom\)\)\' \}\}>[\s\S]*?<\/div>\s*\{\/\* FULLSCREEN IMAGE OVERLAY \*\/\}'

mobile_bar_replacement = """{/* MOBILE STICKY BOTTOM BAR */}
      <div 
        className="md:hidden fixed left-0 right-0 bg-white border-t border-slate-200 p-3 z-[60] flex items-center gap-2 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]" 
        style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}
      >
        <div className="flex-shrink-0 px-2 flex flex-col justify-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Price</p>
          <p className="text-lg font-black text-slate-900 leading-none">₹{product.price}</p>
        </div>
        
        {inStock ? (
          <>
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex-1 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all border-2 ${
                added ? 'bg-emerald-600 text-white border-emerald-600' : 
                'bg-white text-slate-900 border-slate-900'
              }`}
            >
              {added ? 'Added' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 border-2 border-[#0b382d] rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all bg-[#0b382d] text-white shadow-lg shadow-emerald-900/20"
            >
              Buy Now
            </button>
          </>
        ) : (
           <button disabled className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-200 text-slate-500 cursor-not-allowed">
              Out of Stock
           </button>
        )}
      </div>
      {/* FULLSCREEN IMAGE OVERLAY */}"""

content = re.sub(mobile_bar_pattern, mobile_bar_replacement, content)

with open('src/pages/store/ProductDetails.tsx', 'w') as f:
    f.write(content)

