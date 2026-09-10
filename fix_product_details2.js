import fs from 'fs';
let code = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

code = code.replace(
  /\{product\.description\}\n            <\/div>/,
  `{product.description}\n            </p>`
);

code = code.replace(
  /<div className="prose prose-slate mt-8">\s*\{\/\* Rest of the original description replacing block \*\/\}/,
  ``
);

fs.writeFileSync('src/pages/store/ProductDetails.tsx', code);
