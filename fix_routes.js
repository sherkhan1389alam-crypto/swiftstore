import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /<Route path="payments" element=\{<PaymentSettings \/>\} \/>/,
  `<Route path="payment-settings" element={<PaymentSettings />} />`
);
fs.writeFileSync('src/App.tsx', code);
