import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductReviewsManager.tsx', 'utf8');

// Change default state of verified purchase to false
code = code.replace(
  "const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(true);",
  "const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(false);"
);

// Disable or hide the Verified Purchase checkbox so owners can't check it when adding manually
const checkboxReplacement = `
            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" id="isVerifiedPurchase" checked={isVerifiedPurchase} disabled className="w-4 h-4 text-emerald-600 rounded" />
              <label htmlFor="isVerifiedPurchase" className="text-sm font-medium text-slate-700">Verified Purchase (Admin Added)</label>
            </div>
`;
code = code.replace(
  /<div className="flex items-center gap-2 mb-4">\s*<input\s*type="checkbox"\s*id="isVerifiedPurchase"\s*checked=\{isVerifiedPurchase\}\s*onChange=\{\(e\) => setIsVerifiedPurchase\(e\.target\.checked\)\}\s*className="w-4 h-4 text-[#0b382d] border-slate-300 rounded focus:ring-[#0b382d]"\s*\/>\s*<label htmlFor="isVerifiedPurchase" className="text-sm font-medium text-slate-700">Verified Purchase<\/label>\s*<\/div>/,
  checkboxReplacement
);

// If the regex above fails, we'll try a simpler replace
if (code.includes('onChange={(e) => setIsVerifiedPurchase(e.target.checked)}')) {
  code = code.replace(
    'onChange={(e) => setIsVerifiedPurchase(e.target.checked)}',
    'disabled /* Admin cannot mark verified */'
  );
  code = code.replace(
    '>Verified Purchase</label>',
    '>Verified Purchase (Admin Added - Disabled)</label>'
  );
}

fs.writeFileSync('src/pages/admin/ProductReviewsManager.tsx', code);
