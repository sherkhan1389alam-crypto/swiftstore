import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

if (!code.includes('const [variants, setVariants]')) {
  // Add state
  code = code.replace(
    "const [hasVariants, setHasVariants] = useState(false);",
    "const [hasVariants, setHasVariants] = useState(false);\n  const [variants, setVariants] = useState<{name: string, options: string[]}[]>([]);"
  );

  // Add fetch initial data for variants
  code = code.replace(
    "setSku(p.sku || '');",
    "setSku(p.sku || '');\n          setVariants(p.variants || []);\n          setHasVariants(p.hasVariants || false);\n          setIsFeatured(p.isFeatured || false);\n          setIsNewArrival(p.isNewArrival || false);\n          setIsBestSeller(p.isBestSeller || false);\n          setSpecifications(p.specifications || '');"
  );
  
  // Add to productData object
  code = code.replace(
    "hasVariants,",
    "hasVariants,\n      variants,\n      isFeatured,\n      isNewArrival,\n      isBestSeller,\n      specifications,"
  );
  
  // Insert Variants UI block right before Pricing block
  const variantsUI = `
        {/* Advanced Details */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Advanced Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 text-[#0b382d] rounded" />
              <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">Featured Product</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isNewArrival" checked={isNewArrival} onChange={e => setIsNewArrival(e.target.checked)} className="w-4 h-4 text-[#0b382d] rounded" />
              <label htmlFor="isNewArrival" className="text-sm font-medium text-slate-700">New Arrival</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isBestSeller" checked={isBestSeller} onChange={e => setIsBestSeller(e.target.checked)} className="w-4 h-4 text-[#0b382d] rounded" />
              <label htmlFor="isBestSeller" className="text-sm font-medium text-slate-700">Best Seller</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="hasVariants" checked={hasVariants} onChange={e => setHasVariants(e.target.checked)} className="w-4 h-4 text-[#0b382d] rounded" />
              <label htmlFor="hasVariants" className="text-sm font-medium text-slate-700">Has Variants (Colors, Sizes, etc)</label>
            </div>
          </div>
          
          {hasVariants && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900">Product Variants</h3>
                <button type="button" onClick={() => setVariants([...variants, { name: '', options: [] }])} className="text-[#0b382d] text-sm font-bold hover:underline">
                  + Add Variant Option
                </button>
              </div>
              
              {variants.map((variant, vIdx) => (
                <div key={vIdx} className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Option Name (e.g. Size, Color)</label>
                      <input 
                        type="text" 
                        value={variant.name} 
                        onChange={e => {
                          const newV = [...variants];
                          newV[vIdx].name = e.target.value;
                          setVariants(newV);
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" 
                        placeholder="e.g. Color"
                      />
                    </div>
                    <button type="button" onClick={() => setVariants(variants.filter((_, i) => i !== vIdx))} className="mt-6 text-red-500 p-2 hover:bg-red-50 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Values (comma separated)</label>
                    <input 
                      type="text" 
                      value={variant.options.join(', ')} 
                      onChange={e => {
                        const newV = [...variants];
                        newV[vIdx].options = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setVariants(newV);
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white" 
                      placeholder="e.g. Red, Blue, Green"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 border-t border-slate-100 pt-6">
             <label className="block text-sm font-medium text-slate-700 mb-2">Specifications / Details</label>
             <textarea 
               value={specifications} 
               onChange={e => setSpecifications(e.target.value)} 
               rows={4} 
               className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-[#0b382d] focus:ring-[#0b382d] p-3" 
               placeholder="Bullet points or key specs (e.g. Material: 100% Cotton)"
             />
          </div>
        </div>
`;

  // Find the pricing section and inject before it
  code = code.replace(
    /{?\/\* Pricing \*\/?}/,
    variantsUI + "\n\n        {/* Pricing */}"
  );

  fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
}
