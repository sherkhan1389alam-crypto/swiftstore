import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('ProductReviewsManager')) {
  code = code.replace(
    "import AdminReviews from './pages/admin/Reviews';",
    "import AdminReviews from './pages/admin/Reviews';\nimport ProductReviewsManager from './pages/admin/ProductReviewsManager';"
  );
  
  code = code.replace(
    '<Route path="reviews" element={<AdminReviews />} />',
    '<Route path="reviews" element={<AdminReviews />} />\n            <Route path="reviews/:productId" element={<ProductReviewsManager />} />'
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
