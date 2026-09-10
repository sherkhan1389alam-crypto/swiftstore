import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import Support from './pages/admin/Support';")) {
  code = code.replace(
    "import ProductReviewsManager from './pages/admin/ProductReviewsManager';",
    "import ProductReviewsManager from './pages/admin/ProductReviewsManager';\nimport Support from './pages/admin/Support';"
  );
}

if (!code.includes("<Route path=\"support\" element={<Support />} />")) {
  code = code.replace(
    /<Route path="settings" element=\{<AdminPlaceholder title="Website Settings" \/>\} \/>/,
    "<Route path=\"support\" element={<Support />} />\n            <Route path=\"settings\" element={<AdminPlaceholder title=\"Website Settings\" />} />"
  );
}

fs.writeFileSync('src/App.tsx', code);
