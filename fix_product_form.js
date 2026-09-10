import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

code = code.replace(
  /const \[hasVariants,[\s\S]*?specifications, setHasVariants\] = useState\(false\);/,
  "const [hasVariants, setHasVariants] = useState(false);"
);

fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
