import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

// 1. Add states
if (!code.includes('const [isFeatured, setIsFeatured]')) {
  code = code.replace(
    "const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'OUT_OF_STOCK' | 'DISABLED'>('DRAFT');",
    "const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'OUT_OF_STOCK' | 'DISABLED'>('DRAFT');\n  const [isFeatured, setIsFeatured] = useState(false);\n  const [isNewArrival, setIsNewArrival] = useState(false);\n  const [isBestSeller, setIsBestSeller] = useState(false);"
  );
  
  // 2. Populate states on edit
  code = code.replace(
    "setStatus(data.status || 'DRAFT');",
    "setStatus(data.status || 'DRAFT');\n        setIsFeatured(data.isFeatured || false);\n        setIsNewArrival(data.isNewArrival || false);\n        setIsBestSeller(data.isBestSeller || false);"
  );
  
  // 3. Save states
  code = code.replace(
    "status: finalStatus,",
    "status: finalStatus,\n        isFeatured,\n        isNewArrival,\n        isBestSeller,"
  );
  
  // 4. Add UI inside the form
  // Find where to put it. Let's put it right after status select.
  const statusBlock = `<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">`;
  const checkboxHtml = `
          {/* Merchandising Badges */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Merchandising & Visibility</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Mark as Featured Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Mark as New Arrival</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Mark as Best Seller</span>
              </label>
            </div>
          </div>
  `;
  
  // Actually, I can just append it before `{/* Inventory & SKU */}` or inside the `Status` container.
  code = code.replace(
    "{/* Inventory & SKU */}",
    checkboxHtml + "\n          {/* Inventory & SKU */}"
  );
  
  fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
}
