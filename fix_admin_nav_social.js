import fs from 'fs';
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

if (!code.includes("href: '/admin/social'")) {
  code = code.replace(
    /\{ name: 'Help & Support', href: '\/admin\/support', icon: Settings \},/,
    "{ name: 'Help & Support', href: '/admin/support', icon: Settings },\n    { name: 'Social Media', href: '/admin/social', icon: Settings },"
  );
  fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
}
