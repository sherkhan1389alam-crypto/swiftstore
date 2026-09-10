import fs from 'fs';
let code = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

if (!code.includes('ProductReviews')) {
  code = code.replace(
    "import { Loader2",
    "import ProductReviews from '../../components/ProductReviews';\nimport { Loader2"
  );
  
  const target = "</div>\n      {/* Sticky Bottom Bar for Mobile */}";
  const replacement = "<ProductReviews productId={product.id} />\n      </div>\n      {/* Sticky Bottom Bar for Mobile */}";
  code = code.replace(target, replacement);
  
  fs.writeFileSync('src/pages/store/ProductDetails.tsx', code);
}
