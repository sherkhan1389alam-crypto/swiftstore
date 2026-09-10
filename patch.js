const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');
content = content.replace('  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);\n', '');
fs.writeFileSync('src/pages/admin/ProductForm.tsx', content);
