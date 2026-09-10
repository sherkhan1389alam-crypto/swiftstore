import re

with open('src/pages/store/ProductDetails.tsx', 'r') as f:
    content = f.read()

pattern = r'\{\/\* MOBILE STICKY BOTTOM BAR \*\/\}[\s\S]*?\{\/\* FULLSCREEN IMAGE OVERLAY \*\/\}'

replacement = """{/* MOBILE STICKY BOTTOM BAR */}
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
      {/* FULLSCREEN IMAGE OVERLAY */}"""

content = re.sub(pattern, replacement, content)

with open('src/pages/store/ProductDetails.tsx', 'w') as f:
    f.write(content)

