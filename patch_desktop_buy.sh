#!/bin/bash
cat src/pages/store/ProductDetails.tsx | awk '
BEGIN { in_buy = 0 }
/<button/ && /onClick={handleBuyNow}/ && /Buy It Now/ {
    in_buy = 1
    print "              {inStock ? ("
    print "                <button"
    print "                  onClick={handleBuyNow}"
    print "                  className=\"w-full mt-4 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all bg-[#0b382d] text-white hover:bg-emerald-900 shadow-lg shadow-emerald-900/20\""
    print "                >"
    print "                  Buy Now"
    print "                </button>"
    print "              ) : ("
    print "                <button"
    print "                  disabled"
    print "                  className=\"w-full mt-4 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all bg-slate-200 text-slate-500 cursor-not-allowed\""
    print "                >"
    print "                  Out of Stock"
    print "                </button>"
    print "              )}"
    next
}
in_buy && /<\/button>/ {
    in_buy = 0
    next
}
in_buy { next }
!in_buy { print $0 }
' > src/pages/store/ProductDetails.tsx.tmp
mv src/pages/store/ProductDetails.tsx.tmp src/pages/store/ProductDetails.tsx
