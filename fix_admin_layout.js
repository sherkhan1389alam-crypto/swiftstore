import fs from 'fs';
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

code = code.replace(
  /{ name: 'Help & Support', href: '\/admin\/support', icon: Settings },/,
  `{ name: 'Shipping Settings', href: '/admin/shipping', icon: Settings },\n    { name: 'Help & Support', href: '/admin/support', icon: Settings },`
);

fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
