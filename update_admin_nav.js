import fs from 'fs';
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

if (!code.includes("name: 'Branding'")) {
  code = code.replace(
    "{ name: 'Homepage', href: '/admin/homepage', icon: LayoutDashboard },",
    "{ name: 'Homepage', href: '/admin/homepage', icon: LayoutDashboard },\n    { name: 'Branding', href: '/admin/branding', icon: Image },"
  );
  fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
}
