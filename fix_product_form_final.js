import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

code = code.replace(
  /const \[isBestSeller,[\s\S]*?specifications, setIsBestSeller\] = useState\(false\);/,
  "const [isBestSeller, setIsBestSeller] = useState(false);"
);

fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
