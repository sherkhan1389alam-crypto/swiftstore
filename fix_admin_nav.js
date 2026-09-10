import fs from 'fs';
let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

if (!code.includes("href: '/admin/payments'")) {
  code = code.replace(
    /\{ name: 'Settings', href: '\/admin\/settings', icon: Settings \},/,
    `{ name: 'Payment Settings', href: '/admin/payments', icon: Settings },
    { name: 'Settings', href: '/admin/settings', icon: Settings },`
  );
  // Wait, does Settings even exist? The list of files showed Branding, Categories, etc.
  // Let's check AdminLayout.tsx
}
fs.writeFileSync('src/layouts/AdminLayout.tsx', code);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes("PaymentSettings")) {
  appCode = appCode.replace(
    "import Branding from './pages/admin/Branding';",
    "import Branding from './pages/admin/Branding';\nimport PaymentSettings from './pages/admin/PaymentSettings';"
  );
  appCode = appCode.replace(
    /<Route path="branding" element=\{<Branding \/>\} \/>/,
    `<Route path="branding" element={<Branding />} />
            <Route path="payments" element={<PaymentSettings />} />`
  );
  fs.writeFileSync('src/App.tsx', appCode);
}
