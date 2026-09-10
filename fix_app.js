import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import Shipping from \'./pages/admin/Shipping\';')) {
  code = code.replace(
    /import Support from '\.\/pages\/admin\/Support';/,
    `import Support from './pages/admin/Support';\nimport Shipping from './pages/admin/Shipping';`
  );
}

if (!code.includes('<Route path="shipping" element={<Shipping />} />')) {
  code = code.replace(
    /<Route path="support" element={<Support \/>} \/>/,
    `<Route path="shipping" element={<Shipping />} />\n            <Route path="support" element={<Support />} />`
  );
}

fs.writeFileSync('src/App.tsx', code);
