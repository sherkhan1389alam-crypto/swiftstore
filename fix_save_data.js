import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

code = code.replace(
  "isBestSeller,",
  "isBestSeller,\n        hasVariants,\n        variants,\n        specifications,"
);

fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
