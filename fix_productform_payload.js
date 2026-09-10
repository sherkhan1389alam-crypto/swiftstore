import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

if (!code.includes('specifications,')) {
  code = code.replace(
    "isBestSeller,",
    "isBestSeller,\n        specifications,\n        hasVariants,"
  );
  fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
}
