import fs from 'fs';
let code = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

// I need to add tabs below the Product Info section, before the Reviews component.
const tabsReplacement = `
        {/* PRODUCT TABS */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
            <button className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-widest text-slate-900 border-b-2 border-[#0b382d] bg-slate-50 whitespace-nowrap">Description</button>
            <button className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 whitespace-nowrap">Specifications</button>
            <button className="flex-1 py-4 px-6 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 whitespace-nowrap">Shipping & Returns</button>
          </div>
          <div className="p-8">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed font-medium">{product.description}</p>
              {product.specifications && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Specifications</h4>
                  <pre className="text-sm text-slate-600 font-sans whitespace-pre-wrap">{product.specifications}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
`;

code = code.replace(
  /{?\/\* REVIEWS SECTION \*\/?}/,
  tabsReplacement
);

fs.writeFileSync('src/pages/store/ProductDetails.tsx', code);
